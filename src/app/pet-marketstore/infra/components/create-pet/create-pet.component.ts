import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { FieldsetModule } from 'primeng/fieldset';
import { AvatarModule } from 'primeng/avatar';
import { SplitterModule } from 'primeng/splitter';
import { ChipModule } from 'primeng/chip';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { IOwner } from '../../../core/domain/owner.model';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { getProductsData } from './data';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import {
  EventData,
  ListOwnerComponent,
} from '../list-owner/list-owner.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CreatePetDialogComponent } from '../create-pet-dialog/create-pet-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListPetComponent } from '../list-pet/list-pet.component';

type CategoryBadge = { name: string; icon: string };

type Product = {
  id: string;
  code: string;
  description: string;
  quantity: number;
  name: string;
  image: string;
  price: number;
  category: string;
  rating: number;
  inventoryStatus: string;
};

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
    FieldsetModule,
    AvatarModule,
    SplitterModule,
    ChipModule,
    RippleModule,
    StyleClassModule,
    TableModule,
    RatingModule,
    TagModule,
    TabViewModule,
    BadgeModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    MultiSelectModule,
    SliderModule,
    ListOwnerComponent,
    ToastModule,
    CreatePetDialogComponent,
    ListPetComponent,
  ],
  providers: [MessageService, DialogService, OwnerService, DynamicDialogRef],
  templateUrl: './create-pet.component.html',
  styleUrl: './create-pet.component.scss',
})
export class CreatePetComponent implements OnInit {
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  submitted = false;
  petCategories: CategoryBadge[] = [
    {
      name: 'Dot',
      icon: 'fa-solid fa-dog',
    },
    {
      name: 'Cat',
      icon: 'fa-solid fa-cat',
    },
    {
      name: 'Fish',
      icon: 'fa-solid fa-fish',
    },
    {
      name: 'Bird',
      icon: 'fa-solid fa-crow',
    },
    {
      name: 'Pig',
      icon: 'fa-solid fa-piggy-bank',
    },
  ];

  products: Product[] = getProductsData();

  protected form: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    bio: new FormControl(''),
    imageBlob: new FormControl(''),
  });
  protected openCreatePetDialog: boolean = false;
  private refDialog!: DynamicDialogRef<CreatePetDialogComponent>;

  constructor(
    private formBuilder: FormBuilder,
    private ownerService: OwnerService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  createOwner() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.ownerService
      .createOwner({
        name: this.form.value.name,
        email: this.form.value.email,
        imageUrl: null,
        phone: this.form.value.phone,
        bio: this.form.value.bio,
      })
      .subscribe((value) => {
        if (value.success && this.form.get('imageBlob')?.value) {
          this.messageService.add({
            severity: 'success',
            summary: 'Oh poh poh',
            detail: 'Owner successfully created!! (1/3)',
            icon: 'pi pi-check-circle',
            closable: true,
          });
          this.uploadPictureAndUpdate(value.data!);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Aie! aie!',
            detail: 'Owner successfully created!! (1/3)',
            icon: 'pi pi-times-circle',
            closable: true,
          });
        }
      });
  }

  resetForm(): void {
    this.submitted = false;
    this.form.reset(null, {
      emitEvent: true,
    });
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

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'info';
    }
  }

  onListOwnerEventData($event: EventData) {
    console.log($event);
  }

  onDialogClosed(isClosed: boolean) {
    this.openCreatePetDialog = isClosed;
    console.log(isClosed);
  }

  private uploadPictureAndUpdate = (owner: IOwner) => {
    this.ownerService
      // @ts-ignore
      .uploadOwnerPicture(this.fileInput.nativeElement?.files?.[0])
      .subscribe((value) => {
        this.resetForm();
        if (value.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Oh poh poh',
            detail: 'Owner picture successfully uploaded!! (2/3)',
            icon: 'pi pi-check-circle',
            closable: true,
          });
          this.ownerService
            .updateImageOwner(owner.id!, {
              name: this.form.value.name,
              email: this.form.value.email,
              imageUrl: value.data?.path,
              phone: this.form.value.phone,
              bio: this.form.value.bio,
            })
            .subscribe((result) => {
              if (result.success) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Oh! poh poh!',
                  detail: 'Creation of owner: everything going on!! (3/3)',
                  icon: 'pi pi-check-circle',
                  closable: true,
                });
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'aie! aie!',
                  detail: 'Owner picture failed to update!! (3/3)',
                  icon: 'pi pi-times-circle',
                  closable: true,
                });
              }
            });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'aie! aie!',
            detail: 'Owner picture failed to upload!! (2/3)',
            icon: 'pi pi-times-circle',
            closable: true,
          });
        }
      });
  };
}
