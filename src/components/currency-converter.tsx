
"use client";

import * as React from "react";
import Flag from "react-world-flags";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencySelector } from "@/components/currency-selector";
import { commonCurrencies, type Currency } from "@/types/currency";
import { fetchExchangeRate, fetchAIInsightsAction } from "@/lib/actions/currency";
import type { CurrencyInsightsOutput } from "@/ai/flows/currency-insights";
import { AIInsights } from "@/components/ai-insights";
import { useToast } from "@/hooks/use-toast";
import { ArrowRightLeft, Loader2, PlusCircle, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const MAX_QUOTE_CURRENCIES = 3;

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export function CurrencyConverter() {
  const [amount, setAmount] = React.useState<string>("1.00");
  const [baseCurrency, setBaseCurrency] = React.useState<string>("USD");
  const [quoteCurrencies, setQuoteCurrencies] = React.useState<string[]>(["EUR", "JPY", "INR"]);
  const [convertedAmounts, setConvertedAmounts] = React.useState<(number | null)[]>(Array(quoteCurrencies.length).fill(null));
  const [exchangeRates, setExchangeRates] = React.useState<(number | null)[]>(Array(quoteCurrencies.length).fill(null));
  const [isConverting, setIsConverting] = React.useState<boolean>(false);
  const [aiInsights, setAiInsights] = React.useState<CurrencyInsightsOutput | null>(null);
  const [isFetchingInsights, setIsFetchingInsights] = React.useState<boolean>(false);
  const [resultKey, setResultKey] = React.useState(0); // For animation trigger

  const { toast } = useToast();
  const debouncedAmount = useDebounce(parseFloat(amount) || 0, 500);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleBaseCurrencyChange = (newBase: string) => {
    // Prevent base currency from being one of the quote currencies
    if (quoteCurrencies.includes(newBase)) {
      const availableCurrencies = commonCurrencies.filter(c => c.code !== newBase && !quoteCurrencies.includes(c.code));
      if (availableCurrencies.length > 0) {
        const newQuoteCurrencies = quoteCurrencies.map(qc => qc === newBase ? availableCurrencies[0].code : qc);
        setQuoteCurrencies(newQuoteCurrencies);
      } else {
        toast({ variant: "destructive", title: "Selection Error", description: "Cannot select the same currency for base and quote if no other alternatives exist." });
        return;
      }
    }
    setBaseCurrency(newBase);
  };
  
  const handleQuoteCurrencyChange = (index: number, newQuote: string) => {
    if (newQuote === baseCurrency || quoteCurrencies.some((qc, i) => i !== index && qc === newQuote)) {
       toast({ variant: "destructive", title: "Selection Error", description: "Cannot select duplicate or base currency as quote." });
       return;
    }
    const newQuotes = [...quoteCurrencies];
    newQuotes[index] = newQuote;
    setQuoteCurrencies(newQuotes);
  };

  const addQuoteCurrency = () => {
    if (quoteCurrencies.length < MAX_QUOTE_CURRENCIES) {
      const available = commonCurrencies.find(c => c.code !== baseCurrency && !quoteCurrencies.includes(c.code));
      if (available) {
        setQuoteCurrencies([...quoteCurrencies, available.code]);
        setConvertedAmounts([...convertedAmounts, null]);
        setExchangeRates([...exchangeRates, null]);
      } else {
        toast({ title: "No more unique currencies to add.", variant: "default"});
      }
    }
  };

  const removeQuoteCurrency = (index: number) => {
    if (quoteCurrencies.length > 1) {
      setQuoteCurrencies(quoteCurrencies.filter((_, i) => i !== index));
      setConvertedAmounts(convertedAmounts.filter((_, i) => i !== index));
      setExchangeRates(exchangeRates.filter((_, i) => i !== index));
    }
  };
  
  const handleSwapCurrencies = () => {
    if (quoteCurrencies.length > 0) {
      const oldBase = baseCurrency;
      const firstQuote = quoteCurrencies[0];
      setBaseCurrency(firstQuote); 
      const newQuotes = [oldBase, ...quoteCurrencies.slice(1)].filter(qc => qc !== firstQuote);
      if (newQuotes.length === 0 || (newQuotes.length === 1 && newQuotes[0] === firstQuote)) {
        const fallback = commonCurrencies.find(c => c.code !== firstQuote && c.code !== oldBase);
        setQuoteCurrencies(fallback ? [fallback.code] : []);
      } else {
        setQuoteCurrencies(newQuotes.slice(0, MAX_QUOTE_CURRENCIES));
      }
    }
  };


  React.useEffect(() => {
    if (debouncedAmount <= 0 || !baseCurrency || quoteCurrencies.length === 0) {
      setConvertedAmounts(Array(quoteCurrencies.length).fill(0));
      setExchangeRates(Array(quoteCurrencies.length).fill(null));
      return;
    }

    async function getRates() {
      setIsConverting(true);
      try {
        // fetchExchangeRate now returns all conversion rates for the baseCurrency
        const allConversionRates = await fetchExchangeRate(baseCurrency);
        
        const newConvertedAmounts: (number | null)[] = [];
        const newExchangeRates: (number | null)[] = [];

        quoteCurrencies.forEach(qc => {
          const rate = allConversionRates[qc];
          if (typeof rate === 'number') {
            newExchangeRates.push(rate);
            newConvertedAmounts.push(debouncedAmount * rate);
          } else {
            newExchangeRates.push(null);
            newConvertedAmounts.push(null);
            console.warn(`Rate for ${qc} not found in API response for base ${baseCurrency}`);
            // Optionally, show a toast message for the specific missing rate
            // toast({ variant: "destructive", title: "Rate Unavailable", description: `Could not find rate for ${qc}.` });
          }
        });

        setExchangeRates(newExchangeRates);
        setConvertedAmounts(newConvertedAmounts);
        setResultKey(prev => prev + 1); // Trigger animation
      } catch (error) {
        console.error("Failed to fetch exchange rate(s):", error);
        toast({
          variant: "destructive",
          title: "Conversion Error",
          description: error instanceof Error ? error.message : "Could not fetch the latest exchange rates.",
        });
        setConvertedAmounts(Array(quoteCurrencies.length).fill(null));
        setExchangeRates(Array(quoteCurrencies.length).fill(null));
      } finally {
        setIsConverting(false);
      }
    }
    getRates();
  }, [debouncedAmount, baseCurrency, quoteCurrencies, toast]);

  React.useEffect(() => {
    if (!baseCurrency || quoteCurrencies.length === 0) return;

    async function getInsights() {
      setIsFetchingInsights(true);
      setAiInsights(null); 
      try {
        const insights = await fetchAIInsightsAction({ baseCurrency, quoteCurrencies });
        setAiInsights(insights);
      } catch (error) {
        console.error("Failed to fetch AI insights:", error);
         toast({
          variant: "destructive",
          title: "AI Insights Error",
          description: "Could not load AI-powered insights at this moment.",
        });
      } finally {
        setIsFetchingInsights(false);
      }
    }
    getInsights();
  }, [baseCurrency, quoteCurrencies, toast]);
  
  const getCurrencyCountryCode = (currencyCode: string) => {
    return commonCurrencies.find(c => c.code === currencyCode)?.countryCode || "";
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-3xl font-headline text-primary text-center">Global Exchange</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Convert currencies with real-time rates and AI insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-foreground">Amount</label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="text-lg p-3 border-2 focus:border-primary transition-colors duration-300"
              aria-label="Amount to convert"
            />
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2 md:gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-foreground">From</label>
              <CurrencySelector
                currencies={commonCurrencies}
                value={baseCurrency}
                onChange={handleBaseCurrencyChange}
                ariaLabel="Select base currency"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapCurrencies}
              className="self-center text-primary hover:bg-primary/20 transition-colors duration-300"
              aria-label="Swap base currency with first target currency"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </Button>
             <div className="space-y-1">
                <label className="block text-xs font-medium text-foreground">To (Primary)</label>
                 <CurrencySelector
                    currencies={commonCurrencies.filter(c => c.code !== baseCurrency && !quoteCurrencies.slice(1).includes(c.code))}
                    value={quoteCurrencies[0]}
                    onChange={(newQuote) => handleQuoteCurrencyChange(0, newQuote)}
                    ariaLabel="Select primary target currency"
                  />
            </div>
          </div>
          
          {quoteCurrencies.slice(1).map((quoteCode, index) => (
            <div key={`quote-${index+1}`} className="flex items-end space-x-2">
              <div className="flex-1 space-y-1">
                <label className="block text-xs font-medium text-foreground">To (Additional)</label>
                <CurrencySelector
                  currencies={commonCurrencies.filter(c => c.code !== baseCurrency && !quoteCurrencies.some((qc, i) => i !== index+1 && qc === c.code))}
                  value={quoteCode}
                  onChange={(newQuote) => handleQuoteCurrencyChange(index + 1, newQuote)}
                  ariaLabel={`Select additional target currency ${index + 2}`}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeQuoteCurrency(index + 1)} className="text-destructive/70 hover:bg-destructive/10">
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
          ))}

          {quoteCurrencies.length < MAX_QUOTE_CURRENCIES && (
            <Button variant="outline" onClick={addQuoteCurrency} className="w-full border-dashed text-sm">
              <PlusCircle className="h-4 w-4 mr-2" /> Add Target Currency
            </Button>
          )}


          <div className="pt-4 space-y-4">
            <p className="text-sm text-muted-foreground text-center mb-1">Converted Amount(s)</p>
            {isConverting && convertedAmounts.every(a => a === null) ? (
              <div className="space-y-3">
                {quoteCurrencies.map((_, idx) => <Skeleton key={idx} className="h-10 w-3/4 mx-auto rounded-md" />)}
              </div>
            ) : (
              quoteCurrencies.map((qc, index) => (
                <div 
                  key={`${qc}-${resultKey}`} // Forcing re-render for CSS animation
                  className="text-2xl md:text-3xl font-bold text-primary text-center transition-opacity duration-500 ease-in-out opacity-0 animate-fadeIn"
                  style={{ animationFillMode: 'forwards', animationDelay: `${index * 100}ms` }}
                  aria-live="polite"
                >
                  {convertedAmounts[index] !== null ? (
                    <div className="flex items-center justify-center space-x-2">
                       <Flag code={getCurrencyCountryCode(qc)} className="h-6 w-auto rounded-sm" fallback={ <span className="w-7 h-5 bg-muted rounded-sm" /> }/>
                       <span>{qc} {convertedAmounts[index]?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  ): (
                    <div className="flex items-center justify-center space-x-2">
                       <Flag code={getCurrencyCountryCode(qc)} className="h-6 w-auto rounded-sm" fallback={ <span className="w-7 h-5 bg-muted rounded-sm" /> }/>
                       <span>{qc} -</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-secondary/50 p-4 flex flex-col items-center justify-center text-sm text-muted-foreground space-y-1">
          {isConverting && exchangeRates.every(r => r === null) ? (
             <Skeleton className="h-4 w-1/3 my-1" />
          ) : baseCurrency && quoteCurrencies.length > 0 && exchangeRates.some(r => r !== null) ? (
            quoteCurrencies.map((qc, index) => exchangeRates[index] !== null && (
              <div key={qc} className="flex items-center space-x-1">
                <span>1 {baseCurrency} = {exchangeRates[index]?.toFixed(4)} {qc}</span>
              </div>
            ))
          ) : (
            <span>Enter an amount to see exchange rates.</span>
          )}
           {isConverting && <Loader2 className="h-4 w-4 animate-spin mt-1 text-primary" />}
        </CardFooter>
      </Card>

      <AIInsights
        insights={aiInsights?.insights}
        trendReasoning={aiInsights?.trendReasoning}
        predictedTrend={aiInsights?.predictedTrend}
        disclaimer={aiInsights?.disclaimer}
        isLoading={isFetchingInsights}
      />
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation-name: fadeIn;
        }
      `}</style>
    </div>
  );
}
