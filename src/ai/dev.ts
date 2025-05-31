import { config } from 'dotenv';
config();

import '@/ai/flows/filter-recipes.ts';
import '@/ai/flows/generate-recipe.ts';
import '@/ai/flows/suggest-missing-ingredients.ts';