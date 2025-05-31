'use server';

/**
 * @fileOverview Filters recipes based on dietary restrictions.
 *
 * - filterRecipes - A function that filters recipes based on dietary restrictions.
 * - FilterRecipesInput - The input type for the filterRecipes function.
 * - FilterRecipesOutput - The return type for the filterRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FilterRecipesInputSchema = z.object({
  recipes: z.array(z.string()).describe('An array of recipes to filter.'),
  dietaryRestrictions: z
    .array(z.string())
    .describe(
      'An array of dietary restrictions to filter by (e.g., vegetarian, vegan, gluten-free).'
    ),
});
export type FilterRecipesInput = z.infer<typeof FilterRecipesInputSchema>;

const FilterRecipesOutputSchema = z.object({
  filteredRecipes: z
    .array(z.string())
    .describe('An array of recipes that match the specified dietary restrictions.'),
});
export type FilterRecipesOutput = z.infer<typeof FilterRecipesOutputSchema>;

export async function filterRecipes(input: FilterRecipesInput): Promise<FilterRecipesOutput> {
  return filterRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterRecipesPrompt',
  input: {schema: FilterRecipesInputSchema},
  output: {schema: FilterRecipesOutputSchema},
  prompt: `You are a recipe filtering expert. You will receive a list of recipes and a list of dietary restrictions.
Your goal is to filter the recipes based on the dietary restrictions and return a list of recipes that match the restrictions.

Recipes: {{{recipes}}}
Dietary Restrictions: {{{dietaryRestrictions}}}

Filtered Recipes:`,
});

const filterRecipesFlow = ai.defineFlow(
  {
    name: 'filterRecipesFlow',
    inputSchema: FilterRecipesInputSchema,
    outputSchema: FilterRecipesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
