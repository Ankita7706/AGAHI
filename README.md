# AGAHI – Vision Zero Road Safety & Digital Twin Platform
### Real-Time Traffic Conflict Analytics, Microscopic SUMO Accident Simulation & AI Causality Diagnostic Engine

AGAHI is an end-to-end Vision Zero intelligent transportation platform designed to detect traffic near-misses, compute Time-to-Collision (TTC) & Post-Encroachment Time (PET), map high-risk collision hotspots via 2D Kernel Density Estimation (KDE), reconstruct detected accidents in the **Eclipse SUMO micro-simulator**, and diagnose whether incidents were caused by **Infrastructure Road Black Spots** or **Human Driver Error**.

---

## 🌟 Key Capabilities

1. **AI Vision Tracking Engine**:
   - High-accuracy **YOLOv8 Deep Learning** (`yolov8n.pt` / fine-tuned checkpoints) with ByteTrack multi-object tracking.
   - Fallback lightweight MOG2 background subtractor for low-resource CPU edge devices.
2. **Kinematics & Surrogate Safety Measures (SSM)**:
   - Perspective Homography Transformation from image pixels to ground meters ($m$).
   - Real-time velocity tracking ($km/h$) and directional motion vector calculation.
   - Critical Time-to-Collision (TTC) alert triggers ($\text{TTC} < 1.6s$).
3. **2D Hotspot Mapping**:
   - Kernel Density Estimation (KDE) contour heatmaps identifying recurrent intersection conflict zones.
4. **SUMO Digital Twin Simulation & AI Causality Engine** (`agahi_sumo.py`):
   - Automatically reproduces detected real-world conflicts inside Eclipse SUMO.
   - AI Causality Judge assesses Speed, Reaction Latency, Intersection Geometry Angles, and Hotspot Recurrence.
   - Simulates counterfactual Vision Zero engineering countermeasures (e.g., IRC:SP:99 Speed Tables + Priority Yielding) and measures collision elimination.
   - Exports complete SUMO XML packages (`.net.xml`, `.rou.xml`, `.sumocfg`) for municipal engineering review.
5. **Unified Model Training Pipeline** (`train.py`):
   - Fast fine-tuning on custom traffic datasets and Kaggle datasets.
   - Automated bootstrap dataset generator from raw traffic video feeds.

---

## 🖥️ Running the Local Streamlit Web Dashboard

```bash
# 1. Activate the environment
source .venv/bin/activate

# 2. Launch the Streamlit dashboard
streamlit run app.py
```
Open **`http://localhost:8501`** in your browser:
- **Tab 1: 🎥 Video Conflict Analytics & Risk Heatmap**: Upload any traffic video or use the bundled sample, track vehicles, view real-time speeds, and inspect detected conflicts.
- **Tab 2: 🔬 SUMO Digital Twin & AI Black Spot Causality Lab**: Experiment with scenario presets or custom sliders for approach velocities, sightline angles, and conflict cluster counts to see the AI verdict, 3-panel simulation graphics, and download SUMO project archives.

---

## 🧠 Training Custom Models (`train.py`)

### 1. Auto-generate training frames from video:
```bash
python train.py --prepare-dataset --video sample_traffic.mp4
```

### 2. Fine-tune YOLOv8 on your dataset or Kaggle dataset:
```bash
python train.py --engine yolo --data dataset/starter_traffic/data.yaml --epochs 25 --batch-size 8
```
Trained best weights will automatically be saved to `output/weights/best_traffic_model.pt`.

---

## 🚀 Running in Google Colab (Free T4 GPU)

1. Open [Google Colab](https://colab.research.google.com/) and upload `AGAHI_Vision_Zero_Framework.ipynb`.
2. Go to **Runtime ➔ Change runtime type** and select **T4 GPU**.
3. Run the notebook sections in sequence:
   - **Section 1 & 2**: Environment setup and Google Drive persistence.
   - **Section 5 - 8**: Video processing, tracking, speed calculation, and near-miss logging.
   - **Section 9**: 2D KDE Collision Risk Heatmap.
   - **Section 10 - 12**: Starter COCO dataset generation, RF-DETR model fine-tuning, and inference.
   - **Section 13**: Automated SUMO Digital Twin Accident Simulation & AI Causality Diagnosis.

---

## 📁 Repository Structure

```text
├── agahi_analytics.py              # VisionTransformer, YOLOVehicleTracker & SafetyAnalyticsEngine
├── agahi_sumo.py                   # SUMODigitalTwinEngine & AccidentCausalityJudge
├── app.py                          # Streamlit Interactive Web Dashboard
├── train.py                        # Unified Model Fine-Tuning Pipeline (YOLOv8 & RF-DETR)
├── AGAHI_Vision_Zero_Framework.ipynb # Complete 13-Section Google Colab Framework Notebook
├── build_notebook.py               # Notebook synchronization utility
├── sample_traffic.mp4              # Bundled benchmark traffic video
├── run_desktop.py                  # Standalone desktop OpenCV pipeline runner
└── README.md                       # Documentation
```
