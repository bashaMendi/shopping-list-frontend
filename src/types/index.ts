// Shopping list types for the whole app

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  name: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: Product[];
  createdAt?: string;
  updatedAt?: string;
} 