import type { Recipe } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { AlertCircle, ListChecks, Utensils } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="shadow-lg w-full animate-in fade-in-0 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">{recipe.title}</CardTitle>
        {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
           <CardDescription className="text-destructive flex items-center gap-2 pt-2">
            <AlertCircle className="h-5 w-5" />
            <span>Some ingredients might be missing for the original idea.</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-headline text-xl mb-2 flex items-center gap-2 text-accent">
            <ListChecks className="h-5 w-5" />
            Ingredients
          </h3>
          <ul className="list-disc list-inside space-y-1 pl-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-foreground/90">{ingredient}</li>
            ))}
          </ul>
        </div>
        
        {recipe.instructions && recipe.instructions.length > 0 && (
          <div>
            <h3 className="font-headline text-xl mb-2 flex items-center gap-2 text-accent">
              <Utensils className="h-5 w-5" />
              Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 pl-2">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="text-foreground/90">{step}</li>
              ))}
            </ol>
          </div>
        )}

        {(!recipe.instructions || recipe.instructions.length === 0) && recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
          <p className="text-muted-foreground italic">
            It seems there aren't enough ingredients for a full recipe. Try adding the suggested items below!
          </p>
        )}

      </CardContent>
      {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
        <CardFooter className="flex-col items-start gap-2 border-t pt-4">
            <h3 className="font-headline text-lg mb-1 flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Suggested Additions:
            </h3>
            <div className="flex flex-wrap gap-2">
            {recipe.missingIngredients.map((missing, index) => (
              <Badge key={index} variant="destructive" className="text-sm">
                {missing}
              </Badge>
            ))}
            </div>
        </CardFooter>
      )}
    </Card>
  );
}
