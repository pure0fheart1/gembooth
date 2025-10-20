/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { supabase } from './supabase/client'

const STORAGE_KEY = 'gembooth_favorite_modes'

/**
 * Get favorite modes from localStorage
 */
export function getFavoritesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading favorites from localStorage:', error)
    return []
  }
}

/**
 * Save favorite modes to localStorage
 */
export function saveFavoritesToStorage(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error)
  }
}

/**
 * Get favorite modes from Supabase for authenticated user
 */
export async function getFavoritesFromSupabase() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('favorite_modes')
      .eq('id', user.id)
      .maybeSingle()

    if (error) throw error

    return data?.favorite_modes || []
  } catch (error) {
    console.error('Error fetching favorites from Supabase:', error)
    return null
  }
}

/**
 * Save favorite modes to Supabase for authenticated user
 */
export async function saveFavoritesToSupabase(favorites) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { error } = await supabase
      .from('profiles')
      .update({ favorite_modes: favorites })
      .eq('id', user.id)

    if (error) throw error

    return true
  } catch (error) {
    console.error('Error saving favorites to Supabase:', error)
    return false
  }
}

/**
 * Load favorites - tries Supabase first, falls back to localStorage
 */
export async function loadFavorites() {
  const supabaseFavorites = await getFavoritesFromSupabase()

  if (supabaseFavorites !== null) {
    // If user is logged in and has favorites in Supabase, use those
    // Also sync to localStorage for offline access
    saveFavoritesToStorage(supabaseFavorites)
    return supabaseFavorites
  }

  // Fall back to localStorage for non-authenticated users
  return getFavoritesFromStorage()
}

/**
 * Get all favorite modes (convenience function)
 */
export async function getFavorites() {
  return await loadFavorites()
}

/**
 * Check if a mode is favorited
 */
export function isFavorite(modeKey, favorites) {
  return favorites.includes(modeKey)
}

/**
 * Add a mode to favorites
 */
export async function addFavorite(modeKey) {
  const favorites = await loadFavorites()

  if (favorites.includes(modeKey)) {
    return favorites // Already favorited
  }

  const updatedFavorites = [...favorites, modeKey]

  // Save to both storage locations
  saveFavoritesToStorage(updatedFavorites)
  await saveFavoritesToSupabase(updatedFavorites)

  return updatedFavorites
}

/**
 * Remove a mode from favorites
 */
export async function removeFavorite(modeKey) {
  const favorites = await loadFavorites()
  const updatedFavorites = favorites.filter(key => key !== modeKey)

  // Save to both storage locations
  saveFavoritesToStorage(updatedFavorites)
  await saveFavoritesToSupabase(updatedFavorites)

  return updatedFavorites
}

/**
 * Toggle favorite status for a mode
 */
export async function toggleFavorite(modeKey) {
  const favorites = await loadFavorites()

  if (favorites.includes(modeKey)) {
    return await removeFavorite(modeKey)
  } else {
    return await addFavorite(modeKey)
  }
}
