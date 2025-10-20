/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react'
import modes from '../../lib/modes'

// Example transformations - these would be real images in production
const EXAMPLE_PHOTOS = [
  {
    id: 1,
    mode: 'renaissance',
    before: '/examples/before-1.jpg',
    after: '/examples/after-renaissance.jpg',
    alt: 'Renaissance transformation example'
  },
  {
    id: 2,
    mode: 'cartoon',
    before: '/examples/before-2.jpg',
    after: '/examples/after-cartoon.jpg',
    alt: 'Cartoon transformation example'
  },
  {
    id: 3,
    mode: 'anime',
    before: '/examples/before-3.jpg',
    after: '/examples/after-anime.jpg',
    alt: 'Anime transformation example'
  },
  {
    id: 4,
    mode: 'psychedelic',
    before: '/examples/before-4.jpg',
    after: '/examples/after-psychedelic.jpg',
    alt: 'Psychedelic transformation example'
  },
  {
    id: 5,
    mode: '8bit',
    before: '/examples/before-5.jpg',
    after: '/examples/after-8bit.jpg',
    alt: '8-bit transformation example'
  },
  {
    id: 6,
    mode: 'statue',
    before: '/examples/before-6.jpg',
    after: '/examples/after-statue.jpg',
    alt: 'Statue transformation example'
  }
]

function ExampleCard({ example, onImageError }) {
  const [showAfter, setShowAfter] = useState(false)
  const mode = modes[example.mode]

  return (
    <div
      className="exampleCard"
      onMouseEnter={() => setShowAfter(true)}
      onMouseLeave={() => setShowAfter(false)}
      onClick={() => setShowAfter(!showAfter)}
    >
      <div className="exampleImageContainer">
        <div className={`exampleImage before ${showAfter ? 'hidden' : ''}`}>
          <img
            src={example.before}
            alt={`Before ${mode.name} transformation`}
            onError={onImageError}
          />
          <div className="exampleLabel">Before</div>
        </div>
        <div className={`exampleImage after ${showAfter ? 'visible' : ''}`}>
          <img
            src={example.after}
            alt={`After ${mode.name} transformation`}
            onError={onImageError}
          />
          <div className="exampleLabel">After</div>
        </div>
      </div>
      <div className="exampleMode">
        <span className="modeEmoji">{mode.emoji}</span>
        <span className="modeName">{mode.name}</span>
      </div>
    </div>
  )
}

function PlaceholderCard({ example }) {
  const mode = modes[example.mode]

  return (
    <div className="exampleCard placeholder">
      <div className="exampleImageContainer">
        <div className="placeholderContent">
          <div className="placeholderIcon">{mode.emoji}</div>
          <div className="placeholderText">
            <h4>{mode.name}</h4>
            <p>{mode.prompt.slice(0, 80)}...</p>
          </div>
        </div>
      </div>
      <div className="exampleMode">
        <span className="modeEmoji">{mode.emoji}</span>
        <span className="modeName">{mode.name}</span>
      </div>
    </div>
  )
}

export default function ExampleGallery({ onStartDemo, onSignUp }) {
  const [imagesLoaded, setImagesLoaded] = useState(true)

  const handleImageError = () => {
    setImagesLoaded(false)
  }

  return (
    <div className="exampleGallery">
      <div className="galleryHeader">
        <h1>
          <span className="headerEmoji">📸</span> GemBooth
        </h1>
        <p className="galleryTagline">Transform your photos with AI magic</p>
        <p className="galleryDescription">
          Choose from 20+ artistic effects. From Renaissance paintings to 8-bit pixel art,
          turn any selfie into a masterpiece in seconds.
        </p>
      </div>

      <div className="galleryGrid">
        {EXAMPLE_PHOTOS.map((example) =>
          imagesLoaded ? (
            <ExampleCard
              key={example.id}
              example={example}
              onImageError={handleImageError}
            />
          ) : (
            <PlaceholderCard key={example.id} example={example} />
          )
        )}
      </div>

      <div className="galleryCTA">
        <button className="button primary large" onClick={onStartDemo}>
          <span className="icon">camera</span>
          Try It Now - Free!
        </button>
        <button className="button secondary large" onClick={onSignUp}>
          <span className="icon">person_add</span>
          Sign Up to Save
        </button>
      </div>

      <div className="galleryFeatures">
        <div className="feature">
          <span className="featureIcon">⚡</span>
          <h3>Instant Results</h3>
          <p>Transform photos in seconds with cutting-edge AI</p>
        </div>
        <div className="feature">
          <span className="featureIcon">🎨</span>
          <h3>20+ Effects</h3>
          <p>From classic art to futuristic styles</p>
        </div>
        <div className="feature">
          <span className="featureIcon">📱</span>
          <h3>Works Anywhere</h3>
          <p>Desktop, mobile, tablet - take your booth anywhere</p>
        </div>
        <div className="feature">
          <span className="featureIcon">🎁</span>
          <h3>Free to Start</h3>
          <p>Try unlimited transformations before you sign up</p>
        </div>
      </div>

      <div className="galleryFooter">
        <p>No credit card required. No installation needed. Just pure creative fun.</p>
      </div>
    </div>
  )
}
