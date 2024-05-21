import { AbstractDomain } from './abstract.domain';

export interface IPet extends AbstractDomain {
  id: number;
  nickelName: string;
  price: number;
  weight?: number;
  breed?: string;
  bio?: string;
  coverImage: string;
  images?: string[];
  kind?: 'FEMALE' | 'MALE';
  category?: string;
  rate?: number;
  bornDate?: Date;
  ownerId?: string;
}
