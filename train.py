"""
AGAHI Vision Zero - Unified Model Training Pipeline
Supports:
1. YOLOv8 Deep Learning fine-tuning on Custom & Kaggle Datasets (Fast, GPU/CPU)
2. RF-DETR Transformer fine-tuning on Indian Traffic COCO datasets
3. Automatic dataset preparation and validation
"""
import os
import sys
import argparse
import json
import shutil
import cv2
import numpy as np

def train_yolo(data_config: str, epochs: int = 25, batch_size: int = 8, img_size: int = 640, weights: str = "yolov8n.pt"):
    """
    Fine-tunes YOLOv8 on custom traffic dataset (YOLO format or data.yaml).
    """
    print("=" * 65)
    print("🚀 Starting YOLOv8 Fine-Tuning for AGAHI Traffic Analytics")
    print(f"• Base Weights: {weights}")
    print(f"• Dataset Config: {data_config}")
    print(f"• Epochs: {epochs} | Batch Size: {batch_size} | Image Size: {img_size}")
    print("=" * 65)

    try:
        from ultralytics import YOLO
    except ImportError:
        print("❌ Error: 'ultralytics' is not installed. Run: pip install ultralytics")
        sys.exit(1)

    import torch
    device = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"🎯 Training Hardware: {device.upper()} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'Standard CPU'})")

    model = YOLO(weights)
    results = model.train(
        data=data_config,
        epochs=epochs,
        batch=batch_size,
        imgsz=img_size,
        device=device,
        project="output/training_runs",
        name="agahi_custom_yolo",
        exist_ok=True,
        save=True,
        verbose=True
    )

    save_dir = getattr(results, "save_dir", None) or os.path.join("runs", "detect", "output", "training_runs", "agahi_custom_yolo")
    best_weights = os.path.join(save_dir, "weights", "best.pt")
    if not os.path.exists(best_weights):
        best_weights = os.path.join("output/training_runs", "agahi_custom_yolo", "weights", "best.pt")
    if os.path.exists(best_weights):
        # Save a copy as custom_traffic_model.pt
        os.makedirs("output/weights", exist_ok=True)
        target_path = "output/weights/best_traffic_model.pt"
        shutil.copy(best_weights, target_path)
        print("\n" + "=" * 65)
        print("🎉 Training Successful!")
        print(f"✅ Best Checkpoint saved to: {target_path}")
        print("=" * 65)
        print("To use this trained model in AGAHI:")
        print("  1. In app.py / run_desktop.py, point tracker to 'output/weights/best_traffic_model.pt'")
        print("  2. Run: streamlit run app.py")
    return results


def train_rfdetr(dataset_dir: str, epochs: int = 10, batch_size: int = 4, output_dir: str = "output/rfdetr_checkpoints"):
    """
    Fine-tunes RF-DETR Transformer detector on COCO formatted Indian road datasets.
    """
    print("=" * 65)
    print("🧠 Starting RF-DETR Transformer Fine-Tuning")
    print(f"• Dataset Directory: {dataset_dir}")
    print(f"• Epochs: {epochs} | Batch Size: {batch_size}")
    print(f"• Output Checkpoints: {output_dir}")
    print("=" * 65)

    try:
        from rfdetr import RFDETRMedium
    except ImportError:
        print("❌ Error: 'rfdetr' is not installed. Recommended to run in Google Colab T4 GPU:")
        print("   pip install 'rfdetr[train]'")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)
    model = RFDETRMedium()
    model.train(
        dataset_dir=dataset_dir,
        epochs=epochs,
        batch_size=batch_size,
        lr=0.0001,
        output_dir=output_dir
    )
    print(f"\n🎉 RF-DETR Training Complete! Checkpoints saved to: {output_dir}")


def prepare_starter_dataset(video_path: str = "sample_traffic.mp4", output_dir: str = "dataset/starter_traffic", num_frames: int = 30):
    """
    Extracts frames and builds starter YOLO annotations for Indian traffic classes.
    """
    print(f"📸 Preparing starter training dataset from '{video_path}'...")
    if not os.path.exists(video_path):
        print(f"❌ Video file '{video_path}' not found.")
        return None

    cap = cv2.VideoCapture(video_path)
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_f = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step = max(1, total_f // num_frames)

    for split in ["train", "val"]:
        os.makedirs(os.path.join(output_dir, "images", split), exist_ok=True)
        os.makedirs(os.path.join(output_dir, "labels", split), exist_ok=True)

    # Use pre-trained YOLO to bootstrap initial pseudo-labels
    try:
        from ultralytics import YOLO
        detector = YOLO("yolov8n.pt")
        has_detector = True
    except Exception:
        has_detector = False

    saved = 0
    frame_idx = 0
    while cap.isOpened() and saved < num_frames:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_idx % step == 0:
            split = "train" if saved < int(num_frames * 0.8) else "val"
            fname = f"frame_{saved:04d}"
            img_path = os.path.join(output_dir, "images", split, f"{fname}.jpg")
            lbl_path = os.path.join(output_dir, "labels", split, f"{fname}.txt")
            cv2.imwrite(img_path, frame)

            # Generate YOLO bounding box labels
            lines = []
            if has_detector:
                res = detector(frame, verbose=False)[0]
                for box in res.boxes:
                    cls_id = int(box.cls.item())
                    # Only vehicle/person classes (0: person, 1: bicycle, 2: car, 3: moto, 5: bus, 7: truck)
                    if cls_id in [0, 1, 2, 3, 5, 7]:
                        xywhn = box.xywhn[0].cpu().numpy()
                        lines.append(f"{cls_id} {xywhn[0]:.6f} {xywhn[1]:.6f} {xywhn[2]:.6f} {xywhn[3]:.6f}")

            with open(lbl_path, "w") as f:
                f.write("\n".join(lines))
            saved += 1
        frame_idx += 1

    cap.release()

    # Generate data.yaml
    yaml_content = f"""# AGAHI Vision Zero - Traffic Dataset Configuration
path: {os.path.abspath(output_dir)}
train: images/train
val: images/val

names:
  0: person
  1: bicycle
  2: car
  3: motorcycle
  4: airplane
  5: bus
  6: train
  7: truck
"""
    yaml_path = os.path.join(output_dir, "data.yaml")
    with open(yaml_path, "w") as f:
        f.write(yaml_content)

    print(f"✅ Starter dataset ready! {saved} frames extracted to '{output_dir}'.")
    print(f"📄 Dataset config: {yaml_path}")
    return yaml_path


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AGAHI Vision Zero - Unified Model Training Pipeline")
    parser.add_argument("--engine", choices=["yolo", "rfdetr"], default="yolo", help="Detector model engine to train")
    parser.add_argument("--data", type=str, default="", help="Path to data.yaml or COCO dataset directory")
    parser.add_argument("--epochs", type=int, default=15, help="Number of training epochs")
    parser.add_argument("--batch-size", type=int, default=8, help="Batch size")
    parser.add_argument("--img-size", type=int, default=640, help="Image resolution for training")
    parser.add_argument("--weights", type=str, default="yolov8n.pt", help="Initial weights file")
    parser.add_argument("--prepare-dataset", action="store_true", help="Bootstrap a starter dataset from a traffic video")
    parser.add_argument("--video", type=str, default="sample_traffic.mp4", help="Video source for starter dataset generation")

    args = parser.parse_args()

    if args.prepare_dataset:
        yaml_file = prepare_starter_dataset(video_path=args.video, num_frames=30)
        print(f"\nNext step to train: python train.py --engine yolo --data {yaml_file} --epochs 10")
        sys.exit(0)

    if args.engine == "yolo":
        data_cfg = args.data
        if not data_cfg or not os.path.exists(data_cfg):
            # If no data given, prepare starter dataset automatically
            print(f"ℹ️ No valid dataset passed via '--data'. Bootstrapping starter dataset from '{args.video}'...")
            data_cfg = prepare_starter_dataset(video_path=args.video, num_frames=20)
        train_yolo(data_config=data_cfg, epochs=args.epochs, batch_size=args.batch_size, img_size=args.img_size, weights=args.weights)
    elif args.engine == "rfdetr":
        dataset_dir = args.data or "dataset"
        train_rfdetr(dataset_dir=dataset_dir, epochs=args.epochs, batch_size=args.batch_size)
