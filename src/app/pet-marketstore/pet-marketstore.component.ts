import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuBarComponent } from './infra/components/layouts/menu-bar/menu-bar.component';
import { ContentBodyComponent } from './infra/components/layouts/content-body/content-body.component';
import { SidebarComponent } from './infra/components/layouts/sidebar/sidebar.component';
import { FooterComponent } from './infra/components/layouts/footer/footer.component';
import {
  animate,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'ui-pet-marketstore',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MenubarModule,
    MenuBarComponent,
    ContentBodyComponent,
    SidebarComponent,
    FooterComponent,
    ToastModule,
  ],
  templateUrl: './pet-marketstore.component.html',
  styleUrl: './pet-marketstore.component.css',
  animations: [
    trigger('appUIAnimation', [
      transition('* <=> *', [
        query(
          ':enter, :leave',
          [
            style({
              opacity: 0,
              display: 'flex',
              flex: '1',
              transform: 'translateY(-20px)',
              flexDirection: 'column',
            }),
          ],
          { optional: true }
        ),
        query(
          ':enter',
          [
            animate(
              '100ms ease',
              style({ opacity: 1, transform: 'translateY(0)' })
            ),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            animate(
              '100ms ease',
              style({ opacity: 0, transform: 'translateY(-20px)' })
            ),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class PetMarketstoreComponent {
  isAuthPage = false;

  constructor(private activeRoute: ActivatedRoute, private router: Router) {
    router.events
      .pipe(filter((value) => value instanceof NavigationEnd))

      .subscribe((value) => {
        this.isAuthPage = (value as NavigationEnd).url.includes('auth');
      });
  }
}
