'use client';

import { useState } from 'react';
import { Header } from '@/components/fridge-chef/Header';
import { IngredientInputForm } from '@/components/fridge-chef/IngredientInputForm';
import { RecipeDisplay } from '@/components/fridge-chef/RecipeDisplay';
import { DietaryFilter, filterResultContent } from '@/components/fridge-chef/DietaryFilter';
import type { Recipe } from '@/lib/types';
import { generateRecipe, type GenerateRecipeInput } from '@/ai/flows/generate-recipe';
import { filterRecipes } from '@/ai/flows/filter-recipes';
import { useToast } from '@/hooks/use-toast';

export default function FridgeChefPage() {
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [filterCheckResult, setFilterCheckResult] = useState<keyof typeof filterResultContent | null>(null);

  const { toast } = useToast();

  const handleGenerateRecipe = async (values: GenerateRecipeInput) => {
    setIsGenerating(true);
    setGeneratedRecipe(null); // Clear previous recipe
    setFilterCheckResult(null); // Clear previous filter result
    try {
      const recipeOutput = await generateRecipe({ ingredients: values.ingredients });
      setGeneratedRecipe(recipeOutput);
      if (recipeOutput.missingIngredients && recipeOutput.missingIngredients.length > 0 && (!recipeOutput.instructions || recipeOutput.instructions.length === 0)) {
        toast({
          title: 'Suggestions Provided!',
          description: 'We found some items you could add to make a great recipe.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Recipe Generated!',
          description: `Chef's special: ${recipeOutput.title}`,
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error generating recipe:', error);
      toast({
        title: 'Error',
        description: 'Could not generate recipe. Please try again.',
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
        title: 'Error',
        description: 'Could not check recipe suitability. Please try again.',
        variant: 'destructive',
      });
      setFilterCheckResult(null);
    } finally {
      setIsFiltering(false);
    }
  };
  
  const currentFilterResult = filterCheckResult ? { type: filterCheckResult } : null;


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
                filterResult={currentFilterResult}
              />
            )}
          </section>
          <section className="lg:col-span-2">
            <RecipeDisplay recipe={generatedRecipe} isLoading={isGenerating} />
          </section>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm border-t mt-auto">
        © {new Date().getFullYear()} FridgeChef. Cook with what you have!
      </footer>
    </div>
  );
}
