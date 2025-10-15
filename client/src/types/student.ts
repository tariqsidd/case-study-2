export type Student = {
  uuid: number;
  name: string;
  class: number;
  sex: string;
  age: number;
  siblings: number;
  gpa: number;
};

export type StudentPayload = {
  class: number;
  name: string;
  sex: string;
  age: number;
  siblings: number;
  gpa: number;
};
