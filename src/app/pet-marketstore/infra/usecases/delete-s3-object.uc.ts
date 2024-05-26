import { AbstractUseCase } from './abstract.uc';
import { catchError, from } from 'rxjs';
import { remove } from 'aws-amplify/storage';
import { Injectable } from '@angular/core';

@Injectable()
export class DeleteS3ObjectUseCase extends AbstractUseCase<string, void> {
  public execute(key: string): void {
    from(
      remove({
        path: key,
      })
    )
      .pipe(
        catchError((err) => {
          console.error(err);
          return null!;
        })
      )
      .subscribe();
  }
}
