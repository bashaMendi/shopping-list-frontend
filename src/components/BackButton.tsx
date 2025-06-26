import React from 'react';
import { useRouter } from 'next/navigation';

const BackButton: React.FC = () => {
  const router = useRouter();
  return (
    <button type="button" className="btn btn-outline-secondary" onClick={() => router.back()}>
      <i className="bi bi-arrow-right ms-2"></i>
      חזור
    </button>
  );
};

export default BackButton; 