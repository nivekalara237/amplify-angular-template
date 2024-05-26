import { BackendPageResponse, BackendResponse } from './dto/backend.response';

export function mapAwsResponse<T>(
  response: any,
  mapper?: Function
): BackendResponse<T> | BackendPageResponse<T> {
  if (response.errors && response.errors.length > 0) {
    return {
      errorCode: response.errors[0].errorType,
      errorMessage: response.errors.map((v: { message: any }) => v.message),
    } as BackendResponse<T>;
  }
  if (Array.isArray(response.data)) {
    // @ts-ignore
    return {
      success: true,
      nextToken: response.nextToken,
      data: response.data.map(mapper),
    } as BackendPageResponse<T>;
  }
  return {
    success: true,
    // @ts-ignore
    data: mapper?.(response.data),
  } as BackendResponse<T>;
}
