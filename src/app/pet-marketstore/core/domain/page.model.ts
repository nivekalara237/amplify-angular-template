export interface IPage<MODEL> {
  data: MODEL[];
  nextToken?: string;
}

export class Page<T> implements IPage<T> {
  constructor(public data: T[], public nextToken?: string) {}
}
