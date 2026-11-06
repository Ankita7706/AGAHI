import React from 'react'

/**
 * UserLocationMarker
 *
 * Renders the live GPS position as an SVG group element inside the
 * campus map. Uses the D3 projection function to convert lat/lng
 * to SVG pixel coordinates.
 *
 * Required CSS classes (defined in index.css):
 *   .user-dot-wrap  — outer container
 *   .user-ring      — accuracy circle
 *   .user-dot       — core position dot
 *
 * Props:
 *   latitude  {number}            — current GPS latitude
 *   longitude {number}            — current GPS longitude
 *   accuracy  {number}            — GPS accuracy in metres
 *   project   {function}          — D3 projection: ([lng, lat]) => [x, y]
 *   mapScale  {number}            — pixels-per-metre at current zoom (for accuracy ring)
 */
export default function UserLocationMarker({
  latitude,
  longitude,
  accuracy,
  project,
  mapScale = 1,
}) {
  // Guard: don't render until we have a valid fix and projection
  if (
    latitude  == null ||
    longitude == null ||
    typeof project !== 'function'
  ) return null

  let svgCoords
  try {
    svgCoords = project([longitude, latitude])
  } catch (_e) {
    return null
  }

  if (!svgCoords || svgCoords.some(isNaN)) return null

  const [x, y] = svgCoords

  // Convert GPS accuracy (metres) to SVG pixels.
  // mapScale should be provided by the parent as pixels-per-metre.
  // Clamp between 20px and 200px for visual sanity.
  const accuracyPx = accuracy != null
    ? Math.max(20, Math.min(200, accuracy * mapScale))
    : 40

  return (
    <g
      className="user-dot-wrap"
      transform={`translate(${x}, ${y})`}
      aria-label="Your location"
    >
      {/* Accuracy ring */}
      <circle
        className="user-ring"
        cx={0}
        cy={0}
        r={accuracyPx / 2}
        fill="rgba(181,71,27,0.10)"
        stroke="rgba(181,71,27,0.25)"
        strokeWidth={1.5}
        style={{ transition: 'r 0.6s ease' }}
      />

      {/* Outer glow ring */}
      <circle
        cx={0}
        cy={0}
        r={10}
        fill="rgba(181,71,27,0.15)"
        style={{ animation: 'i9-pulse 2.2s ease-in-out infinite' }}
      />

      {/* Core dot */}
      <circle
        className="user-dot"
        cx={0}
        cy={0}
        r={6}
        fill="#B5471B"
        stroke="#FFFCF6"
        strokeWidth={2.5}
      />
    </g>
  )
}
