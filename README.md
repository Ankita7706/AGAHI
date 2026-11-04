# AGAHI

# AGAHI – AI-Powered Predictive Road Safety Intelligence

### See the Risk Before the Crash.

**AGAHI** is an AI-powered road safety intelligence platform designed to transform existing traffic CCTV footage into actionable near-miss detection and predictive road safety insights.

The project aims to help urban authorities identify dangerous traffic interactions, detect high-risk road intersections, and prevent potential accidents before they happen — shifting road safety from reactive enforcement to proactive prevention.

Developed with the vision of making **Bhubaneswar a safer, smarter, and more pedestrian-friendly city**, AGAHI uses computer vision, multi-object tracking, trajectory analysis, and spatial risk mapping to uncover hidden road safety threats.

---

## 🚨 Problem Statement

Traditional traffic management systems primarily focus on monitoring violations and analysing accidents after they occur.

However, hundreds of dangerous interactions and near-miss incidents can happen before a serious accident takes place. Most of these events remain undetected and undocumented.

Key challenges include:

- **Reactive Road Safety:** Authorities often respond after accidents have already occurred.
- **Invisible Near-Misses:** Dangerous vehicle-pedestrian interactions go unnoticed.
- **Manual Video Analysis:** Reviewing thousands of hours of CCTV footage manually is inefficient.
- **Lack of Infrastructure Insights:** Existing enforcement systems provide limited information about unsafe road geometry and intersection design.
- **Vulnerable Road Users:** Pedestrians and two-wheeler riders face significant risks at high-conflict intersections.

AGAHI addresses these challenges by converting ordinary traffic footage into measurable road safety intelligence.

---

## 💡 Our Solution

AGAHI introduces an AI-driven approach to identifying and analysing near-miss incidents using existing city CCTV infrastructure.

Instead of waiting for accidents to happen, the system analyses road-user movements, identifies potentially dangerous interactions, and generates risk heatmaps that help civil engineers understand where infrastructure improvements are needed.

### Core Capabilities

- **AI-Based Object Detection:** Identifies vehicles, buses, trucks, auto-rickshaws, two-wheelers, and pedestrians.
- **Multi-Object Tracking:** Tracks individual road users across video frames.
- **Trajectory Analysis:** Understands movement patterns and interactions between road users.
- **Near-Miss Detection:** Uses Time-to-Collision (TTC) and Post-Encroachment Time (PET) to identify potentially dangerous interactions.
- **Risk Heatmap Generation:** Highlights recurring high-risk zones at intersections using spatial analysis.
- **Engineering Intelligence Dashboard:** Presents actionable insights to help authorities prioritise road safety improvements.
- **Privacy Protection:** Applies face and number-plate blurring to protect individual privacy.

---

## ⚙️ Technical Architecture

AGAHI follows a modular four-stage architecture.

### Stage 1 – Video Ingestion Engine
- Connects to existing CCTV RTSP streams.
- Supports recorded MP4 video footage.
- Extracts video frames.
- Performs camera calibration and resolution normalisation.
- Applies privacy protection through face and number-plate blurring.

### Stage 2 – AI Trajectory Extractor
- Uses YOLOv8/YOLOv10 for object detection.
- Uses ByteTrack for multi-object tracking.
- Maintains object identities across video frames.
- Uses homography transformation to project image coordinates onto the road plane.
- Generates continuous movement trajectories.

### Stage 3 – Risk Heatmap Generation
- Calculates Time-to-Collision (TTC).
- Calculates Post-Encroachment Time (PET).
- Uses Kernel Density Estimation (KDE) for spatial risk mapping.
- Identifies recurring traffic conflict zones.
- Analyses temporal patterns in dangerous interactions.

### Stage 4 – Engineer Dashboard
- Displays intersection-level risk information.
- Identifies peak conflict hours.
- Provides vehicle and pedestrian conflict distributions.
- Ranks high-risk intersections.
- Supports CAD/GIS export for infrastructure planning.

---

## 🧠 Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core backend and AI processing |
| YOLOv8 / YOLOv10 | Object detection |
| ByteTrack | Multi-object tracking |
| OpenCV | Video processing and computer vision |
| NumPy | Numerical and trajectory calculations |
| Kernel Density Estimation | Spatial risk heatmaps |
| TTC & PET | Near-miss risk assessment |
| Homography | Road-plane coordinate projection |
| RTSP | CCTV video stream ingestion |
| Web Dashboard | Visualisation and engineering insights |

*The stack represents the technologies specified in the proposed architecture; final implementation choices may evolve.*

---

## 📍 Proposed Pilot Locations – Bhubaneswar

AGAHI proposes an initial pilot deployment across five high-risk intersections:

1. Jayadev Vihar
2. Khandagiri
3. Rasulgarh
4. Master Canteen
5. Kalpana Square

### Example Infrastructure Applications

| Location | Identified Risk | Proposed Engineering Action |
|---|---|---|
| Jayadev Vihar | Pedestrian-vehicle conflicts | Leading Pedestrian Interval (LPI) |
| Khandagiri | Two-wheeler and bus merging conflicts | Raised pedestrian refuge island and improved channelisation |
| Rasulgarh | Rear-end and T-bone conflicts | Signal clearance recalibration and road safety improvements |

These are proposed use cases from the project presentation, subject to validation through actual traffic footage and field assessment.

---

## 📊 Proposed System Performance

The presentation specifies the following MVP performance targets/results:

| Metric | Presented Value |
|---|---:|
| Inference Speed | 38.5 FPS |
| Object Tracking | 96.4% ByteTrack MOTA |
| Near-Miss Recall | 92.8% |
| Edge Anonymisation | 100% |

*These figures are presentation-reported metrics and should be independently benchmarked and documented against the final implementation.*

---

## 🎯
