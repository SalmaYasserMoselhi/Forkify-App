import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // Page 1, no other pages
    if (currentPage === 1 && numPages === 1) return ``;

    // Page 1, there are other pages
    if (currentPage === 1 && numPages > 1) {
      return this._generateNextButtonMarkup(currentPage);
    }

    // Last page
    if (currentPage === numPages && numPages > 1)
      return this._generatePreviousButtonMarkup(currentPage);

    // Other page
    if (currentPage < numPages)
      return (
        this._generatePreviousButtonMarkup(currentPage) +
        this._generateNextButtonMarkup(currentPage)
      );
  }

  _generateNextButtonMarkup(currentPage) {
    return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span> 

            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
  _generatePreviousButtonMarkup(currentPage) {
    return `
          <button data-goto="${
            currentPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
      `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const button = e.target.closest('button');
      if (!button) return;

      const goToPage = +button.dataset.goto;

      handler(goToPage);
    });
  }
}

export default new PaginationView();
