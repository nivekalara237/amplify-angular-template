export interface BackendResponse<T> {
  data?: T;
  success?: boolean;
  errorMessage?: string | string[];
  errorCode?: string;
}

export interface BackendPageResponse<T> extends BackendResponse<T[]> {
  nextToken?: string;
}
