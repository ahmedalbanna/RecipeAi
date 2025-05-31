
'use server';

/**
 * @fileOverview Generates a recipe based on a list of ingredients and desired language.
 *
 * - generateRecipe - A function that generates a recipe based on the given ingredients and language.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma separated list of ingredients available to use in the recipe.'),
  language: z.string().describe('The language for the recipe (e.g., "English", "Arabic"). Default is English.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  ingredients: z.array(z.string()).describe('The list of ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('The step-by-step instructions to prepare the recipe.'),
  missingIngredients: z.array(z.string()).optional().describe('A list of ingredients that are needed but not available in the input.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a recipe generating AI. A user will provide you with a list of ingredients they have available and a desired language.

You will generate a recipe using those ingredients. The recipe (title, ingredients list, instructions) MUST be in the specified language: {{{language}}}.

If there are not enough ingredients to make a full recipe in {{{language}}}, you will respond with a list of missing ingredients, also in {{{language}}}.

Available Ingredients: {{{ingredients}}}

If there are missing ingredients, populate the missingIngredients array with a list of ingredients the user can easily add to make a complete recipe.
The entire response (title, ingredients, instructions, missingIngredients) should be in {{{language}}}.`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async (input) => {
    // Ensure language is explicitly passed, default to English if not provided.
    const flowInput = {
      ...input,
      language: input.language || 'English',
    };
    const {output} = await prompt(flowInput);
    return output!;
  }
);
