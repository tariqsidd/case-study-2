import {CSSProperties, JSX, useEffect} from 'react';

const containerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '70vh',
};

const spinnerStyle: CSSProperties = {
  width: '48px',
  height: '48px',
  border: '4px solid rgba(0, 0, 0, 0.1)',
  borderTopColor: '#646cff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

// Inject keyframes once
const ensureSpinKeyframes = (() => {
  let injected = false;
  return () => {
    if (injected) return;
    const style = document.createElement('style');
    style.innerHTML = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
    document.head.appendChild(style);
    injected = true;
  };
})();

const Loader: () => JSX.Element = () => {
  useEffect(() => {
    ensureSpinKeyframes();
  }, []);

  return (
    <div style={containerStyle}>
      <div style={spinnerStyle} aria-label="loading" role="status" />
    </div>
  );
};

export default Loader;
