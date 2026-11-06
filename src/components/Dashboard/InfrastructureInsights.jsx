import React from 'react';
import { Lightbulb, Wrench, ArrowUpRight, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';
import { INFRASTRUCTURE_RECOMMENDATIONS } from '../../data/mockTrafficData';

export default function InfrastructureInsights() {
  // Use Case Bento Colors with Light Orange #efddcc as secondary
  const bentoThemes = [
    { bg: 'bg-[#b7c6c2]', text: 'text-black', shadow: 'shadow-[4px_4px_0px_0px_#000000]' },
    { bg: 'bg-[#efddcc]', text: 'text-black', shadow: 'shadow-[8px_8px_0px_0px_#000000]' },
    { bg: 'bg-[#272727]', text: 'text-white', shadow: 'shadow-[4px_4px_0px_0px_#000000]' }
  ];

  return (
    <div className="rounded-xl bg-white border-2 border-black p-5 shadow-[8px_8px_0px_0px_#000000]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-black" />
          <h3 className="font-heading font-black text-xl text-black">
            ACTIONABLE ROAD SAFETY COUNTERMEASURES
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#efddcc] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
          BENTO CIVIC RECOMMENDATIONS
        </span>
      </div>

      <p className="text-xs font-medium text-black/70 mb-5">
        Synthesized engineering interventions generated from repeated near-miss clusters in the CCTV footage.
      </p>

      {/* Bento 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INFRASTRUCTURE_RECOMMENDATIONS.map((rec, i) => {
          const theme = bentoThemes[i % bentoThemes.length];
          const isDark = theme.text === 'text-white';

          return (
            <div 
              key={i}
              className={`p-4 rounded-xl ${theme.bg} ${theme.text} ${theme.shadow} border-2 border-black flex flex-col justify-between space-y-4`}
            >
              <div>
                {/* Top Pill Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border-2 border-black uppercase ${
                    rec.priority === 'CRITICAL'
                      ? 'bg-[#ff5f57] text-black shadow-[2px_2px_0px_0px_#000000]'
                      : 'bg-white text-black shadow-[2px_2px_0px_0px_#000000]'
                  }`}>
                    {rec.priority} PRIORITY
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-white/70' : 'text-black/70'}`}>
                    {rec.timeline}
                  </span>
                </div>

                <h4 className="font-heading font-black text-base leading-snug">{rec.title}</h4>
                <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-white/80' : 'text-black/80'}`}>
                  {rec.rationale}
                </p>
              </div>

              <div className={`pt-3 border-t-2 border-black space-y-1.5 text-xs font-bold`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    <span>Projected Impact:</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded border border-black ${isDark ? 'bg-black text-[#28c840]' : 'bg-white text-black'}`}>
                    {rec.impact}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span>Est. Budget:</span>
                  <span className="font-black">{rec.estimatedCost}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
