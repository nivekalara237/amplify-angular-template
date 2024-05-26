import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SharedModule } from 'primeng/api';
import { SliderModule } from 'primeng/slider';
import {
  TableHeaderCheckboxToggleEvent,
  TableModule,
  TableRowSelectEvent,
  TableRowUnSelectEvent,
} from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IOwner } from '../../../core/domain/owner.model';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { NgStyle } from '@angular/common';
import { OwnerService } from '../../services/owner.service';
import { UiImageComponent } from '../ui-image/ui-image.component';
import { StyleClassModule } from 'primeng/styleclass';
import { CheckboxModule } from 'primeng/checkbox';
import { OverlayPanelModule } from 'primeng/overlaypanel';

type PageConfig = {
  limit: number;
  nextToken?: string;
  prevToken?: string;
  hasNextPage?: () => {};
  hasPreviousPage?: () => {};
};
export type TypeEvent = 'row_selected' | 'row_unselected' | '';
export type EventData = {
  type: TypeEvent;
  data?: any;
};

@Component({
  selector: 'app-list-owner',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MultiSelectModule,
    PaginatorModule,
    SharedModule,
    SliderModule,
    TableModule,
    TagModule,
    AvatarModule,
    BadgeModule,
    NgStyle,
    UiImageComponent,
    StyleClassModule,
    CheckboxModule,
    OverlayPanelModule,
  ],
  templateUrl: './list-owner.component.html',
  styleUrl: './list-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .owner-item-actions .p-button.p-button-sm {
        width: auto !important;
        padding: 6px !important;
      }
    `,
  ],
})
export class ListOwnerComponent implements OnInit {
  owners: IOwner[] = [];
  statuses: { label: string }[] | undefined;
  @Output() eventData: EventEmitter<EventData> = new EventEmitter();
  protected pageConfig: PageConfig = {
    limit: 5,
  };
  protected readonly document = document;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ownerService: OwnerService
  ) {}

  ngOnInit() {
    this.queryingData('');
  }

  setNextPageToken(pageToken: string) {
    if (!!pageToken) {
      this.pageConfig.prevToken = this.pageConfig.nextToken;
      this.pageConfig.nextToken = pageToken;
      this.pageConfig.hasNextPage = () => true;
    } else {
      this.pageConfig.nextToken = null!;
      this.pageConfig.hasNextPage = () => false;
    }
  }

  setPrevPageToken(pageToken: string) {
    if (!!pageToken) {
      this.pageConfig.nextToken = this.pageConfig.prevToken;
      this.pageConfig.prevToken = pageToken;
      this.pageConfig.hasNextPage = () => true;
    } else {
      this.pageConfig.nextToken = this.pageConfig.prevToken!;
      this.pageConfig.hasNextPage = () => false;
    }
  }

  onPageChange(state: PaginatorState) {
    console.log(state);
    this.pageConfig.limit = state.pageCount!;
  }

  reset() {}

  next() {
    this.queryingData(this.pageConfig.nextToken!);
  }

  prev() {
    this.queryingData(this.pageConfig.prevToken!);
  }

  onRowUnselected($event: TableRowUnSelectEvent) {
    this.eventData.emit({
      type: 'row_unselected',
      data: $event.data,
    });
  }

  onRowSelected($event: TableRowSelectEvent) {
    this.eventData.emit({
      type: 'row_selected',
      data: $event.data,
    });
  }

  onHeaderCheckboxToggle($event: TableHeaderCheckboxToggleEvent) {
    console.log($event);
  }

  private queryingData(token: string) {
    this.ownerService
      .query({
        limit: 5,
        filter: null,
        nextToken: token,
      })
      .subscribe((value) => {
        const { data, nextToken } = value;
        this.owners = data!;
        console.log(value);
        this.setNextPageToken(nextToken!);
        this.changeDetectorRef.detectChanges();
      });
  }
}
