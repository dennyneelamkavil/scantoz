// EMAIL
export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// MONGO ID
export const isMongoId = (value: string) => /^[a-f\d]{24}$/i.test(value);

// PRICE (2 decimals)
export const isValidPriceInput = (value: string) =>
  /^\d*\.?\d{0,2}$/.test(value);

// ANY DECIMAL NUMBER
export const isValidNumberInput = (value: string) => /^\d*\.?\d*$/.test(value);

// INTEGER ONLY
export const isDigitsOnly = (value: string) => /^\d*$/.test(value);
