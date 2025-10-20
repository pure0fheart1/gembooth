/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from 'react'
import useStore from '../lib/store'
import {
  loadCustomModes,
  createCustomMode,
  updateCustomMode,
  deleteCustomMode,
  toggleCustomModeFavorite
} from '../lib/actions-supabase'
import { getUserSubscription } from '../lib/stripe/subscriptionService'
import { supabase } from '../lib/supabase/client'
import '../styles/CustomModeManager.css'

export default function CustomModeManager() {
  const customModes = useStore.use.customModes() || []
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingMode, setEditingMode] = useState(null)
  const [formData, setFormData] = useState({ name: '', emoji: '✨', prompt: '' })
  const [isPremium, setIsPremium] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check if user is premium
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const subscription = await getUserSubscription(user.id)
        const tier = subscription?.tier?.id || 'free'
        setIsPremium(tier === 'premium')
      } catch (error) {
        console.error('Error checking premium status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkPremiumStatus()
    loadCustomModes()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingMode) {
      // Update existing mode
      const result = await updateCustomMode(editingMode.id, formData)
      if (result) {
        setEditingMode(null)
        setFormData({ name: '', emoji: '✨', prompt: '' })
      }
    } else {
      // Create new mode
      const result = await createCustomMode(formData.name, formData.emoji, formData.prompt)
      if (result) {
        setShowCreateForm(false)
        setFormData({ name: '', emoji: '✨', prompt: '' })
      }
    }
  }

  const handleEdit = (mode) => {
    setEditingMode(mode)
    setFormData({
      name: mode.name,
      emoji: mode.emoji,
      prompt: mode.prompt
    })
    setShowCreateForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this custom mode?')) {
      await deleteCustomMode(id)
    }
  }

  const handleCancel = () => {
    setShowCreateForm(false)
    setEditingMode(null)
    setFormData({ name: '', emoji: '✨', prompt: '' })
  }

  if (loading) {
    return (
      <div className="customModeManager">
        <div className="loadingSpinner">Loading...</div>
      </div>
    )
  }

  if (!isPremium) {
    return (
      <div className="customModeManager">
        <div className="premiumRequired">
          <h2>✨ Premium Feature</h2>
          <p>Custom modes are exclusive to Premium subscribers.</p>
          <p>Create and save your own personalized AI transformation modes!</p>
          <a href="/pricing" className="upgradeButton">
            Upgrade to Premium
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="customModeManager">
      <div className="header">
        <h2>My Custom Modes</h2>
        {!showCreateForm && (
          <button
            className="createButton"
            onClick={() => setShowCreateForm(true)}
          >
            + Create Mode
          </button>
        )}
      </div>

      {showCreateForm && (
        <form className="createForm" onSubmit={handleSubmit}>
          <h3>{editingMode ? 'Edit Mode' : 'Create New Mode'}</h3>

          <div className="formGroup">
            <label htmlFor="emoji">Emoji</label>
            <input
              id="emoji"
              type="text"
              value={formData.emoji}
              onChange={(e) => setFormData({ ...formData, emoji: e.target.value })}
              maxLength="2"
              placeholder="✨"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="name">Mode Name *</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength="50"
              placeholder="e.g., Vintage Film"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="prompt">
              AI Prompt *
              <span className="hint">
                Describe how you want photos to be transformed
              </span>
            </label>
            <textarea
              id="prompt"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              maxLength="1000"
              placeholder="Transform the photo into a vintage film style with warm tones, subtle grain, and slightly faded colors reminiscent of 1970s photography..."
              rows="6"
              required
            />
            <div className="charCount">{formData.prompt.length}/1000</div>
          </div>

          <div className="formActions">
            <button type="submit" className="submitButton">
              {editingMode ? 'Update Mode' : 'Create Mode'}
            </button>
            <button type="button" className="cancelButton" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {customModes.length === 0 && !showCreateForm && (
        <div className="emptyState">
          <p>You haven't created any custom modes yet.</p>
          <p>Click "Create Mode" to get started!</p>
        </div>
      )}

      {customModes.length > 0 && (
        <div className="modesList">
          {customModes.map((mode) => (
            <div key={mode.id} className="modeCard">
              <div className="modeHeader">
                <span className="modeEmoji">{mode.emoji}</span>
                <h3 className="modeName">{mode.name}</h3>
                <button
                  className={`favoriteButton ${mode.is_favorite ? 'active' : ''}`}
                  onClick={() => toggleCustomModeFavorite(mode.id)}
                  title={mode.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {mode.is_favorite ? '★' : '☆'}
                </button>
              </div>

              <p className="modePrompt">{mode.prompt}</p>

              <div className="modeActions">
                <button
                  className="editButton"
                  onClick={() => handleEdit(mode)}
                >
                  Edit
                </button>
                <button
                  className="deleteButton"
                  onClick={() => handleDelete(mode.id)}
                >
                  Delete
                </button>
              </div>

              <div className="modeFooter">
                <span className="modeDate">
                  Created {new Date(mode.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
