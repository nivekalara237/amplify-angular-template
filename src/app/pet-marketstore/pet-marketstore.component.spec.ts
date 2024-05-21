import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetMarketstoreComponent } from './pet-marketstore.component';

describe('PetMarketstoreComponent', () => {
  let component: PetMarketstoreComponent;
  let fixture: ComponentFixture<PetMarketstoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetMarketstoreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PetMarketstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
