import { useState, useEffect, useRef } from 'react'

/**
 * useLiveLocation
 *
 * Continuously tracks the user's GPS position using
 * navigator.geolocation.watchPosition(). Properly cleans
 * up the watcher on unmount so no watchers are leaked.
 *
 * Returns:
 *   {
 *     latitude   : number | null
 *     longitude  : number | null
 *     accuracy   : number | null   (metres)
 *     loading    : boolean
 *     permission : 'prompt' | 'granted' | 'denied' | 'unavailable'
 *     error      : string | null
 *   }
 */
export default function useLiveLocation() {
  const [state, setState] = useState({
    latitude:   null,
    longitude:  null,
    accuracy:   null,
    loading:    true,
    permission: 'prompt',
    error:      null,
  })

  // Stable ref so cleanup always targets the correct watcher id
  const watcherIdRef = useRef(null)

  useEffect(() => {
    // Guard: Geolocation not supported
    if (!navigator?.geolocation) {
      setState(prev => ({
        ...prev,
        loading:    false,
        permission: 'unavailable',
        error:      'Geolocation is not supported by this browser.',
      }))
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout:            15_000,   // 15 s max wait per fix
      maximumAge:         3_000,    // accept cached fixes up to 3 s old
    }

    const onSuccess = (position) => {
      const { latitude, longitude, accuracy } = position.coords
      setState({
        latitude,
        longitude,
        accuracy,
        loading:    false,
        permission: 'granted',
        error:      null,
      })
    }

    const onError = (err) => {
      let permission = 'unavailable'
      let error      = 'Unable to determine your location.'

      switch (err.code) {
        case err.PERMISSION_DENIED:
          permission = 'denied'
          error      = 'Location permission denied. Please enable it in your browser settings.'
          break
        case err.POSITION_UNAVAILABLE:
          permission = 'unavailable'
          error      = 'GPS signal unavailable. Move to an open area and try again.'
          break
        case err.TIMEOUT:
          permission = 'unavailable'
          error      = 'Location request timed out. Retrying…'
          break
        default:
          break
      }

      setState(prev => ({
        ...prev,
        loading: false,
        permission,
        error,
      }))
    }

    // Start watching — only one watcher ever exists
    watcherIdRef.current = navigator.geolocation.watchPosition(
      onSuccess,
      onError,
      options,
    )

    // Cleanup: always clear the watcher on unmount or re-render
    return () => {
      if (watcherIdRef.current !== null) {
        navigator.geolocation.clearWatch(watcherIdRef.current)
        watcherIdRef.current = null
      }
    }
  }, []) // empty deps — start once, clean up once

  return state
}
