import { AbstractUseCase } from './abstract.uc';
import { Injectable } from '@angular/core';
import { getUrl } from 'aws-amplify/storage';
import { catchError, from, map, Observable } from 'rxjs';

@Injectable()
export class DownloadViewableImageUC extends AbstractUseCase<string, string> {
  public execute(path: string): Observable<string> {
    return from(
      getUrl({
        path: path,
        options: {
          validateObjectExistence: true,
          expiresIn: 10,
          useAccelerateEndpoint: false,
        },
      })
    ).pipe(
      map((value) => value.url.toString()),
      catchError(async (err) => {
        console.error(err);
        return null!;
      })
    );
  }
}
