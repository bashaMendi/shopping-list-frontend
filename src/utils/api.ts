import axios from 'axios';
import type { ShoppingList, Category, Product } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export async function fetchShoppingLists(): Promise<ShoppingList[]> {
  const res = await axios.get(`${API_BASE}/shopping-lists`);
  return res.data;
}

export async function createShoppingList(list: { name: string; items: Product[] }): Promise<ShoppingList> {
  const res = await axios.post(`${API_BASE}/shopping-lists`, list);
  return res.data;
}

export async function updateShoppingList(id: string, list: { name: string; items: Product[] }): Promise<ShoppingList> {
  const res = await axios.put(`${API_BASE}/shopping-lists/${id}`, list);
  return res.data;
}

export async function deleteShoppingList(id: string): Promise<void> {
  await axios.delete(`${API_BASE}/shopping-lists/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await axios.get(`${API_BASE}/categories`);
  return res.data;
}

export async function createCategory(category: { name: string }): Promise<Category> {
  const res = await axios.post(`${API_BASE}/categories`, category);
  return res.data;
} 
