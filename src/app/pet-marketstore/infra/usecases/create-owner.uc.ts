import { AbstractUseCase } from './abstract.uc';
import { Injectable } from '@angular/core';
import { OwnerService } from '../services/owner.service';
import { tap } from 'rxjs';

@Injectable()
export class CreateOwnerUseCase extends AbstractUseCase<any, void> {
  constructor(public service: OwnerService) {
    super();
  }

  protected execute(request: any, file: any): void {
    this.service
      .createOwner(request)
      .pipe(
        tap((value) => {
          if (value.success) {
            this.service.uploadOwnerPicture(file).subscribe();
          }
        })
      )
      .subscribe();
  }
}
