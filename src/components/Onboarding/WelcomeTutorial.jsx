/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { useState, useEffect } from 'react'
import './WelcomeTutorial.css'

const steps = [
  {
    title: 'Welcome to GemBooth! 🎨',
    description: 'Transform your photos with AI magic. Turn yourself into a Renaissance painting, a cartoon character, or anything you can imagine!',
    emoji: '✨'
  },
  {
    title: 'Choose Your Effect 🎭',
    description: 'Select from 22 amazing AI filters - from Film Noir to Cyberpunk, Zombie to Watercolor. Or create your own custom prompt!',
    emoji: '🖼️'
  },
  {
    title: 'Capture & Transform 📸',
    description: 'Click the camera button to snap a photo. Our AI will transform it in seconds using Google Gemini.',
    emoji: '🤖'
  },
  {
    title: 'Create Animated GIFs 🎬',
    description: 'Make GIFs from your transformations to share on social media. Show your friends the magic!',
    emoji: '🎉'
  }
]

export default function WelcomeTutorial({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial) {
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleComplete = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setIsVisible(false)
    if (onComplete) {
      onComplete()
    }
  }

  if (!isVisible) {
    return null
  }

  const currentStepData = steps[currentStep]

  return (
    <div className="tutorialOverlay" onClick={handleSkip}>
      <div className="tutorialModal" onClick={(e) => e.stopPropagation()}>
        <button className="tutorialClose" onClick={handleSkip} aria-label="Close tutorial">
          ✕
        </button>

        <div className="tutorialContent">
          <div className="tutorialEmoji">{currentStepData.emoji}</div>
          <h2>{currentStepData.title}</h2>
          <p>{currentStepData.description}</p>
        </div>

        <div className="tutorialProgress">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`tutorialDot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              onClick={() => setCurrentStep(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>

        <div className="tutorialActions">
          <button
            className="tutorialBtn secondary"
            onClick={handleSkip}
          >
            Skip
          </button>
          <div className="tutorialNav">
            {currentStep > 0 && (
              <button className="tutorialBtn" onClick={handlePrev}>
                ← Back
              </button>
            )}
            <button className="tutorialBtn primary" onClick={handleNext}>
              {currentStep === steps.length - 1 ? "Let's Go! 🚀" : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
