/**
 * Helper function to convert a theme object to CSS variables.
 *
 * This function takes a theme object and converts it into an array of CSS variable strings.
 * Each key-value pair in the theme object is transformed into a CSS variable in the format:
 * --variable-name: value;
 *
 * @param {Object} theme - The theme object containing CSS variable names and values.
 * @returns {string[]} An array of CSS variable strings.
 */
export const toCSSVars = (theme: object): string[] => {
  return Object.entries(theme).map(([key, value]) => `--${key}: ${value}`);
};
