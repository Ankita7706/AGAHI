import React, { useState } from 'react';
import { Clock, AlertTriangle, Info, CheckCircle2, SlidersHorizontal, Zap } from 'lucide-react';
import { REAL_TTC_TIMESERIES, REAL_NEAR_MISS_INCIDENTS, VIDEO_DURATION } from '../../data/realTrafficData';

export default function TtcRiskChart({ currentTime, onSeek, onSelectIncident }) {
  const [metricMode, setMetricMode] = useState('both'); // 'ttc', 'risk', 'both'

  // Dimensions for SVG chart
  const svgWidth = 800;
  const svgHeight = 240;
  const padding = { top: 25, right: 35, bottom: 35, left: 50 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Scale accurately to real video duration (11.18 seconds)
  const maxTime = VIDEO_DURATION || 11.18;
  const maxTtc = 4.0;
  const maxRisk = 100;

  // Scaling helpers
  const scaleX = (t) => padding.left + (Math.min(t, maxTime) / maxTime) * chartWidth;
  const scaleY_Ttc = (val) => padding.top + chartHeight - (Math.min(val, maxTtc) / maxTtc) * chartHeight;
  const scaleY_Risk = (val) => padding.top + chartHeight - (Math.min(val, maxRisk) / maxRisk) * chartHeight;

  // Build SVG path for real TTC
  const ttcPoints = REAL_TTC_TIMESERIES.map(d => `${scaleX(d.t)},${scaleY_Ttc(d.ttc)}`).join(' ');
  // Build SVG path for real Risk Index
  const riskPoints = REAL_TTC_TIMESERIES.map(d => `${scaleX(d.t)},${scaleY_Risk(d.risk)}`).join(' ');

  // Danger threshold Y position (TTC = 1.5s)
  const dangerY = scaleY_Ttc(1.5);

  // Current video playhead X
  const currentX = scaleX(currentTime);

  return (
    <div className="rounded-xl bg-white border-2 border-black p-5 shadow-[8px_8px_0px_0px_#000000]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-black" />
            <h3 className="font-heading font-black text-xl text-black">
              SURROGATE SAFETY TIMELINE: REAL-TIME TIME-TO-COLLISION (TTC)
            </h3>
          </div>
          <p className="text-xs font-medium text-black/70 mt-0.5">
            Continuous kinetic safety curve extracted from <code className="bg-[#efddcc] px-1 py-0.2 rounded border border-black text-black font-bold">sample_traffic.mp4</code>. Valleys dipping into the red zone indicate near-miss conflict points.
          </p>
        </div>

        {/* Metric Selector Controls */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center p-1 rounded-lg bg-[#efddcc] border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
            <button
              onClick={() => setMetricMode('both')}
              className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
                metricMode === 'both' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              Both (TTC + Risk)
            </button>
            <button
              onClick={() => setMetricMode('ttc')}
              className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
                metricMode === 'ttc' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              TTC Curve Only
            </button>
            <button
              onClick={() => setMetricMode('risk')}
              className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
                metricMode === 'risk' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              Risk Index Only
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative w-full overflow-x-auto bg-[#fafafa] rounded-lg border-2 border-black">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-auto cursor-pointer select-none"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const normX = (clickX / rect.width) * svgWidth;
            const clampedX = Math.max(padding.left, Math.min(normX, svgWidth - padding.right));
            const targetTime = ((clampedX - padding.left) / chartWidth) * maxTime;
            onSeek(parseFloat(targetTime.toFixed(2)));
          }}
        >
          {/* Danger Zone Background (TTC < 1.5s) */}
          <rect
            x={padding.left}
            y={dangerY}
            width={chartWidth}
            height={chartHeight - (dangerY - padding.top)}
            fill="#ff5f57"
            fillOpacity="0.14"
          />

          {/* Grid lines */}
          {[0, 1.0, 2.0, 3.0, 4.0].map((val) => {
            const y = scaleY_Ttc(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke="#000000"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  strokeOpacity="0.25"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#000000"
                >
                  {val.toFixed(1)}s
                </text>
              </g>
            );
          })}

          {/* Critical Threshold Line at 1.5s */}
          <line
            x1={padding.left}
            y1={dangerY}
            x2={svgWidth - padding.right}
            y2={dangerY}
            stroke="#ff5f57"
            strokeWidth="1.8"
            strokeDasharray="6 3"
          />
          <text
            x={svgWidth - padding.right - 5}
            y={dangerY - 5}
            textAnchor="end"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
            fill="#ff5f57"
          >
            CRITICAL CONFLICT THRESHOLD (1.50s)
          </text>

          {/* Time Axis Markers (0 to 11.2s) */}
          {[0, 2, 4, 6, 8, 10, maxTime].map((sec) => {
            const x = scaleX(sec);
            return (
              <g key={sec}>
                <line
                  x1={x}
                  y1={padding.top + chartHeight}
                  x2={x}
                  y2={padding.top + chartHeight + 4}
                  stroke="#000000"
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={padding.top + chartHeight + 16}
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#000000"
                >
                  {sec.toFixed(0)}s
                </text>
              </g>
            );
          })}

          {/* Risk Index Curve in Orange (if mode is both or risk) */}
          {(metricMode === 'both' || metricMode === 'risk') && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="3 3"
              points={riskPoints}
            />
          )}

          {/* Real TTC Kinetic Curve in Solid Black/Red (if mode is both or ttc) */}
          {(metricMode === 'both' || metricMode === 'ttc') && (
            <polyline
              fill="none"
              stroke="#0c6366"
              strokeWidth="3"
              points={ttcPoints}
            />
          )}

          {/* Near-Miss Incident Flags on Timeline */}
          {REAL_NEAR_MISS_INCIDENTS.map((inc) => {
            const ix = scaleX(inc.timeSeconds);
            const iy = scaleY_Ttc(inc.ttc);

            return (
              <g 
                key={inc.id}
                className="cursor-pointer group"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectIncident(inc);
                  onSeek(inc.timeSeconds);
                }}
              >
                {/* Marker line */}
                <line
                  x1={ix}
                  y1={padding.top}
                  x2={ix}
                  y2={padding.top + chartHeight}
                  stroke="#ff5f57"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                {/* Hotspot diamond */}
                <polygon
                  points={`${ix},${iy - 7} ${ix + 6},${iy} ${ix},${iy + 7} ${ix - 6},${iy}`}
                  fill="#ff5f57"
                  stroke="#000000"
                  strokeWidth="1.5"
                />
                {/* Label tag */}
                <rect
                  x={ix - 18}
                  y={iy - 22}
                  width="36"
                  height="14"
                  rx="3"
                  fill="#171e19"
                  stroke="#000000"
                  strokeWidth="1"
                />
                <text
                  x={ix}
                  y={iy - 12}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                  fill="#efddcc"
                >
                  {inc.ttc}s
                </text>
              </g>
            );
          })}

          {/* Current Video Playhead Line (Real Scrubber) */}
          <line
            x1={currentX}
            y1={padding.top}
            x2={currentX}
            y2={padding.top + chartHeight}
            stroke="#000000"
            strokeWidth="2.5"
          />
          <polygon
            points={`${currentX - 5},${padding.top - 6} ${currentX + 5},${padding.top - 6} ${currentX},${padding.top}`}
            fill="#000000"
          />

        </svg>
      </div>

      {/* Chart Footer: Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs mt-3 pt-3 border-t-2 border-black/10">
        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#0c6366]" />
            <span>Time-to-Collision (TTC in seconds)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 border-b-2 border-dashed border-[#f59e0b]" />
            <span>Risk Score Index (0-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-[#ff5f57] border border-black" />
            <span>Critical Incident Markers</span>
          </div>
        </div>

        <span className="text-[11px] font-mono font-bold text-black/60">
          Click anywhere on graph to seek video
        </span>
      </div>

    </div>
  );
}
