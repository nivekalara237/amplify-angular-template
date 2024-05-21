import { IOwner } from '../../core/domain/owner.model';

export class OwnerMapper {
  public static toDomain = (data: any): IOwner => {
    return {
      email: data?.Email,
      name: data?.Name,
      phone: data?.Phone,
      bio: data?.Bio,
      id: data?.OwnerID,
      imageUrl: data?.Picture,
    };
  };
}
