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
  isClosing: boolean     = false;

  constructor(private pokeDataService: PokeDataService) {
    effect(() => {
      this.searchInput = this.pokeDataService.searchInput();
    });
  }

  /**
   * Toggles the visibility of the filter.
   * Updates the body's overflow style and adjusts the filter's toggled state accordingly.
   *
   * @param {boolean} open - A flag to indicate whether the filter should be opened (`true`) or closed (`false`).
   */
  toggleFilter(open: boolean) {
    if (!open) {
      document.body.style.overflow = 'unset';
      this.isClosing = true;
    } else {
      document.body.style.overflow = 'hidden';
      this.filterToggled = true;
      this.isClosing     = false;
    }
  }

  /**
   * Handles the end of the filter sidebar animation.
   * Resets the toggled state and closing flag if the animation is completed.
   */
  handleAnimationEnd() {
    if (this.isClosing) {
      this.filterToggled = false;
      this.isClosing     = false;
    }
  }

  /**
   * Handles the change of the search input.
   * Set new variable to get new reference to trigger signal correctly.
   * Sets the search input in the data service and scrolls to the top of the page.
   */
  onSearchInputChange() {
    const searchInput = this.searchInput;
    this.pokeDataService.setSearchInput(searchInput);
    window.scroll({top: 0, behavior: 'smooth'});
  }

  /**
   * Clears the search input and updates the data service with the cleared value.
   */
  deleteSearchInput() {
    this.searchInput = '';
    this.pokeDataService.setSearchInput(this.searchInput);
  }
}
