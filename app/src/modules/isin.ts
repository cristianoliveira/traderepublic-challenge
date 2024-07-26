export const validateISIN = (isin: string): boolean => {
  if (isin.length !== 12) {
    return false;
  }

  let isinNumeric = '';
  for (let i = 0; i < isin.length - 1; i++) {
    const char = isin.charAt(i);
    if (/[A-Z]/.test(char)) {
      isinNumeric += (char.charCodeAt(0) - 55).toString();
    } else {
      isinNumeric += char;
    }
  }

  const checkDigit = parseInt(isin.charAt(11), 10);
  isinNumeric += checkDigit;

  let sum = 0;
  let doubleDigit = false;
  for (let i = isinNumeric.length - 1; i >= 0; i--) {
    let digit = parseInt(isinNumeric.charAt(i), 10);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }

  return (sum % 10) === 0;
}
