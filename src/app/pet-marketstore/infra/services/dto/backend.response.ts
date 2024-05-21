export interface BackendResponse<T> {
  data?: T;
  success?: boolean;
  errorMessage?: string | string[];
  errorCode?: string;
}
