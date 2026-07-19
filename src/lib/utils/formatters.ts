export class NumberFormatter {
  static format(value: number): string {
    return value.toLocaleString();
  }
  static formatWithDecimals(value: number, decimals: number = 1): string {
    return Number.isInteger(value) ? value.toString() : value.toFixed(decimals);
  }
  static formatMetric(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  }
}

export class DateFormatter {
  static formatLocal(timestamp: string | Date | number): string {
    return new Date(timestamp).toLocaleString();
  }
  static formatTime(timestamp: string | Date | number): string {
    return new Date(timestamp).toLocaleTimeString();
  }
  static formatTimeShort(timestamp: string | Date | number): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  static formatRelative(timestamp: string | Date | number): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return this.formatLocal(timestamp);
  }
}

export class PercentageFormatter {
  static format(value: number, decimals: number = 0): string {
    return `${value.toFixed(decimals)}%`;
  }
}

export function formatCurrency(value: string | null | undefined): string {
  if (!value) return '$0.00';
  const num = parseFloat(value);
  if (isNaN(num)) return '$0.00';
  return `$${num.toFixed(2)}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
