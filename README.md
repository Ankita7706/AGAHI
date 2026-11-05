# AGAHI – Vision Zero Model Development Framework (Google Colab Free Tier)

This workspace contains the complete end-to-end framework notebook: [`AGAHI_Vision_Zero_Framework.ipynb`](file:///C:/Users/HP/agahi-vision-zero/AGAHI_Vision_Zero_Framework.ipynb).

---

## 🚀 How to Run in Google Colab (Free Tier)

### Step 1: Upload the Notebook to Colab
1. Open your web browser and go to [colab.research.google.com](https://colab.research.google.com/).
2. In the popup dialog, click the **Upload** tab.
3. Drag and drop or browse to select:
   `C:\Users\HP\agahi-vision-zero\AGAHI_Vision_Zero_Framework.ipynb`

### Step 2: Enable the Free GPU
1. In the Colab top menu, click **Runtime** ➔ **Change runtime type**.
2. Under **Hardware accelerator**, select **T4 GPU** (Standard free tier).
3. Click **Save**.

### Step 3: Run the Cells in Order
- **Cell 1 & 2:** Mounts your Google Drive. This creates a folder `My Drive/VisionZero_AGAHI/` on your Drive so training weights and processed videos are **never lost** even if Colab disconnects.
- **Cell 3 & 4:** Automatically downloads a sample traffic video and sets up the **Safety Analytics Engine**.
- **Cell 5 & 6:** Runs detection (`RFDETRMedium`) + tracking (`ByteTrack`) + speed calculation ($km/h$) + near-miss collision detection ($\text{TTC} < 1.6s$). Renders the video directly in the notebook cell.
- **Cell 7:** Plots a 2D **Risk Heatmap** using Kernel Density Estimation (KDE) over the intersection to spot recurring conflict zones.
- **Cell 8 & 9:** Fine-tunes RF-DETR for Bhubaneswar road conditions (Auto-rickshaws, high-density two-wheelers, distant pedestrians).

---

## 📁 Google Drive Directory Structure Created

Once Cell 1 runs, Google Drive will automatically maintain:
```text
My Drive/
└── VisionZero_AGAHI/
    ├── checkpoints/       <-- Fine-tuned RF-DETR weights (.pth)
    ├── dataset/           <-- Upload Bhubaneswar COCO dataset here
    │   ├── train/
    │   ├── valid/
    │   └── test/
    └── output/            <-- Processed videos & KDE risk heatmaps
```

---

## 🛠 Tuning Parameters in the Notebook

| Parameter | Default | Purpose |
| :--- | :--- | :--- |
| `ttc_threshold` | `1.6` seconds | Time-to-collision threshold to trigger near-miss red alerts |
| `batch_size` | `4` | Memory-safe batch size for Google Colab Free T4 (15GB VRAM) |
| `epochs` | `35` | Fine-tuning epochs on custom dataset |
| `track_activation_threshold` | `0.35` | Minimum confidence score for ByteTrack track association |


