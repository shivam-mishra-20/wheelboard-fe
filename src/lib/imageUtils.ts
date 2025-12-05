/**
 * Image utility functions for handling driver and vehicle images
 */

/**
 * Checks if an image path has a file extension
 */
export const hasImageExtension = (path: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  return imageExtensions.some(ext => path.toLowerCase().endsWith(ext));
};

/**
 * Gets image path with fallback extensions if the original path doesn't have one
 * This is a workaround for backend not saving file extensions
 */
export const getImagePathWithFallback = (imagePath: string | null | undefined): string => {
  if (!imagePath) {
    return '/profile-pic.png';
  }

  // If path already has extension, return as is
  if (hasImageExtension(imagePath)) {
    return imagePath;
  }

  // For paths without extension, the image component will need to try fallbacks
  // Return the path as-is and let the Image component handle 404
  return imagePath;
};

/**
 * Generate fallback URLs for images without extensions
 * Returns array of URLs to try: [original, .png, .jpg, .jpeg]
 */
export const getImageFallbackUrls = (imagePath: string): string[] => {
  if (!imagePath || hasImageExtension(imagePath)) {
    return [imagePath];
  }

  return [
    imagePath,
    `${imagePath}.png`,
    `${imagePath}.jpg`,
    `${imagePath}.jpeg`,
  ];
};
