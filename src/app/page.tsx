import { CurrencyConverter } from "@/components/currency-converter";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-background">
      <CurrencyConverter />
    </main>
  );
}
