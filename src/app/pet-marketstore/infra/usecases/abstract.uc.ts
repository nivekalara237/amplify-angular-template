export abstract class AbstractUseCase<REQ, RESP> {
  protected abstract execute(request: REQ): RESP | void;
}
