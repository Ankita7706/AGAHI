import React, { useState } from 'react';
import { MapPin, Layers, Flame, Navigation, Compass, AlertCircle } from 'lucide-react';
import { NEAR_MISS_INCIDENTS } from '../../data/mockTrafficData';

export default function JunctionSpatialMap({ currentTime, onSelectIncident }) {
  const [viewMode, setViewMode] = useState('heatmap'); // 'heatmap', 'trajectories', 'both'

  // Hotspot zones - preserved
  const hotspots = [
    {
      id: 'hs-1',
      name: 'West Zebra Crossing Conflict Zone',
      x: 32,
      y: 48,
      severity: 'CRITICAL',
      radius: 38,
      color: 'rgba(255, 95, 87, 0.75)',
      incidentsCount: 14,
      desc: 'Rapid two-wheelers cutting through pedestrian crossing gap'
    },
    {
      id: 'hs-2',
      name: 'North Approach U-Turn Merge',
      x: 52,
      y: 30,
      severity: 'HIGH',
      radius: 30,
      color: 'rgba(239, 221, 204, 0.85)',
      incidentsCount: 8,
      desc: 'Auto-rickshaws making abrupt median U-turns against oncoming traffic'
    },
    {
      id: 'hs-3',
      name: 'Southbound Bus Bay Slipway',
      x: 74,
      y: 62,
      severity: 'MODERATE',
      radius: 26,
      color: 'rgba(183, 198, 194, 0.85)',
      incidentsCount: 5,
      desc: 'Blind-spot overtaking around Mo Bus deceleration queue'
    }
  ];

  return (
    <div className="rounded-xl bg-white border-2 border-black p-5 shadow-[8px_8px_0px_0px_#000000] flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-black" />
            <h3 className="font-heading font-black text-xl text-black">TOP-DOWN 2D CONFLICT HOTSPOTS</h3>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#efddcc] border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-xs">
            <button
              onClick={() => setViewMode('heatmap')}
              className={`px-2.5 py-1 rounded font-heading font-bold border-2 transition ${
                viewMode === 'heatmap' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              Heatmap
            </button>
            <button
              onClick={() => setViewMode('trajectories')}
              className={`px-2.5 py-1 rounded font-heading font-bold border-2 transition ${
                viewMode === 'trajectories' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              Trajectories
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`px-2.5 py-1 rounded font-heading font-bold border-2 transition ${
                viewMode === 'both' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
              }`}
            >
              Overlay
            </button>
          </div>
        </div>

        <p className="text-xs font-medium text-black/70 mb-3">
          Perspective-corrected homography projection (camera pixels converted to 2D real-world coordinates).
        </p>
      </div>

      {/* 2D Intersection Schematic Layout */}
      <div className="relative w-full aspect-[16/10] bg-[#171e19] rounded-xl border-2 border-black overflow-hidden flex items-center justify-center">
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Intersection Roads (Dark Charcoal) */}
        <div className="absolute top-0 bottom-0 left-[38%] right-[38%] bg-[#272727] border-x-2 border-black" />
        <div className="absolute left-0 right-0 top-[35%] bottom-[35%] bg-[#272727] border-y-2 border-black" />

        {/* Center Conflict Box in Light Orange */}
        <div className="absolute top-[35%] bottom-[35%] left-[38%] right-[38%] border-2 border-[#efddcc] bg-[#efddcc]/10">
          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#efddcc] font-mono font-bold tracking-widest">
            BOX JUNCTION
          </div>
        </div>

        {/* Zebra Crosswalk lines in high contrast white */}
        <div className="absolute top-[37%] bottom-[37%] left-[32%] w-4 flex flex-col justify-between py-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-1 bg-white border border-black rounded-sm" />
          ))}
        </div>
        <div className="absolute top-[28%] h-4 left-[40%] right-[40%] flex justify-between px-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="w-1.5 h-full bg-white border border-black rounded-sm" />
          ))}
        </div>

        {/* Heatmap Overlay Blobs */}
        {(viewMode === 'heatmap' || viewMode === 'both') && (
          <>
            {hotspots.map(hs => (
              <div
                key={hs.id}
                className="absolute rounded-full pointer-events-none transition-all duration-700"
                style={{
                  left: `${hs.x}%`,
                  top: `${hs.y}%`,
                  width: `${hs.radius * 2}px`,
                  height: `${hs.radius * 2}px`,
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, ${hs.color} 0%, rgba(255, 95, 87, 0) 75%)`
                }}
              />
            ))}
          </>
        )}

        {/* Live Synchronized Vehicle Dots */}
        {(viewMode === 'trajectories' || viewMode === 'both') && (
          <>
            {/* Vehicle 1 (Two-wheeler) */}
            <div 
              className="absolute w-3.5 h-3.5 rounded-full bg-[#efddcc] border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-all duration-200"
              style={{
                left: `${20 + ((currentTime * 12) % 65)}%`,
                top: `${46 + Math.sin(currentTime) * 3}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
            {/* Pedestrian dot */}
            <div 
              className="absolute w-3 h-3 rounded-full bg-[#ff5f57] border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-all duration-200"
              style={{
                left: '33%',
                top: `${60 - ((currentTime * 5) % 25)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
            {/* Auto-rickshaw dot */}
            <div 
              className="absolute w-3.5 h-3.5 rounded-full bg-[#b7c6c2] border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-all duration-200"
              style={{
                left: '44%',
                top: `${15 + ((currentTime * 9) % 70)}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </>
        )}

        {/* Interactive Hotspot Pins */}
        {hotspots.map((hs, idx) => (
          <div
            key={hs.id}
            className="absolute cursor-pointer group"
            style={{ left: `${hs.x}%`, top: `${hs.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="w-6 h-6 rounded-md bg-[#ff5f57] text-black font-heading font-black text-xs flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000] group-hover:scale-125 transition-transform">
              {idx + 1}
            </div>

            {/* Hover tooltip */}
            <div className="absolute left-7 -top-2 hidden group-hover:block w-48 p-2.5 rounded-lg bg-black border-2 border-[#efddcc] text-white text-xs z-20 shadow-[4px_4px_0px_0px_#000000] pointer-events-none">
              <div className="font-heading font-black text-[#efddcc]">{hs.name}</div>
              <div className="text-white/80 text-[11px] mt-0.5">{hs.desc}</div>
              <div className="mt-1 text-[#ff5f57] font-mono font-bold text-[10px]">{hs.incidentsCount} near-miss events detected</div>
            </div>
          </div>
        ))}

        {/* North Arrow Indicator */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-1 rounded bg-black border-2 border-white text-[10px] text-white font-mono font-bold">
          <Compass className="w-3.5 h-3.5 text-[#efddcc]" />
          <span>N (Nandankanan Rd)</span>
        </div>
      </div>

      {/* Hotspots Summary Legend */}
      <div className="mt-3 space-y-1.5 text-xs">
        {hotspots.map((hs, idx) => (
          <div key={hs.id} className="flex items-center justify-between p-2 rounded-lg bg-[#fafafa] border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-black text-[#efddcc] font-heading font-black text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-black text-xs font-bold">{hs.name}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-black bg-[#efddcc] px-2 py-0.5 rounded border border-black">
              {hs.incidentsCount} Conflicts
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}
