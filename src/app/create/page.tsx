'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { resetStatus } from '../../features/shoppingLists/shoppingListsSlice';
import { createShoppingList } from '../../utils/api';
import { useCategories } from '../../hooks/useCategories';
import type { Product } from '../../types';
import CategorySelect from '../../features/shoppingLists/CategorySelect';
import ProductTable from '../../features/shoppingLists/ProductTable';
import BackButton from '../../components/BackButton';
import ErrorAlert from '../../components/ErrorAlert';

export default function CreateListPage() {
  const [listName, setListName] = useState('');
  const { categories, error: categoriesError, addCategory } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productQuantity, setProductQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

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

  // Total quantity
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  // Submit list
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listName.trim() || products.length === 0) {
      setError('יש להזין שם רשימה ולהוסיף לפחות מוצר אחד');
      return;
    }
    setLoadingAction(true);
    setError('');
    try {
      await createShoppingList({
        name: listName,
        items: products,
      });
      dispatch(resetStatus());
      router.push('/?created=1');
    } catch {
      setError('שגיאה ביצירת הרשימה');
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
                צור רשימת קניות חדשה
              </h2>
            </div>
            <ErrorAlert message={error} />
            <ErrorAlert message={categoriesError} />
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
                        categories={categories}
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
                categories={categories}
                onRemoveProduct={handleRemoveProduct}
              />
              <div className="mb-3 text-end">
                <strong>סך כל המוצרים: {totalQuantity}</strong>
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2" disabled={loadingAction}>
                <i className="bi bi-check-circle"></i>
                הוסף רשימה
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 