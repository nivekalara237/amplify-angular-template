import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { CreatePetComponent } from '../../create-pet/create-pet.component';

@Component({
  selector: 'app-content-body',
  standalone: true,
  imports: [SplitterModule, CreatePetComponent],
  templateUrl: './content-body.component.html',
  styleUrl: './content-body.component.css',
})
export class ContentBodyComponent {}
