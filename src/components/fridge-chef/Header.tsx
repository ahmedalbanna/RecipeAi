import { ChefHat } from 'lucide-react';

export function Header() {
  return (
    <header className="py-6 bg-primary/10 shadow-md">
      <div className="container mx-auto flex items-center gap-3 px-4">
        <ChefHat className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline font-bold text-primary">
          FridgeChef
        </h1>
      </div>
    </header>
  );
}
