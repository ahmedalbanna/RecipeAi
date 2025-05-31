
import type { DietaryRestrictionOption } from '@/lib/types';
import { Leaf, WheatOff, MilkOff, Carrot } from 'lucide-react';

export const DIETARY_RESTRICTIONS_OPTIONS: DietaryRestrictionOption[] = [
  { id: 'vegetarian', labelKey: 'dietaryOptions.vegetarian', icon: Carrot },
  { id: 'vegan', labelKey: 'dietaryOptions.vegan', icon: Leaf },
  { id: 'gluten-free', labelKey: 'dietaryOptions.gluten-free', icon: WheatOff },
  { id: 'dairy-free', labelKey: 'dietaryOptions.dairy-free', icon: MilkOff },
];
