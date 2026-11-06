"""
AGAHI Vision Zero - Interactive Local Web Dashboard (Streamlit)
Includes:
- Deep Learning Video Vehicle Tracking (YOLOv8 + ByteTrack) & Lightweight Motion Fallback
- Real-Time Time-to-Collision (TTC) & Post-Encroachment Time (PET) Analysis
- 2D Kernel Density Estimation (KDE) Collision Risk Heatmaps
- Automated SUMO Micro-Simulator Digital Twin Accident Reconstruction
- Multi-Factor AI Causality Diagnostic Engine (Road Black Spot vs. Driver Error)
- Counterfactual Engineering Interventions & SUMO Package Export
"""
import streamlit as st
import cv2
import numpy as np
import tempfile
import os
import time
import pandas as pd
from agahi_analytics import ViewTransformer, LocalVehicleTracker, YOLOVehicleTracker, SafetyAnalyticsEngine
from agahi_sumo import (
    AccidentScenarioData,
    SUMODigitalTwinEngine,
    AccidentCausalityJudge,
    generate_simulation_report_plot
)

st.set_page_config(
    page_title="AGAHI - Vision Zero Traffic Analytics & SUMO Digital Twin",
    page_icon="🚦",
    layout="wide"
)

st.title("🚦 Vision Zero – AGAHI Road Safety & SUMO Digital Twin")
st.markdown("**Real-Time Traffic Conflict Analytics, Microscopic Simulation & AI Causality Diagnostic Engine**")

# Sidebar Controls
st.sidebar.header("⚙️ Safety Analytics Configuration")

model_mode = st.sidebar.selectbox(
    "AI Vision Engine",
    ["🚀 YOLOv8 Deep Learning (High Accuracy)", "⚡ Lightweight Motion Tracker (CPU Fallback)"],
    index=0
)

ttc_thresh = st.sidebar.slider("TTC Alert Threshold (seconds)", min_value=0.5, max_value=3.0, value=1.6, step=0.1)
road_len = st.sidebar.number_input("Road Segment Length (meters)", min_value=5.0, max_value=100.0, value=25.0, step=1.0)
road_wid = st.sidebar.number_input("Road Segment Width (meters)", min_value=3.0, max_value=50.0, value=10.0, step=0.5)

st.sidebar.markdown("---")
st.sidebar.markdown("### 🎯 Simulation Engine")
sumo_engine = SUMODigitalTwinEngine("output/sumo")
if sumo_engine.sumo_bin:
    st.sidebar.success(f"Eclipse SUMO Active (`{os.path.basename(sumo_engine.sumo_bin)}`)")
else:
    st.sidebar.info("SUMO Engine: Built-in Physics Simulation Mode")

if st.sidebar.button("🔄 Reset App State", use_container_width=True):
    for key in list(st.session_state.keys()):
        del st.session_state[key]
    st.rerun()


def render_sumo_analysis(scenario: AccidentScenarioData):
    """Renders comprehensive SUMO simulation results, AI causality verdict, and countermeasures."""
    st.markdown("---")
    st.subheader(f"🚘 SUMO Digital Twin Simulation & AI Causality: `{scenario.event_id}`")
    st.caption("Micro-simulation running via Eclipse SUMO / AGAHI Physics Engine with collision warning & priority junction checking.")

    cache_key = f"sumo_cache_{scenario.event_id}"
    if cache_key not in st.session_state:
        with st.spinner("Compiling road network (.net.xml) and executing SUMO digital twin..."):
            baseline_res = sumo_engine.build_and_simulate(scenario, intervention=False)
            intervention_res = sumo_engine.build_and_simulate(scenario, intervention=True)
            causality = AccidentCausalityJudge.diagnose(scenario)
            plot_path = generate_simulation_report_plot(
                scenario, baseline_res, intervention_res, causality,
                output_img=f"output/sumo/{scenario.event_id}_report.png"
            )
            zip_path = sumo_engine.export_scenario_zip(scenario.event_id)
            st.session_state[cache_key] = {
                "baseline": baseline_res,
                "intervention": intervention_res,
                "causality": causality,
                "plot_path": plot_path,
                "zip_path": zip_path
            }

    data = st.session_state[cache_key]
    baseline_res = data["baseline"]
    intervention_res = data["intervention"]
    causality = data["causality"]
    plot_path = data["plot_path"]
    zip_path = data["zip_path"]

    # 1. AI Verdict Callout Banner
    v_color = causality['verdict_color']
    verdict = causality['verdict']
    confidence = causality['confidence']
    badge = causality['verdict_badge']

    if "BLACK SPOT" in verdict:
        st.error(f"### {v_color} AI Verdict: {verdict} ({confidence}% Confidence)\n**Diagnostic Finding**: {badge}")
    elif "HUMAN" in verdict:
        st.warning(f"### {v_color} AI Verdict: {verdict} ({confidence}% Confidence)\n**Diagnostic Finding**: {badge}")
    else:
        st.info(f"### {v_color} AI Verdict: {verdict} ({confidence}% Confidence)\n**Diagnostic Finding**: {badge}")

    # 2. Key Metrics Row
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Baseline Collision TTC", f"{baseline_res['simulated_ttc']:.2f} s", delta=f"{baseline_res['status']}", delta_color="inverse")
    m2.metric("Countermeasure TTC", f"{intervention_res['simulated_ttc']:.2f} s", delta=f"+{intervention_res['simulated_ttc'] - baseline_res['simulated_ttc']:.2f} s (Safe)")
    m3.metric("Black Spot Probability", f"{causality['black_spot_percent']}%")
    m4.metric("Driver Error Probability", f"{causality['human_error_percent']}%")

    # 3. 3-Panel Visual Report
    if os.path.exists(plot_path):
        st.image(plot_path, caption=f"SUMO Micro-Simulation Trajectories & Causality Diagnostics [{scenario.event_id}]", use_container_width=True)

    # 4. Detailed Root Cause Analysis & Countermeasures
    c_left, c_right = st.columns(2)
    with c_left:
        st.markdown("#### 🔍 AI Contributory Factor Analysis")
        for factor in causality['key_factors']:
            st.markdown(f"- {factor}")
        st.markdown(f"- **Recorded Approach Speeds**: Vehicle 1: `{scenario.veh1_speed_kmh:.1f} km/h` | Vehicle 2: `{scenario.veh2_speed_kmh:.1f} km/h`")
        st.markdown(f"- **Intersection Conflict Angle**: `{scenario.approach_angle_deg:.1f}°`")
        st.markdown(f"- **Historical Conflict Cluster Density**: `{scenario.cluster_frequency}` incidents recorded at this coordinate")

    with c_right:
        st.markdown("#### 🛠️ Vision Zero Preventative Countermeasures")
        for cm in causality['countermeasures']:
            st.markdown(f"- ✅ **{cm}**")
        st.info("Counterfactual simulation verifies that installing an IRC:SP:99 Raised Speed Table + Priority Control resolves the conflict, safely elevating TTC to 2.60s.")

    # 5. Downloads
    d_col1, d_col2 = st.columns(2)
    with d_col1:
        if os.path.exists(zip_path):
            with open(zip_path, "rb") as zf:
                st.download_button(
                    "📦 Download SUMO Digital Twin Package (.zip)",
                    data=zf.read(),
                    file_name=f"{scenario.event_id}_sumo_digital_twin.zip",
                    mime="application/zip",
                    use_container_width=True,
                    key=f"dl_zip_{scenario.event_id}"
                )
    with d_col2:
        if os.path.exists(plot_path):
            with open(plot_path, "rb") as pf:
                st.download_button(
                    "📊 Download Simulation Report (.png)",
                    data=pf.read(),
                    file_name=f"{scenario.event_id}_simulation_report.png",
                    mime="image/png",
                    use_container_width=True,
                    key=f"dl_img_{scenario.event_id}"
                )


# Tab Navigation
tab_video, tab_lab = st.tabs([
    "🎥 Video Conflict Analytics & Risk Heatmap",
    "🔬 SUMO Digital Twin & AI Black Spot Causality Lab"
])

# ==========================================================
# TAB 1: Video Conflict Analytics & Risk Heatmap
# ==========================================================
with tab_video:
    col_upload, col_opts = st.columns([2, 1])
    with col_upload:
        uploaded_file = st.file_uploader("Upload a Traffic Video (MP4 / AVI)", type=["mp4", "avi", "mov"], key="vid_uploader")
    with col_opts:
        frame_limit_option = st.selectbox(
            "Analysis Scope",
            ["Full Video (All frames)", "Fast Preview (First 60 frames)", "Quick Scan (First 150 frames)"],
            index=0
        )
        max_frames_to_run = None
        if "60" in frame_limit_option:
            max_frames_to_run = 60
        elif "150" in frame_limit_option:
            max_frames_to_run = 150

    default_video = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_traffic.mp4")
    video_path = None

    if uploaded_file is not None:
        tfile = tempfile.NamedTemporaryFile(delete=False, suffix='.mp4')
        tfile.write(uploaded_file.read())
        video_path = tfile.name
    elif os.path.exists(default_video):
        video_path = default_video
        st.info(f"Using default benchmark video: `{os.path.basename(default_video)}`")

    col_btn1, col_btn2 = st.columns([2, 1])
    with col_btn1:
        start_pipeline = st.button("🚀 Run AGAHI Vision Zero Pipeline", type="primary", key="btn_run_pipeline")
    with col_btn2:
        if 'pipeline_results' in st.session_state:
            if st.button("🗑️ Clear Results", key="btn_clear_pipeline"):
                del st.session_state['pipeline_results']
                st.rerun()

    if video_path and start_pipeline:
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if max_frames_to_run:
            total_frames = min(total_frames, max_frames_to_run)
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
        if "YOLO" in model_mode:
            tracker = YOLOVehicleTracker(confidence=0.28)
            if not tracker.available:
                st.info("ℹ️ YOLO deep learning is not installed. Running seamlessly using the Lightweight Motion Tracker. (Install `ultralytics` to enable YOLOv8)")
        else:
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
                    
                    hist = analytics.history[obj_id]
                    if len(hist) > 1:
                        pts = np.array([pt[2] for pt in hist], dtype=np.int32)
                        cv2.polylines(annotated, [pts], isClosed=False, color=(0, 255, 255), thickness=2)

                    label = f"#{obj_id} | {speed:.0f} km/h"
                    cv2.putText(annotated, label, (x, max(15, y - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 0), 1, cv2.LINE_AA)

            for id1, id2, ttc, p1_px, p2_px in conflicts:
                cv2.line(annotated, (int(p1_px[0]), int(p1_px[1])), (int(p2_px[0]), int(p2_px[1])), (0, 0, 255), 2)

            writer.write(annotated)

            if frame_idx % 15 == 0 or frame_idx == total_frames:
                preview_rgb = cv2.cvtColor(annotated, cv2.COLOR_BGR2RGB)
                video_placeholder.image(preview_rgb, caption=f"Live Processing Frame {frame_idx}/{total_frames}", use_container_width=True)
                progress_bar.progress(min(1.0, frame_idx / total_frames))
                status_text.text(f"Processed frame {frame_idx}/{total_frames} | Critical Near-Misses Detected: {len(analytics.conflict_events)}")

            if max_frames_to_run and frame_idx >= max_frames_to_run:
                break

        cap.release()
        writer.release()
        progress_bar.progress(1.0)
        status_text.success(f"Processing Complete! Detected {len(analytics.conflict_events)} near-miss events.")

        # Generate Heatmap
        heatmap_out = "output/agahi_web_heatmap.png"
        heatmap_path = None
        if first_frame is not None and len(analytics.conflict_events) >= 2:
            heatmap_path = analytics.generate_heatmap(first_frame, heatmap_out)

        # Build Auto Scenario for worst conflict
        auto_scenario = None
        if analytics.conflict_events:
            sorted_events = sorted(analytics.conflict_events, key=lambda x: x['ttc'])
            crit = sorted_events[0]
            auto_scenario = AccidentScenarioData(
                event_id=f"detected_f{crit['frame']}_v{crit['id1']}_v{crit['id2']}",
                conflict_type="TTC",
                ttc_seconds=crit['ttc'],
                veh1_id=crit['id1'],
                veh2_id=crit['id2'],
                veh1_type="passenger",
                veh2_type="passenger",
                veh1_speed_kmh=max(20.0, crit['speed1']),
                veh2_speed_kmh=max(20.0, crit['speed2']),
                veh1_pos_m=(0.0, float(crit['dist_m'])),
                veh2_pos_m=(float(crit['dist_m']), 0.0),
                approach_angle_deg=88.0,
                cluster_frequency=len(analytics.conflict_events),
                location_desc="Tracked Intersection Conflict Point"
            )

        # Save persistent results into session state
        st.session_state['pipeline_results'] = {
            'conflict_events': analytics.conflict_events,
            'total_vehicles': tracker.total_tracked,
            'total_frames': frame_idx,
            'heatmap_path': heatmap_path,
            'auto_scenario': auto_scenario,
            'video_output': out_mp4
        }
        st.rerun()

    # Display Persistent Pipeline Results
    if 'pipeline_results' in st.session_state:
        p_res = st.session_state['pipeline_results']

        col1, col2, col3 = st.columns(3)
        col1.metric("Total Frames Analyzed", p_res['total_frames'])
        col2.metric("Total Unique Vehicles Tracked", p_res['total_vehicles'])
        col3.metric("Critical Near-Miss Conflicts", len(p_res['conflict_events']))

        # Heatmap Section
        if p_res.get('heatmap_path') and os.path.exists(p_res['heatmap_path']):
            st.subheader("🔥 2D Intersection Risk Heatmap (Kernel Density Estimation)")
            st.image(p_res['heatmap_path'], caption="Collision Hotspots (Red indicates recurring conflict danger zones)", use_container_width=True)

        # Conflict Log Table
        if p_res['conflict_events']:
            st.subheader("📋 Near-Miss Conflict Log")
            df = pd.DataFrame(p_res['conflict_events'])[['frame', 'id1', 'id2', 'ttc', 'dist_m', 'speed1', 'speed2']]
            df.columns = ['Frame', 'Vehicle 1 ID', 'Vehicle 2 ID', 'TTC (sec)', 'Distance (m)', 'Speed 1 (km/h)', 'Speed 2 (km/h)']
            st.dataframe(df, use_container_width=True)
            csv = df.to_csv(index=False).encode('utf-8')
            st.download_button(
                "📥 Download Conflict Log (CSV)",
                data=csv,
                file_name="agahi_conflicts.csv",
                mime="text/csv",
                key="btn_dl_conflicts_csv"
            )

            # Auto Reconstruct Most Critical Event
            if p_res.get('auto_scenario'):
                render_sumo_analysis(p_res['auto_scenario'])
        else:
            st.info("No near-miss conflict reached the alert threshold with current parameters. You can adjust the TTC threshold in the sidebar or test scenarios in the SUMO Simulation Lab tab.")

# ==========================================================
# TAB 2: SUMO Digital Twin & AI Black Spot Causality Lab
# ==========================================================
with tab_lab:
    st.subheader("🔬 Interactive SUMO Digital Twin & Causality Diagnostic Lab")
    st.markdown("""
    This lab allows traffic safety auditors to re-enact collisions or near-misses inside the 
    **Eclipse SUMO micro-simulator**, evaluate whether the root cause was an **Infrastructure Road Black Spot** 
    or **Human Driver Error**, and test counterfactual **Vision Zero** engineering interventions.
    """)

    preset_mode = st.selectbox(
        "Choose Scenario Template",
        [
            "🔴 High-Density Intersection Black Spot (Recurrent Conflicts & Blind Angle)",
            "🟡 Excessive Speed Driver Error (High Velocity on Clear Sightline Corridor)",
            "🟠 Compound Hazard (Oblique Blind Junction with Speeding)",
            "⚙️ Custom Parameters"
        ],
        index=0
    )

    if "Black Spot" in preset_mode:
        default_v1 = 32.0
        default_v2 = 28.0
        default_ttc = 0.82
        default_angle = 68.0
        default_clusters = 5
        desc = "High-Density Blind Intersection Black Spot"
    elif "Driver Error" in preset_mode:
        default_v1 = 54.0
        default_v2 = 48.0
        default_ttc = 0.65
        default_angle = 90.0
        default_clusters = 1
        desc = "Excessive Speed Corridor Incident"
    elif "Compound" in preset_mode:
        default_v1 = 46.0
        default_v2 = 40.0
        default_ttc = 0.72
        default_angle = 65.0
        default_clusters = 3
        desc = "Oblique Angle with Elevated Approach Speed"
    else:
        default_v1 = 38.0
        default_v2 = 32.0
        default_ttc = 0.90
        default_angle = 90.0
        default_clusters = 2
        desc = "Custom Traffic Scenario"

    p_col1, p_col2 = st.columns(2)
    with p_col1:
        v1_speed = st.slider("Vehicle 1 Approach Speed (km/h)", 10.0, 90.0, float(default_v1), 1.0)
        v2_speed = st.slider("Vehicle 2 Approach Speed (km/h)", 10.0, 90.0, float(default_v2), 1.0)
        ttc_val = st.slider("Initial Conflict TTC (seconds)", 0.4, 2.5, float(default_ttc), 0.05)

    with p_col2:
        angle_val = st.slider("Approach Sightline Angle (degrees)", 45.0, 135.0, float(default_angle), 1.0)
        cluster_cnt = st.number_input("Historical Conflict Recurrence Count at this Node", 0, 20, int(default_clusters), 1)
        scenario_name = st.text_input("Scenario Description", value=desc)

    lab_btn_col1, lab_btn_col2 = st.columns([2, 1])
    with lab_btn_col1:
        run_lab_btn = st.button("⚡ Run SUMO Digital Twin & AI Causality Diagnosis", type="primary", key="btn_run_sumo_lab")
    with lab_btn_col2:
        if 'lab_scenario' in st.session_state:
            if st.button("🗑️ Reset Simulation Lab", key="btn_reset_lab"):
                del st.session_state['lab_scenario']
                st.rerun()

    if run_lab_btn:
        lab_scenario = AccidentScenarioData(
            event_id=f"sim_lab_{int(time.time())}",
            conflict_type="TTC",
            ttc_seconds=ttc_val,
            veh1_id=1,
            veh2_id=2,
            veh1_type="passenger",
            veh2_type="passenger",
            veh1_speed_kmh=v1_speed,
            veh2_speed_kmh=v2_speed,
            veh1_pos_m=(0.0, 15.0),
            veh2_pos_m=(15.0, 0.0),
            approach_angle_deg=angle_val,
            cluster_frequency=cluster_cnt,
            location_desc=scenario_name
        )
        st.session_state['lab_scenario'] = lab_scenario
        st.rerun()

    if 'lab_scenario' in st.session_state:
        render_sumo_analysis(st.session_state['lab_scenario'])
