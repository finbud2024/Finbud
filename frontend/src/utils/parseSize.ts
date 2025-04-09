/**
 * Parses a size value from a string or number.
 * If a number is provided, it returns that number.
 * If a string is provided, it attempts to parse it into a number.
 * Returns undefined if the input is undefined or not a valid number.
 *
 * @param input The value to parse.
 * @returns A number representing the size, or undefined.
 */
export function parseSize(input?: string | number): number | undefined {
    if (input === undefined || input === null) {
      return undefined;
    }
    if (typeof input === 'number') {
      return input;
    }
    
    // Try to parse a float from the string
    const parsed = parseFloat(input);
    return isNaN(parsed) ? undefined : parsed;
  }
  