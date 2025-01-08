import {Component, EventEmitter, Output} from '@angular/core';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {
  MatDrawer,
  MatDrawerContainer,
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent
} from '@angular/material/sidenav';

@Component({
  selector: 'app-search-filter-bar',
  imports: [
    MatInput,
    MatFormField,
    MatIcon,
    FormsModule,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    MatButton,
    MatDrawer,
    MatDrawerContainer,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent
  ],
  templateUrl: './search-filter-bar.component.html',
  styleUrl: './search-filter-bar.component.scss'
})
export class SearchFilterBarComponent {
  searchInput: string = '';
  @Output() searchInputChange = new EventEmitter<string>();

  filterToggled: boolean = false;
  isClosing: boolean = false;

  toggleFilter(open: boolean) {
    if (!open) {
      // Trigger Slide-Out Animation
      this.isClosing = true;
    } else {
      // Open Filter
      this.filterToggled = true;
      this.isClosing = false;
    }
  }

  handleAnimationEnd() {
    if (this.isClosing) {
      // After Slide-Out Animation, hide the container
      this.filterToggled = false;
      this.isClosing = false;
    }
  }

  onSearchInputChange() {
    this.searchInputChange.emit(this.searchInput);
    window.scroll({top: 0, behavior: 'smooth'});
  }

  deleteSearchInput() {
    this.searchInput = '';
    this.searchInputChange.emit(this.searchInput);
  }
}
