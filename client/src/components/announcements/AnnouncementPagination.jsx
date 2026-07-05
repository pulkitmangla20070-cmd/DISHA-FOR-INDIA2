import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AnnouncementPagination = ({ currentPage = 1, totalPages = 1, totalItems = 0, itemsPerPage = 9, onPageChange }) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <nav aria-label="Announcement pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>
        Showing <span style={{ fontWeight: 600, color: 'var(--color-heading)' }}>{startItem}</span> to <span style={{ fontWeight: 600, color: 'var(--color-heading)' }}>{endItem}</span> of <span style={{ fontWeight: 600, color: 'var(--color-heading)' }}>{totalItems}</span> results
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            color: currentPage === 1 ? 'var(--color-border)' : 'var(--color-heading)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span style={{ padding: '0.5rem', color: 'var(--color-body)' }}>…</span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: page === currentPage ? 'var(--color-primary)' : 'var(--color-card)',
                  border: `1px solid ${page === currentPage ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  color: page === currentPage ? '#fff' : 'var(--color-heading)',
                  fontSize: '0.85rem',
                  fontWeight: page === currentPage ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'var(--transition-fast)',
                }}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          style={{
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            color: currentPage === totalPages ? 'var(--color-border)' : 'var(--color-heading)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default AnnouncementPagination;
