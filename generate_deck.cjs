const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 or 13.33 x 7.5

// Color Palette
const COLORS = {
  bg: '0B132B',       // Deep Midnight Blue
  cardBg: '162238',   // Slightly lighter navy for cards
  cardBorder: '243B55',
  cardHighlight: '1C2D4A',
  accent: '38BDF8',   // Vibrant Sky Blue
  accentGlow: '0EA5E9',
  green: '10B981',    // Emerald Green
  amber: 'F59E0B',    // Amber / Warning
  red: 'EF4444',      // Danger / Red
  textWhite: 'FFFFFF',
  textLight: 'F1F5F9',
  textMuted: '94A3B8',
  textDim: '64748B'
};

function addHeader(slide, tag, title, subtitle) {
  // Tag / Category
  slide.addText(tag.toUpperCase(), {
    x: 0.8, y: 0.45, w: 10, h: 0.3,
    fontSize: 10, fontFace: 'Calibri', bold: true, color: COLORS.accent,
    charSpacing: 2
  });

  // Main Title
  slide.addText(title, {
    x: 0.8, y: 0.72, w: 11.5, h: 0.55,
    fontSize: 22, fontFace: 'Calibri', bold: true, color: COLORS.textWhite
  });

  // Subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.8, y: 1.25, w: 11.5, h: 0.35,
      fontSize: 12, fontFace: 'Calibri', color: COLORS.textMuted
    });
  }

  // Horizontal subtle accent line
  slide.addShape(pres.ShapeType.line, {
    x: 0.8, y: 1.62, w: 11.7, h: 0,
    line: { color: COLORS.cardBorder, width: 1.5 }
  });
}

function setDarkBackground(slide) {
  slide.background = { color: COLORS.bg };
}

// ==============================================================================
// SLIDE 1: COVER
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);

  // Decorative top banner tag
  slide.addText('BHUBANESWAR SMART CITY  ·  CIVIC INTELLIGENCE INITIATIVE', {
    x: 1.0, y: 0.9, w: 11.3, h: 0.4,
    fontSize: 11, fontFace: 'Calibri', bold: true, color: COLORS.accent,
    charSpacing: 3
  });

  // Main Project Title
  slide.addText('AGAHI', {
    x: 1.0, y: 1.35, w: 11.3, h: 1.2,
    fontSize: 54, fontFace: 'Calibri', bold: true, color: COLORS.textWhite
  });

  // Tagline / Mission
  slide.addText('SEE THE RISK BEFORE THE CRASH', {
    x: 1.0, y: 2.5, w: 11.3, h: 0.5,
    fontSize: 18, fontFace: 'Calibri', bold: true, color: COLORS.amber,
    charSpacing: 2
  });

  slide.addText('Vision Zero for Bhubaneswar · Proactive Near-Miss AI Platform', {
    x: 1.0, y: 2.95, w: 11.3, h: 0.45,
    fontSize: 14, fontFace: 'Calibri', color: COLORS.textMuted
  });

  // Metrics highlight cards
  const stats = [
    { num: '1,200+', label: 'ROAD ACCIDENTS', sub: 'In municipal limits', col: COLORS.textWhite },
    { num: '850+', label: 'ROAD FATALITIES', sub: '71% fatality rate', col: COLORS.red },
    { num: '0', label: 'NEW HARDWARE', sub: 'Zero Capex burden', col: COLORS.green },
    { num: '100%', label: 'EXISTING CCTV', sub: 'Smart City feed reuse', col: COLORS.accent }
  ];

  stats.forEach((s, idx) => {
    const cardX = 1.0 + idx * 2.85;
    slide.addShape(pres.ShapeType.roundRect, {
      x: cardX, y: 3.7, w: 2.65, h: 1.45,
      rectRadius: 0.1,
      fill: { color: COLORS.cardBg },
      line: { color: COLORS.cardBorder, width: 1.2 }
    });

    slide.addText(s.num, {
      x: cardX + 0.15, y: 3.85, w: 2.35, h: 0.55,
      fontSize: 24, fontFace: 'Calibri', bold: true, color: s.col, align: 'center'
    });

    slide.addText(s.label, {
      x: cardX + 0.15, y: 4.4, w: 2.35, h: 0.3,
      fontSize: 10, fontFace: 'Calibri', bold: true, color: COLORS.textLight, align: 'center',
      charSpacing: 1
    });

    slide.addText(s.sub, {
      x: cardX + 0.15, y: 4.7, w: 2.35, h: 0.3,
      fontSize: 9, fontFace: 'Calibri', color: COLORS.textMuted, align: 'center'
    });
  });

  // Team Footer Box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 1.0, y: 5.5, w: 11.33, h: 1.05,
    rectRadius: 0.1,
    fill: { color: '0E182F' },
    line: { color: COLORS.accentGlow, width: 1.0 }
  });

  slide.addText('TEAM: VIGILANTE CODERS', {
    x: 1.25, y: 5.62, w: 5.0, h: 0.3,
    fontSize: 11, fontFace: 'Calibri', bold: true, color: COLORS.accent,
    charSpacing: 2
  });

  slide.addText('Members: Ankita Dutta  ·  Siba Prasad Panda  ·  Nikita Kumari  ·  Anshika Kumari', {
    x: 1.25, y: 5.95, w: 10.8, h: 0.45,
    fontSize: 13, fontFace: 'Calibri', color: COLORS.textWhite
  });
}

// ==============================================================================
// SLIDE 2: 01 / THE CRISIS
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);
  addHeader(slide, '01 / THE CRISIS', 'THE HIDDEN CRISIS IS ALREADY VISIBLE', '1,200+ crashes and 850+ fatalities have turned city intersections into conflict zones.');

  // Stat Card 1
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 1.85, w: 3.6, h: 2.2,
    rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: COLORS.cardBorder, width: 1.2 }
  });
  slide.addText('1,200+', { x: 1.0, y: 2.05, w: 3.2, h: 0.6, fontSize: 32, fontFace: 'Calibri', bold: true, color: COLORS.amber });
  slide.addText('ROAD ACCIDENTS', { x: 1.0, y: 2.65, w: 3.2, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.textWhite });
  slide.addText('Recorded over 4.5 years across Bhubaneswar municipal limits. High concentration at major transit circles.', { x: 1.0, y: 3.0, w: 3.2, h: 0.85, fontSize: 11, fontFace: 'Calibri', color: COLORS.textMuted });

  // Stat Card 2
  slide.addShape(pres.ShapeType.roundRect, {
    x: 4.8, y: 1.85, w: 3.6, h: 2.2,
    rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: COLORS.red, width: 1.2 }
  });
  slide.addText('850+', { x: 5.0, y: 2.05, w: 3.2, h: 0.6, fontSize: 32, fontFace: 'Calibri', bold: true, color: COLORS.red });
  slide.addText('ROAD FATALITIES', { x: 5.0, y: 2.65, w: 3.2, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.textWhite });
  slide.addText('Staggering 71% fatality rate among recorded severe accidents. Victims lack proactive roadside protection.', { x: 5.0, y: 3.0, w: 3.2, h: 0.85, fontSize: 11, fontFace: 'Calibri', color: COLORS.textMuted });

  // Stat Card 3
  slide.addShape(pres.ShapeType.roundRect, {
    x: 8.8, y: 1.85, w: 3.7, h: 2.2,
    rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: COLORS.accent, width: 1.2 }
  });
  slide.addText('78%', { x: 9.0, y: 2.05, w: 3.3, h: 0.6, fontSize: 32, fontFace: 'Calibri', bold: true, color: COLORS.accent });
  slide.addText('VULNERABLE ROAD USERS', { x: 9.0, y: 2.65, w: 3.3, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.textWhite });
  slide.addText('Two-wheeler riders and pedestrians bear nearly 78% of all lives lost due to vehicle-pedestrian conflict zones.', { x: 9.0, y: 3.0, w: 3.3, h: 0.85, fontSize: 11, fontFace: 'Calibri', color: COLORS.textMuted });

  // Case Study Bar
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 4.3, w: 11.7, h: 2.3,
    rectRadius: 0.1, fill: { color: COLORS.cardHighlight }, line: { color: COLORS.cardBorder, width: 1.2 }
  });

  slide.addText('SPOTLIGHT: KHANDAGIRI & JAYADEV VIHAR TRANSIT CONVERGENCE', {
    x: 1.1, y: 4.45, w: 11.0, h: 0.35, fontSize: 11, fontFace: 'Calibri', bold: true, color: COLORS.amber, charSpacing: 1
  });

  slide.addText([
    { text: '• Blind-Spot Convergence: ', options: { bold: true, color: COLORS.textWhite } },
    { text: 'Heavy bus and commercial vehicle turning paths directly overlap with high-density pedestrian crossings.\n', options: { color: COLORS.textMuted } },
    { text: '• Lack of Spatial Separation: ', options: { bold: true, color: COLORS.textWhite } },
    { text: 'Two-wheelers weave into left-turning lanes, creating continuous high-velocity near-miss interactions.\n', options: { color: COLORS.textMuted } },
    { text: '• Invisible Pre-Crash Patterns: ', options: { bold: true, color: COLORS.textWhite } },
    { text: 'Authorities only learn of structural hazards after a fatal accident is registered in police FIR logs.', options: { color: COLORS.textMuted } }
  ], {
    x: 1.1, y: 4.85, w: 11.1, h: 1.6, fontSize: 12, fontFace: 'Calibri', lineSpacing: 20
  });
}

// ==============================================================================
// SLIDE 3: 02 / TREND ANALYSIS
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);
  addHeader(slide, '02 / TREND ANALYSIS (2023-2026)', 'REACTIVE SAFETY IS NOT FLATTENING THE CURVE', 'The Reaction Trap: We are penalizing symptoms while intersection geometry goes unaddressed.');

  const rows = [
    [
      { text: 'CURRENT SYSTEM', options: { bold: true, fill: { color: '1A2E4C' }, color: COLORS.accent } },
      { text: 'WHAT IT DOES TODAY', options: { bold: true, fill: { color: '1A2E4C' }, color: COLORS.accent } },
      { text: 'CRITICAL LIMITATION & FAILURE MODE', options: { bold: true, fill: { color: '1A2E4C' }, color: COLORS.accent } }
    ],
    [
      { text: '01 · Standard CCTV & Traffic Cameras', options: { bold: true, color: COLORS.textWhite } },
      { text: 'Installed at major junctions for manual police monitoring & traffic flow verification.', options: { color: COLORS.textLight } },
      { text: 'Passive Storage: Footage is retrieved only after someone dies to verify fault. Zero predictive or preventative capability.', options: { color: COLORS.amber } }
    ],
    [
      { text: '02 · Speed Radars & Automated Challans', options: { bold: true, color: COLORS.textWhite } },
      { text: 'Automated e-challans target helmetless riding and speed-limit infractions.', options: { color: COLORS.textLight } },
      { text: 'Punitive Revenue Focus: Drivers decelerate before camera sensors and speed up immediately after. Turning conflicts remain unchanged.', options: { color: COLORS.amber } }
    ],
    [
      { text: '03 · Post-Crash FIRs & Blackspot Tagging', options: { bold: true, color: COLORS.textWhite } },
      { text: 'Police manually file crash reports and mark recurring accident locations on maps.', options: { color: COLORS.textLight } },
      { text: 'Post-Mortem Burden: An intersection requires 3 to 5 fatal crashes across 3 consecutive years to qualify for civil remediation.', options: { color: COLORS.red } }
    ]
  ];

  slide.addTable(rows, {
    x: 0.8, y: 1.85, w: 11.7, colW: [3.2, 4.0, 4.5],
    fill: { color: COLORS.cardBg },
    border: { pt: 1, color: COLORS.cardBorder },
    fontSize: 11, fontFace: 'Calibri',
    align: 'left', valign: 'middle',
    rowH: [0.5, 1.25, 1.25, 1.25]
  });
}

// ==============================================================================
// SLIDE 4: 03 / THE CURRENT STACK
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);
  addHeader(slide, '03 / THE CURRENT STACK', 'THREE SYSTEMS OBSERVE THE CRASH. NONE PREVENTS IT.', 'Today’s stack targets post-crash enforcement and revenue, not engineering feedback.');

  const boxes = [
    { num: '01', title: 'SURVEILLANCE CAMERAS', role: 'Passive Video Archival', flaw: 'Pulls footage after fatal crash to prove fault.', col: COLORS.textMuted },
    { num: '02', title: 'SPEED RADAR / E-CHALLAN', role: 'Punitive Enforcement', flaw: 'Penalizes drivers; ignores road design defects.', col: COLORS.amber },
    { num: '03', title: 'POLICE FIR / BLACKSPOT', role: 'Post-Mortem Logging', flaw: 'Requires recurring deaths to qualify for fixes.', col: COLORS.red }
  ];

  boxes.forEach((b, idx) => {
    const bx = 0.8 + idx * 4.0;
    slide.addShape(pres.ShapeType.roundRect, {
      x: bx, y: 1.85, w: 3.7, h: 2.2,
      rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: b.col, width: 1.2 }
    });

    slide.addText(b.num, { x: bx + 0.2, y: 2.0, w: 1.0, h: 0.35, fontSize: 14, fontFace: 'Calibri', bold: true, color: b.col });
    slide.addText(b.title, { x: bx + 0.2, y: 2.35, w: 3.3, h: 0.45, fontSize: 13, fontFace: 'Calibri', bold: true, color: COLORS.textWhite });
    slide.addText(`Role: ${b.role}`, { x: bx + 0.2, y: 2.8, w: 3.3, h: 0.3, fontSize: 10, fontFace: 'Calibri', bold: true, color: COLORS.accent });
    slide.addText(b.flaw, { x: bx + 0.2, y: 3.15, w: 3.3, h: 0.75, fontSize: 11, fontFace: 'Calibri', color: COLORS.textMuted });
  });

  // Callout Box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 0.8, y: 4.35, w: 11.7, h: 2.2,
    rectRadius: 0.1, fill: { color: '1A1F38' }, line: { color: COLORS.red, width: 1.2 }
  });

  slide.addText('THE FUNDAMENTAL DISCONNECT', {
    x: 1.1, y: 4.55, w: 11.0, h: 0.35, fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.red, charSpacing: 1
  });

  slide.addText([
    { text: 'Hundreds of feeds serve fines, not design.\n', options: { fontSize: 14, bold: true, color: COLORS.textWhite } },
    { text: 'An automated e-challan punishes the driver, but provides ', options: { fontSize: 12, color: COLORS.textMuted } },
    { text: 'zero actionable feedback ', options: { fontSize: 12, bold: true, color: COLORS.amber } },
    { text: 'to road engineers about the blind corner, insufficient signal clearance phase, missing pedestrian refuge island, or illegal curb radius that caused the critical conflict in the first place.', options: { fontSize: 12, color: COLORS.textMuted } }
  ], {
    x: 1.1, y: 4.95, w: 11.1, h: 1.4, fontFace: 'Calibri', lineSpacing: 22
  });
}

// ==============================================================================
// SLIDE 5: 04 / SYSTEMIC FLAWS & SAFETY PYRAMID
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);
  addHeader(slide, '04 / SYSTEMIC FLAWS', 'THE NEAR-MISS PYRAMID: SOLVING THE ICEBERG EFFECT', 'Traditional systems only capture the fatal peak. AGAHI detects the high-frequency base.');

  // Left: Pyramid Description Cards
  const levels = [
    { title: 'CRASHES & FATALITIES (The Tip)', count: '850+ Lives Lost', desc: 'Where the city reacts today. Post-crash FIRs and police tagging.', col: COLORS.red },
    { title: 'SEVERE NEAR-MISSES (TTC < 1.5s)', count: 'Thousands / Month', desc: 'Emergency braking, vehicle-pedestrian evasive swerving.', col: COLORS.amber },
    { title: 'TRAFFIC INTERACTION CONFLICTS (PET < 2.0s)', count: 'Tens of Thousands / Day', desc: 'Frequent temporal overlap of road users in blind spots.', col: COLORS.accent }
  ];

  levels.forEach((lvl, i) => {
    const ly = 1.85 + i * 1.55;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: ly, w: 6.8, h: 1.35,
      rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: lvl.col, width: 1.2 }
    });

    slide.addText(lvl.title, { x: 1.0, y: ly + 0.15, w: 4.5, h: 0.3, fontSize: 11, fontFace: 'Calibri', bold: true, color: lvl.col });
    slide.addText(lvl.count, { x: 4.8, y: ly + 0.15, w: 2.6, h: 0.3, fontSize: 11, fontFace: 'Calibri', bold: true, color: COLORS.textWhite, align: 'right' });
    slide.addText(lvl.desc, { x: 1.0, y: ly + 0.5, w: 6.4, h: 0.65, fontSize: 11, fontFace: 'Calibri', color: COLORS.textMuted });
  });

  // Right: AGAHI Advantage Box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 8.0, y: 1.85, w: 4.5, h: 4.45,
    rectRadius: 0.1, fill: { color: COLORS.cardHighlight }, line: { color: COLORS.green, width: 1.2 }
  });

  slide.addText('AGAHI PARADIGM SHIFT', {
    x: 8.3, y: 2.1, w: 3.9, h: 0.35, fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.green, charSpacing: 1
  });

  slide.addText([
    { text: '1. Don’t Wait for Deaths:\n', options: { bold: true, color: COLORS.textWhite } },
    { text: 'Near-misses occur 100x more frequently than crashes. They provide statistical statistical power in days rather than 3 years.\n\n', options: { color: COLORS.textMuted } },
    { text: '2. Diagnose Geometric Flaws:\n', options: { bold: true, color: COLORS.textWhite } },
    { text: 'Trajectories show exactly where turning vehicles clip pedestrian crosswalk paths.\n\n', options: { color: COLORS.textMuted } },
    { text: '3. Pre-Emptive Engineering:\n', options: { bold: true, color: COLORS.textWhite } },
    { text: 'Fix signal cycles, add bollards, or install refuge islands before the next fatal collision occurs.', options: { color: COLORS.textMuted } }
  ], {
    x: 8.3, y: 2.55, w: 3.9, h: 3.5, fontSize: 11, fontFace: 'Calibri', lineSpacing: 18
  });
}

// ==============================================================================
// SLIDE 6: 05 / THE PROACTIVE SOLUTION
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);
  addHeader(slide, '05 / THE PROACTIVE SOLUTION', 'HOW AGAHI TRANSFORMS PASSIVE CAMERAS INTO LIFE-SAVING INTELLIGENCE', 'Zero new hardware capex · 100% existing smart city infrastructure reuse.');

  const pillars = [
    { title: 'ZERO NEW SENSORS', desc: 'Plugs directly into Bhubaneswar existing CCTV and traffic surveillance cameras. No road cuts, no radar radar maintenance.', col: COLORS.green },
    { title: 'AI TRAJECTORY TRACKING', desc: 'Detects 2-wheelers, auto-rickshaws, buses, and pedestrians, tracking their real-world 2D speed and acceleration vectors.', col: COLORS.accent },
    { title: 'PHYSICS-BASED NEAR-MISS', desc: 'Computes Time-to-Collision (TTC) & Post-Encroachment Time (PET) continuously to catch conflicts invisible to human eyes.', col: COLORS.amber },
    { title: 'CIVIL ROAD ACTION', desc: 'Exports quantitative engineering reports showing exactly how to adjust signal timings or install geometric refuge islands.', col: COLORS.accentGlow }
  ];

  pillars.forEach((p, idx) => {
    const px = 0.8 + (idx % 2) * 5.95;
    const py = 1.85 + Math.floor(idx / 2) * 2.3;

    slide.addShape(pres.ShapeType.roundRect, {
      x: px, y: py, w: 5.75, h: 2.1,
      rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: p.col, width: 1.2 }
    });

    slide.addText(p.title, { x: px + 0.25, y: py + 0.2, w: 5.25, h: 0.35, fontSize: 12, fontFace: 'Calibri', bold: true, color: p.col, charSpacing: 1 });
    slide.addText(p.desc, { x: px + 0.25, y: py + 0.65, w: 5.25, h: 1.2, fontSize: 11, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 18 });
  });
}

// ==============================================================================
// SLIDE 7: 06 / MVP ARCHITECTURE (THE REQUESTED CENTERPIECE)
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);
  addHeader(slide, '06 / MVP ARCHITECTURE', 'AGAHI END-TO-END PIPELINE & FULL TECHNOLOGY STACK', 'From raw CCTV pixels to real-world metric trajectories, surrogate safety metrics, and civil engineering action.');

  // 4 Pipeline Stage Cards (Diagram-like layout)
  const stages = [
    {
      num: 'STAGE 01',
      title: 'VIDEO INGESTION',
      sub: 'Feeds & Privacy',
      border: COLORS.accent,
      bullets: [
        '1080p RTSP CCTV Streams',
        'Frame sampling & FPS sync',
        'Edge privacy anonymizer',
        '(License plate & face blur)',
        'Simulated / video replay'
      ],
      techLabel: 'TECH STACK',
      tech: 'OpenCV · FFmpeg · GStreamer'
    },
    {
      num: 'STAGE 02',
      title: 'AI TRAJECTORY',
      sub: 'Detection & Mapping',
      border: COLORS.green,
      bullets: [
        'YOLO multi-class detection',
        '(2W, Pedestrians, Autos, Cars)',
        'ByteTrack continuous MOT',
        'Planar Homography transform',
        'Bird’s-eye ground plane (m)'
      ],
      techLabel: 'TECH STACK',
      tech: 'YOLOv8/v10 · ByteTrack · ONNX'
    },
    {
      num: 'STAGE 03',
      title: 'CONFLICT & RISK',
      sub: 'Physics & Surrogates',
      border: COLORS.amber,
      bullets: [
        'Time-to-Collision (TTC < 1.5s)',
        'Post-Encroachment Time (PET)',
        'Deceleration Rate (DRAC)',
        'Spatial KDE Heatmap Engine',
        'High-risk conflict clustering'
      ],
      techLabel: 'TECH STACK',
      tech: 'NumPy · SciPy · Scikit (KDE)'
    },
    {
      num: 'STAGE 04',
      title: 'CIVIL DASHBOARD',
      sub: 'Engineering Action',
      border: COLORS.accentGlow,
      bullets: [
        'GIS Risk Hotspot Overlay',
        'Peak conflict hour curves',
        'Vulnerable road user split',
        'Signal timing redesign',
        'Evidence-based civil reports'
      ],
      techLabel: 'TECH STACK',
      tech: 'React · Tailwind · Mapbox GL'
    }
  ];

  const cardW = 2.75;
  const cardGap = 0.22;
  const startX = 0.8;
  const startY = 1.82;
  const cardH = 3.35;

  stages.forEach((stg, i) => {
    const cx = startX + i * (cardW + cardGap);

    // Stage Card Body
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx, y: startY, w: cardW, h: cardH,
      rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: stg.border, width: 1.5 }
    });

    // Stage Header Badge
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx + 0.15, y: startY + 0.15, w: cardW - 0.3, h: 0.32,
      rectRadius: 0.06, fill: { color: '101A2F' }, line: { color: stg.border, width: 1.0 }
    });

    slide.addText(stg.num, {
      x: cx + 0.15, y: startY + 0.17, w: cardW - 0.3, h: 0.28,
      fontSize: 9, fontFace: 'Calibri', bold: true, color: stg.border, align: 'center', charSpacing: 1
    });

    // Title & Subtitle
    slide.addText(stg.title, {
      x: cx + 0.15, y: startY + 0.52, w: cardW - 0.3, h: 0.32,
      fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.textWhite, align: 'center'
    });

    slide.addText(stg.sub, {
      x: cx + 0.15, y: startY + 0.82, w: cardW - 0.3, h: 0.22,
      fontSize: 9, fontFace: 'Calibri', color: COLORS.textMuted, align: 'center'
    });

    // Divider
    slide.addShape(pres.ShapeType.line, {
      x: cx + 0.2, y: startY + 1.1, w: cardW - 0.4, h: 0,
      line: { color: COLORS.cardBorder, width: 1.0 }
    });

    // Bullet points
    const bulletText = stg.bullets.map(b => ({
      text: `• ${b}\n`,
      options: { fontSize: 9.5, color: COLORS.textLight }
    }));

    slide.addText(bulletText, {
      x: cx + 0.15, y: startY + 1.18, w: cardW - 0.3, h: 1.45,
      fontFace: 'Calibri', lineSpacing: 16
    });

    // Tech Stack Bottom Box inside Card
    slide.addShape(pres.ShapeType.roundRect, {
      x: cx + 0.12, y: startY + 2.7, w: cardW - 0.24, h: 0.52,
      rectRadius: 0.06, fill: { color: '0A1120' }, line: { color: COLORS.cardBorder, width: 1.0 }
    });

    slide.addText(stg.techLabel, {
      x: cx + 0.12, y: startY + 2.72, w: cardW - 0.24, h: 0.18,
      fontSize: 7.5, fontFace: 'Calibri', bold: true, color: stg.border, align: 'center', charSpacing: 1
    });

    slide.addText(stg.tech, {
      x: cx + 0.12, y: startY + 2.9, w: cardW - 0.24, h: 0.28,
      fontSize: 8.5, fontFace: 'Calibri', bold: true, color: COLORS.textWhite, align: 'center'
    });

    // Connecting Arrow between cards (if not last)
    if (i < stages.length - 1) {
      slide.addText('➔', {
        x: cx + cardW + 0.02, y: startY + 1.4, w: cardGap - 0.04, h: 0.4,
        fontSize: 14, fontFace: 'Calibri', bold: true, color: COLORS.accent, align: 'center'
      });
    }
  });

  // Bottom Full-Width Master Tech Stack Strip
  const stripY = 5.32;
  const stripH = 1.5;

  slide.addShape(pres.ShapeType.roundRect, {
    x: startX, y: stripY, w: 11.7, h: stripH,
    rectRadius: 0.1, fill: { color: '0E192E' }, line: { color: COLORS.accent, width: 1.2 }
  });

  slide.addText('COMPLETE MVP TECHNOLOGY STACK MATRIX', {
    x: startX + 0.25, y: stripY + 0.12, w: 11.2, h: 0.25,
    fontSize: 9.5, fontFace: 'Calibri', bold: true, color: COLORS.accent, charSpacing: 2
  });

  // 4 Tech Columns in bottom banner
  const techCols = [
    {
      cat: 'INGESTION & PRIVACY',
      stack: 'OpenCV · FFmpeg · GStreamer\nH.264 / RTSP · Edge Anonymizer'
    },
    {
      cat: 'AI DETECTION & TRACKING',
      stack: 'YOLOv8 / YOLOv10 (PyTorch)\nByteTrack · Planar Homography'
    },
    {
      cat: 'PHYSICS & CONFLICT ENGINE',
      stack: 'NumPy · SciPy · Shapely\nKDE · PostgreSQL + PostGIS'
    },
    {
      cat: 'FRONTEND & REPORTING',
      stack: 'React 18 · Tailwind CSS\nMapbox GL · FastAPI (Python)'
    }
  ];

  techCols.forEach((tc, idx) => {
    const tx = startX + 0.25 + idx * 2.85;
    slide.addText(tc.cat, {
      x: tx, y: stripY + 0.45, w: 2.7, h: 0.22,
      fontSize: 9, fontFace: 'Calibri', bold: true, color: COLORS.amber
    });

    slide.addText(tc.stack, {
      x: tx, y: stripY + 0.72, w: 2.7, h: 0.65,
      fontSize: 9.5, fontFace: 'Calibri', color: COLORS.textLight, lineSpacing: 14
    });
  });
}

// ==============================================================================
// SLIDE 8: 07 / INFRASTRUCTURE IMPACT
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);
  addHeader(slide, '07 / INFRASTRUCTURE IMPACT', 'CONVERTING AI METRICS INTO PHYSICAL ROAD ENGINEERING', 'Replacing guesswork with evidence-based geometry and signal timing redesigns.');

  const interventions = [
    {
      loc: 'JAYADEV VIHAR JUNCTION',
      issue: 'Pedestrian-bus conflict cluster during evening peak (5:30 - 7:30 PM)',
      aiFinding: 'PET < 1.1s recurring between left-turning buses and crosswalk pedestrians.',
      action: 'Dedicated Leading Pedestrian Interval (LPI 7s) & visual signal re-phasing.',
      col: COLORS.amber
    },
    {
      loc: 'KHANDAGIRI TRANSIT CIRCLE',
      issue: 'Blind-spot convergence between 2-wheelers and transit buses.',
      aiFinding: 'High TTC deceleration clusters at uncurbed left-turn slip road.',
      action: 'Installation of physical pedestrian refuge island and revised corner radius.',
      col: COLORS.red
    },
    {
      loc: 'RASULGARH CONVERGENCE',
      issue: 'High-speed weaving conflicts between freight traffic and autos.',
      aiFinding: 'Lateral velocity variance exceeding safe threshold across merge zones.',
      action: 'Physical lane segregation barriers and advance conflict warning signboards.',
      col: COLORS.green
    }
  ];

  interventions.forEach((item, idx) => {
    const iy = 1.85 + idx * 1.55;
    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: iy, w: 11.7, h: 1.35,
      rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: item.col, width: 1.2 }
    });

    slide.addText(item.loc, { x: 1.1, y: iy + 0.15, w: 4.0, h: 0.3, fontSize: 12, fontFace: 'Calibri', bold: true, color: item.col });
    slide.addText(`Observed Defect: ${item.issue}`, { x: 1.1, y: iy + 0.48, w: 5.5, h: 0.35, fontSize: 10, fontFace: 'Calibri', color: COLORS.textMuted });
    slide.addText(`AI Finding: ${item.aiFinding}`, { x: 1.1, y: iy + 0.85, w: 5.5, h: 0.35, fontSize: 10, fontFace: 'Calibri', color: COLORS.textLight });

    // Action Box on right
    slide.addShape(pres.ShapeType.roundRect, {
      x: 7.0, y: iy + 0.18, w: 5.2, h: 0.98,
      rectRadius: 0.08, fill: { color: '121F38' }, line: { color: COLORS.cardBorder, width: 1.0 }
    });

    slide.addText('CIVIL ACTION RECOMMENDED:', { x: 7.2, y: iy + 0.28, w: 4.8, h: 0.25, fontSize: 9, fontFace: 'Calibri', bold: true, color: COLORS.accent, charSpacing: 1 });
    slide.addText(item.action, { x: 7.2, y: iy + 0.55, w: 4.8, h: 0.55, fontSize: 10.5, fontFace: 'Calibri', bold: true, color: COLORS.textWhite });
  });
}

// ==============================================================================
// SLIDE 9: 08 / STRATEGIC SHIFT & PILOT
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);
  addHeader(slide, '08 / STRATEGIC SHIFT & PILOT', 'BHUBANESWAR PILOT ROADMAP: FROM 5 JUNCTIONS TO CITYWIDE', 'Establishing near-miss baselines before scaling to the Smart City Command Centre.');

  const phases = [
    {
      phase: 'PHASE 1 · MVP PILOT (WEEKS 1-8)',
      title: '5 High-Risk Junctions',
      bullets: [
        'Jayadev Vihar',
        'Khandagiri Intersection',
        'Rasulgarh Square',
        'Master Canteen',
        'Kalpana Square'
      ],
      desc: 'Deploy on recorded/RTSP feeds to extract initial near-miss baseline and calibrate TTC thresholds.',
      col: COLORS.accent
    },
    {
      phase: 'PHASE 2 · SMART CITY INTEGRATION (MONTHS 3-6)',
      title: 'ICCC Integration',
      bullets: [
        'Bhubaneswar ICCC live stream connection',
        'Continuous automated conflict analysis',
        'Daily engineer diagnostic heatmaps',
        'Smart signal priority triggers'
      ],
      desc: 'Integrate into municipal workflow for real-time safety auditing without operator intervention.',
      col: COLORS.amber
    },
    {
      phase: 'PHASE 3 · CITYWIDE VISION ZERO (MONTHS 6-12)',
      title: 'Civic Policy & MoRTH Scale',
      bullets: [
        'Expansion to 50+ intersections',
        'Pre-and-post redesign safety validation',
        'Citizen safety index transparency portal',
        'Adopted by state road safety cell'
      ],
      desc: 'Replace reactive 3-year blackspot lists with continuous proactive civic intelligence.',
      col: COLORS.green
    }
  ];

  phases.forEach((p, idx) => {
    const px = 0.8 + idx * 4.0;
    slide.addShape(pres.ShapeType.roundRect, {
      x: px, y: 1.85, w: 3.7, h: 4.7,
      rectRadius: 0.1, fill: { color: COLORS.cardBg }, line: { color: p.col, width: 1.2 }
    });

    slide.addText(p.phase, { x: px + 0.2, y: 2.05, w: 3.3, h: 0.35, fontSize: 9.5, fontFace: 'Calibri', bold: true, color: p.col, charSpacing: 1 });
    slide.addText(p.title, { x: px + 0.2, y: 2.45, w: 3.3, h: 0.4, fontSize: 13, fontFace: 'Calibri', bold: true, color: COLORS.textWhite });

    const bText = p.bullets.map(b => ({ text: `• ${b}\n`, options: { fontSize: 10, color: COLORS.textLight } }));
    slide.addText(bText, { x: px + 0.2, y: 2.95, w: 3.3, h: 1.8, fontFace: 'Calibri', lineSpacing: 16 });

    slide.addShape(pres.ShapeType.line, { x: px + 0.2, y: 4.85, w: 3.3, h: 0, line: { color: COLORS.cardBorder, width: 1.0 } });
    slide.addText(p.desc, { x: px + 0.2, y: 4.95, w: 3.3, h: 1.45, fontSize: 10.5, fontFace: 'Calibri', color: COLORS.textMuted, lineSpacing: 16 });
  });
}

// ==============================================================================
// SLIDE 10: CONCLUSION & THANK YOU
// ==============================================================================
{
  const slide = pres.addSlide();
  setDarkBackground(slide);

  slide.addText('VISION ZERO FOR BHUBANESWAR', {
    x: 1.0, y: 1.2, w: 11.33, h: 0.4,
    fontSize: 12, fontFace: 'Calibri', bold: true, color: COLORS.accent, charSpacing: 3, align: 'center'
  });

  slide.addText('SEE THE RISK BEFORE THE CRASH', {
    x: 1.0, y: 1.7, w: 11.33, h: 0.8,
    fontSize: 38, fontFace: 'Calibri', bold: true, color: COLORS.textWhite, align: 'center'
  });

  slide.addText('AGAHI empowers city planners to prevent fatal collisions before they occur,\nusing existing infrastructure, computer vision, and proactive surrogate safety analytics.', {
    x: 1.0, y: 2.65, w: 11.33, h: 0.9,
    fontSize: 14, fontFace: 'Calibri', color: COLORS.textMuted, align: 'center', lineSpacing: 22
  });

  // Center Box
  slide.addShape(pres.ShapeType.roundRect, {
    x: 2.5, y: 3.8, w: 8.33, h: 1.8,
    rectRadius: 0.1, fill: { color: '121F38' }, line: { color: COLORS.accent, width: 1.5 }
  });

  slide.addText('TEAM: VIGILANTE CODERS', {
    x: 2.7, y: 4.0, w: 7.93, h: 0.35,
    fontSize: 13, fontFace: 'Calibri', bold: true, color: COLORS.amber, align: 'center', charSpacing: 2
  });

  slide.addText('Ankita Dutta  ·  Siba Prasad Panda  ·  Nikita Kumari  ·  Anshika Kumari', {
    x: 2.7, y: 4.45, w: 7.93, h: 0.4,
    fontSize: 15, fontFace: 'Calibri', bold: true, color: COLORS.textWhite, align: 'center'
  });

  slide.addText('Bhubaneswar Smart City · Civic Intelligence Hackathon', {
    x: 2.7, y: 4.95, w: 7.93, h: 0.35,
    fontSize: 11, fontFace: 'Calibri', color: COLORS.accent, align: 'center'
  });

  slide.addText('Thank You! · Questions & Discussion', {
    x: 1.0, y: 6.0, w: 11.33, h: 0.5,
    fontSize: 16, fontFace: 'Calibri', bold: true, color: COLORS.green, align: 'center'
  });
}

// Write the presentation to file
const outPathWorkspace = path.resolve(__dirname, 'AGAHI_Presentation_Vision_Zero.pptx');
const outPathDesktop = path.resolve('C:\\Users\\ankit\\Desktop', 'AGAHI_Presentation_Vision_Zero.pptx');

pres.writeFile({ fileName: outPathWorkspace })
  .then(() => {
    console.log('Successfully saved to workspace:', outPathWorkspace);
    // Also copy or write to Desktop
    try {
      fs.copyFileSync(outPathWorkspace, outPathDesktop);
      console.log('Successfully copied to Desktop:', outPathDesktop);
    } catch (err) {
      console.log('Could not write directly to Desktop (permission/sandbox):', err.message);
    }
  })
  .catch(err => {
    console.error('Error generating presentation:', err);
    process.exit(1);
  });
