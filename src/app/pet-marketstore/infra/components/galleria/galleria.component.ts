import { Component, Input, OnInit } from '@angular/core';
import { DownloadViewableImageUC } from '../../usecases/download-viewable-image.uc';
import { BehaviorSubject, catchError, forkJoin, of } from 'rxjs';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-galleria',
  standalone: true,
  imports: [GalleriaModule],
  templateUrl: './galleria.component.html',
  styleUrl: './galleria.component.css',
  providers: [DownloadViewableImageUC],
})
export class GalleriaComponent implements OnInit {
  @Input({ required: true })
  imageKeys: string[] = [];

  $imagesPresigned: BehaviorSubject<{ origin: string; thumbnail: string }[]> =
    new BehaviorSubject<{ origin: string; thumbnail: string }[]>([]);

  constructor(private downloadViewableImageUC: DownloadViewableImageUC) {}

  ngOnInit(): void {
    forkJoin(
      this.imageKeys.map((value) =>
        this.downloadViewableImageUC
          .execute(value)
          .pipe(catchError((error: Error) => of(null)))
      )
    ).subscribe((values) => {
      if (values && values.length > 0) {
        this.$imagesPresigned.next(
          [...values]
            .filter((v) => v !== null)
            .map((v) => ({ origin: v as string, thumbnail: v as string }))
        );
      }
    });
  }
}
