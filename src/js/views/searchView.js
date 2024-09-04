class SearchView {
  _parentElement = document.querySelector('.search');

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  // Publisher-Subscriber Pattern
  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      // Prevent default reloading of the page
      e.preventDefault();

      handler();
    });

  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
