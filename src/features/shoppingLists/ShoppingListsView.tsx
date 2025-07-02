'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import type { ShoppingList } from '../../types';
import type { RootState } from './store';
import { fetchShoppingLists, removeList } from './shoppingListsSlice';
import Header from '../../components/Header';
import ShoppingListCard from '../../components/ShoppingListCard';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShoppingListsView = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shoppingLists = useAppSelector((state: RootState) => state.shoppingLists.lists) as ShoppingList[];
  const status = useAppSelector((state) => state.shoppingLists.status);
  const error = useAppSelector((state) => state.shoppingLists.error);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch lists on first load or when query param is present
  useEffect(() => {
    if (
      searchParams.get('created') === '1' ||
      searchParams.get('edited') === '1' ||
      searchParams.get('refresh') === '1'
    ) {
      dispatch(fetchShoppingLists());
      // Do NOT clean up query params here!
    } else if (status === 'idle' && shoppingLists.length === 0) {
      dispatch(fetchShoppingLists());
    }
  }, [dispatch, searchParams, status, shoppingLists.length]);

  // Show toast and clean up query params
  useEffect(() => {
    let shouldReplace = false;
    const url = new URL(window.location.href);
    if (searchParams.get('created') === '1') {
      toast.success('הרשימה נוצרה בהצלחה!');
      url.searchParams.delete('created');
      shouldReplace = true;
    }
    if (searchParams.get('edited') === '1') {
      toast.success('הרשימה עודכנה בהצלחה!');
      url.searchParams.delete('edited');
      shouldReplace = true;
    }
    if (searchParams.get('refresh') === '1') {
      url.searchParams.delete('refresh');
      shouldReplace = true;
    }
    if (shouldReplace) {
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }, [searchParams]);

  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(error);
    }
  }, [status, error]);

  const handleCreate = () => {
    router.push('/create');
  };

  const handleEdit = (id: string) => {
    router.push(`/edit/${id}`);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:3001/api/shopping-lists/${deleteId}`);
      dispatch(removeList(deleteId));
      toast.success('הרשימה נמחקה בהצלחה');
    } catch {
      toast.error('שגיאה במחיקת הרשימה');
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  let content;

  if (status === 'loading') {
    content = <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>;
  } else if (status === 'succeeded') {
    if (shoppingLists.length === 0) {
      content = (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '40vh' }}>
          <i className="bi bi-card-list text-secondary" style={{ fontSize: '5rem' }}></i>
          <div className="mt-3 fs-4 text-secondary">אין רשימות להצגה</div>
        </div>
      );
    } else {
      content = (
        <div className="row mt-4">
          {shoppingLists.map((list: ShoppingList) => (
            <div className="col-12 col-md-6 col-lg-4" key={list.id}>
              <ShoppingListCard
                name={list.name}
                onEdit={() => handleEdit(list.id)}
                onDelete={() => handleDelete(list.id)}
              />
            </div>
          ))}
        </div>
      );
    }
  } else if (status === 'failed') {
    content = null; // Toast will show error
  }

  return (
    <>
      <div>
        <Header onCreate={handleCreate} />
        <div className="container mt-4">
          {content}
        </div>
        <ToastContainer rtl position="top-right" autoClose={2000} aria-label="toast-container" />
      </div>
      {/* Delete Confirmation Modal */}
      <div className={`modal fade${showDeleteModal ? ' show d-block' : ''}`} tabIndex={-1} role="dialog" style={showDeleteModal ? { background: 'rgba(0,0,0,0.5)' } : {}}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">אישור מחיקה</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={cancelDelete}></button>
            </div>
            <div className="modal-body">
              <p>האם אתה בטוח שברצונך למחוק את הרשימה?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelDelete}>ביטול</button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>מחק</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingListsView; 