/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import 'immer'
import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createSelectorFunctions} from 'auto-zustand-selectors-hook'
import modes from './modes'

export default createSelectorFunctions(
  create(
    immer(() => ({
      didInit: false,
      photos: [],
      activeMode: Object.keys(modes)[0],
      gifInProgress: false,
      gifUrl: null,
      customPrompt: '',
      favoriteModes: [],
      customModes: [], // Premium feature: user's custom AI modes
      batchUploadProgress: null, // {total, completed, current}
      isDemoMode: false, // Whether app is in demo/guest mode
      demoPhotosCreated: 0 // Track demo photo count
    }))
  )
)
