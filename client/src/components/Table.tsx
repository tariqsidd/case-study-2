import { JSX, ReactNode, CSSProperties } from 'react';

export type Column<T> = {
  key: keyof T | string; // supports nested via custom render
  header: string;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, rowIndex: number) => ReactNode;
};

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  rowKey?: (row: T, index: number) => string | number;
  bordered?: boolean;
  dense?: boolean;
  styles?: {
    table?: CSSProperties;
    th?: CSSProperties;
    td?: CSSProperties;
  };
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  emptyText = 'No data',
  rowKey,
  bordered = true,
  dense = false,
  styles = {},
}: TableProps<T>): JSX.Element {
  const cellPadding = dense ? '6px' : '8px';
  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    ...styles.table,
  };
  const thStyle: CSSProperties = {
    textAlign: 'left',
    borderBottom: bordered ? '1px solid #ddd' : undefined,
    padding: cellPadding,
    background: '#333',
    fontWeight: 600,
    fontSize: 14,
    ...styles.th,
  };
  const tdStyle: CSSProperties = {
    borderBottom: bordered ? '1px solid #f0f0f0' : undefined,
    padding: cellPadding,
    fontSize: 14,
    ...styles.td,
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} style={{ ...thStyle, textAlign: c.align ?? thStyle.textAlign, width: c.width }}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((row, ri) => (
            <tr key={rowKey ? rowKey(row, ri) : ri}>
              {columns.map((c, ci) => (
                <td key={ci} style={{ ...tdStyle, textAlign: c.align ?? tdStyle.textAlign }}>
                  {c.render ? c.render(row, ri) : (row as any)[c.key as any]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default Table;
