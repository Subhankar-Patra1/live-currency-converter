export interface Currency {
  code: string;
  name: string;
  countryCode: string; // ISO 3166-1 alpha-2 country code, or special like "EU"
}

export const commonCurrencies: Currency[] = [
  { code: "USD", name: "United States Dollar", countryCode: "US" },
  { code: "EUR", name: "Euro", countryCode: "EU" }, // Special case for Euro
  { code: "JPY", name: "Japanese Yen", countryCode: "JP" },
  { code: "GBP", name: "British Pound Sterling", countryCode: "GB" },
  { code: "AUD", name: "Australian Dollar", countryCode: "AU" },
  { code: "CAD", name: "Canadian Dollar", countryCode: "CA" },
  { code: "CHF", name: "Swiss Franc", countryCode: "CH" },
  { code: "CNY", name: "Chinese Yuan", countryCode: "CN" },
  { code: "INR", name: "Indian Rupee", countryCode: "IN" },
  { code: "BRL", name: "Brazilian Real", countryCode: "BR" },
  { code: "ZAR", name: "South African Rand", countryCode: "ZA" },
  { code: "NZD", name: "New Zealand Dollar", countryCode: "NZ" },
  { code: "SGD", name: "Singapore Dollar", countryCode: "SG" },
  { code: "MXN", name: "Mexican Peso", countryCode: "MX" },
  { code: "HKD", name: "Hong Kong Dollar", countryCode: "HK" },
];
