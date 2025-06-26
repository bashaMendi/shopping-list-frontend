"use client";
import React from 'react';
import Select from 'react-select';
import type { Category } from '../../types';

interface CategorySelectProps {
  categories: Category[];
  selectedCategory: string;
  newCategory?: string;
  onCategoryChange: (value: string) => void;
  onNewCategoryChange: (value: string) => void;
  onAddCategory: () => void;
  loading: boolean;
}

const CategorySelect: React.FC<CategorySelectProps> = ({
  categories,
  selectedCategory,
  newCategory = '',
  onCategoryChange,
  onNewCategoryChange,
  onAddCategory,
  loading,
}) => {
  // react-select expects options as { value, label }
  const options = categories.map(cat => ({ value: cat.id, label: cat.name }));
  const selectedOption = options.find(opt => opt.value === selectedCategory) || null;

  return (
    <div className="d-flex align-items-end gap-2 flex-nowrap" style={{ width: '100%' }}>
      <div style={{ minWidth: 120, maxWidth: 180, flex: 1 }}>
        <Select
          options={options}
          value={selectedOption}
          onChange={opt => onCategoryChange(opt ? opt.value : '')}
          isClearable
          isSearchable
          placeholder="בחר קטגוריה"
          isDisabled={loading}
          styles={{
            menu: base => ({ ...base, zIndex: 99999, direction: 'rtl' }),
            input: base => ({ ...base, direction: 'rtl' }),
            control: base => ({ ...base, minHeight: 32, fontSize: 14, direction: 'rtl' }),
            option: base => ({ ...base, textAlign: 'right', direction: 'rtl' }),
          }}
          theme={theme => ({
            ...theme,
            borderRadius: 6,
            spacing: { ...theme.spacing, controlHeight: 32 },
          })}
          classNamePrefix="react-select"
          menuPlacement="auto"
          menuPosition="fixed"
        />
      </div>
      <input
        type="text"
        className="form-control"
        placeholder="קטגוריה חדשה"
        value={newCategory || ''}
        onChange={e => onNewCategoryChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onAddCategory()}
        disabled={loading}
        style={{ maxWidth: 140 }}
      />
      <button
        type="button"
        className="btn btn-success d-flex align-items-center justify-content-center"
        onClick={onAddCategory}
        disabled={loading || !(newCategory || '').trim()}
        title="הוסף קטגוריה"
        style={{ minWidth: 36 }}
      >
        <i className="bi bi-plus"></i>
      </button>
    </div>
  );
};

export default CategorySelect; 