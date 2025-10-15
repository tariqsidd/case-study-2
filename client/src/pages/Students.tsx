import { JSX, useMemo, useState } from 'react';
import { useFetcher } from '../hooks/useFetcher';
import { useMutate } from '../hooks/useMutate';
import { deleteStudent } from '../services/students';
import Table from '../components/Table';
import Modal from '../components/Modal';
import AddStudentForm from '../components/AddStudentForm';
import type { Student } from '../types/student';

// Student type imported from shared types

// Columns are created in-component so we can access handlers

function Students(): JSX.Element {
  const { data, loading, error, refetch } = useFetcher<Student[]>('/students', { auto: true });
  const rows = data ?? [];
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Student | null>(null);

  const delMut = useMutate<{ success: boolean }, Error, number>(deleteStudent);

  const columns = useMemo(() => {
    return [
      { key: 'uuid', header: 'UUID', width: 100 },
      { key: 'name', header: 'Name' },
      { key: 'class', header: 'Class', width: 80 },
      { key: 'age', header: 'Age', width: 80, align: 'right' },
      { key: 'sex', header: 'Sex', width: 100 },
      { key: 'siblings', header: 'Siblings', width: 100, align: 'right' },
      { key: 'gpa', header: 'GPA', width: 100, align: 'right' },
      {
        key: 'actions',
        header: 'Actions',
        width: 180,
        render: (row: Student) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => {
                setSelected(row);
                setEditMode('edit');
                setModalOpen(true);
              }}
            >
              Edit
            </button>
            <button
              style={{ color: 'white', background: '#d32f2f', border: 'none', padding: '6px 10px', borderRadius: 4 }}
              onClick={async () => {
                if (!confirm(`Delete student ${row.name}?`)) return;
                try {
                  await delMut.mutateAsync(row.uuid);
                  await refetch();
                } catch (e) {
                  alert(`Failed to delete: ${e}`);
                }
              }}
              disabled={delMut.isPending}
            >
              Delete
            </button>
          </div>
        ),
      },
    ];
  }, [refetch]);

  return (
    <div>
      <h1>Students of SafePay</h1>
      <button
        onClick={() => {
          setSelected(null);
          setEditMode('create');
          setModalOpen(true);
        }}
        style={{ marginLeft: 8, marginBottom: 12 }}
      >
        Add Student
      </button>
      {loading && !rows.length && <p>Loading students…</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
      <Table<Student>
        columns={columns}
        data={rows}
        emptyText={loading ? 'Loading…' : 'No students found.'}
        rowKey={(r) => r.uuid}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={<span>{editMode === 'edit' ? 'Edit Student' : 'Add Student'}</span>}
      >
        <AddStudentForm
          mode={editMode}
          uuid={selected?.uuid}
          initial={selected ? {
            class: selected.class,
            name: selected.name,
            sex: selected.sex,
            age: selected.age,
            siblings: selected.siblings,
            gpa: selected.gpa,
          } : undefined}
          onSuccess={() => {
            setModalOpen(false);
            setSelected(null);
            setEditMode('create');
            refetch();
          }}
        />
      </Modal>
    </div>
  );
}

export default Students;
