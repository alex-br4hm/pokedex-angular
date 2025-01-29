import {Component, effect, EventEmitter, Input, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {FilterSidebarComponent} from './filter-sidebar/filter-sidebar.component';
import {PokeDataService} from '../../../core/services/poke-data.service';
import {FilterDisplayComponent} from '../filter-display/filter-display.component';

@Component({
  selector: 'app-search-filter-bar',
  imports: [
    MatIcon,
    FormsModule,
    FilterSidebarComponent,
    FilterDisplayComponent
  ],
  templateUrl: './search-filter-bar.component.html',
  styleUrl: './search-filter-bar.component.scss'
})
export class SearchFilterBarComponent {
  @Input() searchInput: string = '';
  @Output() searchInputChange: EventEmitter<string> = new EventEmitter<string>();

  filterToggled: boolean = false;
  isClosing: boolean = false;

  constructor(private pokeDataService: PokeDataService) {
    effect(() => {
      this.searchInput = this.pokeDataService.searchInput();
    });
  }

  toggleFilter(open: boolean) {
    if (!open) {
      document.body.style.overflow = 'unset';
      this.isClosing = true;
    } else {
      document.body.style.overflow = 'hidden';
      this.filterToggled = true;
      this.isClosing = false;
    }
  }

  handleAnimationEnd() {
    if (this.isClosing) {
      this.filterToggled = false;
      this.isClosing = false;
    }
  }

  onSearchInputChange() {
    const searchInput = this.searchInput;
    this.pokeDataService.setSearchInput(searchInput);
    window.scroll({top: 0, behavior: 'smooth'});
  }

  deleteSearchInput() {
    this.searchInput = '';
    this.pokeDataService.setSearchInput(this.searchInput);
  }
}
