import React from 'react';

interface ShoppingListCardProps {
  name: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ShoppingListCard: React.FC<ShoppingListCardProps> = ({ name, onEdit, onDelete }) => (
  <div className="card shadow-sm mb-3">
    <div className="card-body d-flex flex-column justify-content-between">
      <h5 className="card-title">{name}</h5>
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-outline-primary" title="ערוך" onClick={onEdit}>
          <i className="bi bi-pencil"></i>
        </button>
        <button className="btn btn-outline-danger" title="מחק" onClick={onDelete}>
          <i className="bi bi-trash"></i>
        </button>
      </div>
    </div>
  </div>
);

export default ShoppingListCard; 