import { AbstractUseCase } from './abstract.uc';
import { Injectable } from '@angular/core';
import { OwnerService } from '../services/owner.service';

@Injectable()
export class CreateOwnerUseCase extends AbstractUseCase<any, void> {
  constructor(public service: OwnerService) {
    super();
  }

  protected execute(request: any): void {
    this.service.createOwner(request);
  }
}
