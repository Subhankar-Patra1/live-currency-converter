"use client";

import * as React from "react";
import Flag from "react-world-flags";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Currency } from "@/types/currency";

interface CurrencySelectorProps {
  currencies: Currency[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export function CurrencySelector({
  currencies,
  value,
  onChange,
  disabled,
  ariaLabel = "Select currency"
}: CurrencySelectorProps) {
  // const selectedCurrency = currencies.find(c => c.code === value); // This line is no longer strictly needed for rendering the trigger

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-full text-base md:text-sm" aria-label={ariaLabel}>
        {/* SelectValue will render the content of the selected SelectItem,
            which already includes the flag and currency details. */}
        <SelectValue placeholder="Select currency" />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center">
              <Flag code={currency.countryCode} className="h-4 w-auto mr-2 rounded-sm" fallback={ <span className="w-5 h-3.5 bg-muted rounded-sm" /> } />
              <span className="font-medium mr-2">{currency.code}</span>
              <span className="text-muted-foreground text-xs truncate">{currency.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
