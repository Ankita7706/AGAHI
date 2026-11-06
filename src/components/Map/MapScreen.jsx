import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import useLiveLocation from '../../hooks/useLiveLocation.js'
import useProximityDetection from '../../hooks/useProximityDetection.js'
import { claimSpawn } from '../../lib/claimSpawn.js'
import UserLocationMarker from './UserLocationMarker.jsx'
import ClaimToast from './ClaimToast.jsx'
import LocationStatusMessage from './LocationStatusMessage.jsx'

/* ─────────────────────────────────────────────────────────────────
   MOCK SPAWN DATA
   Replace with real data from Supabase / your admin system.
   Spawns are centred near a generic campus quad at ~37.775° N, 122.418° W
   (adjust to match your actual campus).
───────────────────────────────────────────────────────────────── */
const MOCK_SPAWNS = [
  {
    id:        'spawn-001',
    name:      'Main Quad',
    latitude:  37.7752,
    longitude: -122.4195,
    radius:    40,    // metres
    points:    50,
    active:    true,
  },
  {
    id:        'spawn-002',
    name:      'Library Steps',
    latitude:  37.7748,
    longitude: -122.4182,
    radius:    30,
    points:    75,
    active:    true,
  },
  {
    id:        'spawn-003',
    name:      'Science Hall',
    latitude:  37.7760,
    longitude: -122.4210,
    radius:    35,
    points:    60,
    active:    false, // inactive — should be ignored
  },
  {
    id:        'spawn-004',
    name:      'Student Union',
    latitude:  37.7742,
    longitude: -122.4200,
    radius:    50,
    points:    100,
    active:    true,
  },
]

/* ─────────────────────────────────────────────────────────────────
   MAP VIEWPORT — 375 × 812 mobile (scales responsively)
───────────────────────────────────────────────────────────────── */
const MAP_W = 375
const MAP_H = 580  // map area height; rest is header + bottom bar

/* ─────────────────────────────────────────────────────────────────
   Spawn Pin SVG component
───────────────────────────────────────────────────────────────── */
function SpawnPin({ spawn, claimed }) {
  const fill   = claimed ? '#8A7A6D' : '#B5471B'
  const fillBg = claimed ? '#EDE1D3' : '#FBEEE1'

  return (
    <g className="spawn-pin-wrap" aria-label={`${spawn.name} — ${spawn.points} pts`}>
      {/* Radius circle */}
      <circle
        r={spawn.radius * 0.55}
        fill={fill}
        opacity={claimed ? 0.08 : 0.18}
        stroke={fill}
        strokeWidth={1}
        strokeDasharray="4 3"
      />
      {/* Pin shadow */}
      <ellipse cx={0} cy={16} rx={5} ry={2.5} fill="rgba(26,19,16,0.12)" />
      {/* Pin body */}
      <path
        d={`M0,-14 C-7,-14 -7,-5 -7,0 C-7,7 0,14 0,14 C0,14 7,7 7,0 C7,-5 7,-14 0,-14 Z`}
        fill={fillBg}
        stroke={fill}
        strokeWidth={1.5}
      />
      {/* Pin inner dot */}
      <circle cy={-3} r={4} fill={fill} />
      {/* Points badge */}
      <g transform="translate(0, -22)">
        <rect
          x={-16} y={-9} width={32} height={16}
          rx={8}
          fill={claimed ? '#EDE1D3' : '#B5471B'}
        />
        <text
          textAnchor="middle"
          dy="0.35em"
          fill={claimed ? '#8A7A6D' : '#FFFCF6'}
          fontSize={9}
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight={700}
        >
          {claimed ? '✓' : `+${spawn.points}`}
        </text>
      </g>
    </g>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Score Pill
───────────────────────────────────────────────────────────────── */
function ScorePill({ score }) {
  return (
    <div
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          '6px',
        background:   '#FFFCF6',
        border:       '1.5px solid #EDE1D3',
        borderRadius: '9999px',
        padding:      '6px 14px',
        boxShadow:    '0 2px 8px rgba(26,19,16,0.08)',
      }}
    >
      <span style={{ fontSize: '14px' }}>⭐</span>
      <span
        style={{
          fontFamily:    "'Space Grotesk', sans-serif",
          fontWeight:    700,
          fontSize:      '14px',
          color:         '#B5471B',
          letterSpacing: '-0.02em',
        }}
      >
        {score} pts
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MAIN MAP SCREEN
───────────────────────────────────────────────────────────────── */
export default function MapScreen() {
  const location = useLiveLocation()

  // Claimed spawn IDs for session (separate from detection hook's internal set
  // so we can render claimed state on pins)
  const [claimedIds, setClaimedIds] = useState(new Set())
  const [totalScore,  setTotalScore]  = useState(0)

  // Toast state — only one toast at a time per claim
  const [toast, setToast] = useState(null)

  // Handle a spawn being crossed
  const handlePointCrossed = useCallback(async (spawn) => {
    try {
      await claimSpawn(spawn)
      setClaimedIds(prev => new Set([...prev, String(spawn.id)]))
      setTotalScore(prev => prev + (spawn.points ?? 0))
      setToast(spawn)
    } catch (err) {
      console.error('[I9] Claim failed:', err)
    }
  }, [])

  useProximityDetection({
    location,
    spawns: MOCK_SPAWNS,
    onPointCrossed: handlePointCrossed,
  })

  // ── D3 Projection ───────────────────────────────────────────────
  // Mercator projection centred on the campus cluster
  const projection = useMemo(() => {
    const lngs = MOCK_SPAWNS.map(s => s.longitude)
    const lats = MOCK_SPAWNS.map(s => s.latitude)
    const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2

    return d3.geoMercator()
      .center([centerLng, centerLat])
      .scale(200_000)
      .translate([MAP_W / 2, MAP_H / 2])
  }, [])

  // Rough pixels-per-metre for accuracy ring scaling at this zoom
  // D3 Mercator: scale / (Earth radius in metres) ≈ pixels/metre at equator
  const PIXELS_PER_METRE = projection.scale() / 6_378_137

  // ── Status overlay logic ─────────────────────────────────────────
  const activeSpawns = MOCK_SPAWNS.filter(s => s.active)
  const hasActiveSpawns = activeSpawns.length > 0

  let statusType = null
  if (location.permission === 'denied') statusType = 'denied'
  else if (location.permission === 'unavailable') statusType = 'unavailable'
  else if (!hasActiveSpawns) statusType = 'no-spawns'

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div
      style={{
        width:          '100%',
        height:         '100dvh',
        maxWidth:       '480px',
        margin:         '0 auto',
        display:        'flex',
        flexDirection:  'column',
        background:     '#FBF6EE',
        position:       'relative',
        overflow:       'hidden',
      }}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <header
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '16px 20px 12px',
          background:     '#FFFCF6',
          borderBottom:   '1px solid #EDE1D3',
          boxShadow:      '0 1px 8px rgba(26,19,16,0.06)',
          zIndex:         10,
          flexShrink:     0,
        }}
      >
        <div>
          <h1
            className="i9-heading"
            style={{ fontSize: '20px', margin: 0, letterSpacing: '-0.03em' }}
          >
            I9
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '11px',
              color:      '#8A7A6D',
              margin:     '2px 0 0',
            }}
          >
            {activeSpawns.length} active spawn{activeSpawns.length !== 1 ? 's' : ''}
          </p>
        </div>
        <ScorePill score={totalScore} />
      </header>

      {/* ── Map area ────────────────────────────────────────────── */}
      <div
        style={{
          flex:     '1 1 0',
          position: 'relative',
          overflow: 'hidden',
          background: '#EDE1D3',
        }}
      >
        {/* Campus SVG map */}
        <svg
          className="i9-map-svg"
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-label="I9 campus map"
        >
          {/* ── Background tiles (schematic grid) ────────────── */}
          <rect width={MAP_W} height={MAP_H} fill="#E8DDD0" />

          {/* Stylised campus paths / blocks */}
          <CampusSchematic projection={projection} />

          {/* ── Spawn radius circles ─────────────────────────── */}
          {MOCK_SPAWNS.filter(s => s.active).map(spawn => {
            const pt = projection([spawn.longitude, spawn.latitude])
            if (!pt) return null
            return (
              <circle
                key={`radius-${spawn.id}`}
                cx={pt[0]}
                cy={pt[1]}
                r={spawn.radius * PIXELS_PER_METRE}
                fill="rgba(181,71,27,0.06)"
                stroke="rgba(181,71,27,0.20)"
                strokeWidth={1}
                strokeDasharray="5 4"
              />
            )
          })}

          {/* ── Spawn pins ───────────────────────────────────── */}
          {MOCK_SPAWNS.filter(s => s.active).map(spawn => {
            const pt = projection([spawn.longitude, spawn.latitude])
            if (!pt) return null
            return (
              <g key={`pin-${spawn.id}`} transform={`translate(${pt[0]}, ${pt[1]})`}>
                <SpawnPin
                  spawn={spawn}
                  claimed={claimedIds.has(String(spawn.id))}
                />
              </g>
            )
          })}

          {/* ── User location marker ─────────────────────────── */}
          <UserLocationMarker
            latitude={location.latitude}
            longitude={location.longitude}
            accuracy={location.accuracy}
            project={projection}
            mapScale={PIXELS_PER_METRE}
          />
        </svg>

        {/* ── Status overlay ───────────────────────────────────── */}
        {location.loading && !statusType && (
          <LocationStatusMessage type="loading" />
        )}
        {statusType && (
          <LocationStatusMessage type={statusType} />
        )}

        {/* ── Claim toast ──────────────────────────────────────── */}
        {toast && (
          <ClaimToast
            spawn={toast}
            onDismiss={() => setToast(null)}
            duration={3200}
          />
        )}
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────── */}
      <nav
        aria-label="I9 navigation"
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-around',
          padding:        '10px 0 20px',
          background:     '#FFFCF6',
          borderTop:      '1px solid #EDE1D3',
          boxShadow:      '0 -1px 8px rgba(26,19,16,0.06)',
          flexShrink:     0,
        }}
      >
        <NavItem icon="🗺️" label="Map"    active />
        <NavItem icon="🏆" label="Ranks"  active={false} />
        <NavItem icon="👤" label="Profile" active={false} />
      </nav>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   NavItem
───────────────────────────────────────────────────────────────── */
function NavItem({ icon, label, active }) {
  return (
    <button
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '3px',
        background:     'none',
        border:         'none',
        cursor:         'pointer',
        padding:        '6px 20px',
        borderRadius:   '12px',
        transition:     'background 0.15s ease',
      }}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
    >
      <span style={{ fontSize: '22px', lineHeight: 1 }}>{icon}</span>
      <span
        style={{
          fontFamily:  "'Inter', sans-serif",
          fontSize:    '10px',
          fontWeight:  active ? 700 : 400,
          color:       active ? '#B5471B' : '#8A7A6D',
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </span>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────────
   CampusSchematic
   Purely decorative SVG campus map schematic — blocks + paths.
   Rendered via the same D3 projection so everything lines up.
───────────────────────────────────────────────────────────────── */
function CampusSchematic({ projection }) {
  // Derive bounding box in SVG space from spawn cluster
  const pts = MOCK_SPAWNS.map(s => projection([s.longitude, s.latitude])).filter(Boolean)
  if (pts.length === 0) return null

  const xs = pts.map(p => p[0])
  const ys = pts.map(p => p[1])
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2

  const W = MAP_W, H = MAP_H

  return (
    <g aria-hidden="true">
      {/* Ground fill */}
      <rect x={0} y={0} width={W} height={H} fill="#EDE1D3" />

      {/* Path / road grid */}
      <line x1={0} y1={cy} x2={W} y2={cy} stroke="#D6CAB8" strokeWidth={18} />
      <line x1={cx} y1={0} x2={cx} y2={H} stroke="#D6CAB8" strokeWidth={18} />

      {/* Diagonal path */}
      <line x1={cx - 80} y1={cy - 80} x2={cx + 80} y2={cy + 80}
        stroke="#D6CAB8" strokeWidth={10} />

      {/* Building blocks */}
      {[
        [cx - 110, cy - 120, 80, 60],
        [cx + 40,  cy - 100, 70, 50],
        [cx - 90,  cy + 50,  60, 55],
        [cx + 55,  cy + 40,  75, 60],
        [cx - 20,  cy - 160, 90, 40],
      ].map(([x, y, w, h], i) => (
        <rect
          key={i}
          x={x} y={y} width={w} height={h}
          rx={4}
          fill="#D9CEBC"
          stroke="#C8BAA5"
          strokeWidth={1}
        />
      ))}

      {/* Central quad lawn */}
      <ellipse cx={cx} cy={cy} rx={50} ry={35} fill="#C9DBA8" opacity={0.55} />
      <ellipse cx={cx} cy={cy} rx={38} ry={25} fill="#B8CE96" opacity={0.55} />

      {/* Pavement centre mark */}
      <circle cx={cx} cy={cy} r={6} fill="#C8BAA5" />
    </g>
  )
}
