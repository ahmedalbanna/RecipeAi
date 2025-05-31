
'use client';

import { ChefHat, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <header className="py-6 bg-primary/10 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <ChefHat className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-headline font-bold text-primary">
            {t('fridgeChef')}
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Languages className="h-5 w-5" />
              <span className="sr-only">{t('selectLanguage')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => setLanguage('en')}
              disabled={language === 'en'}
            >
              {t('language.english')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLanguage('ar')}
              disabled={language === 'ar'}
            >
              {t('language.arabic')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
