"""
AGAHI Vision Zero - Interactive Local Web Dashboard (Streamlit)
Run locally: streamlit run app.py
"""
import streamlit as st
import cv2
import numpy as np
import tempfile
import os
import time
import pandas as pd
from agahi_analytics import ViewTransformer, LocalVehicleTracker, SafetyAnalyticsEngine

st.set_page_config(
    page_title="AGAHI - Vision Zero Traffic Analytics",
    page_icon="🚦",
    layout="wide"
)

st.title("🚦 Vision Zero – AGAHI Road Safety & Near-Miss Platform")
st.markdown("**Real-Time Traffic Conflict Analytics & Intersection Hotspot Mapping**")

# Sidebar Controls
st.sidebar.header("⚙️ Safety Analytics Configuration")

ttc_thresh = st.sidebar.slider("TTC Alert Threshold (seconds)", min_value=0.5, max_value=3.0, value=1.6, step=0.1)
road_len = st.sidebar.number_input("Road Segment Length (meters)", min_value=5.0, max_value=100.0, value=25.0, step=1.0)
road_wid = st.sidebar.number_input("Road Segment Width (meters)", min_value=3.0, max_value=50.0, value=10.0, step=0.5)

st.sidebar.markdown("---")
st.sidebar.markdown("### 🎯 Hardware Mode")
st.sidebar.success("Local RTX 3050 Native Engine (Zero Cloud Latency)")

uploaded_file = st.file_uploader("Upload a Traffic Video (MP4 / AVI)", type=["mp4", "avi", "mov"])

# Default sample fallback if no file uploaded
default_video = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_traffic.mp4")
video_path = None

if uploaded_file is not None:
    tfile = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
    tfile.write(uploaded_file.read())
    video_path = tfile.name
elif os.path.exists(default_video):
    video_path = default_video
    st.info(f"Using default bundled video: `{os.path.basename(default_video)}`")

if video_path and st.button("🚀 Run AGAHI Vision Zero Pipeline", type="primary"):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = max(15.0, cap.get(cv2.CAP_PROP_FPS) or 30.0)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Adaptive perspective quadrilateral
    src_polygon = np.array([
        [int(w * 0.25), int(h * 0.30)],
        [int(w * 0.75), int(h * 0.30)],
        [int(w * 0.95), int(h * 0.95)],
        [int(w * 0.05), int(h * 0.95)]
    ], dtype=np.float32)

    dst_rectangle = np.array([
        [0, 0], [road_wid, 0], [road_wid, road_len], [0, road_len]
    ], dtype=np.float32)

    transformer = ViewTransformer(src_polygon, dst_rectangle)
    tracker = LocalVehicleTracker(max_disappeared=15, min_area=int(w * h * 0.001))
    analytics = SafetyAnalyticsEngine(transformer=transformer, fps=fps)

    progress_bar = st.progress(0)
    status_text = st.empty()
    video_placeholder = st.empty()

    os.makedirs("output", exist_ok=True)
    out_mp4 = "output/agahi_web_output.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(out_mp4, fourcc, fps, (w, h))

    frame_idx = 0
    first_frame = None

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1
        if first_frame is None:
            first_frame = frame.copy()

        objects, boxes = tracker.detect_and_update(frame)
        current_data = analytics.update_tracks(objects, frame_idx)
        conflicts = analytics.compute_ttc_conflicts(current_data, frame_idx, ttc_threshold=ttc_thresh)

        annotated = frame.copy()
        cv2.polylines(annotated, [src_polygon.astype(np.int32)], isClosed=True, color=(255, 180, 0), thickness=1)

        for obj_id, (cx, cy) in objects.items():
            if obj_id in boxes:
                x, y, bw, bh = boxes[obj_id]
                speed = current_data[obj_id]['speed_kmh'] if obj_id in current_data else 0.0
                cv2.rectangle(annotated, (x, y), (x + bw, y + bh), (0, 220, 0), 2)
                
                # Trajectory trail
                hist = analytics.history[obj_id]
                if len(hist) > 1:
                    pts = np.array([pt[2] for pt in hist], dtype=np.int32)
                    cv2.polylines(annotated, [pts], isClosed=False, color=(0, 255, 255), thickness=2)

                label = f"#{obj_id} | {speed:.0f} km/h"
                cv2.putText(annotated, label, (x, max(15, y - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 0), 1, cv2.LINE_AA)

        for id1, id2, ttc, p1_px, p2_px in conflicts:
            cv2.line(annotated, (int(p1_px[0]), int(p1_px[1])), (int(p2_px[0]), int(p2_px[1])), (0, 0, 255), 2)

        writer.write(annotated)

        # Update preview occasionally
        if frame_idx % 15 == 0:
            preview_rgb = cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB)
            video_placeholder.image(preview_rgb, caption=f"Live Processing Frame {frame_idx}/{total_frames}", use_container_width=True)
            progress_bar.progress(min(1.0, frame_idx / total_frames))
            status_text.text(f"Processed frame {frame_idx}/{total_frames} | Critical Near-Misses Detected: {len(analytics.conflict_events)}")

    cap.release()
    writer.release()
    progress_bar.progress(1.0)
    status_text.success(f"Processing Complete! Detected {len(analytics.conflict_events)} near-miss events.")

    # Display Metrics
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Frames Analyzed", frame_idx)
    col2.metric("Total Unique Vehicles Tracked", tracker.next_object_id - 1)
    col3.metric("Critical Near-Miss Conflicts", len(analytics.conflict_events))

    # Heatmap Section
    st.subheader("🔥 2D Intersection Risk Heatmap (Kernel Density Estimation)")
    heatmap_out = "output/agahi_web_heatmap.png"
    analytics.generate_heatmap(first_frame, heatmap_out)

    if os.path.exists(heatmap_out):
        st.image(heatmap_out, caption="Collision Hotspots (Red indicates recurring conflict danger zones)", use_container_width=True)

    # Conflict Log Table
    if analytics.conflict_events:
        st.subheader("📋 Near-Miss Conflict Log")
        df = pd.DataFrame(analytics.conflict_events)[['frame', 'id1', 'id2', 'ttc', 'dist_m', 'speed1', 'speed2']]
        df.columns = ['Frame', 'Vehicle 1 ID', 'Vehicle 2 ID', 'TTC (sec)', 'Distance (m)', 'Speed 1 (km/h)', 'Speed 2 (km/h)']
        st.dataframe(df, use_container_width=True)
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button("📥 Download Conflict Log (CSV)", data=csv, file_name="agahi_conflicts.csv", mime="text/csv")
