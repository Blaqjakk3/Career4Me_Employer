import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date)) return 'Invalid Date';
  return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
  });
};

export const isJobExpired = (expiryDateString) => {
  if (!expiryDateString) return false;
  const expiryDate = new Date(expiryDateString);
  const currentDate = new Date();
  // Set time to 00:00:00 for accurate date comparison
  expiryDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  return expiryDate < currentDate;
};

export const isValidExpiryDate = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const currentDate = new Date();

  // Set time to 00:00:00 for accurate date comparison
  selectedDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  // Check if date is before or equal to current date
  if (selectedDate <= currentDate) {
      return false;
  }

  // Check if date is more than 2 months from current date
  const twoMonthsLater = new Date();
  twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
  twoMonthsLater.setHours(0, 0, 0, 0);

  if (selectedDate > twoMonthsLater) {
      return false;
  }

  return true;
};

export const formatTimeRemaining = (dateString) => {
  if (!dateString) return '';
  const targetDate = new Date(dateString);
  const now = new Date();

  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
      return 'Expired';
  } else if (diffDays <= 14) { // Up to 2 weeks
      return `${diffDays} day${diffDays === 1 ? '' : 's'}`;
  } else if (diffDays <= 60) { // Up to 2 months (approx 60 days)
      const diffWeeks = Math.ceil(diffDays / 7);
      return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'}`;
  } else {
      const diffMonths = Math.ceil(diffDays / 30);
      return `${diffMonths} month${diffMonths === 1 ? '' : 's'}`;
  }
};

