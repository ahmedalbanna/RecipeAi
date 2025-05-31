'use server';

/**
 * @fileOverview AI flow to suggest missing ingredients for a recipe based on the user's current ingredients.
 *
 * - suggestMissingIngredients - A function that suggests missing ingredients.
 * - SuggestMissingIngredientsInput - The input type for the suggestMissingIngredients function.
 * - SuggestMissingIngredientsOutput - The return type for the suggestMissingIngredients function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestMissingIngredientsInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma separated list of ingredients the user has.'),
  recipeType: z
    .string()
    .describe('The type of recipe the user wants to make e.g. pasta, salad, etc.'),
});
export type SuggestMissingIngredientsInput = z.infer<
  typeof SuggestMissingIngredientsInputSchema
>;

const SuggestMissingIngredientsOutputSchema = z.object({
  missingIngredients: z
    .string()
    .describe(
      'A comma separated list of ingredients the user should add to make a complete recipe.'
    ),
  reasoning: z
    .string()
    .describe('The AI reasoning for suggesting these ingredients.'),
});
export type SuggestMissingIngredientsOutput = z.infer<
  typeof SuggestMissingIngredientsOutputSchema
>;

export async function suggestMissingIngredients(
  input: SuggestMissingIngredientsInput
): Promise<SuggestMissingIngredientsOutput> {
  return suggestMissingIngredientsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestMissingIngredientsPrompt',
  input: {schema: SuggestMissingIngredientsInputSchema},
  output: {schema: SuggestMissingIngredientsOutputSchema},
  prompt: `You are a recipe suggestion AI.

You will be provided a list of ingredients, and a desired recipe type.

You will suggest ingredients to add to the user's list of ingredients so that they can successfully create the recipe.

Ingredients: {{{ingredients}}}
Recipe Type: {{{recipeType}}}

Respond with only the suggested ingredients and the reasoning behind your choices.`,
});

const suggestMissingIngredientsFlow = ai.defineFlow(
  {
    name: 'suggestMissingIngredientsFlow',
    inputSchema: SuggestMissingIngredientsInputSchema,
    outputSchema: SuggestMissingIngredientsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
