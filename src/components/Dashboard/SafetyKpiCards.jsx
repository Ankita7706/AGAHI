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
import { REAL_TTC_TIMESERIES, REAL_CORRIDOR_METRICS } from '../../data/realTrafficData';

export default function SafetyKpiCards({ currentTime, currentRiskScore = 78 }) {
  // Find current instant sample from real extracted video telemetry
  const currentSample = REAL_TTC_TIMESERIES.reduce((prev, curr) => 
    Math.abs(curr.t - currentTime) < Math.abs(prev.t - currentTime) ? curr : prev
  , REAL_TTC_TIMESERIES[0]);

  const dynamicTtc = currentSample?.ttc ?? 3.4;
  const dynamicRisk = currentSample?.risk ?? currentRiskScore;
  const dynamicVruThreat = currentSample?.vruThreat ?? 38;
  const dynamicFlow = currentSample?.flowRate ?? 1420;

  const getRiskStatus = (risk) => {
    if (risk >= 75) return { label: 'CRITICAL CONFLICT', color: 'text-black', bg: 'bg-[#ff5f57]', badge: 'bg-black text-[#ff5f57]' };
    if (risk >= 45) return { label: 'ELEVATED CONFLICT', color: 'text-black', bg: 'bg-[#efddcc]', badge: 'bg-black text-[#efddcc]' };
    return { label: 'OPTIMAL FLOW', color: 'text-black', bg: 'bg-[#28c840]', badge: 'bg-black text-[#28c840]' };
  };

  const status = getRiskStatus(dynamicRisk);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Dynamic Conflict Risk Index */}
      <div className={`p-4 rounded-xl ${status.bg} border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between transition-colors`}>
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
              style={{ width: `${Math.min(100, dynamicRisk)}%` }}
            />
          </div>
        </div>

        <p className="text-[11px] font-medium text-black/80 mt-2.5 leading-tight">
          Real-time kinetic friction score calculated from trajectory convergence and closing speed.
        </p>
      </div>

      {/* 2. Instantaneous Minimum Time-to-Collision (TTC) */}
      <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-black flex items-center gap-1.5 uppercase">
              <Clock className="w-4 h-4 text-black" />
              <span>Time-to-Collision</span>
            </span>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-black ${
              dynamicTtc < 1.5 ? 'bg-[#ff5f57] text-white animate-pulse' : 'bg-[#28c840] text-black'
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
            <span>Target: &gt; 2.5s</span>
            <span className="text-[#ff5f57] font-mono">Near-Miss: &lt; 1.5s</span>
          </div>
        </div>

        <p className="text-[11px] font-medium text-black/80 mt-1 leading-tight">
          Current time remaining before two closest vehicle/pedestrian paths intersect.
        </p>
      </div>

      {/* 3. Vulnerable Road User (VRU) Exposure */}
      <div className="p-4 rounded-xl bg-[#efddcc] border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-black flex items-center gap-1.5 uppercase">
              <Users className="w-4 h-4 text-black" />
              <span>VRU Threat Rate</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-black bg-black text-[#efddcc]">
              {dynamicVruThreat > 60 ? 'HIGH' : 'MODERATE'}
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-4xl text-black">{dynamicVruThreat}%</span>
            <span className="text-xs font-mono font-bold text-black/70">exposure</span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-black mt-2.5 pt-2 border-t-2 border-black">
            <span>Pedestrians & Two-Wheelers</span>
            <span className="font-mono text-black">Active Zone</span>
          </div>
        </div>

        <p className="text-[11px] font-medium text-black/80 mt-1 leading-tight">
          Proximity risk factor for two-wheelers, cyclists, and crossing pedestrians.
        </p>
      </div>

      {/* 4. Corridor Flow Rate */}
      <div className="p-4 rounded-xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-black flex items-center gap-1.5 uppercase">
              <Car className="w-4 h-4 text-black" />
              <span>Corridor Flow</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-black bg-[#28c840] text-black">
              LIVE
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-4xl text-black">
              {dynamicFlow}
            </span>
            <span className="text-xs font-mono font-bold text-black/70">veh / hr</span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-black mt-2.5 pt-2 border-t-2 border-black">
            <span>Vehicles Tracked: {REAL_CORRIDOR_METRICS.totalVehiclesTracked}</span>
            <span className="font-mono text-[#0c6366]">Total Conflicts: {REAL_CORRIDOR_METRICS.totalConflictsDetected}</span>
          </div>
        </div>

        <p className="text-[11px] font-medium text-black/80 mt-1 leading-tight">
          Instantaneous traffic throughput density derived from persistent multi-object tracking.
        </p>
      </div>

    </div>
  );
}
