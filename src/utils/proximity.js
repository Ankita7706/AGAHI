import * as turf from '@turf/turf'

/**
 * isInsideSpawn
 *
 * Returns true if the given user location is within
 * the spawn's radius (metres).
 *
 * @param {{ latitude: number, longitude: number }} userLocation
 * @param {{ latitude: number, longitude: number, radius: number }} spawn
 * @returns {boolean}
 */
export function isInsideSpawn(userLocation, spawn) {
  if (
    userLocation == null ||
    userLocation.latitude == null ||
    userLocation.longitude == null ||
    spawn == null ||
    spawn.latitude == null ||
    spawn.longitude == null ||
    typeof spawn.radius !== 'number' ||
    spawn.radius <= 0
  ) {
    return false
  }

  try {
    const userPt  = turf.point([userLocation.longitude, userLocation.latitude])
    const spawnPt = turf.point([spawn.longitude, spawn.latitude])
    const distanceM = turf.distance(userPt, spawnPt, { units: 'meters' })
    return distanceM <= spawn.radius
  } catch (_e) {
    // Malformed coordinates — never treat as inside
    return false
  }
}

/**
 * detectCrossedSpawns
 *
 * Compares previous and current user location against a list of
 * spawn points to find OUTSIDE → INSIDE transitions.
 *
 * Already-claimed spawns are excluded so they are never re-triggered.
 * Only active spawns are considered.
 *
 * State machine per spawn:
 *   first-fix    : record current inside/outside state, never emit
 *   outside → inside  : CROSSING — emit
 *   inside  → inside  : no-op
 *   inside  → outside : record exit, no emit
 *   outside → outside : no-op
 *
 * @param {{ latitude: number, longitude: number } | null} prevLocation
 * @param {{ latitude: number, longitude: number }} currLocation
 * @param {Array<{ id, latitude, longitude, radius, points, active }>} spawns
 * @param {Map<string, boolean>} insideStateMap   — mutable, keyed by spawn.id
 * @param {Set<string>}          claimedSpawnIds  — immutable read, keyed by spawn.id
 * @returns {Array}  spawns whose threshold was just crossed (OUTSIDE → INSIDE)
 */
export function detectCrossedSpawns(
  prevLocation,
  currLocation,
  spawns,
  insideStateMap,
  claimedSpawnIds,
) {
  if (!currLocation || currLocation.latitude == null) return []
  if (!Array.isArray(spawns) || spawns.length === 0) return []

  const crossed = []

  for (const spawn of spawns) {
    // Skip inactive or malformed spawns
    if (!spawn?.active) continue
    if (spawn.id == null) continue

    // Skip already-claimed spawns
    if (claimedSpawnIds.has(String(spawn.id))) continue

    const currInside = isInsideSpawn(currLocation, spawn)
    const spawnKey   = String(spawn.id)

    if (!insideStateMap.has(spawnKey)) {
      // First location fix — establish state, never emit
      insideStateMap.set(spawnKey, currInside)
      continue
    }

    const wasInside = insideStateMap.get(spawnKey)

    // Detect OUTSIDE → INSIDE transition
    if (!wasInside && currInside) {
      crossed.push(spawn)
    }

    // Update state regardless
    insideStateMap.set(spawnKey, currInside)
  }

  return crossed
}
