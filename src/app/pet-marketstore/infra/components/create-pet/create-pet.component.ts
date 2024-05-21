import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { OwnerService } from '../../services/owner.service';

@Component({
  selector: 'app-create-pet',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    ReactiveFormsModule,
    InputTextareaModule,
    ButtonModule,
  ],
  templateUrl: './create-pet.component.html',
  styleUrl: './create-pet.component.css',
})
export class CreatePetComponent implements OnInit {
  submitted = false;
  protected form: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    bio: new FormControl(''),
    imageBlob: new FormControl(''),
  });

  constructor(
    private formBuilder: FormBuilder,
    private ownerService: OwnerService
  ) {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get bioCtrl(): FormControl<string> {
    return <FormControl<string>>this.form.get('bio');
  }

  createOwner() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    console.log(JSON.stringify(this.form.value, null, 2));

    this.ownerService
      .createOwner({
        name: this.form.value.name,
        email: this.form.value.email,
        imageUrl: null,
        phone: this.form.value.phone,
        bio: this.form.value.bio,
      })
      .subscribe((value) => {
        console.log('RESPONSE', value);
      });
  }

  resetForm(): void {
    this.submitted = false;
    this.form.reset();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(64),
          Validators.minLength(3),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      bio: [''],
      imageBlob: [null],
    });
  }
}
