import React from 'react'

/* ── Icon helpers ─────────────────────────────────────────────── */

function GpsIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#FBEEE1" />
      <circle cx="20" cy="20" r="7" stroke="#B5471B" strokeWidth="2.5" fill="none" />
      <line x1="20" y1="4"  x2="20" y2="11" stroke="#B5471B" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="29" x2="20" y2="36" stroke="#B5471B" strokeWidth="2" strokeLinecap="round" />
      <line x1="4"  y1="20" x2="11" y2="20" stroke="#B5471B" strokeWidth="2" strokeLinecap="round" />
      <line x1="29" y1="20" x2="36" y2="20" stroke="#B5471B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#FBEEE1" />
      <path
        d="M20 10C16.13 10 13 13.13 13 17C13 22.25 20 30 20 30C20 30 27 22.25 27 17C27 13.13 23.87 10 20 10Z"
        fill="#B5471B"
        opacity="0.25"
      />
      <path
        d="M20 9C15.58 9 12 12.58 12 17C12 23 20 31 20 31C20 31 28 23 28 17C28 12.58 24.42 9 20 9Z"
        stroke="#B5471B"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="20" cy="17" r="3" fill="#B5471B" />
    </svg>
  )
}

function ErrorIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="18" fill="#FBEEE1" />
      <path d="M20 13V22" stroke="#B5471B" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="20" cy="27" r="1.5" fill="#B5471B" />
    </svg>
  )
}

/* ── LocationStatusMessage ────────────────────────────────────── */

/**
 * LocationStatusMessage
 *
 * Renders a full-screen overlay for:
 *   - 'denied'      — GPS permission denied, with Open Settings CTA
 *   - 'unavailable' — GPS error / unavailable
 *   - 'no-spawns'   — No active spawn points right now
 *   - 'loading'     — Acquiring location (subtle, not an overlay)
 *
 * Props:
 *   type            {'denied'|'unavailable'|'no-spawns'|'loading'}
 *   nextSpawnLabel  {string|null}  — optional countdown or time label for no-spawns state
 */
export default function LocationStatusMessage({ type, nextSpawnLabel = null }) {
  if (!type) return null

  /* ── Loading (non-blocking) ───────────────────────────────── */
  if (type === 'loading') {
    return (
      <div
        style={{
          position:    'absolute',
          top:         16,
          left:        '50%',
          transform:   'translateX(-50%)',
          zIndex:      60,
          background:  '#FFFCF6',
          border:      '1.5px solid #EDE1D3',
          borderRadius:'9999px',
          padding:     '8px 18px',
          boxShadow:   '0 2px 16px 0 rgba(26,19,16,0.08)',
          display:     'flex',
          alignItems:  'center',
          gap:         '8px',
          fontFamily:  "'Inter', sans-serif",
          fontSize:    '13px',
          fontWeight:  500,
          color:       '#8A7A6D',
          whiteSpace:  'nowrap',
        }}
      >
        <span
          style={{
            width: 10, height: 10,
            borderRadius: '50%',
            background: '#B5471B',
            opacity: 0.7,
            animation: 'i9-pulse 1.4s ease-in-out infinite',
            display: 'inline-block',
          }}
        />
        Acquiring location…
      </div>
    )
  }

  /* ── Full-screen overlays ─────────────────────────────────── */
  const configs = {
    denied: {
      icon:    <GpsIcon />,
      title:   'Location Required',
      body:    'I9 needs your GPS to find nearby spawn points. Please allow location access to play.',
      cta:     'Open Settings',
      onCta:   () => {
        // On mobile browsers there's no programmatic redirect to OS settings,
        // so we open the MDN guide as a fallback for web.
        window.open(
          'https://support.google.com/chrome/answer/142065',
          '_blank',
          'noopener noreferrer',
        )
      },
    },
    unavailable: {
      icon:    <ErrorIcon />,
      title:   'GPS Unavailable',
      body:    'Unable to get your location. Move to an open area, ensure GPS is enabled, and try again.',
      cta:     'Retry',
      onCta:   () => window.location.reload(),
    },
    'no-spawns': {
      icon:    <PinIcon />,
      title:   'No Active Spawns',
      body:    'There are no active spawn points right now. New points will appear soon — stay close to campus!',
      cta:     null,
      onCta:   null,
    },
  }

  const cfg = configs[type]
  if (!cfg) return null

  return (
    <div className="i9-status-overlay" role="dialog" aria-modal="false" aria-label={cfg.title}>
      {/* Icon */}
      <div style={{ marginBottom: 20 }}>{cfg.icon}</div>

      {/* Title */}
      <h2
        className="i9-heading"
        style={{
          fontSize:      '20px',
          marginBottom:  '10px',
          letterSpacing: '-0.03em',
        }}
      >
        {cfg.title}
      </h2>

      {/* Body */}
      <p
        style={{
          fontFamily:   "'Inter', sans-serif",
          fontSize:     '14px',
          color:        '#8A7A6D',
          lineHeight:   1.6,
          maxWidth:     '280px',
          marginBottom: cfg.cta ? '24px' : (nextSpawnLabel ? '20px' : '0'),
        }}
      >
        {cfg.body}
      </p>

      {/* Next spawn countdown (no-spawns only) */}
      {type === 'no-spawns' && nextSpawnLabel && (
        <div
          style={{
            background:   '#FBEEE1',
            border:       '1.5px solid #EDE1D3',
            borderRadius: '12px',
            padding:      '12px 20px',
            marginBottom: '0',
            display:      'flex',
            flexDirection:'column',
            alignItems:   'center',
            gap:          '4px',
          }}
        >
          <span
            style={{
              fontFamily:    "'Space Grotesk', sans-serif",
              fontWeight:    700,
              fontSize:      '22px',
              color:         '#B5471B',
              letterSpacing: '-0.03em',
            }}
          >
            {nextSpawnLabel}
          </span>
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:   '12px',
              color:      '#8A7A6D',
            }}
          >
            until next spawn
          </span>
        </div>
      )}

      {/* CTA Button */}
      {cfg.cta && (
        <button
          onClick={cfg.onCta}
          style={{
            fontFamily:    "'Space Grotesk', sans-serif",
            fontWeight:    600,
            fontSize:      '14px',
            color:         '#FFFCF6',
            background:    '#B5471B',
            border:        'none',
            borderRadius:  '9999px',
            padding:       '12px 28px',
            cursor:        'pointer',
            letterSpacing: '-0.01em',
            boxShadow:     '0 2px 12px 0 rgba(181,71,27,0.30)',
            transition:    'background 0.18s ease, transform 0.12s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#E0672A'
            e.currentTarget.style.transform  = 'scale(1.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#B5471B'
            e.currentTarget.style.transform  = 'scale(1)'
          }}
        >
          {cfg.cta}
        </button>
      )}
    </div>
  )
}
