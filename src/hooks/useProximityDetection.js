import { useEffect, useRef, useCallback } from 'react'
import { detectCrossedSpawns } from '../utils/proximity.js'

/**
 * useProximityDetection
 *
 * Watches the user's location against a list of spawn points and
 * fires onPointCrossed(spawn) exactly once per OUTSIDE → INSIDE
 * transition per session.
 *
 * Usage:
 *   useProximityDetection({ location, spawns, onPointCrossed })
 *
 * @param {object} params
 * @param {{ latitude, longitude, accuracy, loading, permission, error }} params.location
 * @param {Array<{ id, name, latitude, longitude, radius, points, active }>} params.spawns
 * @param {function(spawn): void} params.onPointCrossed
 */
export default function useProximityDetection({ location, spawns, onPointCrossed }) {
  // Tracks which spawns the user is currently inside (persists across renders)
  const insideStateMapRef  = useRef(new Map())

  // Tracks which spawns have been claimed in this session (persists across renders)
  const claimedSpawnIdsRef = useRef(new Set())

  // Previous location for transition detection
  const prevLocationRef    = useRef(null)

  // Stable callback ref — avoids stale closure without re-subscribing the effect
  const callbackRef = useRef(onPointCrossed)
  useEffect(() => { callbackRef.current = onPointCrossed }, [onPointCrossed])

  /**
   * Exposed: mark a spawn as claimed so detection skips it going forward.
   * Call this immediately after claimSpawn() succeeds.
   */
  const markClaimed = useCallback((spawnId) => {
    claimedSpawnIdsRef.current.add(String(spawnId))
  }, [])

  useEffect(() => {
    // Skip if location is not ready
    if (
      !location ||
      location.latitude  == null ||
      location.longitude == null ||
      location.loading
    ) return

    const currLocation = {
      latitude:  location.latitude,
      longitude: location.longitude,
    }

    const crossed = detectCrossedSpawns(
      prevLocationRef.current,
      currLocation,
      spawns ?? [],
      insideStateMapRef.current,
      claimedSpawnIdsRef.current,
    )

    // Fire callback for each newly-crossed spawn
    for (const spawn of crossed) {
      // Double-guard: do not claim if already marked during this same batch
      if (!claimedSpawnIdsRef.current.has(String(spawn.id))) {
        // Optimistically mark claimed before the async claim completes
        // to prevent a second crossing event sneaking through
        claimedSpawnIdsRef.current.add(String(spawn.id))
        callbackRef.current?.(spawn)
      }
    }

    prevLocationRef.current = currLocation
  }, [location, spawns])

  return { markClaimed, claimedSpawnIds: claimedSpawnIdsRef.current }
}
