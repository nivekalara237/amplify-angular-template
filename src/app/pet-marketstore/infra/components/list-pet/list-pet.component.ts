import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { IPet } from '../../../core/domain/pet.model';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe, NgIf } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { ConfirmationService, MessageService, SharedModule } from 'primeng/api';
import { TableHeaderCheckboxToggleEvent, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ImageModule } from 'primeng/image';
import { UiImageComponent } from '../ui-image/ui-image.component';
import { FormsModule } from '@angular/forms';
import { PetService } from '../../services/pet.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { AvatarModule } from 'primeng/avatar';
import { CreatePetDialogComponent } from '../create-pet-dialog/create-pet-dialog.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DeleteS3ObjectUseCase } from '../../usecases/delete-s3-object.uc';

type PageConfig = {
  limit: number;
  nextToken?: string;
};

@Component({
  selector: 'app-list-pet',
  standalone: true,
  imports: [
    ButtonModule,
    CurrencyPipe,
    RatingModule,
    SharedModule,
    TableModule,
    TagModule,
    ImageModule,
    UiImageComponent,
    FormsModule,
    NgIf,
    AvatarModule,
    ConfirmDialogModule,
  ],
  templateUrl: './list-pet.component.html',
  styleUrl: './list-pet.component.css',
  providers: [
    PetService,
    ConfirmationService,
    MessageService,
    DynamicDialogRef,
    DialogService,
    DeleteS3ObjectUseCase,
  ],
})
export class ListPetComponent implements OnInit, OnDestroy {
  pets: IPet[] = [];
  pageConfig: PageConfig = {
    limit: 5,
  };
  @Input() ownersSelected!: null;
  private $onDestroy$: Subject<void> = new Subject<void>();
  private refDialog!: DynamicDialogRef;

  constructor(
    private petService: PetService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private deleteS3ObjectUseCase: DeleteS3ObjectUseCase
  ) {}

  ngOnDestroy(): void {
    this.$onDestroy$.next();
    this.$onDestroy$.complete();
  }

  ngOnInit(): void {
    this.searchPets(null!);
  }

  deletePet(pet: IPet) {
    this.confirmationService.confirm({
      header: `Are you sure?`,
      message: `Please confirm to proceed?`,
      accept: () => {
        this.petService
          .delete(pet.id)
          .pipe(takeUntil(this.$onDestroy$))
          .subscribe((value) => {
            if (value.success) {
              this.messageService.add({
                severity: 'success',
                detail: 'Successfully deleted pet',
                summary: 'Success',
                closable: true,
                life: 60000,
              });
              pet.images?.forEach((key) =>
                this.deleteS3ObjectUseCase.execute(key)
              );
              this.pets = [...this.pets].filter((v) => v.id !== pet.id);
              this.changeDetectorRef.detectChanges();
            } else {
              this.messageService.add({
                severity: 'error',
                detail: Array.isArray(value.errorMessage)
                  ? value.errorMessage.join(',\n')
                  : value.errorMessage,
                summary: 'Failed deleted pet',
                closable: true,
                life: 60000,
              });
            }
          });
      },
      reject: () => {},
    });
  }

  getSeverity():
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast' {
    const severities = [
      'success',
      'secondary',
      'info',
      'warning',
      'danger',
      'contrast',
    ];
    const random = Math.floor(Math.random() * severities.length);
    // @ts-ignore
    return severities[random];
  }

  onHeaderCheckboxToggle($event: TableHeaderCheckboxToggleEvent) {
    console.log($event);
  }

  addPet() {
    this.refDialog = this.dialogService.open(CreatePetDialogComponent, {
      modal: true,
      maximizable: true,
      header: 'Create Pet',
      style: { width: '35rem' },
      breakpoints: { '1199px': '75vw', '575px': '90vw' },
      contentStyle: { overflow: 'auto' },
      templates: {},
    });
    this.refDialog.onClose.subscribe((value) => {
      if (value && Object.hasOwn(value, 'name')) {
        this.pets.push(value);
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  showMore() {
    if (this.pageConfig.nextToken && this.pageConfig.nextToken.length) {
      this.searchPets(this.pageConfig.nextToken);
    }
  }

  private searchPets(token: string) {
    this.petService
      .search({
        limit: this.pageConfig.limit,
        nextToken: token,
      })
      .pipe(
        takeUntil(this.$onDestroy$),
        tap((value) => {
          if (value.success) {
            value.data?.forEach((value) => {
              this.pets.push(value);
            });
            this.pageConfig.nextToken = value.nextToken;
            this.changeDetectorRef.detectChanges();
          } else {
            this.messageService.add({
              severity: 'error',
              life: 5000,
              summary: 'Something went wrong',
              detail: Array.isArray(value.errorMessage)
                ? value.errorMessage.join(',\n')
                : value.errorMessage,
            });
          }
        })
      )
      .subscribe();
  }
}
