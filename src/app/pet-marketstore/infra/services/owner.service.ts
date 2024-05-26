import { Injectable } from '@angular/core';
import { uploadData } from '@aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '../../../../../amplify/data/resource';
import { catchError, finalize, from, map, Observable, of } from 'rxjs';
import { BackendPageResponse, BackendResponse } from './dto/backend.response';
import { IOwner } from '../../core/domain/owner.model';
import { OwnerMapper } from '../mapper/owner.mapper';
import { mapAwsResponse } from './service.utils';

const client = generateClient<Schema>();
const mapper = (v: any) => OwnerMapper.toDomain(v);

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  // private static mapAwsResponse<T>(
  //   response: any
  // ): BackendResponse<T> | BackendPageResponse<T> {
  //   if (response.errors && response.errors.length > 0) {
  //     return {
  //       errorCode: response.errors[0].errorType,
  //       errorMessage: response.errors.map((v: { message: any }) => v.message),
  //     } as BackendResponse<T>;
  //   }
  //   if (Array.isArray(response.data)) {
  //     return {
  //       success: true,
  //       nextToken: response.nextToken,
  //       data: response.data.map((v: any) => OwnerMapper.toDomain(v)),
  //     } as BackendPageResponse<T>;
  //   }
  //   return {
  //     success: true,
  //     data: OwnerMapper.toDomain(response.data),
  //   } as BackendResponse<T>;
  // }

  updateImageOwner = (
    _id: string,
    owner: IOwner
  ): Observable<BackendResponse<IOwner>> => {
    const promise = client.models.PetOwner.update({
      id: _id,
      Name: owner.name,
      Email: owner.email,
      Phone: owner.phone,
      Bio: owner.bio,
      Picture: owner.imageUrl,
    });
    return from(promise).pipe(
      map((value) => mapAwsResponse(value, mapper) as BackendResponse<IOwner>),
      finalize(() => client.cancel(promise))
    );
  };

  createOwner = (request: IOwner): Observable<BackendResponse<IOwner>> => {
    const promise = client.models.PetOwner.create({
      Name: request.name,
      Email: request.email,
      Phone: request.phone,
      Bio: request.bio,
      Picture: request.imageUrl,
    });
    return from(promise).pipe(
      map((value) => mapAwsResponse(value, mapper) as BackendResponse<IOwner>),
      finalize(() => client.cancel(promise))
    );
  };

  uploadOwnerPicture = (
    file: File
  ): Observable<BackendResponse<{ path: string } | null>> => {
    const uuid = new Date().getTime();
    const u = uploadData({
      data: file,
      path: `owner-pictures/${uuid}_${file.name}`,
    });

    try {
      return from(u.result).pipe(
        map((value) => {
          return {
            success: true,
            data: { path: value.path },
          };
        }),
        catchError(async (err) => ({
          success: false,
          data: null,
        }))
      );
    } catch (e) {
      return of({
        success: false,
        data: null,
      });
    }
  };

  listAll = (): Observable<BackendResponse<IOwner[]>> => {
    const prom = client.models.PetOwner.list();
    return from(prom).pipe(
      map(
        (value) => mapAwsResponse(value, mapper) as BackendPageResponse<IOwner>
      ),
      map((value) => ({
        ...value,
        data: value.data,
      })),
      finalize(() => client.cancel(prom))
    );
  };

  query = (query: any): Observable<BackendPageResponse<IOwner>> => {
    const prom = client.models.PetOwner.list({
      limit: query.limit || 10,
      filter: query.filter,
      nextToken: query.nextToken,
    });
    return from(prom).pipe(
      map(
        (value) => mapAwsResponse(value, mapper) as BackendPageResponse<IOwner>
      ),
      finalize(() => client.cancel(prom))
    );
  };
}
