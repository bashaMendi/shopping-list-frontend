'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { updateShoppingList } from '../../../utils/api';
import { useCategories } from '../../../hooks/useCategories';
import type { Product, Category } from '../../../types';
import CategorySelect from '../../../features/shoppingLists/CategorySelect';
import ProductTable from '../../../features/shoppingLists/ProductTable';
import BackButton from '../../../components/BackButton';
import ErrorAlert from '../../../components/ErrorAlert';

interface ApiProduct {
  name: string;
  category: string;
  quantity: number;
}

export default function EditListPage() {
  const params = useParams();
  const router = useRouter();
  const [listName, setListName] = useState('');
  const { categories, loading: loadingCategories, error: categoriesError, addCategory } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');
  const [extraCategories, setExtraCategories] = useState<Category[]>([]);

  // Fetch categories and list data on mount
  useEffect(() => {
    if (!categories.length) return;
    setLoadingPage(true);
    fetch(`http://localhost:3001/api/shopping-lists/${params.id}`)
      .then(res => res.json())
      .then((listRes) => {
        const tempExtraCategories: Category[] = [];
        const productsFromServer = listRes.items.map((item: any) => {
          let cat = categories.find((c) => c.id === item.category || c.name === item.category);
          if (!cat) {
            cat = { id: item.category, name: item.category };
            // Avoid duplicates
            if (!tempExtraCategories.find(ec => ec.id === cat.id)) {
              tempExtraCategories.push(cat);
            }
          }
          return {
            name: item.name,
            categoryId: cat.id,
            categoryName: cat.name,
            quantity: item.quantity,
          };
        });
        setListName(listRes.name);
        setProducts(productsFromServer);
        setExtraCategories(tempExtraCategories);
      })
      .catch(() => setError('שגיאה בטעינת הנתונים'))
      .finally(() => setLoadingPage(false));
  }, [params.id, categories]);

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setLoadingAction(true);
    try {
      const cat = await addCategory(newCategory);
      if (cat) {
        setProductCategory(cat.id);
        setNewCategory('');
      }
    } catch {
      setError('שגיאה בהוספת קטגוריה');
    } finally {
      setLoadingAction(false);
    }
  };

  // Add product to list
  const handleAddProduct = () => {
    if (!productName.trim() || !productCategory || productQuantity < 1) return;
    const cat = categories.find(c => c.id === productCategory);
    setProducts(prevProducts => {
      const idx = prevProducts.findIndex(p => p.name === productName && p.categoryId === productCategory);
      if (idx !== -1) {
        // Update quantity if exists
        return prevProducts.map((p, i) =>
          i === idx ? { ...p, quantity: p.quantity + productQuantity } : p
        );
      } else {
        // Add new product
        return [
          ...prevProducts,
          {
            name: productName,
            categoryId: productCategory,
            categoryName: cat ? cat.name : '',
            quantity: productQuantity,
          },
        ];
      }
    });
    setProductName('');
    setProductCategory('');
    setProductQuantity(1);
  };

  // Remove product
  const handleRemoveProduct = (idx: number) => {
    setProducts(products.filter((_, i) => i !== idx));
  };

  // Update product quantity inline
  const handleChangeProductQuantity = (idx: number, newQuantity: number) => {
    setProducts(products => products.map((p, i) => i === idx ? { ...p, quantity: newQuantity } : p));
  };

  // Group products by category (only categories with products)
  const categoriesWithProducts = categories.filter(cat => products.some(p => p.categoryId === cat.id));
  const productsByCategory = categoriesWithProducts.reduce((acc, cat) => {
    acc[cat.id] = products.filter(p => p.categoryId === cat.id);
    return acc;
  }, {} as Record<string, Product[]>);

  // Total quantity
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  // Submit list update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim() || products.length === 0) {
      setError('יש להזין שם רשימה ולהוסיף לפחות מוצר אחד');
      return;
    }
    setLoadingAction(true);
    setError('');
    try {
      await updateShoppingList(params.id as string, {
        name: listName,
        items: products.map(p => ({
          name: p.name,
          category: p.categoryId,
          quantity: p.quantity
        })),
      });
      router.push('/?edited=1');
    } catch {
      setError('שגיאה בעדכון הרשימה');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="">
          <div className="card shadow-sm p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <BackButton />
              <h2 className="mb-0 text-center flex-grow-1">
                עריכת רשימת קניות
              </h2>
            </div>
            <ErrorAlert message={error} />
            <ErrorAlert message={categoriesError} />
            {loadingPage ? (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">טוען...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">שם הרשימה</label>
                  <input className="form-control form-control-lg" value={listName} onChange={e => setListName(e.target.value)} required placeholder="הכנס שם רשימה" />
                </div>
                <div className="card mb-4 p-3 bg-light border-0">
                  <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-4">
                      <label className="form-label">שם מוצר</label>
                      <input className="form-control" value={productName} onChange={e => setProductName(e.target.value)} placeholder="הכנס שם מוצר" />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label">קטגוריה</label>
                      <div className="input-group flex-nowrap">
                        <CategorySelect
                          categories={[...categories, ...extraCategories]}
                          selectedCategory={productCategory}
                          newCategory={newCategory}
                          onCategoryChange={setProductCategory}
                          onNewCategoryChange={setNewCategory}
                          onAddCategory={handleAddCategory}
                          loading={loadingAction}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-2">
                      <label className="form-label">כמות</label>
                      <input type="number" min={1} className="form-control" value={productQuantity} onChange={e => setProductQuantity(Number(e.target.value))} />
                    </div>
                    <div className="col-12 col-md-2 d-grid">
                      <button type="button" className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleAddProduct} disabled={loadingAction}>
                        <i className="bi bi-plus-circle"></i>
                        הוסף מוצר
                      </button>
                    </div>
                  </div>
                </div>
                <ProductTable
                  products={products}
                  categories={[...categories, ...extraCategories]}
                  onRemoveProduct={handleRemoveProduct}
                  onChangeProductQuantity={handleChangeProductQuantity}
                  editableQuantity
                />
                <div className="mb-3 text-end">
                  <strong>סך כל המוצרים: {totalQuantity}</strong>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2" disabled={loadingAction}>
                  <i className="bi bi-check-circle"></i>
                  עדכן רשימה
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 