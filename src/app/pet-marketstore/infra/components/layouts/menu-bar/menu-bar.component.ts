import { Component, OnInit } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { UserService } from '../../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-menu-bar',
  standalone: true,
  imports: [
    MenubarModule,
    InputTextModule,
    AvatarModule,
    BadgeModule,
    NgClass,
    NgIf,
    RippleModule,
    AsyncPipe,
    ButtonModule,
    MenuModule,
  ],
  templateUrl: './menu-bar.component.html',
  styleUrl: './menu-bar.component.css',
  providers: [UserService],
})
export class MenuBarComponent implements OnInit {
  items: MenuItem[] | undefined = [];
  $user: BehaviorSubject<any> = new BehaviorSubject(null);
  items2: MenuItem[] | undefined = [
    {
      icon: 'pi pi-sign-out',
      name: 'Logout',
      label: 'Logout',
      command: (event: MenuItemCommandEvent) => {
        this.logout();
      },
    },
  ];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Pet Shop Office',
        icon: 'pi pi-home',
        command: (event: MenuItemCommandEvent) => {
          this.router.navigateByUrl('market');
        },
      },
    ];

    this.userService.getCurrentUser().subscribe((value) => {
      if (value && value.loginId) {
        this.$user.next(value);
      }
    });
  }

  login() {
    this.router.navigateByUrl('/auth');
  }

  private logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigateByUrl('/auth');
    });
  }
}
