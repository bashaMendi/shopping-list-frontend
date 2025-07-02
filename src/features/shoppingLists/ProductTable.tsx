import React from 'react';
import type { Product, Category } from '../../types';

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onRemoveProduct: (idx: number) => void;
  onChangeProductQuantity?: (idx: number, newQuantity: number) => void;
  editableQuantity?: boolean;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  onRemoveProduct,
  onChangeProductQuantity,
  editableQuantity = false,
}) => {
  // Group products by category
  const categoriesWithProducts = categories.filter(cat => products.some(p => p.categoryId === cat.id));
  const productsByCategory = categoriesWithProducts.reduce((acc, cat) => {
    acc[cat.id] = products.filter(p => p.categoryId === cat.id);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div className="row mb-4">
      {categoriesWithProducts.map(cat => {
        const totalInCategory = productsByCategory[cat.id]?.reduce((sum, p) => sum + p.quantity, 0) || 0;
        return (
          <div className="col-md-3" key={cat.id}>
            <div className="card mb-3">
              <div className="card-header text-center fw-bold">
                {cat.name} <span className="text-secondary" style={{ fontSize: '0.95em' }}>(סה&quot;כ: {totalInCategory})</span>
              </div>
              <ul className="list-group list-group-flush">
                {productsByCategory[cat.id]?.map((p, idx) => (
                  <li className="list-group-item d-flex justify-content-between align-items-center" key={p.name + idx}>
                    <span>{p.name}</span>
                    <div className="d-flex align-items-center gap-2">
                      {editableQuantity && onChangeProductQuantity ? (
                        <input
                          type="number"
                          min={1}
                          className="form-control form-control-sm"
                          style={{ width: 60 }}
                          value={p.quantity}
                          onChange={e => {
                            const val = Number(e.target.value);
                            if (val > 0) onChangeProductQuantity(products.findIndex(x => x === p), val);
                          }}
                        />
                      ) : (
                        <span className="badge bg-primary ms-2">{p.quantity}</span>
                      )}
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onRemoveProduct(products.findIndex(x => x === p))}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductTable; 