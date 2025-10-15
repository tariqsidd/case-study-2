const getBaseUrl = () => (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:5001';

export type Payload = {
  class: number;
  name: string;
  sex: string;
  age: number;
  siblings: number;
  gpa: number;
};

export type CreateResponse = { uuid: number };
export type UpdateResponse = { success: boolean };

export async function createStudent(payload: Payload): Promise<CreateResponse> {
  const res = await fetch(`${getBaseUrl()}/student`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function updateStudent(uuid: number, payload: Payload): Promise<UpdateResponse> {
  const res = await fetch(`${getBaseUrl()}/student/${uuid}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function deleteStudent(uuid: number): Promise<{ success: boolean }>
{
  const res = await fetch(`${getBaseUrl()}/student/${uuid}`, {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
