import { JSX, ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  closeOnBackdrop?: boolean;
  width?: number | string;
  maxWidth?: number | string;
};

const modalRoot = (() => {
  if (typeof document === 'undefined') return null;
  let root = document.getElementById('modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'modal-root';
    document.body.appendChild(root);
  }
  return root;
})();

function Modal({
  open,
  onClose,
  title,
  footer,
  children,
  closeOnBackdrop = true,
  width = 600,
  maxWidth = '90vw',
}: ModalProps): JSX.Element | null {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    // Prevent body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !modalRoot) return null;

  const modal = (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeOnBackdrop ? onClose : undefined}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.45)',
        }}
      />

      {/* Dialog */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          background: '#fff',
          color: '#111',
          width,
          maxWidth,
          maxHeight: '90vh',
          borderRadius: 8,
          boxShadow:
            '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        {(title || true) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderBottom: '1px solid #eee',
              background: '#fafafa',
            }}
          >
            <div style={{ fontWeight: 600 }}>{title}</div>
            <button
              aria-label="Close"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
                padding: 4,
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: 16, overflow: 'auto' }}>{children}</div>

        {/* Footer */}
        {footer !== undefined && (
          <div
            style={{
              padding: 12,
              borderTop: '1px solid #eee',
              background: '#fafafa',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 8,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, modalRoot);
}

export default Modal;
