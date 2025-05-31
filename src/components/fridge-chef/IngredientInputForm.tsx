
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const formSchema = (t: Function) => z.object({
  ingredients: z.string().min(3, {
    message: t('ingredientsError'), // Assuming you add 'ingredientsError' to your locale files
  }),
});

type IngredientFormValues = z.infer<ReturnType<typeof formSchema>>;

interface IngredientInputFormProps {
  onSubmit: (values: IngredientFormValues) => Promise<void>;
  isLoading: boolean;
}

export function IngredientInputForm({ onSubmit, isLoading }: IngredientInputFormProps) {
  const { t } = useLanguage();
  // Add "ingredientsError": "Please list at least one ingredient (min 3 chars)." to en.json
  // And "ingredientsError": "يرجى ذكر مكون واحد على الأقل (3 أحرف على الأقل)." to ar.json
  const currentFormSchema = formSchema(t);


  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(currentFormSchema),
    defaultValues: {
      ingredients: '',
    },
  });

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{t('whatsInYourFridge')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="ingredients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('ingredients')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('ingredientsPlaceholder')}
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('generating')}...
                </>
              ) : (
                t('generateRecipe')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
