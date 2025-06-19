
"use server";

import type { CurrencyInsightsInput, CurrencyInsightsOutput } from '@/ai/flows/currency-insights';
import { getCurrencyInsights } from '@/ai/flows/currency-insights';

const API_KEY = process.env.EXCHANGERATE_API_KEY;
const API_BASE_URL = "https://v6.exchangerate-api.com/v6";

interface ExchangeRateApiResponse {
  result: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  base_code: string;
  conversion_rates: {
    [key: string]: number;
  };
  error?: { "error-type": string };
}

// This function now returns all conversion rates for the given baseCurrency
export async function fetchExchangeRate(baseCurrency: string): Promise<ExchangeRateApiResponse['conversion_rates']> {
  if (!API_KEY) {
    console.error("ExchangeRate-API key is missing. Please set EXCHANGERATE_API_KEY in .env");
    // For a real app, you might want a more user-friendly error or a fallback mechanism.
    throw new Error("API key is not configured. Please contact support or check server logs.");
  }

  const apiUrl = `${API_BASE_URL}/${API_KEY}/latest/${baseCurrency}`;

  try {
    // Added { cache: 'no-store' } to ensure fresh data on every request
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`Failed to fetch exchange rates: ${response.statusText} - ${errorData?.error?.["error-type"] || 'Unknown API error'}`);
    }

    const data: ExchangeRateApiResponse = await response.json();

    if (data.result === "error") {
      console.error("ExchangeRate-API Error:", data.error?.["error-type"]);
      throw new Error(`API returned an error: ${data.error?.["error-type"]}`);
    }
    
    if (!data.conversion_rates) {
        console.error("No conversion rates found in API response for base:", baseCurrency, data);
        throw new Error(`No conversion rates returned for ${baseCurrency}.`);
    }

    return data.conversion_rates;

  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    if (error instanceof Error) {
        // Re-throw with a slightly more generic message for the client, original error logged for server-side debugging.
        throw new Error(`Could not fetch exchange rates. ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching exchange rates.");
  }
}

export async function fetchAIInsightsAction(input: CurrencyInsightsInput): Promise<CurrencyInsightsOutput> {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 600));
    const insights = await getCurrencyInsights(input);
    return insights;
  } catch (error) {
    console.error("Error fetching AI insights:", error);
    return {
      insights: "We encountered an issue while generating AI insights. This could be due to temporary network problems or limitations with the currency pair data. Please try again later or with a different currency pair.",
      disclaimer: "AI insights are for informational purposes only and should not be considered financial advice. Always consult with a qualified financial advisor before making investment decisions."
    };
  }
}
