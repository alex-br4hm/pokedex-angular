import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatIconButton} from '@angular/material/button';
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
