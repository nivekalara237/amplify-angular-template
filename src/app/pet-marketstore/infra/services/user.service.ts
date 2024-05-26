import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getCurrentUser, signOut } from '@aws-amplify/auth';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({ providedIn: 'root' })
export class UserService {
  getCurrentUser(): Observable<{
    username: string;
    userId: string;
    loginId?: string;
  }> {
    return fromPromise(getCurrentUser()).pipe(
      map((value) => ({
        username: value.username,
        userId: value.userId,
        loginId: value.signInDetails?.loginId,
      }))
    );
  }

  logout(): Observable<void> {
    return fromPromise(signOut());
  }
}
