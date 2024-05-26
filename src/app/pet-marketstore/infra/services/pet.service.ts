import { Injectable } from '@angular/core';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../../../../amplify/data/resource';
import { IPet } from '../../core/domain/pet.model';
import { BackendPageResponse, BackendResponse } from './dto/backend.response';
import { finalize, from, map, Observable } from 'rxjs';
import { mapAwsResponse } from './service.utils';
import { PetMapper } from '../mapper/pet.mapper';

const client = generateClient<Schema>();
const mappingDtoToDomain = (dto: any): IPet => PetMapper.toDomain(dto);

@Injectable({ providedIn: 'root' })
export class PetService {
  create = (pet: IPet): Observable<BackendResponse<IPet>> => {
    return from(client.models.Pet.create(PetMapper.toDto(pet))).pipe(
      map(
        (value) =>
          mapAwsResponse(value, mappingDtoToDomain) as BackendResponse<IPet>
      )
    );
  };

  update = (_id: string, pet: IPet): Observable<BackendResponse<IPet>> => {
    return from(
      client.models.Pet.update({
        ...PetMapper.toDto(pet),
        id: _id,
      })
    ).pipe(
      map(
        (value) =>
          mapAwsResponse(value, mappingDtoToDomain) as BackendResponse<IPet>
      )
    );
  };

  delete = (_id: string): Observable<BackendResponse<boolean>> => {
    return from(
      client.models.Pet.delete({
        id: _id,
      })
    ).pipe(map((value) => mapAwsResponse(value) as BackendResponse<boolean>));
  };

  getOne = (_id: string): Observable<BackendResponse<IPet>> => {
    const promize = client.models.Pet.get({
      id: _id,
    });
    return from(promize).pipe(
      map(
        (value) =>
          mapAwsResponse(value, mappingDtoToDomain) as BackendResponse<IPet>
      ),
      finalize(() => client.cancel(promize))
    );
  };
  search = (query: any): Observable<BackendPageResponse<IPet>> => {
    const prom = client.models.Pet.list({
      limit: query.limit || 10,
      filter: query.filter,
      nextToken: query.nextToken,
    });
    return from(prom).pipe(
      map(
        (value) =>
          mapAwsResponse(value, mappingDtoToDomain) as BackendPageResponse<IPet>
      ),
      finalize(() => client.cancel(prom))
    );
  };
}
