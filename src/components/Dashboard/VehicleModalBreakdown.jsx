import React from 'react';
import { PieChart, Users, AlertTriangle, ShieldCheck } from 'lucide-react';
import { VEHICLE_CLASSES } from '../../data/mockTrafficData';

export default function VehicleModalBreakdown() {
  const totalVehicles = VEHICLE_CLASSES.reduce((acc, curr) => acc + curr.count, 0);

  // High contrast neo color palette with Dark Cyan #0c6366 & Light Orange #efddcc
  const neoColors = {
    'Two-Wheelers (Bikes/Scooters)': '#efddcc',
    'Auto-Rickshaws (3-Wheelers)': '#0c6366',
    'Passenger Cars / Taxis': '#b7c6c2',
    'City Buses & Heavy Trucks': '#171e19',
    'Pedestrians (VRU)': '#ff5f57'
  };

  return (
    <div className="rounded-xl bg-white border-2 border-black p-5 shadow-[8px_8px_0px_0px_#000000] flex flex-col justify-between">
      
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-black" />
            <h3 className="font-heading font-black text-xl text-black">MODAL SPLIT & VRU VULNERABILITY</h3>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-[#efddcc] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
            N = {totalVehicles} DETECTIONS
          </span>
        </div>

        <p className="text-xs font-medium text-black/70 mb-4 leading-relaxed">
          Compares traffic volume share against near-miss conflict involvement rate.
        </p>
      </div>

      {/* Segmented Volume Stack Bar with 2px black border */}
      <div className="w-full h-4 rounded-lg overflow-hidden flex bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] mb-4">
        {VEHICLE_CLASSES.map(cls => (
          <div
            key={cls.name}
            style={{ width: `${cls.percentage}%`, backgroundColor: neoColors[cls.name] || cls.color }}
            title={`${cls.name}: ${cls.percentage}% volume`}
            className="h-full border-r border-black last:border-r-0"
          />
        ))}
      </div>

      {/* Breakdown Cards in Neo-Brutalist rows */}
      <div className="space-y-2">
        {VEHICLE_CLASSES.map(cls => {
          const color = neoColors[cls.name] || cls.color;
          const isHighConflict = parseInt(cls.conflictRate) > 50;

          return (
            <div 
              key={cls.name}
              className="p-2.5 rounded-lg bg-[#fafafa] border-2 border-black flex items-center justify-between text-xs shadow-[2px_2px_0px_0px_#000000]"
            >
              <div className="flex items-center gap-2.5">
                <span 
                  className="w-4 h-4 rounded-md shrink-0 border-2 border-black shadow-[1px_1px_0px_0px_#000000]"
                  style={{ backgroundColor: color }}
                />
                <div>
                  <span className="font-heading font-black text-black block">{cls.name}</span>
                  <span className="text-[10px] text-black/70 font-mono font-bold">
                    {cls.count} tracked · {cls.percentage}% volume
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded border-2 border-black ${
                  isHighConflict 
                    ? 'bg-[#ff5f57] text-black shadow-[2px_2px_0px_0px_#000000]' 
                    : 'bg-white text-black'
                }`}>
                  {cls.conflictRate} Conflict Rate
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Finding Callout in Light Orange #efddcc Neo Card */}
      <div className="mt-4 p-3 rounded-lg bg-[#efddcc] border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex items-start gap-2.5 text-xs text-black">
        <Users className="w-4 h-4 text-black shrink-0 mt-0.5" />
        <div>
          <strong className="font-heading font-black">Vision Zero Finding:</strong> Two-wheelers and pedestrians account for <strong>88%</strong> of high-risk near-misses despite occupying only 51% of spatial road surface.
        </div>
      </div>

    </div>
  );
}
