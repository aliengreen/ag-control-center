import { Component } from './component'
import paginate from 'jw-paginate'

/**
 * ComponentTable List Component
 * @extends Component
 */
export class ComponentTable extends Component {

  constructor(placeholderId, props, View) {
    super(placeholderId, props, View);

    if (props.dataset) {
      this.dataset = props.dataset;
      this.connection = props.dataset.connection;
      this.appInfo = props.dataset.appInfo;
    }

    this.search = '';
    this.paginationCurrentPage = 1;
    this.paginationPageSize = 10;
    this.order = 'asc';
    this.order_by = '';

    /** Attach Prev click event */
    let prevElem = this.getPrevElement();
    prevElem.addEventListener('click', (e) => {
      if (!e.target.hasAttribute('disabled')) {
        this.paginationCurrentPage--;
        this.loadData();
      }
    });

    /** Attach Next click event */
    let nextElem = this.getNextElement();
    nextElem.addEventListener('click', (e) => {
      if (!e.target.hasAttribute('disabled')) {
        this.paginationCurrentPage++;
        this.loadData();
      }
    });

    /** Attach change page size change event */
    let selElem = this.getElementByClassName('.select-pagesize');
    selElem.addEventListener('change', (e) => {
      this.paginationPageSize = e.target.value;
      this.loadData();
    });

    /** Attach search textbox event */
    let searchElem = this.getElementByClassName('.search-field');
    let inputElem = this.getElementByClassName('.input-button');
    inputElem.addEventListener('click', (e) => {
      this.search = searchElem.value;
      this.paginationCurrentPage = 1;
      this.loadData();
    });

    /** Attach enter key event to the textbox */
    searchElem.addEventListener('keyup', (e) => {
      if (e.keyCode == 13) {
        // Cancel the default action, if needed
        e.preventDefault();
        this.search = searchElem.value;
        this.paginationCurrentPage = 1;
        this.loadData();
      }
    });
  }

  getPrevElement() {
    return this.getElementByClassName('.pagination-previous');
  }

  getNextElement() {
    return this.getElementByClassName('.pagination-next');
  }

  addPaginationNumbers(total, pageNumber, pageSize) {
    this.refs['pagination-list'].innerHTML = '';
    let pg = paginate(total, pageNumber, pageSize, 10);

    let prevElement = this.getPrevElement();
    let nextElement = this.getNextElement();

    if (total > 0) {
      prevElement.removeAttribute('disabled');
      nextElement.removeAttribute('disabled');
    }

    if (pageNumber == 1) {
      prevElement.setAttribute('disabled', '');
    }

    if (pageNumber == this.totalPages) {
      prevElement.setAttribute('disabled', '');
    }

    for (let i = pg.startPage; i <= pg.endPage; i++) {
      let paginationNum = '';
      if (pg.currentPage == i) {
        paginationNum = `<li>
        <a class="pagination-link is-current page-button" aria-label="Page ${i}" data-click-event="page">${i}</a>
        </li>`;
      } else {
        paginationNum = `<li>
        <a class="pagination-link page-button" aria-label="Page ${i}" data-click-event="page">${i}</a>
        </li>`;
      }
      this.refs['pagination-list'].innerHTML += paginationNum;
    }

    const eventElems = this.componentElem.querySelectorAll('.page-button')
    eventElems.forEach((elem) => {
      elem.addEventListener('click', (e) => {
        let pageNum = parseInt(e.target.innerText.trim());
        if (pageNum != pg.currentPage) {
          this.paginationCurrentPage = pageNum;
          this.loadData();
        }
      });
    });

  }

  addMessage() {
    let msg = `<div class="columns is-desktop is-vcentered" style="height: 100%">
    <div class="column has-text-centered">
    <h1 class="subtitle">${this.polyglot.t('users.not.found')}</h1>
    </div>
    </div>`;

    this.refs['user-list'].innerHTML = msg;
  }

  /** Reload data */
  reload() {
    this.loadData();
  }

}