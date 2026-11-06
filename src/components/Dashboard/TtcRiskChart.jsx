import React, { useState } from 'react';
import { Clock, AlertTriangle, Info, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { TTC_TIMESERIES, NEAR_MISS_INCIDENTS } from '../../data/mockTrafficData';

export default function TtcRiskChart({ currentTime, onSeek, onSelectIncident }) {
  const [metricMode, setMetricMode] = useState('both'); // 'ttc', 'pet', 'both'

  // Dimensions for SVG chart - preserved
  const svgWidth = 800;
  const svgHeight = 240;
  const padding = { top: 25, right: 35, bottom: 35, left: 50 };

  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  const maxTime = 80;
  const maxMetric = 5.0;

  // Scaling helpers
  const scaleX = (t) => padding.left + (t / maxTime) * chartWidth;
  const scaleY = (val) => padding.top + chartHeight - (Math.min(val, maxMetric) / maxMetric) * chartHeight;

  // Build SVG path for TTC
  const ttcPoints = TTC_TIMESERIES.map(d => `${scaleX(d.t)},${scaleY(d.ttc)}`).join(' ');
  // Build SVG path for PET
  const petPoints = TTC_TIMESERIES.map(d => `${scaleX(d.t)},${scaleY(d.pet)}`).join(' ');

  // Danger threshold Y position (1.5s)
  const dangerY = scaleY(1.5);
  // Caution threshold Y position (3.0s)
  const cautionY = scaleY(3.0);

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
              SURROGATE SAFETY TIMELINE: TTC & PET KINETICS
            </h3>
          </div>
          <p className="text-xs font-medium text-black/70 mt-0.5">
            Continuous kinetic safety margins extracted from video feed. Valleys dipping into the red zone indicate critical near-miss events.
          </p>
        </div>

        {/* Metric Selector Controls in Light Orange #efddcc */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center p-1 rounded-lg bg-[#efddcc] border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
            <button
              onClick={() => setMetricMode('both')}
              className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
                metricMode === 'both' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              Both (TTC + PET)
            </button>
            <button
              onClick={() => setMetricMode('ttc')}
              className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
                metricMode === 'ttc' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              TTC Only
            </button>
            <button
              onClick={() => setMetricMode('pet')}
              className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
                metricMode === 'pet' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              PET Only
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
            onSeek(targetTime);
          }}
        >
          {/* Danger Zone Background (< 1.5s) */}
          <rect
            x={padding.left}
            y={dangerY}
            width={chartWidth}
            height={scaleY(0) - dangerY}
            fill="#ff5f57"
            fillOpacity="0.25"
          />

          {/* Caution Zone Background (1.5s - 3.0s) in warm light orange */}
          <rect
            x={padding.left}
            y={cautionY}
            width={chartWidth}
            height={dangerY - cautionY}
            fill="#efddcc"
            fillOpacity="0.5"
          />

          {/* Grid lines & Y Axis labels */}
          {[1.0, 1.5, 2.0, 3.0, 4.0, 5.0].map((val) => {
            const y = scaleY(val);
            const isDanger = val === 1.5;
            const isCaution = val === 3.0;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={svgWidth - padding.right}
                  y2={y}
                  stroke={isDanger ? '#ff5f57' : isCaution ? '#0c6366' : '#000000'}
                  strokeWidth={isDanger || isCaution ? 2 : 1}
                  strokeDasharray={isDanger || isCaution ? '4 4' : '2 2'}
                  opacity={isDanger || isCaution ? 1 : 0.3}
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill={isDanger ? '#ff5f57' : isCaution ? '#0c6366' : '#000000'}
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {val.toFixed(1)}s
                </text>
              </g>
            );
          })}

          {/* X Axis Time Marks */}
          {[0, 15, 30, 45, 60, 75].map((t) => {
            const x = scaleX(t);
            return (
              <g key={t}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={svgHeight - padding.bottom}
                  stroke="#000000"
                  strokeWidth="1"
                  opacity="0.2"
                />
                <text
                  x={x}
                  y={svgHeight - padding.bottom + 18}
                  textAnchor="middle"
                  fill="#000000"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {String(Math.floor(t / 60)).padStart(2, '0')}:{String(t % 60).padStart(2, '0')}
                </text>
              </g>
            );
          })}

          {/* Threshold zone labels in Neo badges */}
          <text x={svgWidth - padding.right - 6} y={dangerY - 6} textAnchor="end" fill="#ff5f57" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            CRITICAL NEAR-MISS BARRIER (&lt; 1.5s)
          </text>
          <text x={svgWidth - padding.right - 6} y={cautionY - 6} textAnchor="end" fill="#0c6366" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            CAUTION SAFETY MARGIN (&lt; 3.0s)
          </text>

          {/* Polyline: Time-to-Collision (TTC) - Solid Black / Thick */}
          {(metricMode === 'ttc' || metricMode === 'both') && (
            <polyline
              fill="none"
              stroke="#000000"
              strokeWidth="3.5"
              points={ttcPoints}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Polyline: Post-Encroachment Time (PET) - Dashed Sage */}
          {(metricMode === 'pet' || metricMode === 'both') && (
            <polyline
              fill="none"
              stroke="#b7c6c2"
              strokeWidth="3"
              strokeDasharray="6 4"
              points={petPoints}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Incident markers with pulsing danger icons */}
          {NEAR_MISS_INCIDENTS.map(inc => {
            const x = scaleX(inc.timeSeconds);
            const y = scaleY(inc.ttc);
            const isSelected = Math.abs(currentTime - inc.timeSeconds) < 2.5;

            return (
              <g 
                key={inc.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSeek(inc.timeSeconds);
                  if (onSelectIncident) onSelectIncident(inc);
                }}
                className="cursor-pointer"
              >
                {/* Vertical pin line */}
                <line
                  x1={x}
                  y1={y}
                  x2={x}
                  y2={svgHeight - padding.bottom}
                  stroke="#ff5f57"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />

                {/* Circle marker with hard black border */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8 : 6}
                  fill="#ff5f57"
                  stroke="#000000"
                  strokeWidth="2"
                />

                {/* Neo Callout Tag in Light Orange #efddcc */}
                <rect
                  x={x - 24}
                  y={y - 22}
                  width="48"
                  height="16"
                  rx="3"
                  fill="#000000"
                  stroke="#000000"
                />
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  fill="#efddcc"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {inc.ttc}s !
                </text>
              </g>
            );
          })}

          {/* Live Video Playhead Cursor */}
          <g>
            <line
              x1={currentX}
              y1={padding.top}
              x2={currentX}
              y2={svgHeight - padding.bottom}
              stroke="#000000"
              strokeWidth="2.5"
            />
            {/* Playhead handle at top */}
            <polygon
              points={`${currentX - 6},${padding.top - 8} ${currentX + 6},${padding.top - 8} ${currentX},${padding.top}`}
              fill="#000000"
            />
            {/* Current time tag in neo badge with Light Orange #efddcc */}
            <rect
              x={currentX - 22}
              y={padding.top - 24}
              width="44"
              height="15"
              rx="3"
              fill="#efddcc"
              stroke="#000000"
              strokeWidth="1.5"
            />
            <text
              x={currentX}
              y={padding.top - 13}
              textAnchor="middle"
              fill="#000000"
              fontSize="9"
              fontWeight="900"
              fontFamily="monospace"
            >
              {currentTime.toFixed(1)}s
            </text>
          </g>
        </svg>
      </div>

      {/* Footer Info & Human Understanding Explanation */}
      <div className="mt-4 pt-3 border-t-2 border-black flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-semibold text-black">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 bg-black rounded" />
            <span className="font-bold">Time-to-Collision (TTC)</span>
            <span className="text-black/60">(Seconds remaining before path collision)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-1.5 bg-[#b7c6c2] border border-black rounded" />
            <span className="font-bold">Post-Encroachment Time (PET)</span>
            <span className="text-black/60">(Time gap between departure & arrival)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-black bg-[#efddcc] px-3 py-1.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
          <Info className="w-4 h-4 shrink-0 text-black" />
          <span>Click on chart or red pins to jump top-right video preview to that moment.</span>
        </div>
      </div>

    </div>
  );
}
