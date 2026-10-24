/**
 * Offline Audio Cache Service using Browser CacheStorage API.
 * Ensures downloaded audio files are genuinely playable offline without internet connectivity.
 */

const AUDIO_CACHE_NAME = 'rafik_quran_audio_v1';

/**
 * Checks if browser CacheStorage API is available
 */
function isCacheStorageSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window;
}

/**
 * Retrieves a playable URL for an audio resource:
 * If the resource is already stored in offline CacheStorage, returns a local Blob URL.
 * Otherwise returns the original network URL.
 */
export async function getPlayableAudioUrl(url: string): Promise<string> {
  if (!url || !isCacheStorageSupported()) {
    return url;
  }

  try {
    const cache = await window.caches.open(AUDIO_CACHE_NAME);
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      if (blob && blob.size > 1000) {
        return URL.createObjectURL(blob);
      }
    }
  } catch (err) {
    console.warn('CacheStorage lookup error:', err);
  }

  return url;
}

/**
 * Saves an audio file to offline CacheStorage for offline playback
 */
export async function saveAudioToOfflineCache(url: string): Promise<boolean> {
  if (!url || !isCacheStorageSupported()) {
    return false;
  }

  try {
    const cache = await window.caches.open(AUDIO_CACHE_NAME);
    // Check if already cached
    const existing = await cache.match(url);
    if (existing) {
      return true;
    }

    const response = await fetch(url, {
      headers: { Accept: 'audio/*,*/*' },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Failed to download audio for offline: HTTP ${response.status}`);
    }

    await cache.put(url, response.clone());
    return true;
  } catch (err) {
    console.warn('saveAudioToOfflineCache error:', err);
    return false;
  }
}

/**
 * Checks if an audio URL is currently cached offline
 */
export async function isAudioCachedOffline(url: string): Promise<boolean> {
  if (!url || !isCacheStorageSupported()) {
    return false;
  }

  try {
    const cache = await window.caches.open(AUDIO_CACHE_NAME);
    const match = await cache.match(url);
    return Boolean(match);
  } catch {
    return false;
  }
}

/**
 * Removes an audio URL from offline CacheStorage
 */
export async function removeAudioFromOfflineCache(url: string): Promise<boolean> {
  if (!url || !isCacheStorageSupported()) {
    return false;
  }

  try {
    const cache = await window.caches.open(AUDIO_CACHE_NAME);
    return await cache.delete(url);
  } catch {
    return false;
  }
}
