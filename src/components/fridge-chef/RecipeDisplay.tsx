import type { Recipe } from '@/lib/types';
import { RecipeCard } from './RecipeCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Sparkles, Loader2 } from 'lucide-react';

interface RecipeDisplayProps {
  recipe: Recipe | null;
  isLoading: boolean;
}

export function RecipeDisplay({ recipe, isLoading }: RecipeDisplayProps) {
  if (isLoading) {
    return (
      <Card className="shadow-lg flex flex-col items-center justify-center min-h-[300px] animate-pulse">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            Generating your culinary masterpiece...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Our AI chef is hard at work!</p>
        </CardContent>
      </Card>
    );
  }

  if (!recipe) {
    return (
      <Card className="shadow-lg flex flex-col items-center justify-center min-h-[300px] border-dashed border-2">
        <CardHeader>
           <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="font-headline text-2xl text-center text-muted-foreground">
            Ready to Cook?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Enter your ingredients and let FridgeChef whip up a recipe for you!
          </p>
        </CardContent>
      </Card>
    );
  }

  return <RecipeCard recipe={recipe} />;
}
