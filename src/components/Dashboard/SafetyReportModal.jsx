import React from 'react';
import { X, Printer, Shield, CheckCircle2, AlertTriangle, FileText, Download } from 'lucide-react';
import { NEAR_MISS_INCIDENTS, VEHICLE_CLASSES, INFRASTRUCTURE_RECOMMENDATIONS } from '../../data/mockTrafficData';

export default function SafetyReportModal({ isOpen, onClose, junction, user }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-none flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border-2 border-black rounded-2xl shadow-[12px_12px_0px_0px_#000000] overflow-hidden my-8 text-black flex flex-col">
        
        {/* Browser Mockup Header Bar with Traffic Dots */}
        <div className="neo-browser-header justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="mockup-dot-red" />
              <span className="mockup-dot-yellow" />
              <span className="mockup-dot-green" />
            </div>
            <span className="font-heading font-black text-xs text-white uppercase tracking-wider ml-2">
              VISION ZERO SAFETY AUDIT REPORT · BSCL ICCC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="neo-button-primary py-1 px-3 text-xs shadow-[2px_2px_0px_0px_#efddcc]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#ff5f57] hover:bg-[#ff5f57]/80 text-black border border-black transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-black overflow-y-auto max-h-[75vh]">
          
          {/* Header block */}
          <div className="border-b-2 border-black pb-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest bg-[#efddcc] px-2 py-0.5 rounded border border-black">
                  GOVERNMENT OF ODISHA · BHUBANESWAR SMART CITY LIMITED
                </span>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-black mt-2">
                  Surrogate Safety Assessment & Near-Miss Conflict Audit
                </h1>
                <p className="text-xs font-bold text-black/70 mt-0.5">
                  Location: <strong className="text-black">{junction.name}</strong> · Method: <strong className="text-black">RF-DETR + ByteTrack Video Kinematics</strong>
                </p>
              </div>

              <div className="text-left sm:text-right font-mono text-[11px] text-black bg-[#fafafa] p-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
                <div>Ref: <strong className="text-black">AGAHI-AUD-2026-04</strong></div>
                <div>Auditor: <strong className="text-black">{user.name}</strong></div>
                <div>Agency: <strong>{user.agency}</strong></div>
                <div>Date: <strong>2026-11-06</strong></div>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights in 4 Neo Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#ff5f57]/20 border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
              <div className="text-black text-[10px] uppercase font-bold">Conflict Risk Index</div>
              <div className="font-heading font-black text-2xl text-black mt-1">78 / 100</div>
              <div className="text-[10px] font-bold text-[#ff5f57] mt-0.5">Elevated Friction Zone</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
              <div className="text-black text-[10px] uppercase font-bold">Minimum TTC Observed</div>
              <div className="font-heading font-black text-2xl text-black mt-1">0.84 s</div>
              <div className="text-[10px] font-bold text-[#ff5f57] mt-0.5">Below 1.5s Danger Line</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#b7c6c2] border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
              <div className="text-black text-[10px] uppercase font-bold">VRU Conflict Share</div>
              <div className="font-heading font-black text-2xl text-black mt-1">88 %</div>
              <div className="text-[10px] font-bold text-black/70 mt-0.5">Bikes & Pedestrians</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#efddcc] border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
              <div className="text-black text-[10px] uppercase font-bold">CCTV Coverage</div>
              <div className="font-heading font-black text-2xl text-black mt-1">100 %</div>
              <div className="text-[10px] font-bold text-black/70 mt-0.5">3 Synchronized Feeds</div>
            </div>
          </div>

          {/* Incident Log Summary */}
          <div>
            <h3 className="font-heading font-black text-base text-black mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#ff5f57]" />
              <span>Critical Surrogate Safety Conflicts (TTC &lt; 1.5s)</span>
            </h3>
            <table className="w-full text-left border-2 border-black rounded-lg overflow-hidden">
              <thead className="bg-[#171e19] text-white font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-2 border-b-2 border-black">Time</th>
                  <th className="p-2 border-b-2 border-black">Conflict Category</th>
                  <th className="p-2 border-b-2 border-black">Actors Involved</th>
                  <th className="p-2 border-b-2 border-black">TTC / PET</th>
                  <th className="p-2 border-b-2 border-black">Primary Geometric Cause</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black font-medium">
                {NEAR_MISS_INCIDENTS.map(inc => (
                  <tr key={inc.id} className="text-[11px] hover:bg-[#efddcc]/30">
                    <td className="p-2 font-mono font-bold">{inc.timeFormatted}</td>
                    <td className="p-2 font-bold text-black">{inc.type}</td>
                    <td className="p-2">{inc.actor1.type} vs {inc.actor2.type}</td>
                    <td className="p-2 font-mono font-black text-[#ff5f57]">{inc.ttc}s / {inc.pet}s</td>
                    <td className="p-2 text-black/80">{inc.rootCause}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recommended Countermeasures */}
          <div>
            <h3 className="font-heading font-black text-base text-black mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#28c840]" />
              <span>Required Geometric & Signal Interventions</span>
            </h3>
            <div className="space-y-2">
              {INFRASTRUCTURE_RECOMMENDATIONS.map((rec, i) => (
                <div key={i} className="p-3 rounded-lg bg-[#fafafa] border-2 border-black flex items-start justify-between gap-4 shadow-[2px_2px_0px_0px_#000000]">
                  <div>
                    <span className="font-heading font-black text-black text-sm block">{rec.title}</span>
                    <span className="text-black/80 text-xs block mt-0.5">{rec.rationale}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-black block bg-[#efddcc] px-2 py-0.5 rounded border border-black">{rec.impact}</span>
                    <span className="text-black/70 text-[10px] font-mono font-bold block mt-1">{rec.estimatedCost}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signoff */}
          <div className="pt-4 border-t-2 border-black flex items-center justify-between text-[11px] font-bold text-black/70">
            <span>Prepared via AGAHI Vision Zero Platform · Integrated with Bhubaneswar Smart City ICCC</span>
            <span className="bg-black text-white px-2 py-0.5 rounded">Digital Signature: VALIDATED</span>
          </div>

        </div>

      </div>
    </div>
  );
}
