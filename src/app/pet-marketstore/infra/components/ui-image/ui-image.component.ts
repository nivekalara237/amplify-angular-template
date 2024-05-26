import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DownloadViewableImageUC } from '../../usecases/download-viewable-image.uc';
import { AvatarModule } from 'primeng/avatar';
import { NgOptimizedImage } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ui-image',
  standalone: true,
  imports: [AvatarModule, NgOptimizedImage],
  templateUrl: './ui-image.component.html',
  styleUrl: './ui-image.component.css',
  providers: [DownloadViewableImageUC],
})
export class UiImageComponent implements OnInit, OnDestroy {
  @Input({ required: true }) s3key!: string;
  imageUrl: string = '';
  @Input({ required: true }) type: 'standard' | 'avatar' = 'avatar';
  @Input({ required: false, alias: 'avatar-shape' }) shape:
    | 'square'
    | 'circle'
    | undefined = undefined;
  @Input({ required: false, alias: 'avatar-size' })
  size: 'normal' | 'large' | 'xlarge' | undefined = undefined;
  private unsubscribe = new Subject<void>();

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private viewableUseCase: DownloadViewableImageUC
  ) {}

  ngOnInit(): void {
    if (!!this.s3key) {
      this.viewableUseCase
        .execute(this.s3key)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((value) => {
          this.imageUrl = value;
          this.changeDetectorRef.detectChanges();
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
