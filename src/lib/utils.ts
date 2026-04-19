import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Automatically converts Google Drive sharing links to direct image URLs
 */
export function formatImageUrl(url?: string): string {
  if (!url) return '';
  
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return '';

  // Handle Google Drive links
  if (trimmedUrl.includes('drive.google.com')) {
    // Standard sharing link: /d/ID/view
    const dMatch = trimmedUrl.match(/\/d\/(.+?)\/([^\/?]+)?/);
    if (dMatch && dMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${dMatch[1]}`;
    }
    
    // Direct ID in query param: id=ID
    const idMatch = trimmedUrl.match(/[?&]id=(.+?)(&|$)/);
    if (idMatch && idMatch[1]) {
      return `https://drive.google.com/uc?export=view&id=${idMatch[1]}`;
    }
  }
  
  return trimmedUrl;
}

/**
 * Automatically converts Google Drive sharing links to direct download links
 */
export function formatDownloadUrl(url?: string): string {
  if (!url) return '';
  
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/(.+?)\/(view|edit)?/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  
  return url;
}
