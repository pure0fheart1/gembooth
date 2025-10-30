/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartScreen from './StartScreen';
import Canvas from './Canvas';
import WardrobePanel from './WardrobePanel';
import OutfitStack from './OutfitStack';
import { generateVirtualTryOnImage, generatePoseVariation } from '../../lib/fitCheck/fitCheckService';
import { ChevronDownIcon, ChevronUpIcon } from './icons';
import { defaultWardrobe } from '../../lib/fitCheck/wardrobeData';
import Footer from './Footer';
import { getFriendlyErrorMessage } from '../../lib/fitCheck/utils';
import Spinner from './Spinner';
import { useAuth } from '../../contexts/AuthContext';
import { checkUsageLimit, incrementUsage } from '../../lib/usageTracking';
import { useNavigate } from 'react-router-dom';
import '../../styles/FitCheck.css';

const POSE_INSTRUCTIONS = [
  "Full frontal view, hands on hips",
  "Slightly turned, 3/4 view",
  "Side profile view",
  "Jumping in the air, mid-action shot",
  "Walking towards camera",
  "Leaning against a wall",
];

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  React.useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = (event) => setMatches(event.matches);
    mediaQueryList.addEventListener('change', listener);
    if (mediaQueryList.matches !== matches) {
      setMatches(mediaQueryList.matches);
    }
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query, matches]);

  return matches;
};

const FitCheckApp = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [modelImageUrl, setModelImageUrl] = useState(null);
  const [outfitHistory, setOutfitHistory] = useState([]);
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [wardrobe, setWardrobe] = useState(defaultWardrobe);
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const activeOutfitLayers = useMemo(() =>
    outfitHistory.slice(0, currentOutfitIndex + 1),
    [outfitHistory, currentOutfitIndex]
  );

  const activeGarmentIds = useMemo(() =>
    activeOutfitLayers.map(layer => layer.garment?.id).filter(Boolean),
    [activeOutfitLayers]
  );

  const displayImageUrl = useMemo(() => {
    if (outfitHistory.length === 0) return modelImageUrl;
    const currentLayer = outfitHistory[currentOutfitIndex];
    if (!currentLayer) return modelImageUrl;

    const poseInstruction = POSE_INSTRUCTIONS[currentPoseIndex];
    return currentLayer.poseImages[poseInstruction] ?? Object.values(currentLayer.poseImages)[0];
  }, [outfitHistory, currentOutfitIndex, currentPoseIndex, modelImageUrl]);

  const availablePoseKeys = useMemo(() => {
    if (outfitHistory.length === 0) return [];
    const currentLayer = outfitHistory[currentOutfitIndex];
    return currentLayer ? Object.keys(currentLayer.poseImages) : [];
  }, [outfitHistory, currentOutfitIndex]);

  const handleModelFinalized = (url) => {
    setModelImageUrl(url);
    setOutfitHistory([{
      garment: null,
      poseImages: { [POSE_INSTRUCTIONS[0]]: url }
    }]);
    setCurrentOutfitIndex(0);
  };

  const handleStartOver = () => {
    setModelImageUrl(null);
    setOutfitHistory([]);
    setCurrentOutfitIndex(0);
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setCurrentPoseIndex(0);
    setIsSheetCollapsed(false);
    setWardrobe(defaultWardrobe);
  };

  const handleGarmentSelect = useCallback(async (garmentFile, garmentInfo) => {
    if (!displayImageUrl || isLoading) return;

    // Check if user has authenticated
    if (!user) {
      setError('Please log in to use FitCheck');
      return;
    }

    const nextLayer = outfitHistory[currentOutfitIndex + 1];
    if (nextLayer && nextLayer.garment?.id === garmentInfo.id) {
      setCurrentOutfitIndex(prev => prev + 1);
      setCurrentPoseIndex(0);
      return;
    }

    // Check usage limit before proceeding
    const usageCheck = await checkUsageLimit(user.id, 'fitcheck');
    if (!usageCheck.allowed) {
      setError(usageCheck.message || 'You have reached your FitCheck limit for this month. Please upgrade your plan to continue.');
      return;
    }

    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Adding ${garmentInfo.name}...`);

    try {
      const newImageUrl = await generateVirtualTryOnImage(displayImageUrl, garmentFile);
      const currentPoseInstruction = POSE_INSTRUCTIONS[currentPoseIndex];

      const newLayer = {
        garment: garmentInfo,
        poseImages: { [currentPoseInstruction]: newImageUrl }
      };

      setOutfitHistory(prevHistory => {
        const newHistory = prevHistory.slice(0, currentOutfitIndex + 1);
        return [...newHistory, newLayer];
      });
      setCurrentOutfitIndex(prev => prev + 1);

      setWardrobe(prev => {
        if (prev.find(item => item.id === garmentInfo.id)) {
          return prev;
        }
        return [...prev, garmentInfo];
      });

      // Increment usage after successful garment application
      await incrementUsage(user.id, 'fitcheck');
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to apply garment'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [displayImageUrl, isLoading, currentPoseIndex, outfitHistory, currentOutfitIndex, user]);

  const handleRemoveLastGarment = () => {
    if (currentOutfitIndex > 0) {
      setCurrentOutfitIndex(prevIndex => prevIndex - 1);
      setCurrentPoseIndex(0);
    }
  };

  const handlePoseSelect = useCallback(async (newIndex) => {
    if (isLoading || outfitHistory.length === 0 || newIndex === currentPoseIndex) return;

    const poseInstruction = POSE_INSTRUCTIONS[newIndex];
    const currentLayer = outfitHistory[currentOutfitIndex];

    if (currentLayer.poseImages[poseInstruction]) {
      setCurrentPoseIndex(newIndex);
      return;
    }

    const baseImageForPoseChange = Object.values(currentLayer.poseImages)[0];
    if (!baseImageForPoseChange) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Changing pose...`);

    const prevPoseIndex = currentPoseIndex;
    setCurrentPoseIndex(newIndex);

    try {
      const newImageUrl = await generatePoseVariation(baseImageForPoseChange, poseInstruction);
      setOutfitHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const updatedLayer = newHistory[currentOutfitIndex];
        updatedLayer.poseImages[poseInstruction] = newImageUrl;
        return newHistory;
      });
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to change pose'));
      setCurrentPoseIndex(prevPoseIndex);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [currentPoseIndex, outfitHistory, isLoading, currentOutfitIndex]);

  const viewVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  return (
    <div className="fitCheckPage">
      {/* Page Header with Title */}
      <div className="fitCheckPageHeader">
        <div className="fitCheckPageHeaderContent">
          <h1 className="fitCheckPageTitle">Virtual Try-On Studio</h1>
          <p className="fitCheckPageSubtitle">
            {!modelImageUrl
              ? "Transform your photos into a personal fashion model"
              : "Build your outfit with AI-powered virtual try-on"}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!modelImageUrl ? (
          <motion.div
            key="start-screen"
            className="fitCheckPageContent"
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <div className="fitCheckCenteredContainer">
              <StartScreen onModelFinalized={handleModelFinalized} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            className="fitCheckPageContent"
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            {/* Main Content Area */}
            <div className="fitCheckMainLayout">
              {/* Left: Canvas Area */}
              <div className="fitCheckCanvasSection">
                <div className="fitCheckCanvasWrapper">
                  <Canvas
                    displayImageUrl={displayImageUrl}
                    onStartOver={handleStartOver}
                    isLoading={isLoading}
                    loadingMessage={loadingMessage}
                    onSelectPose={handlePoseSelect}
                    poseInstructions={POSE_INSTRUCTIONS}
                    currentPoseIndex={currentPoseIndex}
                    availablePoseKeys={availablePoseKeys}
                  />
                </div>
              </div>

              {/* Right: Wardrobe Panel */}
              <aside className="fitCheckSidebarSection">
                {/* Mobile Collapse Toggle */}
                <button
                  onClick={() => setIsSheetCollapsed(!isSheetCollapsed)}
                  className="fitCheckMobileToggle md:hidden"
                  aria-label={isSheetCollapsed ? 'Expand panel' : 'Collapse panel'}
                >
                  {isSheetCollapsed ? (
                    <ChevronUpIcon className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  ) : (
                    <ChevronDownIcon className="w-6 h-6" style={{ color: 'rgba(255, 255, 255, 0.7)' }} />
                  )}
                </button>

                {/* Sidebar Content */}
                <div className={`fitCheckSidebarContent ${isSheetCollapsed ? 'collapsed' : ''}`}>
                  {error && (
                    <div className="fitCheckError" role="alert">
                      <div className="fitCheckErrorIcon">⚠️</div>
                      <div>
                        <p className="fitCheckErrorTitle">Error</p>
                        <p className="fitCheckErrorMessage">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="fitCheckSidebarScroll">
                    <OutfitStack
                      outfitHistory={activeOutfitLayers}
                      onRemoveLastGarment={handleRemoveLastGarment}
                    />
                    <WardrobePanel
                      onGarmentSelect={handleGarmentSelect}
                      activeGarmentIds={activeGarmentIds}
                      isLoading={isLoading}
                      wardrobe={wardrobe}
                    />
                  </div>
                </div>
              </aside>
            </div>

            {/* Mobile Loading Overlay */}
            <AnimatePresence>
              {isLoading && isMobile && (
                <motion.div
                  className="fitCheckMobileLoading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Spinner />
                  {loadingMessage && (
                    <p className="fitCheckLoadingText">{loadingMessage}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer isOnDressingScreen={!!modelImageUrl} />
    </div>
  );
};

export default FitCheckApp;
