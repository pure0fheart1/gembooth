/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Using the same API key as ImageGeneration.jsx
const API_KEY = 'AIzaSyBjosltDAxf1XQXoxO7ogY6BXO3UmD191A';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent';

// Helper function to convert a File object to base64 data
const fileToBase64 = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result;
      const arr = dataUrl.split(',');
      if (arr.length < 2) {
        reject(new Error("Invalid data URL"));
        return;
      }
      const mimeMatch = arr[0].match(/:(.*?);/);
      if (!mimeMatch || !mimeMatch[1]) {
        reject(new Error("Could not parse MIME type from data URL"));
        return;
      }
      resolve({
        mimeType: mimeMatch[1],
        data: arr[1]
      });
    };
    reader.onerror = error => reject(error);
  });
};

const handleApiResponse = (response, context) => {
  // Check for blocking
  if (response.promptFeedback?.blockReason) {
    const { blockReason, blockReasonMessage } = response.promptFeedback;
    const errorMessage = `Request was blocked. Reason: ${blockReason}. ${blockReasonMessage || ''}`;
    console.error(errorMessage, { response });
    throw new Error(errorMessage);
  }

  // Try to find the image part
  const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  if (imagePartFromResponse?.inlineData) {
    const { mimeType, data } = imagePartFromResponse.inlineData;
    console.log(`Received image data (${mimeType}) for ${context}`);
    return `data:${mimeType};base64,${data}`;
  }

  // If no image, check for other reasons
  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason && finishReason !== 'STOP') {
    const errorMessage = `Image generation for ${context} stopped unexpectedly. Reason: ${finishReason}. This often relates to safety settings.`;
    console.error(errorMessage, { response });
    throw new Error(errorMessage);
  }

  const textResponse = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  const errorMessage = `The AI model did not return an image for the ${context}. ` +
    (textResponse
      ? `The model responded with text: "${textResponse}"`
      : "This can happen due to safety filters or if the request is too complex. Please try rephrasing your prompt to be more direct.");

  console.error(`Model response did not contain an image part for ${context}.`, { response });
  throw new Error(errorMessage);
};

/**
 * Generates an edited image using generative AI based on a text prompt and a specific point.
 */
export const generateEditedImage = async (originalImage, userPrompt, hotspot) => {
  console.log('Starting generative edit at:', hotspot);

  const imagePart = await fileToBase64(originalImage);
  const prompt = `You are an expert photo editor AI. Your task is to perform a natural, localized edit on the provided image based on the user's request.
User Request: "${userPrompt}"
Edit Location: Focus on the area around pixel coordinates (x: ${hotspot.x}, y: ${hotspot.y}).

Editing Guidelines:
- The edit must be realistic and blend seamlessly with the surrounding area.
- The rest of the image (outside the immediate edit area) must remain identical to the original.

Safety & Ethics Policy:
- You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
- You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.

Output: Return ONLY the final edited image. Do not return text.`;

  console.log('Sending image and prompt to the model...');
  const requestBody = {
    contents: [{
      parts: [
        { inlineData: imagePart },
        { text: prompt }
      ]
    }]
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Received response from model.', data);

  return handleApiResponse(data, 'edit');
};

/**
 * Generates an image with a filter applied using generative AI.
 */
export const generateFilteredImage = async (originalImage, filterPrompt) => {
  console.log(`Starting filter generation: ${filterPrompt}`);

  const imagePart = await fileToBase64(originalImage);
  const prompt = `You are an expert photo editor AI. Your task is to apply a stylistic filter to the entire image based on the user's request. Do not change the composition or content, only apply the style.
Filter Request: "${filterPrompt}"

Safety & Ethics Policy:
- Filters may subtly shift colors, but you MUST ensure they do not alter a person's fundamental race or ethnicity.
- You MUST REFUSE any request that explicitly asks to change a person's race (e.g., 'apply a filter to make me look Chinese').

Output: Return ONLY the final filtered image. Do not return text.`;

  console.log('Sending image and filter prompt to the model...');
  const requestBody = {
    contents: [{
      parts: [
        { inlineData: imagePart },
        { text: prompt }
      ]
    }]
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Received response from model for filter.', data);

  return handleApiResponse(data, 'filter');
};

/**
 * Generates an image with a global adjustment applied using generative AI.
 */
export const generateAdjustedImage = async (originalImage, adjustmentPrompt) => {
  console.log(`Starting global adjustment generation: ${adjustmentPrompt}`);

  const imagePart = await fileToBase64(originalImage);
  const prompt = `You are an expert photo editor AI. Your task is to perform a natural, global adjustment to the entire image based on the user's request.
User Request: "${adjustmentPrompt}"

Editing Guidelines:
- The adjustment must be applied across the entire image.
- The result must be photorealistic.

Safety & Ethics Policy:
- You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
- You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.

Output: Return ONLY the final adjusted image. Do not return text.`;

  console.log('Sending image and adjustment prompt to the model...');
  const requestBody = {
    contents: [{
      parts: [
        { inlineData: imagePart },
        { text: prompt }
      ]
    }]
  };

  const response = await fetch(`${API_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Received response from model for adjustment.', data);

  return handleApiResponse(data, 'adjustment');
};
