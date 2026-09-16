import { Language } from '../types';

/**
 * Format minutes into clean, concise string:
 * e.g., 25 -> "25m"
 *       80 -> "1h20m"
 *       90 -> "1h30m"
 *       120 -> "2h"
 */
export function formatDuration(minutes: number, language: Language = 'vi'): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours}h`;
  }
  return `${hours}h${remainingMins}m`;
}

/**
 * Format minutes into readable detailed phrase:
 * e.g., 80 -> "1 tiếng 20 phút" (vi) | "1 hr 20 mins" (en)
 */
export function formatDetailedDuration(minutes: number, language: Language = 'vi'): string {
  if (minutes < 60) {
    return language === 'vi' ? `${minutes} phút` : `${minutes} mins`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return language === 'vi' ? `${hours} tiếng` : `${hours} hrs`;
  }
  return language === 'vi'
    ? `${hours} tiếng ${remainingMins} phút`
    : `${hours} hr ${remainingMins} mins`;
}

/**
 * Checks if a task is a long task (typically 1 to 2 hours)
 */
export function isOneToTwoHourTask(minutes: number): boolean {
  return minutes >= 60 && minutes <= 120;
}
