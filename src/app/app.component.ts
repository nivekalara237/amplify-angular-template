import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import {
  AmplifyAuthenticatorModule,
  AuthenticatorService,
} from '@aws-amplify/ui-angular';
import { JsonPipe } from '@angular/common';
import { PrimeNGConfig } from 'primeng/api';
import { PetMarketstoreComponent } from './pet-marketstore/pet-marketstore.component';

Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    TodosComponent,
    AmplifyAuthenticatorModule,
    JsonPipe,
    PetMarketstoreComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'amplify-angular-template';

  constructor(
    private primengConfig: PrimeNGConfig,
    public authenticator: AuthenticatorService
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
  }
}
