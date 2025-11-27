import { ProrationCalculation } from '../models/subscription.interface';

/**
 * Utility functions for subscription proration calculations
 */

/**
 * Calculates the first Tuesday of a given year
 * @param year The year to calculate for
 * @returns Date object representing the first Tuesday
 */
export function getFirstTuesdayOfYear(year: number): Date {
  const janFirst = new Date(year, 0, 1);
  const dayOfWeek = janFirst.getDay();

  // Tuesday is day 2 (Sunday = 0, Monday = 1, Tuesday = 2, ...)
  const daysUntilTuesday = dayOfWeek <= 2 ? 2 - dayOfWeek : 9 - dayOfWeek;

  const firstTuesday = new Date(year, 0, 1 + daysUntilTuesday);
  firstTuesday.setHours(0, 0, 0, 0);

  return firstTuesday;
}

/**
 * Calculates the next renewal date (first Tuesday of next year)
 * @param currentDate The current date or subscription start date
 * @returns Date object representing the next renewal date
 */
export function getNextRenewalDate(currentDate: Date = new Date()): Date {
  const nextYear = currentDate.getFullYear() + 1;
  return getFirstTuesdayOfYear(nextYear);
}

/**
 * Checks if a given year is a leap year
 * @param year The year to check
 * @returns true if leap year, false otherwise
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * Gets the number of days in a year
 * @param year The year
 * @returns 366 for leap years, 365 otherwise
 */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

/**
 * Calculates the number of days remaining in the current subscription year
 * @param startDate The subscription start date
 * @returns Number of days remaining until first Tuesday of next year
 */
export function getDaysRemainingInYear(startDate: Date = new Date()): number {
  const renewalDate = getNextRenewalDate(startDate);
  const msPerDay = 24 * 60 * 60 * 1000;
  const diffMs = renewalDate.getTime() - startDate.getTime();
  return Math.ceil(diffMs / msPerDay);
}

/**
 * Calculates the prorated subscription price based on remaining days in year
 * @param fullYearPrice The full annual subscription price (default 0.99 EUR)
 * @param startDate The subscription start date (default today)
 * @returns ProrationCalculation object with all proration details
 */
export function calculateProration(
  fullYearPrice: number = 0.99,
  startDate: Date = new Date()
): ProrationCalculation {
  const year = startDate.getFullYear();
  const daysInYear = getDaysInYear(year);
  const daysRemaining = getDaysRemainingInYear(startDate);
  const nextRenewalDate = getNextRenewalDate(startDate);

  // Calculate prorated price: (fullYearPrice / daysInYear) * daysRemaining
  const dailyRate = fullYearPrice / daysInYear;
  const proratedPrice = Math.round(dailyRate * daysRemaining * 100) / 100; // Round to 2 decimals

  return {
    fullYearPrice,
    daysInYear,
    daysRemaining,
    proratedPrice,
    startDate,
    nextRenewalDate
  };
}

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
