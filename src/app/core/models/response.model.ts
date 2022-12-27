export interface ApiGenericResponse<T> {
  status: string;
  message: string;
  errors?: any;
  token: string;
  count: number;
  totalRecords: number;
  data: T | null;
}
