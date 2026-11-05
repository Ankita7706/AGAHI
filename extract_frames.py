"""
AGAHI Vision Zero - Local Frame Extractor
Extracts 1 frame per second from raw traffic video and zips them for Roboflow annotation.
"""
import cv2
import os
import shutil
import sys

def extract_frames(video_path: str, output_folder: str = "frames_extracted", sample_fps: int = 1):
    if not os.path.exists(video_path):
        print(f"Error: Video file not found at '{video_path}'")
        return

    os.makedirs(output_folder, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    
    native_fps = max(1, int(cap.get(cv2.CAP_PROP_FPS)))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration_sec = total_frames / native_fps
    
    frame_interval = max(1, native_fps // sample_fps)
    print(f"Video: {video_path}")
    print(f"FPS: {native_fps} | Total Frames: {total_frames} | Duration: {duration_sec:.1f}s")
    print(f"Sampling every {frame_interval} frame(s)...")

    frame_idx = 0
    saved_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_idx % frame_interval == 0:
            frame_name = os.path.join(output_folder, f"frame_{saved_count:04d}.jpg")
            cv2.imwrite(frame_name, frame)
            saved_count += 1
        frame_idx += 1

    cap.release()
    print(f"\nExtracted {saved_count} frames to '{output_folder}'.")

    # Zip for Roboflow
    zip_path = "bhubaneswar_frames_roboflow"
    shutil.make_archive(zip_path, 'zip', output_folder)
    print(f"Ready for Roboflow! Zipped file created: {zip_path}.zip")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        video = sys.argv[1]
    else:
        video = input("Enter the path to your traffic video file: ").strip(' "\'')
    extract_frames(video)
