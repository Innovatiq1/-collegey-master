import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bulletPoints'
})
export class BulletPointsPipe implements PipeTransform {
  transform(value: string): string {

    const processedContent = value
      .replace(/<li>/g, '&#8226; ')
      .replace(/<\/li>/g, '<br>')
  
    return processedContent;
  }
}
