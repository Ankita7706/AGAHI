import React from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Users, 
  Gauge, 
  TrendingUp, 
  Activity, 
  HelpCircle,
  Clock,
  Car
} from 'lucide-react';
import { TTC_TIMESERIES } from '../../data/mockTrafficData';

export default function SafetyKpiCards({ currentTime, currentRiskScore = 78 }) {
  // Find current instant risk based on video timestamp - preserved
  const currentSample = TTC_TIMESERIES.reduce((prev, curr) => 
    Math.abs(curr.t - currentTime) < Math.abs(prev.t - currentTime) ? curr : prev
  , TTC_TIMESERIES[0]);

  const dynamicTtc = currentSample?.ttc ?? 3.4;
  const dynamicRisk = currentSample?.risk ?? currentRiskScore;

  const getRiskStatus = (risk) => {
    if (risk >= 80) return { label: 'CRITICAL CONFLICT', color: 'text-black', bg: 'bg-[#ff5f57]', badge: 'bg-black text-[#ff5f57]' };
    if (risk >= 50) return { label: 'ELEVATED CONFLICT', color: 'text-black', bg: 'bg-[#efddcc]', badge: 'bg-black text-[#efddcc]' };
    return { label: 'OPTIMAL FLOW', color: 'text-black', bg: 'bg-[#28c840]', badge: 'bg-black text-[#28c840]' };
  };

  const status = getRiskStatus(dynamicRisk);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Dynamic Conflict Risk Index */}
      <div className={`p-4 rounded-xl ${status.bg} border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between`}>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-black flex items-center gap-1.5 uppercase">
              <ShieldAlert className="w-4 h-4 text-black" />
              <span>Conflict Risk</span>
            </span>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-black ${status.badge}`}>
              {status.label}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-4xl text-black">{dynamicRisk}</span>
            <span className="text-xs font-mono font-bold text-black/70">/ 100</span>
          </div>

          {/* Neo progress bar */}
          <div className="w-full bg-white h-2 rounded-full border-2 border-black mt-2.5 overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-300"
              style={{ width: `${dynamicRisk}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] font-medium text-black/80 mt-2.5 leading-tight">
          Real-time kinetic friction score calculated from trajectory convergence and closing speed.
        </p>
      </div>

      {/* 2. Instantaneous Minimum TTC */}
      <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-black flex items-center gap-1.5 uppercase">
              <Clock className="w-4 h-4 text-black" />
              <span>Time-to-Collision</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-black ${
              dynamicTtc < 1.5 ? 'bg-[#ff5f57] text-black' : 'bg-[#b7c6c2] text-black'
            }`}>
              {dynamicTtc < 1.5 ? 'DANGER ZONE' : 'CLEAR'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className={`font-heading font-black text-4xl ${dynamicTtc < 1.5 ? 'text-[#ff5f57]' : 'text-black'}`}>
              {dynamicTtc.toFixed(2)}s
            </span>
            <span className="text-xs font-mono font-bold text-black/70">safety window</span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-black mt-2.5 pt-2 border-t-2 border-black">
            <span>Target: &gt; 3.0s</span>
            <span className="text-[#ff5f57] font-mono">Near-Miss: &lt; 1.5s</span>
          </div>
        </div>

        <p className="text-[11px] font-medium text-black/80 mt-1 leading-tight">
          Current time remaining before two closest vehicle/pedestrian paths intersect.
        </p>
      </div>

      {/* 3. Vulnerable Road User (VRU) Exposure in Sage */}
      <div className="p-4 rounded-xl bg-[#b7c6c2] border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-black flex items-center gap-1.5 uppercase">
              <Users className="w-4 h-4 text-black" />
              <span>VRU Threat Rate</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black text-[#efddcc] border border-black">
              HIGH CONCERN
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-4xl text-black">88%</span>
            <span className="text-xs font-bold text-black/70">of near-misses</span>
          </div>

          <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-bold">
            <span className="px-1.5 py-0.5 rounded bg-white text-black border border-black">Bikes: 61%</span>
            <span className="px-1.5 py-0.5 rounded bg-white text-black border border-black">Zebra: 27%</span>
          </div>
        </div>

        <p className="text-[11px] font-medium text-black/80 mt-2 leading-tight">
          Motorcycles and pedestrians represent the vast majority of critical conflict victims.
        </p>
      </div>

      {/* 4. Active Objects & Speed Dispersion in Light Orange #efddcc */}
      <div className="p-4 rounded-xl bg-[#efddcc] border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-black flex items-center gap-1.5 uppercase">
              <Gauge className="w-4 h-4 text-black" />
              <span>Corridor Flow</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-black border border-black">
              RF-DETR MOT
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-4xl text-black">385</span>
            <span className="text-xs font-mono font-bold text-black/70">tracked / 10m</span>
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-black mt-2.5 pt-2 border-t-2 border-black">
            <span>Avg: <strong className="font-mono">34.2 km/h</strong></span>
            <span>Limit: <strong className="font-mono">40 km/h</strong></span>
          </div>
        </div>

        <p className="text-[11px] font-medium text-black/80 mt-1 leading-tight">
          Continuous tracking via ByteTrack persistent ID associations across camera frames.
        </p>
      </div>

    </div>
  );
}
