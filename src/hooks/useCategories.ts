import { useState, useEffect, useCallback } from 'react';
import { fetchCategories, createCategory } from '../utils/api';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch(() => setError('שגיאה בטעינת קטגוריות'))
      .finally(() => setLoading(false));
  }, []);

  const addCategory = useCallback(async (name: string) => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const cat = await createCategory({ name });
      setCategories(prev => [...prev, cat]);
      return cat;
    } catch {
      setError('שגיאה בהוספת קטגוריה');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { categories, loading, error, addCategory };
} 