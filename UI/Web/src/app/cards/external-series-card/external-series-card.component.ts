import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExternalSeries} from "../../_models/series-detail/external-series";
import {RouterLinkActive} from "@angular/router";
import {ImageComponent} from "../../shared/image/image.component";
import {NgbProgressbar, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslocoModule} from "@ngneat/transloco";

@Component({
  selector: 'app-external-series-card',
  standalone: true,
  imports: [CommonModule, ImageComponent, NgbProgressbar, NgbTooltip, ReactiveFormsModule, RouterLinkActive, TranslocoModule],
  templateUrl: './external-series-card.component.html',
  styleUrls: ['./external-series-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExternalSeriesCardComponent {
  @Input({required: true}) data!: ExternalSeries;
  @ViewChild('link', {static: false}) link!: ElementRef<HTMLAnchorElement>;

  handleClick() {
    if (this.link) {
      this.link.nativeElement.click();
    }
  }
}
