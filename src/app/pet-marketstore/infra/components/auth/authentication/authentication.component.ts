import { Component, OnInit } from '@angular/core';
import { AmplifyAuthenticatorModule } from '@aws-amplify/ui-angular';
import { getCurrentUser } from '@aws-amplify/auth';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [AmplifyAuthenticatorModule, ButtonModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css',
})
export class AuthenticationComponent implements OnInit {
  constructor(private router: Router) {}

  async ngOnInit(): Promise<void> {
    const { username, userId, signInDetails } = await getCurrentUser();
    if (username) {
      this.router.navigateByUrl('/');
    }
  }
}
