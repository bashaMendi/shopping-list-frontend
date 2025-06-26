import React from 'react';

const Header = ({ onCreate }: { onCreate: () => void }) => (
  <header className="d-flex justify-content-between align-items-center py-3 px-4 border-bottom bg-white">
    <div className="d-flex align-items-center gap-2">
      <i className="bi bi-card-checklist fs-2 text-primary"></i>
      <span className="fw-bold fs-4">הקניות שלי</span>
    </div>
    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={onCreate}>
      <i className="bi bi-file-earmark-plus"></i>
      צור רשימה
    </button>
  </header>
);

export default Header; 