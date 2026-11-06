// AGAHI Traffic Intelligence & Vision Zero Data Store
export const JUNCTIONS = [
  {
    id: 'jayadev-vihar',
    name: 'Jayadev Vihar Intersection (Zone 1)',
    city: 'Bhubaneswar Smart City',
    lat: 20.2974,
    lng: 85.8194,
    riskScore: 78,
    riskLevel: 'Elevated Risk',
    cameras: [
      { id: 'cam-04', name: 'Cam 04 — North Arm (Jayadev Vihar to Nandankanan)', fps: 29.8, res: '1080p' },
      { id: 'cam-02', name: 'Cam 02 — West Pedestrian Crosswalk & Median', fps: 30.0, res: '1080p' },
      { id: 'cam-01', name: 'Cam 01 — Rotary Weaving & Overpass Slipway', fps: 29.5, res: '1080p' }
    ]
  },
  {
    id: 'master-canteen',
    name: 'Master Canteen Square (Station Feeder)',
    city: 'Bhubaneswar Central',
    lat: 20.2667,
    lng: 85.8427,
    riskScore: 64,
    riskLevel: 'Moderate Risk',
    cameras: [
      { id: 'cam-mc-1', name: 'Cam 01 — Station Road East Exit', fps: 30.0, res: '1080p' }
    ]
  },
  {
    id: 'patia-kiit',
    name: 'Patia KIIT Square (University Corridor)',
    city: 'Bhubaneswar North',
    lat: 20.3541,
    lng: 85.8188,
    riskScore: 71,
    riskLevel: 'High VRU Risk',
    cameras: [
      { id: 'cam-pt-1', name: 'Cam 03 — Campus Gateway Pedestrian Zone', fps: 29.9, res: '1080p' }
    ]
  },
  {
    id: 'rasulgarh',
    name: 'Rasulgarh Square (Freight & Rotary)',
    city: 'Bhubaneswar East',
    lat: 20.2892,
    lng: 85.8643,
    riskScore: 82,
    riskLevel: 'Severe Friction',
    cameras: [
      { id: 'cam-rs-1', name: 'Cam 02 — Heavy Vehicle Weaving Arm', fps: 29.7, res: '1080p' }
    ]
  }
];

export const VEHICLE_CLASSES = [
  { name: 'Two-Wheelers (Bikes/Scooters)', count: 184, percentage: 48, color: '#38BDF8', icon: 'Bike', conflictRate: '61%' },
  { name: 'Auto-Rickshaws (3-Wheelers)', count: 88, percentage: 23, color: '#F59E0B', icon: 'Truck', conflictRate: '24%' },
  { name: 'Passenger Cars / Taxis', count: 76, percentage: 20, color: '#10B981', icon: 'Car', conflictRate: '11%' },
  { name: 'City Buses & Heavy Trucks', count: 23, percentage: 6, color: '#8B5CF6', icon: 'Bus', conflictRate: '3%' },
  { name: 'Pedestrians (VRU)', count: 13, percentage: 3, color: '#EF4444', icon: 'User', conflictRate: '79%' }
];

export const NEAR_MISS_INCIDENTS = [
  {
    id: 'INC-2026-0891',
    timeSeconds: 9.4,
    timeFormatted: '00:09.4',
    timestamp: '14:23:19',
    type: 'Critical Cut-in Conflict',
    vruInvolved: true,
    actor1: { id: '#204', type: 'Two-Wheeler', speed: '42 km/h' },
    actor2: { id: '#088', type: 'Pedestrian', speed: '4 km/h' },
    ttc: 0.84, // Time to Collision (seconds)
    pet: 0.62, // Post Encroachment Time (seconds)
    severity: 'CRITICAL',
    location: 'West Pedestrian Crossing Arm',
    rootCause: 'Motorcyclist swerved past queuing auto-rickshaws into unsignalized zebra crossing.',
    recommendation: 'Provide raised pedestrian refuge island & enforce stop-bar compliance.'
  },
  {
    id: 'INC-2026-0892',
    timeSeconds: 22.1,
    timeFormatted: '00:22.1',
    timestamp: '14:23:32',
    type: 'Weaving Right-Turn Conflict',
    vruInvolved: false,
    actor1: { id: '#112', type: 'Auto-Rickshaw', speed: '28 km/h' },
    actor2: { id: '#309', type: 'Passenger Car', speed: '48 km/h' },
    ttc: 1.18,
    pet: 0.94,
    severity: 'HIGH',
    location: 'Central Merge Pocket',
    rootCause: 'Abrupt lane cut across two traffic lanes to take unannounced U-turn.',
    recommendation: 'Delineate physical lane channelization for U-turn bay.'
  },
  {
    id: 'INC-2026-0893',
    timeSeconds: 38.6,
    timeFormatted: '00:38.6',
    timestamp: '14:23:48',
    type: 'Blind-Spot Merging Friction',
    vruInvolved: true,
    actor1: { id: '#415', type: 'City Bus (Mo Bus)', speed: '24 km/h' },
    actor2: { id: '#502', type: 'Two-Wheeler', speed: '36 km/h' },
    ttc: 1.42,
    pet: 1.10,
    severity: 'HIGH',
    location: 'Southbound Bus Bay Entry',
    rootCause: 'Scooter attempted overtaking from the blind passenger-door side during bus deceleration.',
    recommendation: 'Extend segregated bus bay entry with chevron pavement markings.'
  },
  {
    id: 'INC-2026-0894',
    timeSeconds: 51.3,
    timeFormatted: '00:51.3',
    timestamp: '14:24:01',
    type: 'Red-Light Tailgating Near-Miss',
    vruInvolved: false,
    actor1: { id: '#621', type: 'Two-Wheeler', speed: '45 km/h' },
    actor2: { id: '#190', type: 'Passenger Car', speed: '12 km/h' },
    ttc: 1.31,
    pet: 1.05,
    severity: 'MODERATE',
    location: 'North Arm Approach Stopline',
    rootCause: 'Sudden braking at amber light transition caused trailing rider hard skidding.',
    recommendation: 'Add yellow clearance countdown timers on all signal aspects.'
  },
  {
    id: 'INC-2026-0895',
    timeSeconds: 67.8,
    timeFormatted: '01:07.8',
    timestamp: '14:24:18',
    type: 'Jaywalking Intersection Crossing',
    vruInvolved: true,
    actor1: { id: '#733', type: 'Pedestrian', speed: '3 km/h' },
    actor2: { id: '#804', type: 'Auto-Rickshaw', speed: '33 km/h' },
    ttc: 0.92,
    pet: 0.75,
    severity: 'CRITICAL',
    location: 'Nandankanan Road Diagonal',
    rootCause: 'Elderly pedestrian crossed 45m diagonal through stopped traffic as green phase triggered.',
    recommendation: 'Install pedestrian guardrails along median to direct to signalized zebra.'
  }
];

// Continuous Time Series for TTC/PET over 80 seconds
export const TTC_TIMESERIES = [
  { t: 0, ttc: 4.8, pet: 3.9, risk: 18 },
  { t: 4, ttc: 4.2, pet: 3.5, risk: 24 },
  { t: 8, ttc: 2.1, pet: 1.8, risk: 52 },
  { t: 9.4, ttc: 0.84, pet: 0.62, risk: 94, incident: 'INC-2026-0891' },
  { t: 12, ttc: 3.4, pet: 2.7, risk: 36 },
  { t: 16, ttc: 4.5, pet: 3.8, risk: 20 },
  { t: 20, ttc: 2.4, pet: 1.9, risk: 58 },
  { t: 22.1, ttc: 1.18, pet: 0.94, risk: 88, incident: 'INC-2026-0892' },
  { t: 26, ttc: 3.8, pet: 3.0, risk: 30 },
  { t: 30, ttc: 4.6, pet: 3.9, risk: 22 },
  { t: 35, ttc: 2.8, pet: 2.1, risk: 48 },
  { t: 38.6, ttc: 1.42, pet: 1.10, risk: 84, incident: 'INC-2026-0893' },
  { t: 42, ttc: 3.9, pet: 3.2, risk: 28 },
  { t: 47, ttc: 3.1, pet: 2.4, risk: 42 },
  { t: 51.3, ttc: 1.31, pet: 1.05, risk: 82, incident: 'INC-2026-0894' },
  { t: 56, ttc: 4.3, pet: 3.6, risk: 25 },
  { t: 62, ttc: 3.5, pet: 2.9, risk: 35 },
  { t: 67.8, ttc: 0.92, pet: 0.75, risk: 92, incident: 'INC-2026-0895' },
  { t: 72, ttc: 3.6, pet: 2.8, risk: 34 },
  { t: 76, ttc: 4.4, pet: 3.7, risk: 22 },
  { t: 80, ttc: 4.7, pet: 4.0, risk: 19 }
];

export const HOURLY_CONFLICT_TREND = [
  { hour: '07:00', conflicts: 6, volume: 1420 },
  { hour: '08:00', conflicts: 18, volume: 2890 },
  { hour: '09:00', conflicts: 34, volume: 4120 }, // Peak Morning Office
  { hour: '10:00', conflicts: 29, volume: 3850 },
  { hour: '11:00', conflicts: 14, volume: 2400 },
  { hour: '12:00', conflicts: 11, volume: 2100 },
  { hour: '13:00', conflicts: 9, volume: 1950 },
  { hour: '14:00', conflicts: 13, volume: 2200 },
  { hour: '15:00', conflicts: 16, volume: 2600 },
  { hour: '16:00', conflicts: 22, volume: 3200 },
  { hour: '17:00', conflicts: 38, volume: 4450 }, // Peak Evening
  { hour: '18:00', conflicts: 42, volume: 4780 }, // Highest Conflict Rate
  { hour: '19:00', conflicts: 35, volume: 4100 },
  { hour: '20:00', conflicts: 24, volume: 3300 },
  { hour: '21:00', conflicts: 15, volume: 2100 }
];

export const INFRASTRUCTURE_RECOMMENDATIONS = [
  {
    priority: 'CRITICAL',
    title: 'Install Raised Pedestrian Refuge Island on Jayadev Vihar West Crosswalk',
    rationale: '79% of critical near-misses involve pedestrians trapped mid-crossing across 6 lanes without physical refuge.',
    impact: 'Estimated 64% reduction in VRU conflict exposure',
    estimatedCost: '₹ 3.4 Lakhs',
    timeline: 'Immediate (2 Weeks)'
  },
  {
    priority: 'HIGH',
    title: 'Leading Pedestrian Interval (LPI) Signal Timing Optimization',
    rationale: 'Right-turning two-wheelers conflict with pedestrians in the first 5 seconds of the green phase.',
    impact: 'Estimated 45% reduction in right-turn weaving near-misses',
    estimatedCost: '₹ 0 (Software Config in Smart City ICCC)',
    timeline: 'Within 48 Hours'
  },
  {
    priority: 'MEDIUM',
    title: 'Channelized Auto-Rickshaw Drop-off Bay 40m Before Intersection',
    rationale: 'Unscheduled curbside pick/drops cause acute lane swerving and rear-end brake conflicts.',
    impact: 'Estimated 30% reduction in corridor friction',
    estimatedCost: '₹ 8.5 Lakhs',
    timeline: '4-6 Weeks'
  }
];
