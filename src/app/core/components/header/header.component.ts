import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-header',
  imports: [
    FormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  searchInput: string = '';
  @Output() searchInputChange = new EventEmitter<string>();

  onSearchInputChange() {
    this.searchInputChange.emit(this.searchInput);
  }

}
