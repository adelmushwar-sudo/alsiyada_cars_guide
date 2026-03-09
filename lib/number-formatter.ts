/**
 * Format a number with thousand separators
 * @param value - The number to format
 * @param locale - The locale to use (default: 'ar-SA')
 * @returns Formatted string with thousand separators
 */
export function formatNumberWithSeparators(
  value: number | string,
  locale: string = "ar-SA"
): string {
  if (!value) return "";

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "";

  return new Intl.NumberFormat(locale, {
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Parse a formatted number string back to a number
 * @param formattedValue - The formatted string
 * @returns The numeric value
 */
export function parseFormattedNumber(formattedValue: string): number {
  if (!formattedValue) return 0;

  // Remove all non-digit characters except decimal point
  const cleaned = formattedValue.replace(/[^\d.]/g, "");
  return parseFloat(cleaned) || 0;
}

/**
 * Format a number as currency
 * @param value - The number to format
 * @param currency - The currency code (default: 'SAR')
 * @param locale - The locale to use (default: 'ar-SA')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number | string,
  currency: string = "SAR",
  locale: string = "ar-SA"
): string {
  if (!value) return "";

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency === "SAR" ? "SAR" : "USD",
    useGrouping: true,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Handle input change for numeric fields with automatic formatting
 * @param text - The input text
 * @param currentValue - The current value
 * @returns Object with formatted display value and numeric value
 */
export function handleNumberInput(
  text: string,
  currentValue: number = 0
): { displayValue: string; numericValue: number } {
  if (!text) {
    return { displayValue: "", numericValue: 0 };
  }

  // Remove all non-digit characters
  const cleaned = text.replace(/\D/g, "");

  if (!cleaned) {
    return { displayValue: "", numericValue: 0 };
  }

  const numericValue = parseInt(cleaned, 10);
  const displayValue = formatNumberWithSeparators(numericValue);

  return { displayValue, numericValue };
}

/**
 * Validate VIN format (17 characters, alphanumeric only, no Arabic)
 * @param vin - The VIN to validate
 * @returns true if valid, false otherwise
 */
export function isValidVIN(vin: string): boolean {
  if (!vin) return false;

  // Check if contains Arabic characters
  const arabicRegex = /[\u0600-\u06FF]/g;
  if (arabicRegex.test(vin)) return false;

  // Check if it's 17 characters and alphanumeric
  const vinRegex = /^[A-Z0-9]{17}$/i;
  return vinRegex.test(vin);
}

/**
 * Filter out Arabic characters from input
 * @param text - The input text
 * @returns Text without Arabic characters
 */
export function removeArabicCharacters(text: string): string {
  const arabicRegex = /[\u0600-\u06FF]/g;
  return text.replace(arabicRegex, "");
}

/**
 * Format year for display
 * @param year - The year number
 * @returns Formatted year string
 */
export function formatYear(year: number | string): string {
  if (!year) return "";

  const yearNum = typeof year === "string" ? parseInt(year, 10) : year;

  if (isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
    return "";
  }

  return yearNum.toString();
}

/**
 * Get current year
 * @returns Current year as number
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Generate array of years from start to end
 * @param startYear - Start year (default: 1990)
 * @param endYear - End year (default: current year)
 * @returns Array of years
 */
export function generateYearArray(
  startYear: number = 1990,
  endYear: number = getCurrentYear()
): number[] {
  const years: number[] = [];
  for (let i = endYear; i >= startYear; i--) {
    years.push(i);
  }
  return years;
}
