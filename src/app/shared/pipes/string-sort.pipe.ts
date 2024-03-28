import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringSort',
  pure: true,
  standalone: true
})
export class StringSortPipe implements PipeTransform {
  transform(value: string[] | null, asc = false): string[] | null {
    if (!value) {
      return null;
    }
    return value.sort((a, b) => a.localeCompare(b));
  }

}