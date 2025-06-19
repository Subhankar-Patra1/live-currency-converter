
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, HelpCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AIInsightsProps {
  insights?: string;
  trendReasoning?: string; // Kept for prop compatibility, but not displayed
  predictedTrend?: string; // Kept for prop compatibility, but not displayed
  disclaimer?: string;
  isLoading: boolean;
}

export function AIInsights({ insights, disclaimer, isLoading }: AIInsightsProps) {
  if (isLoading) {
    return (
      <Card className="mt-6 shadow-lg bg-card">
        <CardHeader>
          <div className="flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-accent" />
            <CardTitle className="font-headline">AI Powered Insights</CardTitle>
          </div>
          <CardDescription>Fetching latest analysis...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Skeleton className="h-4 w-1/3 mb-2" /> {/* Title skeleton */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-4 w-1/2" /> {/* Disclaimer skeleton */}
        </CardFooter>
      </Card>
    );
  }

  if (!insights) { 
    return null; 
  }

  return (
    <Card className="mt-8 shadow-lg bg-card border-accent/30" data-testid="ai-insights-card">
      <CardHeader>
        <div className="flex items-center">
          <Lightbulb className="h-6 w-6 mr-2 text-accent animate-pulse" />
          <CardTitle className="font-headline text-primary">AI Powered Insights</CardTitle>
        </div>
        <CardDescription>Contextual information about your selected currency pair(s).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1 flex items-center">
              <HelpCircle className="h-4 w-4 mr-2 text-primary/80" />
              General Insights & Tips
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-line">{insights}</p>
          </div>
        )}
      </CardContent>
      {disclaimer && (
        <CardFooter>
          <p className="text-xs text-muted-foreground italic">{disclaimer}</p>
        </CardFooter>
      )}
    </Card>
  );
}

