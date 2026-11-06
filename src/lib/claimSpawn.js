/**
 * claimSpawn — Modular claim service
 *
 * Currently runs as a mock (no Supabase configured).
 * The interface is Supabase-ready: swap the body of claimSpawn()
 * with a real Supabase insert and the rest of the app doesn't change.
 *
 * To wire up Supabase:
 *   1. Install:  npm install @supabase/supabase-js
 *   2. Create:   src/lib/supabaseClient.js
 *   3. Replace the mock body below with:
 *        const { error } = await supabase
 *          .from('claims')
 *          .insert({ spawn_id: spawn.id, user_id: currentUserId, points: spawn.points })
 *        if (error) throw error
 *
 * @param {{ id, name, latitude, longitude, radius, points, active }} spawn
 * @returns {Promise<{ success: boolean, spawn: object, claimedAt: string }>}
 */
export async function claimSpawn(spawn) {
  if (!spawn || spawn.id == null) {
    throw new Error('claimSpawn: invalid spawn object')
  }

  // ── MOCK IMPLEMENTATION ──────────────────────────────────────────
  // Simulates a ~200ms network round-trip so the UI flow is realistic.
  // Replace this block with the Supabase call described above.
  await new Promise((resolve) => setTimeout(resolve, 200))

  const result = {
    success:   true,
    spawn,
    claimedAt: new Date().toISOString(),
    // In a real implementation this would include server-assigned fields:
    // id, user_id, session_id, server_timestamp, etc.
  }

  // Console trace for development verification
  if (import.meta.env.DEV) {
    console.log('[I9] Spawn claimed (mock):', result)
  }

  return result
  // ── END MOCK ─────────────────────────────────────────────────────
}
