import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { OwnerService } from '../../services/owner.service';
import { IOwner } from '../../../core/domain/owner.model';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil, tap } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { StepperModule } from 'primeng/stepper';
import {
  JsonPipe,
  NgClass,
  NgFor,
  NgIf,
  NgOptimizedImage,
  NgTemplateOutlet,
} from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { UiImageComponent } from '../ui-image/ui-image.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { BadgeModule } from 'primeng/badge';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { StyleClassModule } from 'primeng/styleclass';
import { ToastModule } from 'primeng/toast';
import { PetService } from '../../services/pet.service';
import { UploadFileToS3Service } from '../../services/upload-file-to-s3.service';

enum PetCategory {
  DOG,
  CAT,
  BIRD,
  FISH,
  RABBIT,
}

@Component({
  selector: 'app-create-pet-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    StepperModule,
    NgClass,
    IconFieldModule,
    InputIconModule,
    FormsModule,
    PasswordModule,
    DropdownModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    NgOptimizedImage,
    UiImageComponent,
    NgTemplateOutlet,
    JsonPipe,
    RadioButtonModule,
    InputTextareaModule,
    FileUploadModule,
    BadgeModule,
    HttpClientModule,
    CheckboxModule,
    StyleClassModule,
    ToastModule,
  ],
  templateUrl: './create-pet-dialog.component.html',
  styleUrl: './create-pet-dialog.component.css',
  providers: [OwnerService, PetService, MessageService, UploadFileToS3Service],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePetDialogComponent implements OnInit, OnDestroy {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();
  @Input({ alias: 'pet-owner' }) owner!: IOwner;
  stepActive: number = 0;
  form: FormGroup;
  totalSize: number = 0;
  totalSizePercent: number = 0;
  files = [];
  protected owners: IOwner[] = [];
  protected ownerSelected!: IOwner;
  private $unsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private ownerService: OwnerService,
    private dialogRef: DynamicDialogRef,
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private petService: PetService,
    private messageService: MessageService,
    private uploadService: UploadFileToS3Service,
    private config: PrimeNGConfig
  ) {
    this.form = this.formBuilder.group({
      owner: this.formBuilder.group({
        ownerId: ['', [Validators.required]],
      }),
      pet: this.formBuilder.group({
        name: [
          'Toutou',
          [
            Validators.required,
            Validators.maxLength(64),
            Validators.minLength(3),
          ],
        ],
        price: ['1200', [Validators.required, Validators.min(1)]],
        category: ['CAT', [Validators.required]],
        bornDate: ['12/03/2021', [Validators.required]],
        breed: ['DX'],
        kind: ['CAT'],
        bio: ['Lorem Ipsum..'],
        rate: ['2.4'],
        weight: ['1.2'],
      }),
      images: this.formBuilder.group({
        images: [null, []],
        defaultImage: [null, [Validators.required]],
      }),
    });
  }

  protected _visible: boolean = false;

  @Input({ alias: 'show' })
  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  ngOnInit(): void {
    this.ownerService
      .listAll()
      .pipe(
        takeUntil(this.$unsubscribe),
        tap((value) => (this.owners = value.data!))
      )
      .subscribe((value) => this.changeDetectorRef.detectChanges());
  }

  ngOnDestroy(): void {
    this.$unsubscribe.complete();
    this.$unsubscribe.unsubscribe();
  }

  onClose(): void {
    this.visible = false;
    this.close.emit(true);
    this.dialogRef.close('OK');
  }

  savePet() {}

  subForm(subformName: string): FormGroup {
    return <FormGroup<any>>this.form.get(subformName);
  }

  onOwnerSelected($event: DropdownChangeEvent) {
    this.ownerSelected = $event.value;
    this.subForm('owner').get('ownerId')?.patchValue($event.value?.id);
  }

  getCategories() {
    return Object.keys(PetCategory).filter((v) => isNaN(v as any));
  }

  choose(event: any, callback: Function) {
    callback();
  }

  onRemoveTemplatingFile(
    event: any,
    file: any,
    removeFileCallback: Function,
    index: number
  ) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
    if (this.subForm('images').get('defaultImage')?.value === file.name) {
      this.subForm('images')
        .get('defaultImage')
        ?.patchValue(null, { emitEvent: true });
    }
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
      // @ts-ignore
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: Function) {
    callback();
  }

  formatSize(bytes: number, decimalPoint = 2) {
    if (bytes == 0) return '0 Bytes';
    const k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onUploadFiles($event: FileUploadHandlerEvent) {}

  truncateFileName(name: string) {
    if (name.length > 20) {
      try {
        const start = name.substring(0, 17);
        const ext = name.split('.')?.[1];
        const nameWithoutext = name.split('.')?.[0] || '';
        const endWithoutExt = nameWithoutext.substring(
          nameWithoutext.length - 3,
          nameWithoutext.length
        );
        return `${start}...${endWithoutExt}.${ext}`;
      } catch (e) {
        return name;
      }
    }
    return name;
  }

  onCreatePet() {
    if (this.form.valid) {
      const partialPet = this.subForm('pet').getRawValue();
      this.petService
        .create({
          ...partialPet,
          ownerId: this.subForm('owner').get('ownerId')?.value,
        })
        .pipe(takeUntil(this.$unsubscribe))
        .subscribe((value) => {
          if (value.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'oh po! po!',
              detail: 'The information about pet has been created (1/3)',
              closable: true,
              life: 60000,
            });
            this.uploadService
              .uploadFiles(this.files, 'pets')
              .pipe(takeUntil(this.$unsubscribe))
              .subscribe((res) => {
                if (res.success) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'oh po! po!',
                    detail: "The pet's images were upload successfully (2/3)",
                    closable: true,
                    life: 60000,
                  });
                  this.petService
                    .update(value.data?.id!, {
                      ...partialPet,
                      ownerId: this.subForm('owner').get('ownerId')?.value,
                      images: res.data?.map(({ path }) => path),
                      coverImage: res.data?.find(
                        (value) =>
                          value.originalName ===
                          this.subForm('images').get('defaultImage')?.value
                      )?.path,
                    })
                    .subscribe((resUpdate) => {
                      if (resUpdate.success) {
                        this.messageService.add({
                          severity: 'success',
                          summary: 'oh po! po!',
                          detail: 'Pet create created (3/3)',
                          closable: true,
                          life: 60000,
                        });
                        setTimeout(() => this.dialogRef.close('OK'), 7000);
                      } else {
                        this.messageService.add({
                          severity: 'warning',
                          summary: 'aie! aie!',
                          closable: true,
                          life: 60000,
                          detail: "Pet images failed to update!! (3/3)',",
                        });
                      }
                    });
                } else {
                  this.messageService.add({
                    severity: 'warning',
                    summary: 'aie! aie!',
                    closable: true,
                    life: 60000,
                    detail: "Pet image failed to upload!! (2/3)',",
                  });
                }
              });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'aie! aie!',
              detail: Array.isArray(value.errorMessage)
                ? value.errorMessage.join(',\n')
                : value.errorMessage,
              closable: true,
              life: 60000,
            });
          }
        });
    }
  }
}
