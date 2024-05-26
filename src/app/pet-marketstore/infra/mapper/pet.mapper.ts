import { IPet } from '../../core/domain/pet.model';
import moment from 'moment';

export class PetMapper {
  public static toDomain(value: any): IPet {
    return {
      id: value.id || value.ID,
      name: value.NickelName,
      price: value.Price,
      weight: value.Weight,
      breed: value.Breed,
      bio: value.PetBio,
      coverImage: value.DefaultImage,
      images: value.Images,
      kind: value.Kind,
      category: value.Category,
      rate: value.Rate,
      bornDate: value.BornDate,
      ownerId: value.PetOwner?.id,
    };
  }

  public static toDto(domain: IPet): any {
    return {
      ID: domain.id,
      NickelName: domain.name,
      Category: domain.category,
      BornDate: moment(domain.bornDate).format('YYYY-MM-DD'),
      Weight: domain.weight,
      Breed: domain.breed,
      Price: domain.price,
      Kind: domain.kind,
      Rate: domain.rate,
      OwnerID: domain.ownerId,
      Images: domain.images,
      DefaultImage: domain.coverImage,
      PetBio: domain.bio,
    };
  }
}
