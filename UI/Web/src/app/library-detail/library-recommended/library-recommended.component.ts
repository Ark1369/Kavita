import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit
} from '@angular/core';
import { filter, map, merge, Observable, shareReplay } from 'rxjs';
import { Genre } from 'src/app/_models/metadata/genre';
import { Series } from 'src/app/_models/series';
import { MetadataService } from 'src/app/_services/metadata.service';
import { RecommendationService } from 'src/app/_services/recommendation.service';
import { SeriesService } from 'src/app/_services/series.service';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import { SeriesCardComponent } from '../../cards/series-card/series-card.component';
import { CarouselReelComponent } from '../../carousel/_components/carousel-reel/carousel-reel.component';
import { NgIf, AsyncPipe } from '@angular/common';
import {TranslocoModule} from "@ngneat/transloco";

@Component({
    selector: 'app-library-recommended',
    templateUrl: './library-recommended.component.html',
    styleUrls: ['./library-recommended.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
  imports: [NgIf, CarouselReelComponent, SeriesCardComponent, AsyncPipe, TranslocoModule]
})
export class LibraryRecommendedComponent implements OnInit {

  @Input() libraryId: number = 0;
  private readonly destroyRef = inject(DestroyRef);

  quickReads$!: Observable<Series[]>;
  quickCatchups$!: Observable<Series[]>;
  highlyRated$!: Observable<Series[]>;
  onDeck$!: Observable<Series[]>;
  rediscover$!: Observable<Series[]>;
  moreIn$!: Observable<Series[]>;
  genre$!: Observable<Genre>;

  all$!: Observable<any>;

  constructor(private recommendationService: RecommendationService, private seriesService: SeriesService,
    private metadataService: MetadataService) { }

  ngOnInit(): void {

    this.quickReads$ = this.recommendationService.getQuickReads(this.libraryId, 0, 30)
                      .pipe(takeUntilDestroyed(this.destroyRef), map(p => p.result), shareReplay());

    this.quickCatchups$ = this.recommendationService.getQuickCatchupReads(this.libraryId, 0, 30)
                      .pipe(takeUntilDestroyed(this.destroyRef), map(p => p.result), shareReplay());

    this.highlyRated$ = this.recommendationService.getHighlyRated(this.libraryId, 0, 30)
                      .pipe(takeUntilDestroyed(this.destroyRef), map(p => p.result), shareReplay());

    this.rediscover$ = this.recommendationService.getRediscover(this.libraryId, 0, 30)
                      .pipe(takeUntilDestroyed(this.destroyRef), map(p => p.result), shareReplay());

    this.onDeck$ = this.seriesService.getOnDeck(this.libraryId, 0, 30)
                        .pipe(takeUntilDestroyed(this.destroyRef), map(p => p.result), shareReplay());

    this.genre$ = this.metadataService.getAllGenres([this.libraryId]).pipe(
                        takeUntilDestroyed(this.destroyRef),
                        map(genres => genres[Math.floor(Math.random() * genres.length)]),
                        shareReplay()
                  );
    this.genre$.subscribe(genre => {
      this.moreIn$ = this.recommendationService.getMoreIn(this.libraryId, genre.id, 0, 30).pipe(takeUntilDestroyed(this.destroyRef), map(p => p.result), shareReplay());
    });

    this.all$ = merge(this.quickReads$, this.quickCatchups$, this.highlyRated$, this.rediscover$, this.onDeck$, this.genre$).pipe(takeUntilDestroyed(this.destroyRef));
  }


  reloadInProgress(series: Series | number) {
    if (Number.isInteger(series)) {
      if (!series) {return;}
    }
    // If the update to Series doesn't affect the requirement to be in this stream, then ignore update request
    const seriesObj = (series as Series);
    if (seriesObj.pagesRead !== seriesObj.pages && seriesObj.pagesRead !== 0) {
      return;
    }

    this.quickReads$ = this.quickReads$.pipe(filter(series => !series.includes(seriesObj)));
    this.quickCatchups$ = this.quickCatchups$.pipe(filter(series => !series.includes(seriesObj)));
  }

}
