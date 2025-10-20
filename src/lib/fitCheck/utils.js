/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getFriendlyErrorMessage(error, context) {
  let rawMessage = 'An unknown error occurred.';
  if (error instanceof Error) {
    rawMessage = error.message;
  } else if (typeof error === 'string') {
    rawMessage = error;
  } else if (error) {
    rawMessage = String(error);
  }

  if (rawMessage.includes("Unsupported MIME type")) {
    try {
      const errorJson = JSON.parse(rawMessage);
      const nestedMessage = errorJson?.error?.message;
      if (nestedMessage && nestedMessage.includes("Unsupported MIME type")) {
        const mimeType = nestedMessage.split(': ')[1] || 'unsupported';
        return `File type '${mimeType}' is not supported. Please use a format like PNG, JPEG, or WEBP.`;
      }
    } catch (e) {
      // Not a JSON string
    }
    return `Unsupported file format. Please upload an image format like PNG, JPEG, or WEBP.`;
  }

  return `${context}. ${rawMessage}`;
}
