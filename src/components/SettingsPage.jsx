import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase/client'
import '../styles/SettingsPage.css'

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  // Profile state
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: ''
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })

  // Load profile data
  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  async function loadProfile() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      showMessage('Failed to load profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function saveProfile(e) {
    e.preventDefault()
    try {
      setSaving(true)
      setMessage(null)

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      showMessage('Profile updated successfully!', 'success')
    } catch (error) {
      console.error('Error updating profile:', error)
      showMessage(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function changePassword(e) {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('Passwords do not match', 'error')
      return
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('Password must be at least 6 characters', 'error')
      return
    }

    try {
      setSaving(true)
      setMessage(null)

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })

      if (error) throw error

      showMessage('Password updated successfully!', 'success')
      setPasswordData({ newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error updating password:', error)
      showMessage(error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  function requestAccountDeletion() {
    const confirmed = window.confirm(
      '⚠️ Account deletion requires manual verification for security.\n\n' +
      'To delete your account, please email support with:\n' +
      '• Your email: ' + user.email + '\n' +
      '• Request: Delete Account\n\n' +
      'Your account and all data will be permanently deleted within 48 hours.'
    )

    if (confirmed) {
      // Open email client
      const subject = encodeURIComponent('Account Deletion Request')
      const body = encodeURIComponent(
        `I would like to delete my GemBooth account.\n\n` +
        `Email: ${user.email}\n` +
        `User ID: ${user.id}\n\n` +
        `I understand this action is permanent and all my data will be deleted.`
      )
      window.location.href = `mailto:support@gembooth.com?subject=${subject}&body=${body}`
    }
  }

  function showMessage(text, type) {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  if (!user) {
    return (
      <div className="settingsPage">
        <div className="notAuthenticated">
          <h2>Sign In Required</h2>
          <p>Please sign in to access settings.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="settingsPage">
        <div className="loadingContainer">
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="settingsPage">
      <div className="pageHeader">
        <h1>⚙️ Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settingsTabs">
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'account' ? 'active' : ''}
          onClick={() => setActiveTab('account')}
        >
          Account
        </button>
        <button
          className={activeTab === 'privacy' ? 'active' : ''}
          onClick={() => setActiveTab('privacy')}
        >
          Privacy
        </button>
      </div>

      <div className="settingsContent">
        {activeTab === 'profile' && (
          <div className="settingsSection">
            <h2>Profile Information</h2>
            <form onSubmit={saveProfile}>
              <div className="formGroup">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="your-username"
                />
                <small>Your unique username</small>
              </div>

              <div className="formGroup">
                <label htmlFor="full_name">Full Name</label>
                <input
                  id="full_name"
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="John Doe"
                />
                <small>Your display name</small>
              </div>

              <div className="formGroup">
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows="4"
                />
                <small>A short description about you</small>
              </div>

              <div className="formGroup">
                <label htmlFor="avatar_url">Avatar URL</label>
                <input
                  id="avatar_url"
                  type="url"
                  value={profile.avatar_url}
                  onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
                <small>Link to your profile picture</small>
              </div>

              <button type="submit" className="button primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="settingsSection">
            <h2>Account Settings</h2>

            <div className="infoGroup">
              <h3>Email Address</h3>
              <p className="emailDisplay">{user.email}</p>
              <small>Contact support to change your email</small>
            </div>

            <div className="divider" />

            <form onSubmit={changePassword}>
              <h3>Change Password</h3>
              <div className="formGroup">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  minLength="6"
                />
              </div>

              <div className="formGroup">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  minLength="6"
                />
              </div>

              <button type="submit" className="button primary" disabled={saving}>
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </form>

            <div className="divider" />

            <div className="dangerZone">
              <h3>⚠️ Danger Zone</h3>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <p className="dangerNote">For security, account deletion requires manual verification. Click below to contact support.</p>
              <button
                onClick={requestAccountDeletion}
                className="button danger"
              >
                Request Account Deletion
              </button>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="settingsSection">
            <h2>Privacy Settings</h2>

            <div className="infoGroup">
              <h3>Data Privacy</h3>
              <p>Your photos and GIFs are private by default and only visible to you.</p>
              <p>You can make individual photos or GIFs public from the Gallery.</p>
            </div>

            <div className="divider" />

            <div className="infoGroup">
              <h3>Data Storage</h3>
              <p>All your data is securely stored and encrypted:</p>
              <ul className="privacyList">
                <li>✓ Photos stored in secure Supabase storage</li>
                <li>✓ Database encrypted at rest</li>
                <li>✓ SSL/TLS encryption in transit</li>
                <li>✓ Row-level security policies enabled</li>
              </ul>
            </div>

            <div className="divider" />

            <div className="infoGroup">
              <h3>Third-Party Services</h3>
              <p>GemBooth uses the following services:</p>
              <ul className="privacyList">
                <li>• Google Gemini API for AI image processing</li>
                <li>• Supabase for authentication and storage</li>
                <li>• Stripe for payment processing (if applicable)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
