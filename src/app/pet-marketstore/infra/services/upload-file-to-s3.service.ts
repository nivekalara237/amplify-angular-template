import { Injectable } from '@angular/core';
import { catchError, forkJoin, from, map, Observable, of } from 'rxjs';
import { BackendResponse } from './dto/backend.response';
import { uploadData } from '@aws-amplify/storage';

@Injectable({
  providedIn: 'root',
})
export class UploadFileToS3Service {
  uploadFiles = (
    files: File[],
    prefix = ''
  ): Observable<
    BackendResponse<[{ path: string; originalName?: string }] | null>
  > => {
    prefix = !!prefix && prefix.length > 0 ? prefix + '/' : '';
    const uuid = new Date().getTime();
    const arr = [...files].map((file) =>
      from(
        uploadData({
          data: file,
          path: `${prefix}${uuid}_${file.name}`,
        }).result.then((result) => ({ result, original: file.name }))
      )
    );

    try {
      return forkJoin(arr).pipe(
        map((value) => {
          return {
            success: true,
            data: value.map((v) => ({
              path: v.result.path,
              originalName: v.original,
            })),
          } as BackendResponse<any>;
        }),
        catchError(async (err) => ({
          success: false,
          data: null,
        }))
      );
    } catch (e) {
      return of({
        success: false,
        data: null,
      });
    }
  };
}
