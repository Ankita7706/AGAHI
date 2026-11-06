import React, { useState, useEffect, useRef } from 'react'

/**
 * ClaimToast
 *
 * Displays a temporary "Point claimed, +N pts" notification matching
 * the I9 design system. Auto-dismisses after `duration` ms.
 * Prevents stacking duplicate toasts for the same spawn within a session.
 *
 * Props:
 *   spawn    {object | null}  — the claimed spawn ({ id, name, points })
 *   onDismiss {function}      — called when the toast finishes dismissing
 *   duration  {number}        — display time in ms (default 3000)
 */
export default function ClaimToast({ spawn, onDismiss, duration = 3000 }) {
  const [phase, setPhase] = useState('enter') // 'enter' | 'exit'
  const timerRef = useRef(null)
  const exitTimerRef = useRef(null)

  useEffect(() => {
    if (!spawn) return

    // Start dismiss timer
    timerRef.current = setTimeout(() => {
      setPhase('exit')
      // Wait for exit animation to complete before calling onDismiss
      exitTimerRef.current = setTimeout(() => {
        onDismiss?.()
      }, 280)
    }, duration)

    return () => {
      clearTimeout(timerRef.current)
      clearTimeout(exitTimerRef.current)
    }
  }, [spawn, duration, onDismiss])

  if (!spawn) return null

  const pts = typeof spawn.points === 'number' ? spawn.points : '?'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Point claimed, plus ${pts} points`}
      className={`claim-toast-${phase}`}
      style={{
        position:      'absolute',
        bottom:        '112px',
        left:          '50%',
        transform:     'translateX(-50%)',
        zIndex:        100,
        pointerEvents: 'none',
        userSelect:    'none',
      }}
    >
      <div
        style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '10px',
          background:      '#FFFCF6',
          border:          '1.5px solid #EDE1D3',
          borderRadius:    '9999px',
          padding:         '10px 20px',
          boxShadow:       '0 4px 24px 0 rgba(26,19,16,0.13)',
          whiteSpace:      'nowrap',
        }}
      >
        {/* Icon */}
        <span style={{ fontSize: '18px', lineHeight: 1 }}>📍</span>

        {/* Message */}
        <span
          style={{
            fontFamily:  "'Inter', sans-serif",
            fontWeight:  700,
            fontSize:    '14px',
            color:       '#1A1310',
            letterSpacing: '-0.01em',
          }}
        >
          Point claimed,&nbsp;
          <span style={{ color: '#B5471B' }}>+{pts} pts</span>
        </span>

        {/* Spawn name pill */}
        {spawn.name && (
          <span
            style={{
              fontFamily:    "'Inter', sans-serif",
              fontWeight:    500,
              fontSize:      '12px',
              color:         '#8A7A6D',
              background:    '#FBEEE1',
              borderRadius:  '9999px',
              padding:       '2px 10px',
              letterSpacing: '-0.01em',
            }}
          >
            {spawn.name}
          </span>
        )}
      </div>
    </div>
  )
}
