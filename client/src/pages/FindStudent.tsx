import { FormEvent, useState, CSSProperties } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { lookupStart, lookupSuccess, lookupFailure, clearRecent } from '../store/studentSlice';
import { getStudent } from '../services/students';

function FindStudent() {
  const dispatch = useAppDispatch();
  const { recent, loading, error } = useAppSelector((s) => s.student);
  const [uuid, setUuid] = useState('');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = uuid.trim();
    if (!trimmed) return;
    dispatch(lookupStart());
    try {
      const data = await getStudent(trimmed);
      // Treat empty object / null / undefined as not found
      const ok = data && Object.keys(data as any).length > 0;
      if (ok) {
        dispatch(lookupSuccess(data));
      } else {
        dispatch(lookupFailure('Student not found'));
      }
      // debug output for troubleshooting
      // eslint-disable-next-line no-console
      console.debug('Lookup response', data);
    } catch (err: any) {
      dispatch(lookupFailure(err?.message || 'Failed to fetch student'));
    }
  };

  const cardStyle: CSSProperties = {
    border: '1px solid #e5e5e5',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    background: '#fff',
    color: '#111',
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
  };

  const labelStyle: CSSProperties = { fontWeight: 600, width: 120, color: '#333' };
  const valueStyle: CSSProperties = { color: '#111' };
  const rowStyle: CSSProperties = { display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid #f4f4f4' };

  return (
    <div>
      <h1>Find Student</h1>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <input
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          placeholder="Enter UUID"
          style={{ padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6, minWidth: 240 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Looking…' : 'Lookup'}
        </button>
        {recent && (
          <button type="button" onClick={() => dispatch(clearRecent())} style={{ marginLeft: 8 }}>
            Clear
          </button>
        )}
      </form>

      {error && <div style={{ color: 'crimson', marginTop: 8 }}>Error: {error}</div>}

      {recent && (
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0, marginBottom: 8, color: '#111' }}>Most recent lookup</h3>
          <div style={rowStyle}><span style={labelStyle}>UUID</span><span style={valueStyle}>{recent.uuid}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Name</span><span style={valueStyle}>{recent.name}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Class</span><span style={valueStyle}>{recent.class}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Sex</span><span style={valueStyle}>{recent.sex}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Age</span><span style={valueStyle}>{recent.age}</span></div>
          <div style={rowStyle}><span style={labelStyle}>Siblings</span><span style={valueStyle}>{recent.siblings}</span></div>
          <div style={{ ...rowStyle, borderBottom: 'none' }}><span style={labelStyle}>GPA</span><span style={valueStyle}>{recent.gpa}</span></div>
        </div>
      )}
    </div>
  );
}

export default FindStudent;
