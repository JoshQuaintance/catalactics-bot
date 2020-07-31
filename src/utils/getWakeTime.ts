import { DateTime } from 'luxon';
/**
 * Get Bot Wake Time
 *
 * @returns String with time and time zone
 */
export default function getWakeTime(): string {
  const dt = DateTime.local();
  const formatted = dt.toLocaleString(DateTime.TIME_WITH_SHORT_OFFSET);

  return formatted;
}

