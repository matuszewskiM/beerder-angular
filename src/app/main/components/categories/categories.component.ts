import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Category } from '../../types/category.interface';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent {
  @Input() public categories!: Category[] | null;
  @Output() private selected = new EventEmitter<number>()

  public onSelected(id: number): void {
    this.selected.emit(id)
  }
}
