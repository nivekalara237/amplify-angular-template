import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../../../../amplify/data/resource';
import { from, map, Observable } from 'rxjs';
import { BackendResponse } from './dto/backend.response';
import { IOwner } from '../../core/domain/owner.model';
import { OwnerMapper } from '../mapper/owner.mapper';

const client = generateClient<Schema>();

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  createOwner = (request: IOwner): Observable<BackendResponse<IOwner>> => {
    console.log(client.models);
    return from(
      client.models.PetOwner.create({
        Name: request.name,
        Email: request.email,
        Phone: request.phone,
        Bio: request.bio,
        Picture: request.imageUrl,
      })
    ).pipe(
      map((value) => {
        if (value.errors && value.errors.length > 0) {
          return {
            errorCode: value.errors[0].errorType,
            errorMessage: value.errors.map((v) => v.message),
          } as BackendResponse<IOwner>;
        }
        return {
          success: true,
          data: OwnerMapper.toDomain(value.data),
        } as BackendResponse<IOwner>;
      })
    );
  };
}
