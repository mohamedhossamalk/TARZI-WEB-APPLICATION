/**
 * Format date to local string
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount, currencyCode = 'ج.م') => {
  return `${amount?.toLocaleString()} ${currencyCode}`;
};

/**
 * Truncate text to a certain length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get status color
 * @param {string} status - Status
 * @returns {string} Color name
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'processing':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Convert array to comma-separated string
 * @param {Array} array - Array to convert
 * @returns {string} Comma-separated string
 */
export const arrayToString = (array) => {
  if (!array || !Array.isArray(array)) return '';
  return array.join(', ');
};

/**
 * Convert comma-separated string to array
 * @param {string} string - Comma-separated string
 * @returns {Array} Array
 */
export const stringToArray = (string) => {
  if (!string) return [];
  return string.split(',').map(item => item.trim()).filter(Boolean);
};

/**
 * Get error message from API error
 * @param {Error} error - Error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'حدث خطأ ما';
};