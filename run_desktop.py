"""
AGAHI Vision Zero - Local Desktop Runner
Runs real-time vehicle tracking, speed estimation, and near-miss collision detection on your local machine.
Zero external downloads required.
"""
import cv2
import numpy as np
import time
import os
import sys
import argparse
from agahi_analytics import ViewTransformer, LocalVehicleTracker, YOLOVehicleTracker, SafetyAnalyticsEngine

def run_agahi(video_path: str, show_window: bool = True, ttc_threshold: float = 1.8, max_frames: int = None):
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at: {video_path}")
        return

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = max(15.0, cap.get(cv2.CAP_PROP_FPS) or 30.0)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    print("=" * 60)
    print("AGAHI Vision Zero - Road Safety Analytics (Local Mode)")
    print(f"Video: {video_path}")
    print(f"Resolution: {w}x{h} | FPS: {fps:.1f} | Total Frames: {total_frames}")
    if max_frames:
        print(f"Processing limit: First {max_frames} frames")
    print("=" * 60)

    # 1. Perspective Calibration (Quad to 10m x 30m real-world road rectangle)
    src_polygon = np.array([
        [int(w * 0.25), int(h * 0.30)],
        [int(w * 0.75), int(h * 0.30)],
        [int(w * 0.95), int(h * 0.95)],
        [int(w * 0.05), int(h * 0.95)]
    ], dtype=np.float32)

    dst_rectangle = np.array([
        [0, 0], [10, 0], [10, 30], [0, 30]
    ], dtype=np.float32)

    transformer = ViewTransformer(src_polygon, dst_rectangle)
    try:
        tracker = YOLOVehicleTracker(confidence=0.28)
        if not tracker.available:
            tracker = LocalVehicleTracker(max_disappeared=15, min_area=int(w * h * 0.001))
    except Exception:
        tracker = LocalVehicleTracker(max_disappeared=15, min_area=int(w * h * 0.001))
    analytics = SafetyAnalyticsEngine(transformer=transformer, fps=fps)

    # Output setup
    os.makedirs("output", exist_ok=True)
    out_video_path = "output/agahi_tracked_output.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(out_video_path, fourcc, fps, (w, h))

    frame_idx = 0
    first_frame = None
    t_start = time.time()

    if show_window:
        print("\nProcessing frames with live display... Press 'q' in the window to quit, 'p' to pause.\n")
    else:
        print("\nProcessing frames in headless mode...\n")

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1
        if first_frame is None:
            first_frame = frame.copy()

        # A. Detect & Track objects
        objects, boxes = tracker.detect_and_update(frame)

        # B. Safety Analytics (Speed & TTC)
        current_data = analytics.update_tracks(objects, frame_idx)
        conflicts = analytics.compute_ttc_conflicts(current_data, frame_idx, ttc_threshold=ttc_threshold)

        # C. Visualization
        annotated = frame.copy()

        # Draw road calibration quad
        cv2.polylines(annotated, [src_polygon.astype(np.int32)], isClosed=True, color=(255, 180, 0), thickness=1)

        # Draw objects
        for obj_id, (cx, cy) in objects.items():
            if obj_id in boxes:
                x, y, bw, bh = boxes[obj_id]
                speed = current_data[obj_id]['speed_kmh'] if obj_id in current_data else 0.0

                # Bounding box & centroid
                cv2.rectangle(annotated, (x, y), (x + bw, y + bh), (0, 220, 0), 2)
                cv2.circle(annotated, (int(cx), int(cy)), 4, (0, 0, 255), -1)

                # Trajectory trail
                hist = analytics.history[obj_id]
                if len(hist) > 1:
                    pts = np.array([h[2] for h in hist], dtype=np.int32)
                    cv2.polylines(annotated, [pts], isClosed=False, color=(0, 255, 255), thickness=2)

                # Label badge
                label = f"#{obj_id} | {speed:.0f} km/h"
                (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
                cv2.rectangle(annotated, (x, y - 22), (x + tw + 6, y), (0, 220, 0), -1)
                cv2.putText(annotated, label, (x + 3, y - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

        # Draw conflict alerts
        for id1, id2, ttc, p1_px, p2_px in conflicts:
            pt1 = (int(p1_px[0]), int(p1_px[1]))
            pt2 = (int(p2_px[0]), int(p2_px[1]))
            cv2.line(annotated, pt1, pt2, (0, 0, 255), 3)

            mid_x = int((pt1[0] + pt2[0]) / 2)
            mid_y = int((pt1[1] + pt2[1]) / 2) - 12
            cv2.putText(annotated, f"TTC: {ttc:.1f}s", (mid_x - 40, mid_y),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2, cv2.LINE_AA)

        # AGAHI HUD Banner
        fps_current = frame_idx / max(1e-3, (time.time() - t_start))
        cv2.rectangle(annotated, (10, 10), (450, 50), (20, 20, 20), -1)
        cv2.putText(annotated, f"AGAHI Vision Zero | Conflicts: {len(analytics.conflict_events)} | FPS: {fps_current:.1f}",
                    (20, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 255, 255), 2)

        writer.write(annotated)

        if show_window:
            cv2.imshow("AGAHI Vision Zero - Local Analytics", annotated)
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                print("Processing stopped by user.")
                break
            elif key == ord('p'):
                cv2.waitKey(-1)  # Pause until key pressed

        if frame_idx % 60 == 0:
            print(f"Frame {frame_idx}/{total_frames} | Conflicts logged: {len(analytics.conflict_events)}")

        if max_frames and frame_idx >= max_frames:
            print(f"Reached processing limit of {max_frames} frames.")
            break

    cap.release()
    writer.release()
    if show_window:
        cv2.destroyAllWindows()

    print("\n" + "=" * 60)
    print(f"Completed! Processed {frame_idx} frames.")
    print(f"Total Near-Miss Conflicts Detected: {len(analytics.conflict_events)}")
    print(f"Tracked video saved to: {out_video_path}")

    # Generate Risk Heatmap
    if first_frame is not None and len(analytics.conflict_events) > 1:
        heatmap_file = "output/risk_heatmap.png"
        analytics.generate_heatmap(first_frame, heatmap_file)
        print(f"Risk Heatmap (KDE) generated: {heatmap_file}")
    print("=" * 60)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AGAHI Vision Zero - Standalone Desktop Analytics Runner")
    bundled = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_traffic.mp4")
    parser.add_argument("video", nargs="?", default=bundled if os.path.exists(bundled) else None, help="Path to input traffic video")
    parser.add_argument("--headless", action="store_true", help="Run in headless mode without displaying OpenCV GUI window")
    parser.add_argument("--ttc", type=float, default=1.8, help="Time-to-Collision alert threshold in seconds (default: 1.8)")
    parser.add_argument("--max-frames", type=int, default=None, help="Maximum number of frames to process (optional)")
    args = parser.parse_args()

    target = args.video
    if not target or not os.path.exists(target):
        target = input("Enter path to your MP4 traffic video: ").strip(' "\'')

    run_agahi(target, show_window=not args.headless, ttc_threshold=args.ttc, max_frames=args.max_frames)
