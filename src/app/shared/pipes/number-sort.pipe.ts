import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numSort',
  pure: true,
  standalone: true
})
export class NumberSortPipe implements PipeTransform {
  transform<T extends {}>(value: T[] | undefined, key: keyof T, asc = false): T[] | undefined {
    if (!value) {
      return;
    }

    return value.sort((a, b) => 
      asc
        ? a[key] as number - (b[key] as number)
        : b[key] as number - (a[key] as number));
  }

}