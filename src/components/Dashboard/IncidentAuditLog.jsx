import React, { useState } from 'react';
import { AlertTriangle, Play, ShieldAlert, Filter, Clock, Eye, CheckCircle2 } from 'lucide-react';
import { NEAR_MISS_INCIDENTS } from '../../data/mockTrafficData';

export default function IncidentAuditLog({ currentTime, onSeek, onSelectIncident }) {
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'CRITICAL', 'VRU'

  const filteredIncidents = NEAR_MISS_INCIDENTS.filter(inc => {
    if (filter === 'CRITICAL') return inc.severity === 'CRITICAL';
    if (filter === 'VRU') return inc.vruInvolved;
    return true;
  });

  return (
    <div className="rounded-xl bg-white border-2 border-black p-5 shadow-[8px_8px_0px_0px_#000000]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-black" />
            <h3 className="font-heading font-black text-xl text-black">
              NEAR-MISS CONFLICT AUDIT LOG
            </h3>
          </div>
          <p className="text-xs font-medium text-black/70 mt-0.5">
            Auto-detected kinetic friction events extracted from video stream. Click "Inspect in Video" to rewind the top-right preview.
          </p>
        </div>

        {/* Filter buttons in Light Orange #efddcc */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#efddcc] border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-xs">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
              filter === 'ALL' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
            }`}
          >
            All Conflicts ({NEAR_MISS_INCIDENTS.length})
          </button>
          <button
            onClick={() => setFilter('CRITICAL')}
            className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
              filter === 'CRITICAL' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
            }`}
          >
            Critical Only
          </button>
          <button
            onClick={() => setFilter('VRU')}
            className={`px-3 py-1 rounded text-xs font-heading font-bold border-2 transition ${
              filter === 'VRU' ? 'bg-black text-[#efddcc] border-black shadow-[2px_2px_0px_0px_#000000]' : 'border-transparent text-black hover:border-black'
            }`}
          >
            VRU (Pedestrians/Bikes)
          </button>
        </div>
      </div>

      {/* Incident List Table */}
      <div className="overflow-x-auto rounded-lg border-2 border-black">
        <table className="w-full text-left text-xs bg-white">
          <thead className="bg-[#171e19] text-white font-mono text-[11px] uppercase border-b-2 border-black">
            <tr>
              <th className="py-2.5 px-3 font-bold">Time / Cam</th>
              <th className="py-2.5 px-3 font-bold">Conflict Type</th>
              <th className="py-2.5 px-3 font-bold">Actors Involved</th>
              <th className="py-2.5 px-3 font-bold">TTC / PET</th>
              <th className="py-2.5 px-3 font-bold">Severity</th>
              <th className="py-2.5 px-3 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {filteredIncidents.map(inc => {
              const isCurrentlyPlaying = Math.abs(currentTime - inc.timeSeconds) < 2.5;

              return (
                <tr 
                  key={inc.id}
                  className={`transition-colors font-medium ${
                    isCurrentlyPlaying ? 'bg-[#efddcc]' : 'hover:bg-[#fafafa]'
                  }`}
                >
                  {/* Timestamp */}
                  <td className="py-3 px-3 font-mono">
                    <span className="text-black font-black text-sm block">{inc.timeFormatted}</span>
                    <span className="text-[10px] text-black/60 font-bold">{inc.timestamp}</span>
                  </td>

                  {/* Conflict Type & Location */}
                  <td className="py-3 px-3">
                    <div className="font-heading font-black text-sm text-black">{inc.type}</div>
                    <div className="text-[11px] text-black/70 font-semibold">{inc.location}</div>
                  </td>

                  {/* Actors */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-black">
                      <span className="bg-[#b7c6c2] px-1.5 py-0.5 rounded border border-black">{inc.actor1.type}</span>
                      <span>↔</span>
                      <span className="bg-[#ff5f57] px-1.5 py-0.5 rounded border border-black text-black">{inc.actor2.type}</span>
                    </div>
                  </td>

                  {/* TTC / PET Metrics */}
                  <td className="py-3 px-3 font-mono">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded border-2 border-black font-black text-xs ${
                        inc.ttc < 1.0 ? 'bg-[#ff5f57] text-black' : 'bg-[#efddcc] text-black'
                      }`}>
                        TTC: {inc.ttc}s
                      </span>
                      <span className="text-black/70 text-[11px] font-bold">
                        PET: {inc.pet}s
                      </span>
                    </div>
                  </td>

                  {/* Severity Badge */}
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase border-2 border-black ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-[#ff5f57] text-black shadow-[2px_2px_0px_0px_#000000]'
                        : inc.severity === 'HIGH'
                        ? 'bg-[#efddcc] text-black shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-[#28c840] text-black shadow-[2px_2px_0px_0px_#000000]'
                    }`}>
                      {inc.severity}
                    </span>
                  </td>

                  {/* Action Button: Jump to video preview */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        onSeek(inc.timeSeconds);
                        if (onSelectIncident) onSelectIncident(inc);
                      }}
                      className="neo-button-secondary py-1 px-3 text-xs shadow-[2px_2px_0px_0px_#000000]"
                    >
                      <Play className="w-3 h-3 fill-black text-black" />
                      <span>Inspect in Video</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
