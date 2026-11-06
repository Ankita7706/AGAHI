# AGAHI – Vision Zero Road Safety & Digital Twin Platform
### Real-Time Traffic Conflict Analytics, Microscopic SUMO Accident Simulation & AI Causality Diagnostic Engine

AGAHI is an end-to-end Vision Zero intelligent transportation platform designed to detect traffic near-misses, compute Time-to-Collision (TTC) & Post-Encroachment Time (PET), map high-risk collision hotspots via 2D Kernel Density Estimation (KDE), reconstruct detected accidents in the **Eclipse SUMO micro-simulator**, and diagnose whether incidents were caused by **Infrastructure Road Black Spots** or **Human Driver Error**.

---

## 🍴 Fork & Repository Setup

This repository is forked from [Ankita7706/AGAHI](https://github.com/Ankita7706/AGAHI):

```bash
# Clone your fork
git clone https://github.com/nikkita18/AGAHI.git
cd AGAHI

# Keep synced with upstream
git remote add upstream https://github.com/Ankita7706/AGAHI.git
git fetch upstream
```

---

## 🌟 Key Capabilities

1. **AI Vision Tracking Engine**:
   - High-accuracy **YOLOv8 Deep Learning** (`yolov8n.pt` / fine-tuned checkpoints) with ByteTrack multi-object tracking.
   - Fallback lightweight MOG2 background subtractor for low-resource CPU edge devices (zero extra weights required).
2. **Kinematics & Surrogate Safety Measures (SSM)**:
   - Perspective Homography Transformation from image pixels to ground meters ($m$).
   - Real-time velocity tracking ($km/h$) and directional motion vector calculation.
   - Critical Time-to-Collision (TTC) alert triggers ($\text{TTC} < 1.6s$).
3. **2D Hotspot Mapping**:
   - Kernel Density Estimation (KDE) contour heatmaps identifying recurrent intersection conflict zones.
4. **SUMO Digital Twin Simulation & AI Causality Engine** (`agahi_sumo.py`):
   - Automatically reproduces detected real-world conflicts inside Eclipse SUMO or built-in physics engine.
   - AI Causality Judge assesses Speed, Reaction Latency, Intersection Geometry Angles, and Hotspot Recurrence.
   - Simulates counterfactual Vision Zero engineering countermeasures (e.g., IRC:SP:99 Speed Tables + Priority Yielding) and measures collision elimination.
   - Exports complete SUMO XML packages (`.net.xml`, `.rou.xml`, `.sumocfg`) for municipal engineering review.
5. **Unified Model Training Pipeline** (`train.py`):
   - Fast fine-tuning on custom traffic datasets and Kaggle datasets.
   - Automated bootstrap dataset generator from raw traffic video feeds.

---

## ⚡ Quick Start: Running Locally

### Option A: Unified Full-Stack Platform (React Frontend + Python ML Backend API)

Run both the React Vite frontend and the Python ML backend with a single click or command:

```bash
run_all.bat
```

Or start them individually:
```bash
# 1. Start Python ML & LLM API backend (Port 8000)
python backend_api.py

# 2. Start React Frontend Dashboard (Port 5173)
npm run dev
```

- **React Vision Zero Dashboard**: [`http://localhost:5173`](http://localhost:5173)
  - **Live CCTV Video Preview Player**: Native HTML5 player with frame-by-frame scrubbing, 0.5x-2x playback, raw vs YOLOv8 inference toggle, and HUD timecode telemetry.
  - **Dynamic Safety KPI Cards**: Real-time Time-to-Collision (TTC), Kinetic Conflict Risk Index, Vulnerable Road User (VRU) Threat Rate, and Corridor Flow synchronized with video playback.
  - **Interactive TTC & Risk Curve**: 11.2s timeline graph with clickable time scrubbing, critical danger thresholds ($TTC < 1.6s$), and interactive data points.
  - **2D Kernel Density Estimation (KDE) Spatial Heatmap**: Real spatial collision distribution with interactive hotspot cluster pins.
  - **Near-Miss Incident Audit Log**: 6 real near-miss conflicts detected via computer vision with click-to-seek video forensic replay.
  - **AI Safety Copilot & In-Dashboard Forensic Inspector**: Interactive LLM assistant (powered by Gemini or built-in local transport intelligence) providing IRC:SP:99 engineering countermeasures and SUMO digital twin verification.
- **Python ML Backend API**: [`http://localhost:8000`](http://localhost:8000)
  - `GET /api/status` – System health and model status
  - `GET /api/telemetry` – Frame-by-frame TTC and conflict metrics
  - `GET /api/incidents` – Near-miss incident records
  - `POST /api/llm/chat` – LLM Forensic Safety Copilot
  - `POST /api/sumo/simulate` – Microscopic traffic simulation

---

### Option B: Streamlit Python Web Dashboard

On Windows, double-click **`run_dashboard.bat`** or run:

```bash
streamlit run app.py
```

Open **`http://localhost:8501`** in your browser:
- **Tab 1: 🎥 Video Conflict Analytics & Risk Heatmap**: Upload any traffic video or use the bundled sample, track vehicles, view real-time speeds, inspect near-misses, and generate 2D KDE heatmaps.
- **Tab 2: 🔬 SUMO Digital Twin & AI Black Spot Causality Lab**: Experiment with scenario presets or custom sliders for approach velocities, sightline angles, and conflict cluster counts to see the AI verdict, 3-panel simulation graphics, and download SUMO project archives.

---

## 🖥️ Standalone Desktop OpenCV Runner (`run_desktop.py`)

Run real-time video analytics directly through OpenCV:

```bash
# Run with live video display window
python run_desktop.py sample_traffic.mp4

# Run in fast headless mode (no GUI window)
python run_desktop.py sample_traffic.mp4 --headless

# Quick test on first 60 frames with custom TTC threshold:
python run_desktop.py sample_traffic.mp4 --max-frames 60 --ttc 1.6
```

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
├── backend_api.py                  # Flask REST API connecting Python ML & LLM to React frontend
├── agahi_analytics.py              # ViewTransformer, YOLOVehicleTracker & SafetyAnalyticsEngine
├── agahi_sumo.py                   # SUMODigitalTwinEngine & AccidentCausalityJudge
├── app.py                          # Streamlit Interactive Web Dashboard (Port 8501)
├── run_all.bat                     # Launches Python ML Backend (8000) & React Frontend (5173)
├── run_dashboard.bat               # One-click Windows Streamlit dashboard launcher
├── run_desktop.bat                 # One-click Windows desktop OpenCV runner
├── run_desktop.py                  # Standalone desktop OpenCV pipeline runner
├── train.py                        # Unified Model Fine-Tuning Pipeline (YOLOv8 & RF-DETR)
├── generate_real_telemetry.py      # Telemetry extractor for video & React components
├── src/                            # React Frontend Source Code
│   ├── components/Dashboard/       # Vision Zero Dashboard, Video Preview, LLM Copilot, KPIs
│   └── data/realTrafficData.js     # Real telemetry & near-miss datasets from computer vision
├── public/                         # Video & Heatmap web assets (sample_traffic.mp4, heatmap)
├── requirements.txt                # Python dependencies
├── package.json                    # Node dependencies
├── sample_traffic.mp4              # Bundled benchmark traffic video
├── AGAHI_Vision_Zero_Framework.ipynb # Complete 13-Section Google Colab Framework Notebook
└── README.md                       # Platform documentation
```
