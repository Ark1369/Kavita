import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  pure: true,
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private dom: DomSanitizer) {}

  transform(value: string): unknown {
    return this.dom.sanitize(SecurityContext.HTML, value);
  }

}
