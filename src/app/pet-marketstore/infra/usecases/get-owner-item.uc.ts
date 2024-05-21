import { Injectable } from '@angular/core';
import { AbstractUseCase } from './abstract.uc';
import { IOwner } from '../../core/domain/owner.model';

@Injectable()
export class GetOwnerItemUseCase extends AbstractUseCase<string, IOwner> {
  protected execute(request: string): IOwner {
    return {} as IOwner;
  }
}
