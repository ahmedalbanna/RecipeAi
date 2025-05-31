
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DIETARY_RESTRICTIONS_OPTIONS } from '@/lib/constants';
import type { DietaryRestrictionOption } from '@/lib/types';
import { Loader2, Filter, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DietaryFilterProps {
  recipeTitle: string;
  onCheckSuitability: (dietaryRestrictions: string[]) => Promise<void>;
  isLoading: boolean;
  filterResult: { type: keyof ReturnType<typeof getFilterResultContent> } | null;
}

const getFilterResultContent = (t: Function) => ({
  match: {
    Icon: CheckCircle2,
    text: t("filterResult.match"),
    className: "text-green-600 dark:text-green-400"
  },
  noMatch: {
    Icon: XCircle,
    text: t("filterResult.noMatch"),
    className: "text-destructive"
  },
  noSelection: {
    Icon: Filter,
    text: t("filterResult.noSelection"),
    className: "text-muted-foreground"
  }
});

export function DietaryFilter({ recipeTitle, onCheckSuitability, isLoading, filterResult }: DietaryFilterProps) {
  const { t } = useLanguage();
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  
  const filterResultContent = getFilterResultContent(t);

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

  const ResultContentDetails = filterResult ? filterResultContent[filterResult.type] : null;

  return (
    <Card className="shadow-lg animate-in fade-in-0 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{t('dietaryCheck')}</CardTitle>
        <CardDescription>
          {t('checkIfRecipeFits', { recipeTitle: recipeTitle })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label className="font-medium">{t('selectDietaryPreferences')}</Label>
          {DIETARY_RESTRICTIONS_OPTIONS.map((option: DietaryRestrictionOption) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox
                id={option.id}
                checked={selectedRestrictions.includes(option.id)}
                onCheckedChange={() => handleRestrictionChange(option.id)}
                aria-label={t(option.labelKey)}
              />
              <Label htmlFor={option.id} className="flex items-center gap-2 cursor-pointer">
                <option.icon className="h-5 w-5 text-accent" />
                {t(option.labelKey)}
              </Label>
            </div>
          ))}
        </div>
        <Button onClick={handleSubmit} className="w-full" disabled={isLoading || selectedRestrictions.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('checking')}...
            </>
          ) : (
            t('checkSuitability')
          )}
        </Button>
        {ResultContentDetails && (
           <div className={`flex items-center gap-2 p-3 rounded-md border ${ResultContentDetails.className} bg-opacity-10 ${filterResult?.type === 'match' ? 'bg-green-500 border-green-600' : filterResult?.type === 'noMatch' ? 'bg-red-500 border-red-600' : 'bg-muted border-border'}`}>
            <ResultContentDetails.Icon className="h-5 w-5" />
            <span className="text-sm">{ResultContentDetails.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
