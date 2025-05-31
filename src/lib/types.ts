
import type { GenerateRecipeOutput as AIResponseRecipe } from '@/ai/flows/generate-recipe';
import type { LucideIcon } from 'lucide-react';

export type Recipe = AIResponseRecipe;

export interface DietaryRestrictionOption {
  id: string;
  labelKey: string; // Changed from label to labelKey for translation
  icon: LucideIcon;
}
