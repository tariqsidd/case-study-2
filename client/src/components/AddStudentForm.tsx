import { JSX, CSSProperties, ChangeEvent, FormEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { useMutate } from '../hooks/useMutate';
import { createStudent, updateStudent } from '../services/students';

export type AddStudentFormProps = {
  onSuccess: () => void;
  mode?: 'create' | 'edit';
  uuid?: number; // required for edit
  initial?: {
    class: number;
    name: string;
    sex: string;
    age: number;
    siblings: number;
    gpa: number;
  };
};

// Keep numeric inputs as strings to allow empty values in the UI
type FormValues = {
  class: string;
  name: string;
  sex: string;
  age: string;
  siblings: string;
  gpa: string;
};

// Payload expected by API
type Payload = {
  class: number;
  name: string;
  sex: string;
  age: number;
  siblings: number;
  gpa: number;
};

type ApiResponse = { uuid: number };

const initial: FormValues = {
  class: '',
  name: '',
  sex: 'M',
  age: '',
  siblings: '',
  gpa: '',
};

function AddStudentForm({ onSuccess, mode = 'create', uuid, initial: init }: AddStudentFormProps): JSX.Element {
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // When opening in edit mode, seed values from initial
  useEffect(() => {
    if (mode === 'edit' && init) {
      setValues({
        class: String(init.class ?? ''),
        name: init.name ?? '',
        sex: (init.sex as any) ?? 'M',
        age: String(init.age ?? ''),
        siblings: String(init.siblings ?? ''),
        gpa: String(init.gpa ?? ''),
      });
      setErrors({});
    } else if (mode === 'create') {
      setValues(initial);
      setErrors({});
    }
  }, [mode, init]);

  const validate = (v: FormValues) => {
    const e: Record<string, string> = {};
    if (!v.name.trim()) e.name = 'Name is required';
    if (!['M', 'F'].includes(v.sex)) e.sex = 'Sex must be M or F';
    const cls = Number(v.class);
    const age = Number(v.age);
    const sib = Number(v.siblings);
    const gpa = Number(v.gpa);
    if (v.class === '') e.class = 'Class is required';
    else if (!Number.isFinite(cls) || cls <= 0) e.class = 'Class must be a positive number';
    if (v.age === '') e.age = 'Age is required';
    else if (!Number.isFinite(age) || age <= 0) e.age = 'Age must be a positive number';
    if (v.siblings === '') e.siblings = 'Siblings is required';
    else if (!Number.isFinite(sib) || sib < 0) e.siblings = 'Siblings must be 0 or more';
    if (v.gpa === '') e.gpa = 'GPA is required';
    else if (!Number.isFinite(gpa) || gpa < 0) e.gpa = 'GPA must be 0 or more';
    return e;
  };

  // Convert to API payload when values change (only used on submit when valid)
  const body: Payload = useMemo(
    () => ({
      class: Number(values.class),
      name: values.name.trim(),
      sex: values.sex,
      age: Number(values.age),
      siblings: Number(values.siblings),
      gpa: Number(values.gpa),
    }),
    [values]
  );

  // Mutations
  const createMut = useMutate<ApiResponse, Error, Payload>(createStudent);
  const updateMut = useMutate<{ success: boolean }, Error, { uuid: number; payload: Payload }>((vars) => updateStudent(vars.uuid, vars.payload));

  const onChange = (field: keyof FormValues) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const eMap = validate(values);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
    try {
      if (mode === 'edit' && typeof uuid === 'number') {
        await updateMut.mutateAsync({ uuid, payload: body });
      } else {
        await createMut.mutateAsync(body);
      }
      onSuccess();
      setValues(initial);
    } catch (_) {
      // errors are handled via mutation state
    }
  };

  const blockInvalid = (e: KeyboardEvent<HTMLInputElement>) => {
    const invalid = ['e', 'E', '+', '-'];
    if (invalid.includes(e.key)) {
      e.preventDefault();
    }
  };

  const fieldStyle: CSSProperties = { display: 'flex', flexDirection: 'column', marginBottom: 12 };
  const labelStyle: CSSProperties = { fontSize: 13, fontWeight: 600, marginBottom: 4 };
  const inputStyle: CSSProperties = { padding: '8px 10px', border: '1px solid #ddd', borderRadius: 6 };
  const errorStyle: CSSProperties = { color: 'crimson', fontSize: 12, marginTop: 4 };

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Name</label>
          <input value={values.name} onChange={onChange('name')} style={inputStyle} placeholder="e.g. Alice" />
          {errors.name && <span style={errorStyle}>{errors.name}</span>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Sex</label>
          <select value={values.sex} onChange={onChange('sex')} style={inputStyle}>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
          {errors.sex && <span style={errorStyle}>{errors.sex}</span>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Class</label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={values.class}
            onKeyDown={blockInvalid}
            onChange={onChange('class')}
            style={inputStyle}
            placeholder="e.g. 7"
          />
          {errors.class && <span style={errorStyle}>{errors.class}</span>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Age</label>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            value={values.age}
            onKeyDown={blockInvalid}
            onChange={onChange('age')}
            style={inputStyle}
            placeholder="e.g. 13"
          />
          {errors.age && <span style={errorStyle}>{errors.age}</span>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Siblings</label>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={values.siblings}
            onKeyDown={blockInvalid}
            onChange={onChange('siblings')}
            style={inputStyle}
            placeholder="e.g. 2"
          />
          {errors.siblings && <span style={errorStyle}>{errors.siblings}</span>}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>GPA</label>
          <input
            type="number"
            step="0.01"
            min={0}
            inputMode="decimal"
            value={values.gpa}
            onKeyDown={blockInvalid}
            onChange={onChange('gpa')}
            style={inputStyle}
            placeholder="e.g. 3.75"
          />
          {errors.gpa && <span style={errorStyle}>{errors.gpa}</span>}
        </div>
      </div>

      {(createMut.error || updateMut.error) && (
        <div style={{ color: 'crimson', marginTop: 8 }}>Error: {(createMut.error || updateMut.error)?.message}</div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
        <button type="submit" disabled={createMut.isPending || updateMut.isPending}>
          {createMut.isPending || updateMut.isPending
            ? (mode === 'edit' ? 'Saving…' : 'Adding…')
            : (mode === 'edit' ? 'Save' : 'Add Student')}
        </button>
      </div>
    </form>
  );
}

export default AddStudentForm;
