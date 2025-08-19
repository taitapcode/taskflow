export function formatRelativeTime(input: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
  const now = new Date();
  const date = input instanceof Date ? input : new Date(input);
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);

  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];

  for (const [unit, secondsInUnit] of divisions) {
    const delta = Math.round(diffSec / secondsInUnit);
    if (Math.abs(delta) >= 1) return rtf.format(delta, unit);
  }
  return rtf.format(0, 'second');
}
