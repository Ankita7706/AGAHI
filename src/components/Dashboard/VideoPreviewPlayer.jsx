import React, { useRef, useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Video, 
  Layers, 
  Upload, 
  Crosshair, 
  AlertTriangle, 
  Settings2,
  Sliders,
  CheckSquare,
  Square,
  Sparkles
} from 'lucide-react';
import { NEAR_MISS_INCIDENTS } from '../../data/mockTrafficData';

export default function VideoPreviewPlayer({
  currentTime,
  isPlaying,
  onTogglePlay,
  onSeek,
  selectedIncident,
  activeCamera,
  onCameraChange,
  isExpanded,
  onToggleExpand
}) {
  const canvasRef = useRef(null);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(true);
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [showConflictVectors, setShowConflictVectors] = useState(true);
  const [showSpeedTags, setShowSpeedTags] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const videoElementRef = useRef(null);

  // File upload handler - preserved
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedVideoUrl(url);
    }
  };

  // Find if there is an active conflict at this timestamp - preserved
  const activeConflict = NEAR_MISS_INCIDENTS.find(inc => 
    Math.abs(currentTime - inc.timeSeconds) < 2.5
  );

  // Canvas-based real-time realistic traffic simulation renderer - preserved
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const width = canvas.width;
    const height = canvas.height;

    const render = () => {
      // Background: Roadway & Intersection Surface
      ctx.fillStyle = '#171e19';
      ctx.fillRect(0, 0, width, height);

      // Draw asphalt lanes
      ctx.fillStyle = '#272727';
      // Vertical road
      ctx.fillRect(width * 0.32, 0, width * 0.36, height);
      // Horizontal road
      ctx.fillRect(0, height * 0.35, width, height * 0.32);

      // Lane markings in Light Orange #efddcc
      ctx.strokeStyle = '#efddcc';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 8]);

      // Vertical center dashed divider
      ctx.beginPath();
      ctx.moveTo(width * 0.5, 0);
      ctx.lineTo(width * 0.5, height * 0.35);
      ctx.moveTo(width * 0.5, height * 0.67);
      ctx.lineTo(width * 0.5, height);
      ctx.stroke();

      // Horizontal center dashed divider
      ctx.beginPath();
      ctx.moveTo(0, height * 0.51);
      ctx.lineTo(width * 0.32, height * 0.51);
      ctx.moveTo(width * 0.68, height * 0.51);
      ctx.lineTo(width, height * 0.51);
      ctx.stroke();
      ctx.setLineDash([]);

      // Zebra Crosswalk in high contrast white
      ctx.fillStyle = '#ffffff';
      // North Zebra
      for (let i = 0; i < 9; i++) {
        ctx.fillRect(width * 0.34 + i * 14, height * 0.31, 8, 12);
      }
      // West Zebra
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(width * 0.28, height * 0.38 + i * 12, 12, 7);
      }

      // Stoplines in Light Orange #efddcc
      ctx.strokeStyle = '#efddcc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(width * 0.32, height * 0.35);
      ctx.lineTo(width * 0.68, height * 0.35);
      ctx.moveTo(width * 0.32, height * 0.37);
      ctx.lineTo(width * 0.32, height * 0.67);
      ctx.stroke();

      // Timestamp phase calculations
      const t = currentTime;

      // Simulated dynamic vehicles
      const vehicles = [
        {
          id: '#204',
          type: 'Two-Wheeler',
          color: '#efddcc',
          x: width * 0.25 + ((t * 22) % (width * 0.7)),
          y: height * 0.44 + Math.sin(t * 1.5) * 8,
          w: 14,
          h: 22,
          speed: '42 km/h',
          conf: 0.94,
          trail: [[width * 0.15, height * 0.44], [width * 0.22, height * 0.44]]
        },
        {
          id: '#088',
          type: 'Pedestrian',
          color: '#ff5f57',
          x: width * 0.29,
          y: height * 0.65 - ((t * 9) % (height * 0.35)),
          w: 10,
          h: 10,
          speed: '4 km/h',
          conf: 0.89,
          trail: [[width * 0.29, height * 0.62], [width * 0.29, height * 0.58]]
        },
        {
          id: '#112',
          type: 'Auto-Rickshaw',
          color: '#b7c6c2',
          x: width * 0.42,
          y: height * 0.1 + ((t * 18) % (height * 0.8)),
          w: 18,
          h: 26,
          speed: '28 km/h',
          conf: 0.96,
          trail: [[width * 0.42, height * 0.2], [width * 0.42, height * 0.3]]
        },
        {
          id: '#309',
          type: 'Car',
          color: '#ffffff',
          x: width * 0.58,
          y: height * 0.85 - ((t * 26) % (height * 0.8)),
          w: 22,
          h: 36,
          speed: '48 km/h',
          conf: 0.98,
          trail: [[width * 0.58, height * 0.7], [width * 0.58, height * 0.55]]
        },
        {
          id: '#415',
          type: 'City Bus',
          color: '#efddcc',
          x: width * 0.8 - ((t * 14) % (width * 0.7)),
          y: height * 0.58,
          w: 48,
          h: 24,
          speed: '24 km/h',
          conf: 0.97,
          trail: [[width * 0.85, height * 0.58], [width * 0.75, height * 0.58]]
        }
      ];

      // Draw trajectory trails
      if (showTrajectories) {
        vehicles.forEach(v => {
          ctx.strokeStyle = v.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(v.x, v.y);
          v.trail.forEach(pt => ctx.lineTo(pt[0], pt[1]));
          ctx.stroke();
        });
      }

      // Draw Vehicles / Bounding Boxes
      vehicles.forEach(v => {
        // Vehicle physical body
        ctx.fillStyle = v.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(v.x - v.w / 2, v.y - v.h / 2, v.w, v.h, 2);
        ctx.fill();
        ctx.stroke();

        // RF-DETR Bounding Box with hard lines
        if (showBoundingBoxes) {
          ctx.strokeStyle = v.color;
          ctx.lineWidth = 2;
          ctx.strokeRect(v.x - v.w / 2 - 3, v.y - v.h / 2 - 3, v.w + 6, v.h + 6);

          // Tag label
          ctx.fillStyle = '#000000';
          ctx.fillRect(v.x - v.w / 2 - 3, v.y - v.h / 2 - 17, 74, 14);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`${v.id} ${v.conf}`, v.x - v.w / 2 - 1, v.y - v.h / 2 - 6);
        }

        // Speed tag in Light Orange #efddcc
        if (showSpeedTags) {
          ctx.fillStyle = '#efddcc';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(v.speed, v.x - v.w / 2 - 1, v.y + v.h / 2 + 11);
        }
      });

      // Draw Conflict Collision Vectors if an active conflict is happening
      if (activeConflict && showConflictVectors) {
        const v1 = vehicles[0]; // Two-wheeler
        const v2 = vehicles[1]; // Pedestrian

        ctx.strokeStyle = '#ff5f57';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
        ctx.setLineDash([]);

        // Danger marker
        const midX = (v1.x + v2.x) / 2;
        const midY = (v1.y + v2.y) / 2;

        ctx.strokeStyle = '#ff5f57';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(midX, midY, 16, 0, Math.PI * 2);
        ctx.stroke();

        // TTC Warning pill in black & light orange
        ctx.fillStyle = '#000000';
        ctx.strokeStyle = '#efddcc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(midX - 45, midY - 26, 90, 18, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#efddcc';
        ctx.font = 'bold 10px Satoshi, sans-serif';
        ctx.fillText(`! TTC: ${activeConflict.ttc}s`, midX - 36, midY - 13);
      }

      // Camera HUD Overlay (CCTV OSD timestamp)
      ctx.fillStyle = '#000000';
      ctx.fillRect(8, 8, 170, 36);
      ctx.strokeStyle = '#efddcc';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(8, 8, 170, 36);

      ctx.fillStyle = '#efddcc';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('CCTV FEED · SMART CITY ICCC', 14, 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = '9px monospace';
      const mm = String(Math.floor(currentTime / 60)).padStart(2, '0');
      const ss = String(Math.floor(currentTime % 60)).padStart(2, '0');
      const ms = String(Math.floor((currentTime % 1) * 10)).padStart(1, '0');
      ctx.fillText(`CAM-04 · 2026-11-06 ${mm}:${ss}.${ms}`, 14, 34);

      // Status dot
      ctx.fillStyle = isPlaying ? '#28c840' : '#febc2e';
      ctx.beginPath();
      ctx.arc(width - 16, 16, 5, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTime, isPlaying, showBoundingBoxes, showTrajectories, showConflictVectors, showSpeedTags, activeConflict]);

  return (
    <div className={`transition-all duration-300 neo-browser-frame ${
      isExpanded ? 'fixed inset-6 z-50 max-w-5xl mx-auto my-auto h-[85vh] shadow-[16px_16px_0px_0px_#000000]' : 'w-full shadow-[8px_8px_0px_0px_#000000]'
    }`}>
      
      {/* Browser Header Bar with the 3 Traffic Dots */}
      <div className="neo-browser-header justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="mockup-dot-red" />
            <span className="mockup-dot-yellow" />
            <span className="mockup-dot-green" />
          </div>
          <span className="font-heading font-black text-xs text-white uppercase tracking-wider ml-2">
            LIVE CCTV PREVIEW
          </span>
          <span className="px-2 py-0.5 rounded bg-[#efddcc] text-black font-mono font-bold text-[10px] border border-black">
            {activeCamera?.name ? activeCamera.name.split('—')[0] : 'CAM-04'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Custom Video Uploader */}
          <label className="p-1.5 rounded bg-[#272727] hover:bg-[#efddcc] text-white hover:text-black border border-black cursor-pointer transition" title="Upload local MP4/WebM video">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept="video/mp4,video/webm" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Toggle Expand / Fullscreen */}
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded bg-[#272727] hover:bg-[#efddcc] text-white hover:text-black border border-black transition"
            title={isExpanded ? 'Collapse preview' : 'Expand preview'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative bg-[#171e19] aspect-video w-full flex items-center justify-center overflow-hidden border-b-2 border-black">
        {uploadedVideoUrl ? (
          <video
            ref={videoElementRef}
            src={uploadedVideoUrl}
            className="w-full h-full object-cover"
            controls={false}
            loop
            muted
          />
        ) : (
          <canvas
            ref={canvasRef}
            width={480}
            height={270}
            className="w-full h-full object-cover block"
          />
        )}

        {/* Critical Collision Neo Alert Bar */}
        {activeConflict && (
          <div className="absolute top-3 inset-x-3 p-2.5 rounded-lg bg-[#ff5f57] text-black border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-between text-xs font-bold animate-bounce">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-black" />
              <div>
                <span className="font-heading font-black">NEAR-MISS CONFLICT: </span>
                <span>{activeConflict.type} (TTC: {activeConflict.ttc}s, PET: {activeConflict.pet}s)</span>
              </div>
            </div>
            <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 rounded border border-black">
              {activeConflict.actor1.type} vs {activeConflict.actor2.type}
            </span>
          </div>
        )}

        {/* AI Inference Stats Overlay in Neo-Brutalist badge */}
        <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black border-2 border-black text-[10px] font-mono text-white flex items-center gap-3 shadow-[2px_2px_0px_0px_#000000]">
          <span>MODEL: <strong className="text-[#efddcc]">RF-DETR</strong></span>
          <span>TRACKER: <strong className="text-[#28c840]">ByteTrack</strong></span>
          <span>FPS: <strong className="text-white">29.8</strong></span>
        </div>
      </div>

      {/* Video Controls & Layer Toggles */}
      <div className="p-3 bg-white space-y-2">
        {/* Scrubber & Time */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-lg bg-black text-[#efddcc] border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition font-bold"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          <span className="text-[11px] font-mono font-bold text-black shrink-0">
            {String(Math.floor(currentTime / 60)).padStart(2, '0')}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
          </span>

          <input
            type="range"
            min={0}
            max={80}
            step={0.2}
            value={currentTime}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-[#efddcc] rounded-lg border-2 border-black appearance-none cursor-pointer accent-black"
          />

          <span className="text-[11px] font-mono font-bold text-black/60 shrink-0">01:20</span>

          <div className="flex items-center gap-1 text-[10px] font-mono font-bold">
            {[0.5, 1, 2].map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-1.5 py-0.5 rounded border-2 border-black transition ${
                  playbackSpeed === speed 
                    ? 'bg-black text-[#efddcc] shadow-[2px_2px_0px_0px_#000000]' 
                    : 'bg-white text-black hover:bg-[#efddcc]'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* AI Overlay Layer Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-1 pt-2 border-t-2 border-black text-[11px] font-bold text-black">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-black">
              <input
                type="checkbox"
                checked={showBoundingBoxes}
                onChange={() => setShowBoundingBoxes(!showBoundingBoxes)}
                className="rounded border-2 border-black text-black w-3.5 h-3.5 focus:ring-black"
              />
              <span>Bounding Boxes</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-black">
              <input
                type="checkbox"
                checked={showTrajectories}
                onChange={() => setShowTrajectories(!showTrajectories)}
                className="rounded border-2 border-black text-black w-3.5 h-3.5 focus:ring-black"
              />
              <span>Trajectories</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-black">
              <input
                type="checkbox"
                checked={showConflictVectors}
                onChange={() => setShowConflictVectors(!showConflictVectors)}
                className="rounded border-2 border-black text-black w-3.5 h-3.5 focus:ring-black"
              />
              <span>TTC Vectors</span>
            </label>
          </div>

          <span className="text-[10px] text-black font-mono font-bold hidden sm:inline bg-[#efddcc] px-2 py-0.5 rounded border border-black">
            HOMOGRAPHY: 2D METRIC
          </span>
        </div>
      </div>

    </div>
  );
}
