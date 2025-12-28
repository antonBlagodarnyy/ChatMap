// kebab-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'foldedTextPipe',
})
export class FoldedTextPipe implements PipeTransform {
  transform(value: string, length: number): string {
    return value.length < length ? value : value.slice(0, length).concat('...') ;
  }
}
