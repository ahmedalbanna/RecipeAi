
'use client';

import { useState } from 'react';
import { Header } from '@/components/fridge-chef/Header';
import { IngredientInputForm } from '@/components/fridge-chef/IngredientInputForm';
import { RecipeDisplay } from '@/components/fridge-chef/RecipeDisplay';
import { DietaryFilter } from '@/components/fridge-chef/DietaryFilter';
import type { Recipe } from '@/lib/types';
import { generateRecipe, type GenerateRecipeInput as AIInputType } from '@/ai/flows/generate-recipe';
import { filterRecipes } from '@/ai/flows/filter-recipes';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

// Wrapper type because AIInputType is just ingredients, but we need to pass language from page
interface FormInputValues {
  ingredients: string;
}


export default function FridgeChefPage() {
  const { t, language } = useLanguage();
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterCheckResult, setFilterCheckResult] = useState<keyof ReturnType<typeof import('@/components/fridge-chef/DietaryFilter')['getFilterResultContent']> | null>(null);


  const { toast } = useToast();

  const handleGenerateRecipe = async (values: FormInputValues) => {
    setIsGenerating(true);
    setGeneratedRecipe(null); 
    setFilterCheckResult(null); 
    try {
      const recipeOutput = await generateRecipe({ 
        ingredients: values.ingredients,
        language: language === 'ar' ? 'Arabic' : 'English' 
      });
      setGeneratedRecipe(recipeOutput);
      if (recipeOutput.missingIngredients && recipeOutput.missingIngredients.length > 0 && (!recipeOutput.instructions || recipeOutput.instructions.length === 0)) {
        toast({
          title: t('suggestionsProvidedToastTitle'),
          description: t('suggestionsProvidedToastDescription'),
          variant: 'default',
        });
      } else {
        toast({
          title: t('recipeGeneratedToastTitle'),
          description: t('recipeGeneratedToastDescription', { title: recipeOutput.title }),
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: t('errorTitle'),
        description: t('errorGeneratingRecipe'),
        variant: 'destructive',
      });
      setGeneratedRecipe(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckSuitability = async (dietaryRestrictions: string[]) => {
    if (!generatedRecipe) return;
    if (dietaryRestrictions.length === 0) {
      setFilterCheckResult('noSelection');
      return;
    }

    setIsFiltering(true);
    setFilterCheckResult(null); 
    try {
      const filterInput = {
        // Note: Recipe title might be in Arabic or English.
        // The filterRecipes flow currently doesn't account for language of the recipe title.
        // For a more robust solution, filterRecipes might also need a language hint or operate on language-agnostic identifiers if possible.
        // For now, we pass the title as is.
        recipes: [generatedRecipe.title], 
        dietaryRestrictions: dietaryRestrictions,
      };
      const filterOutput = await filterRecipes(filterInput);
      if (filterOutput.filteredRecipes && filterOutput.filteredRecipes.length > 0) {
        setFilterCheckResult('match');
      } else {
        setFilterCheckResult('noMatch');
      }
    } catch (error) {
      console.error('Error filtering recipe:', error);
      toast({
        title: t('errorTitle'),
        description: t('errorFilteringRecipe'),
        variant: 'destructive',
      });
      setFilterCheckResult(null);
    } finally {
      setIsFiltering(false);
    }
  };
  
  const currentFilterResultForComponent = filterCheckResult ? { type: filterCheckResult } : null;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 md:p-8 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 space-y-8">
            <IngredientInputForm onSubmit={handleGenerateRecipe} isLoading={isGenerating} />
            {generatedRecipe && (
              <DietaryFilter
                recipeTitle={generatedRecipe.title}
                onCheckSuitability={handleCheckSuitability}
                isLoading={isFiltering}
                filterResult={currentFilterResultForComponent}
              />
            )}
          </section>
          <section className="lg:col-span-2">
            <RecipeDisplay recipe={generatedRecipe} isLoading={isGenerating} />
          </section>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm border-t mt-auto">
        {t('footerText', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
