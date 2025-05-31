import type { DietaryRestrictionOption } from '@/lib/types';
import { Leaf, WheatOff, MilkOff, Carrot } from 'lucide-react';

export const DIETARY_RESTRICTIONS_OPTIONS: DietaryRestrictionOption[] = [
  { id: 'vegetarian', label: 'Vegetarian', icon: Carrot },
  { id: 'vegan', label: 'Vegan', icon: Leaf },
  { id: 'gluten-free', label: 'Gluten-Free', icon: WheatOff },
  { id: 'dairy-free', label: 'Dairy-Free', icon: MilkOff },
  // Add more as needed, e.g. nut-free, soy-free, etc.
];
