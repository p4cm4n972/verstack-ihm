/**
 * Utility functions for subscription
 */

/**
 * Formats a price in euros for display
 * @param amount The amount in euros
 * @returns Formatted string (e.g., "0,99 €")
 */
export function formatEuroPrice(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

/**
 * Checks if a subscription is currently active
 * @param endDate The subscription end date
 * @returns true if active, false if expired
 */
export function isSubscriptionActive(endDate: Date): boolean {
  return new Date() < new Date(endDate);
}
