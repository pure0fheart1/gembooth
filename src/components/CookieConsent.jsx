import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, cannot be disabled
    analytics: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setIsVisible(true);
    } else {
      // Load saved preferences
      try {
        const savedPrefs = JSON.parse(consentGiven);
        setPreferences(savedPrefs);
      } catch (e) {
        // If parsing fails, show banner again
        setIsVisible(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
    };
    savePreferences(allAccepted);
  };

  const handleRejectNonEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
    };
    savePreferences(essentialOnly);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs) => {
    localStorage.setItem('cookieConsent', JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);
    setShowPreferences(false);

    // Initialize or disable analytics based on preference
    if (prefs.analytics) {
      console.log('Analytics enabled');
      // Here you would initialize analytics (Google Analytics, etc.)
      // Example: window.gtag('consent', 'update', { 'analytics_storage': 'granted' });
    } else {
      console.log('Analytics disabled');
      // Example: window.gtag('consent', 'update', { 'analytics_storage': 'denied' });
    }
  };

  const handleTogglePreferences = (key) => {
    if (key === 'essential') return; // Cannot disable essential cookies
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay for preferences modal */}
      {showPreferences && <div style={styles.overlay} onClick={() => setShowPreferences(false)} />}

      {/* Cookie consent banner */}
      <div style={styles.banner}>
        <div style={styles.content}>
          <div style={styles.textSection}>
            <h3 style={styles.title}>🍪 We use cookies</h3>
            <p style={styles.description}>
              We use essential cookies to make our site work. With your consent, we may also use non-essential cookies
              to improve user experience and analyze website traffic. By clicking "Accept All", you agree to our use
              of cookies. For more information, please read our{' '}
              <a href="/privacy" style={styles.link} target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>.
            </p>
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={handleAcceptAll} style={{ ...styles.button, ...styles.acceptButton }}>
              Accept All
            </button>
            <button onClick={handleRejectNonEssential} style={{ ...styles.button, ...styles.rejectButton }}>
              Reject Non-Essential
            </button>
            <button onClick={() => setShowPreferences(true)} style={{ ...styles.button, ...styles.preferencesButton }}>
              Manage Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Cookie Preferences</h3>
            <p style={styles.modalDescription}>
              Customize your cookie preferences below. Essential cookies cannot be disabled as they are necessary for
              the website to function properly.
            </p>

            <div style={styles.cookieCategories}>
              {/* Essential Cookies */}
              <div style={styles.categoryCard}>
                <div style={styles.categoryHeader}>
                  <div>
                    <h4 style={styles.categoryTitle}>Essential Cookies</h4>
                    <p style={styles.categoryDescription}>
                      Required for authentication, security, and basic website functionality. These cookies cannot be disabled.
                    </p>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={preferences.essential}
                      disabled
                      style={styles.switchInput}
                    />
                    <span style={{ ...styles.slider, ...(preferences.essential && styles.sliderChecked), ...styles.sliderDisabled }}></span>
                  </label>
                </div>
                <div style={styles.cookieDetails}>
                  <p style={styles.detailText}>
                    <strong>Examples:</strong> Authentication tokens, session management, security tokens
                  </p>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div style={styles.categoryCard}>
                <div style={styles.categoryHeader}>
                  <div>
                    <h4 style={styles.categoryTitle}>Analytics Cookies</h4>
                    <p style={styles.categoryDescription}>
                      Help us understand how you use the website so we can improve your experience.
                    </p>
                  </div>
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => handleTogglePreferences('analytics')}
                      style={styles.switchInput}
                    />
                    <span style={{ ...styles.slider, ...(preferences.analytics && styles.sliderChecked) }}></span>
                  </label>
                </div>
                <div style={styles.cookieDetails}>
                  <p style={styles.detailText}>
                    <strong>Examples:</strong> Page views, feature usage, performance metrics
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.modalButtons}>
              <button onClick={() => setShowPreferences(false)} style={{ ...styles.button, ...styles.cancelButton }}>
                Cancel
              </button>
              <button onClick={handleSavePreferences} style={{ ...styles.button, ...styles.saveButton }}>
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  banner: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTop: '1px solid #2a2a2a',
    padding: '20px',
    zIndex: 9999,
    boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  },
  textSection: {
    flex: '1 1 400px',
  },
  title: {
    color: '#f3f4f6',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  description: {
    color: '#d1d5db',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
  },
  link: {
    color: '#60a5fa',
    textDecoration: 'underline',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  },
  acceptButton: {
    backgroundColor: '#60a5fa',
    color: '#ffffff',
  },
  rejectButton: {
    backgroundColor: '#374151',
    color: '#e5e7eb',
  },
  preferencesButton: {
    backgroundColor: 'transparent',
    color: '#60a5fa',
    border: '1px solid #60a5fa',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 9998,
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 10000,
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '30px',
    border: '1px solid #2a2a2a',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    color: '#f3f4f6',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  modalDescription: {
    color: '#9ca3af',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  cookieCategories: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  categoryCard: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
    padding: '16px',
  },
  categoryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '12px',
  },
  categoryTitle: {
    color: '#f3f4f6',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  categoryDescription: {
    color: '#9ca3af',
    fontSize: '13px',
    lineHeight: '1.5',
    margin: 0,
  },
  cookieDetails: {
    paddingTop: '12px',
    borderTop: '1px solid #2a2a2a',
  },
  detailText: {
    color: '#9ca3af',
    fontSize: '12px',
    margin: 0,
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '48px',
    height: '24px',
    flexShrink: 0,
  },
  switchInput: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#374151',
    transition: '0.3s',
    borderRadius: '24px',
    '::before': {
      position: 'absolute',
      content: '""',
      height: '18px',
      width: '18px',
      left: '3px',
      bottom: '3px',
      backgroundColor: 'white',
      transition: '0.3s',
      borderRadius: '50%',
    },
  },
  sliderChecked: {
    backgroundColor: '#60a5fa',
    '::before': {
      transform: 'translateX(24px)',
    },
  },
  sliderDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    backgroundColor: '#374151',
    color: '#e5e7eb',
  },
  saveButton: {
    backgroundColor: '#60a5fa',
    color: '#ffffff',
  },
};
