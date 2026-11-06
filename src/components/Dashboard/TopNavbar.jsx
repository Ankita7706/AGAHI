import React from 'react';
import { 
  Shield, 
  MapPin, 
  Video, 
  LogOut, 
  Download, 
  AlertCircle, 
  User, 
  ChevronDown,
  Activity,
  Zap,
  Bot,
  Sparkles
} from 'lucide-react';
import { JUNCTIONS } from '../../data/mockTrafficData';

export default function TopNavbar({
  user,
  onLogout,
  selectedJunction,
  onSelectJunction,
  selectedCamera,
  onSelectCamera,
  onOpenReport,
  onOpenCopilot
}) {
  return (
    <header className="sticky top-0 z-50 w-full min-h-[5rem] bg-[#0c6366] border-b-2 border-black px-4 sm:px-6 py-3 flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Brand Logo in a 10x10 black square container + Name in Cabinet Grotesk */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-black rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000000] shrink-0">
              <Zap className="w-5 h-5 text-[#efddcc] fill-[#efddcc]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-2xl tracking-tighter text-white uppercase">
                  AGAHI
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#efddcc] border-2 border-black text-black shadow-[2px_2px_0px_0px_#000000]">
                  VISION ZERO
                </span>
              </div>
              <p className="text-[10px] font-bold text-[#efddcc]/90 uppercase tracking-wide">
                Proactive CCTV Traffic Safety AI
              </p>
            </div>
          </div>

          <div className="h-7 w-0.5 bg-black hidden sm:block mx-1" />

          {/* Junction Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-white shrink-0" />
            <select
              value={selectedJunction.id}
              onChange={(e) => {
                const j = JUNCTIONS.find(item => item.id === e.target.value);
                if (j) onSelectJunction(j);
              }}
              className="bg-white border-2 border-black rounded-lg px-3 py-1.5 text-xs text-black font-bold focus:outline-none focus:bg-[#fbf4ee] shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
            >
              {JUNCTIONS.map(j => (
                <option key={j.id} value={j.id}>{j.name}</option>
              ))}
            </select>
          </div>

          {/* Camera Angle Selector */}
          <div className="flex items-center gap-1.5">
            <Video className="w-4 h-4 text-white shrink-0" />
            <select
              value={selectedCamera?.id || ''}
              onChange={(e) => {
                const cam = selectedJunction.cameras.find(c => c.id === e.target.value);
                if (cam) onSelectCamera(cam);
              }}
              className="bg-white border-2 border-black rounded-lg px-2.5 py-1.5 text-xs text-black font-mono font-bold focus:outline-none focus:bg-[#fbf4ee] shadow-[2px_2px_0px_0px_#000000] cursor-pointer"
            >
              {selectedJunction.cameras.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right side: Live telemetry, AI Copilot, Export report, User profile */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          
          {/* Live Stream Telemetry status pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-[11px] font-mono font-bold text-black">
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black animate-pulse" />
            <span>29.8 FPS</span>
            <span>·</span>
            <span>32ms Latency</span>
            <span>·</span>
            <span className="bg-[#efddcc] px-1.5 py-0.5 rounded border border-black">RF-DETR + ByteTrack</span>
          </div>

          {/* AI LLM Copilot Button */}
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#efddcc] hover:bg-white text-black font-heading font-black text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            title="Open Vision Zero AI LLM Copilot"
          >
            <Bot className="w-4 h-4 text-[#0c6366]" />
            <span>AI COPILOT</span>
            <span className="w-2 h-2 rounded-full bg-[#ff5f57] border border-black animate-ping" />
          </button>

          {/* Audit Report Generator Button */}
          <button
            onClick={onOpenReport}
            className="neo-button-secondary py-1.5 px-3 text-xs shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span className="hidden sm:inline">Export Audit Report</span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l-2 border-black">
            <div className="hidden sm:block text-right">
              <div className="font-heading font-black text-white text-xs leading-none">{user.name}</div>
              <div className="text-[10px] font-bold text-[#efddcc] mt-0.5">{user.role}</div>
            </div>

            <div className="w-8 h-8 rounded-lg bg-black text-[#efddcc] border-2 border-black font-heading font-black text-xs flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
              {user.name.charAt(0)}
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-white hover:bg-[#ff5f57] hover:text-white border-2 border-black text-black transition shadow-[2px_2px_0px_0px_#000000]"
              title="Sign out & return to registration portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
}
