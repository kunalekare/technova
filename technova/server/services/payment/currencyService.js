import axios from 'axios';
import logger from '../../utils/logger.js';

// Simple in-memory cache
let ratesCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 1000 * 60 * 60 * 12; // 12 hours

/**
 * Fetches exchange rates relative to INR
 * @returns {Promise<Object>} Map of currency codes to exchange rates
 */
export const getExchangeRates = async () => {
  if (ratesCache && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
    return ratesCache;
  }

  try {
    const response = await axios.get('https://open.er-api.com/v6/latest/INR');
    if (response.data && response.data.rates) {
      ratesCache = response.data.rates;
      lastFetchTime = Date.now();
      return ratesCache;
    }
    throw new Error('Invalid response from exchange rate API');
  } catch (error) {
    logger.error(`Error fetching exchange rates: ${error.message}`);
    // Fallback static rates if API fails
    return {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0094,
      AUD: 0.018,
      CAD: 0.016
    };
  }
};

/**
 * Converts INR amount to target currency
 */
export const convertCurrency = async (amountInr, targetCurrency) => {
  if (targetCurrency === 'INR') return amountInr;
  
  const rates = await getExchangeRates();
  const rate = rates[targetCurrency];
  
  if (!rate) {
    throw new Error(`Unsupported currency: ${targetCurrency}`);
  }
  
  return Number((amountInr * rate).toFixed(2));
};

/**
 * Gets the current exchange rate for a target currency (e.g., 1 INR = X targetCurrency)
 */
export const getRate = async (targetCurrency) => {
  if (targetCurrency === 'INR') return 1;
  const rates = await getExchangeRates();
  return rates[targetCurrency] || null;
};
