import { AbstractDomain } from './abstract.domain';

export interface IOwner extends AbstractDomain {
  bio?: string;
  imageUrl?: string | null;
  id?: string;
  name: string;
  email: string;
  phone?: string;
}
