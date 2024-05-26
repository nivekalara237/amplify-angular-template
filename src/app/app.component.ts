import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import { Hub } from 'aws-amplify/utils';
import outputs from '../../amplify_outputs.json';
import {
  AmplifyAuthenticatorModule,
  AuthenticatorService,
} from '@aws-amplify/ui-angular';
import { JsonPipe, NgIf } from '@angular/common';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { PetMarketstoreComponent } from './pet-marketstore/pet-marketstore.component';
import { ButtonModule } from 'primeng/button';
import { AuthenticationComponent } from './pet-marketstore/infra/components/auth/authentication/authentication.component';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService],
  imports: [
    RouterOutlet,
    TodosComponent,
    AmplifyAuthenticatorModule,
    JsonPipe,
    PetMarketstoreComponent,
    NgIf,
    ButtonModule,
    AuthenticationComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'amplify-angular-template';
  protected isAuthPage = window.location.href.includes('auth');

  constructor(
    private primengConfig: PrimeNGConfig,
    public authenticator: AuthenticatorService,
    private router: Router
  ) {
    Amplify.configure(outputs);
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.primengConfig.zIndex = {
      modal: 1100,
      overlay: 1000,
      menu: 1000,
      tooltip: 1100,
    };

    this.manageAuthHub();
  }

  private manageAuthHub() {
    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        // @ts-ignore
        case 'signedIn': {
          this.router.navigateByUrl('market');
          return;
        }
        default:
          console.log('Not managed');
          return;
      }
    });
  }
}
