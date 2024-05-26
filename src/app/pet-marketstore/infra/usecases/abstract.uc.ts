import { Observable } from 'rxjs';

export abstract class AbstractUseCase<REQ, RESP> {
  protected abstract execute(
    request: REQ,
    ...args: any[]
  ): RESP | Promise<RESP> | Observable<RESP> | void;
}
