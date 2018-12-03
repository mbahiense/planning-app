export class Task {
  id: number;
  label: string;
  module: string;
  status: 'todo' | 'doing' | 'done';
  createdAt?: Date;
  finishAt?: Date;
  assign?: User | number;
  weight?: number;
}

export class User {
  id?: string;
  name?: string;
  avatar: string;
}
