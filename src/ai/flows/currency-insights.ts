
'use server';

/**
 * @fileOverview AI-powered insights and tips for currency exchange.
 *
 * - getCurrencyInsights - A function that provides currency exchange insights and tips.
 * - CurrencyInsightsInput - The input type for the getCurrencyInsights function.
 * - CurrencyInsightsOutput - The return type for the getCurrencyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CurrencyInsightsInputSchema = z.object({
  baseCurrency: z.string().describe('The base currency for conversion.'),
  // Allow an array of quote currencies or a single one for flexibility
  quoteCurrencies: z.union([z.string(), z.array(z.string())]).describe('The quote currency or currencies for conversion.'),
});

export type CurrencyInsightsInput = z.infer<typeof CurrencyInsightsInputSchema>;

const CurrencyInsightsOutputSchema = z.object({
  insights: z.string().describe('General AI-powered insights and tips regarding currency exchange for the given pair(s).'),
  trendReasoning: z.string().optional().describe("Brief, concise summary (strictly 1-2 sentences) of key factors influencing the primary currency pair (base vs first quote) this week, based on public data."),
  predictedTrend: z.string().optional().describe("Predicted general trend for the primary currency pair for the next month based on recent data and macroeconomic factors. Keep it concise."),
  disclaimer: z
    .string()
    .describe(
      'A disclaimer about the probabilistic nature of the observations and that this is not financial advice.'
    ),
});

export type CurrencyInsightsOutput = z.infer<typeof CurrencyInsightsOutputSchema>;

export async function getCurrencyInsights(input: CurrencyInsightsInput): Promise<CurrencyInsightsOutput> {
  return currencyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'currencyInsightsPrompt',
  input: {schema: CurrencyInsightsInputSchema},
  output: {schema: CurrencyInsightsOutputSchema},
  prompt: `You are an AI assistant providing insights and tips for currency exchange.
User is interested in the exchange between Base Currency: {{{baseCurrency}}} and Quote Currency/Currencies: {{{quoteCurrencies}}}.

Provide the following information:
1. General insights and tips for currency exchange between these currencies. Focus on the primary pair if multiple quote currencies are provided (base vs first quote).

Always include a disclaimer that the observations are probabilistic and not financial advice.

Format your response as a JSON object that conforms to the CurrencyInsightsOutputSchema, ensuring 'insights' and 'disclaimer' fields are populated. The fields 'trendReasoning' and 'predictedTrend' are optional and should not be generated unless specifically asked for in a future version of this prompt.
Example output format (current request):
{
  "insights": "string",
  "disclaimer": "string"
}`,
});

const currencyInsightsFlow = ai.defineFlow(
  {
    name: 'currencyInsightsFlow',
    inputSchema: CurrencyInsightsInputSchema,
    outputSchema: CurrencyInsightsOutputSchema,
  },
  async input => {
    // Ensure quoteCurrencies is always a string for the prompt, taking the first if array
    const primaryQuoteCurrency = Array.isArray(input.quoteCurrencies) ? input.quoteCurrencies[0] : input.quoteCurrencies;
    
    const promptInput = {
        baseCurrency: input.baseCurrency,
        quoteCurrencies: primaryQuoteCurrency 
    };

    const {output} = await prompt(promptInput);
    // Ensure trendReasoning and predictedTrend are not returned if the model hallucinates them
    return {
        insights: output!.insights,
        disclaimer: output!.disclaimer,
        // Explicitly set these to undefined if not in output, or if they are empty strings from model
        trendReasoning: output!.trendReasoning || undefined,
        predictedTrend: output!.predictedTrend || undefined,
    };
  }
);

