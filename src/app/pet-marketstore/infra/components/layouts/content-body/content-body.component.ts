import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { MarketComponent } from '../../market/market.component';

@Component({
  selector: 'app-content-body',
  standalone: true,
  imports: [SplitterModule, MarketComponent],
  templateUrl: './content-body.component.html',
  styleUrl: './content-body.component.css',
})
export class ContentBodyComponent {}
