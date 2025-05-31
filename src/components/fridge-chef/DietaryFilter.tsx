'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DIETARY_RESTRICTIONS_OPTIONS } from '@/lib/constants';
import type { DietaryRestrictionOption } from '@/lib/types';
import { Loader2, Filter, CheckCircle2, XCircle } from 'lucide-react';

interface DietaryFilterProps {
  recipeTitle: string;
  onCheckSuitability: (dietaryRestrictions: string[]) => Promise<void>;
  isLoading: boolean;
  filterResult: {-readonly [K in keyof typeof filterResultContent]: (typeof filterResultContent)[K]} | null;
}

export const filterResultContent = {
  match: {
    Icon: CheckCircle2,
    text: "This recipe matches your selected dietary preferences!",
    className: "text-green-600 dark:text-green-400"
  },
  noMatch: {
    Icon: XCircle,
    text: "This recipe may not suit your selected dietary preferences.",
    className: "text-destructive"
  },
  noSelection: {
    Icon: Filter,
    text: "Select dietary preferences to check the recipe.",
    className: "text-muted-foreground"
  }
}

export function DietaryFilter({ recipeTitle, onCheckSuitability, isLoading, filterResult }: DietaryFilterProps) {
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  const handleRestrictionChange = (restrictionId: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restrictionId)
        ? prev.filter((id) => id !== restrictionId)
        : [...prev, restrictionId]
    );
  };

  const handleSubmit = () => {
    onCheckSuitability(selectedRestrictions);
  };

  const ResultContent = filterResult ? filterResultContent[filterResult.type as keyof typeof filterResultContent] : null;


  return (
    <Card className="shadow-lg animate-in fade-in-0 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Dietary Check</CardTitle>
        <CardDescription>
          Check if '{recipeTitle}' fits specific dietary needs.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="font-medium">Select Dietary Preferences:</Label>
          {DIETARY_RESTRICTIONS_OPTIONS.map((option: DietaryRestrictionOption) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedRestrictions.includes(option.id)}
                onCheckedChange={() => handleRestrictionChange(option.id)}
                aria-label={option.label}
              />
              <Label htmlFor={option.id} className="flex items-center gap-2 cursor-pointer">
                <option.icon className="h-5 w-5 text-accent" />
                {option.label}
              </Label>
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={isLoading || selectedRestrictions.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Suitability'
          )}
        </Button>
        {ResultContent && (
           <div className={`flex items-center gap-2 p-3 rounded-md border ${ResultContent.className} bg-opacity-10 ${filterResult?.type === 'match' ? 'bg-green-500 border-green-600' : filterResult?.type === 'noMatch' ? 'bg-red-500 border-red-600' : 'bg-muted border-border'}`}>
            <ResultContent.Icon className="h-5 w-5" />
            <span className="text-sm">{ResultContent.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
