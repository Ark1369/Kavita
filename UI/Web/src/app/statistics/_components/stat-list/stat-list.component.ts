import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PieData } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs';
import { PieDataItem } from '../../_models/pie-data-item';
import { CompactNumberPipe } from '../../../pipe/compact-number.pipe';
import { ImageComponent } from '../../../shared/image/image.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import {TranslocoModule} from "@ngneat/transloco";

@Component({
    selector: 'app-stat-list',
    templateUrl: './stat-list.component.html',
    styleUrls: ['./stat-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgIf, NgbTooltip, NgFor, NgClass, ImageComponent, AsyncPipe, CompactNumberPipe, TranslocoModule]
})
export class StatListComponent {

  /**
   * Title of list
   */
  @Input() title: string = ''
  /**
   * Optional label to render after value
   */
  @Input() label: string = ''
  /**
   * Optional data to put in tooltip
   */
  @Input() description: string = '';
  @Input({required: true}) data$!: Observable<PieDataItem[]>;
  @Input() image: ((data: PieDataItem) => string) | undefined = undefined;
  /**
   * Optional callback handler when an item is clicked
   */
  @Input() handleClick: ((data: PieDataItem) => void) | undefined = undefined;

  doClick(item: PieDataItem) {
    if (!this.handleClick) return;
    this.handleClick(item);
  }

}
