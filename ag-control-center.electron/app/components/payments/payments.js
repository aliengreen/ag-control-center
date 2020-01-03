import './payments.scss'
import { ComponentTable } from '../componentTable'
import View from './payments.html'
import moment from 'moment'
import { DetailsPanel } from '../details-panel/details-panel';


/**
 * Payment List Component
 * @extends Component
 */
export class Payments extends ComponentTable {

  constructor(placeholderId, props) {
    super(placeholderId, props, View);

    this.loadData();

    moment.locale(this.appInfo.locale);

    // Initialize Details Panel
    this.infoComponent = new DetailsPanel('details-panel-placeholder', {
      dataset: props.dataset
    });


  }


  /* Load payments */
  loadData() {

    /* Start spinning loading animation */
    this.startLoading();

    /* Clear HTML table */
    this.refs['payment-list'].innerHTML = '';

    this.connection.paymentList(this.search, (this.paginationCurrentPage - 1) * this.paginationPageSize, this.paginationPageSize, this.order, this.order_by).then((res, statusCode) => {
      
      /* Add paginaiton footer */
      this.addPaginationNumbers(res.total, this.paginationCurrentPage, this.paginationPageSize);

      /* Set total payment count */
      this.setValue('total', res.total);

      /* Stop spinning loading animation */
      this.stopLoading();

      if (res.rows.length == 0) {
        this.addMessage();
      }
      let index = 0;

      res.rows.forEach((row) => {

        let products = JSON.parse(row.products);

        // let metaData = JSON.parse(row.meta);

        index++;
        let html = `<div class="columns is-marginless table-row" data-id="${row.order_id}" data-bind-clkcb="paymentSelectCallback">
        <div class="column is-3">
          <a href="#" data-id="${row.order_id}" class="is-size-5" data-bind-clkcb="paymentViewCallback">${row.firstname} ${row.lastname}</a>
          <p class="is-size-7">${row.email}</p>
          <p class="is-size-7 has-text-grey">T:${row.phone}</p>
          <p class="is-size-7 has-text-grey" title="Order ID">${row.order_id}</p>
          <p class="is-size-7 has-text-grey" title="Transaction ID">${row.tid}</p>
        </div>
        <div class="column is-3"><strong>${row.total_amount_gel.toFixed(2)}</strong></div>
        <div class="column is-2"><p class="is-size-7">${moment(row.created).format('D MMM YY h:mm A')}</p></div>`

        html += `
        <div class="column is-4">
          <div class="action-group">
            <button class="button is-rounded is-small" data-id="${row.order_id}" data-bind-clkcb="paymentAcceptCallback" data-trn>Accept</button>
            <div class="dropdown is-hoverable">
            <div class="dropdown-trigger">
              <button class="button is-rounded is-small" aria-haspopup="true" aria-controls="dropdown-menu4">
              <span data-trn>More</span>
                <span class="icon is-small">
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
                </span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu4" role="menu">
              <div class="dropdown-content">
                <a href="#" class="dropdown-item" data-id="${row.order_id}" data-bind-clkcb="paymentCancelCallback" data-trn>
                Cancel Payment
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>
        </div>`;

        this.refs['payment-list'].innerHTML += html;
      });


      this.bindCallbacks();
      this.translateComponent();

    }).catch((statusCode) => {

      /* Stop spinning loading animation */
      this.stopLoading();
      console.log(`Can't get payment list (${statusCode})`);
    });
  }


  getView() {
    return View;
  }


  paymentSelectCallback(e, id) {
    this.current_id = id;
    // this.showInfo(id);
  }

  paymentViewCallback(e, id) {
    this.connection.getPayment(id).then((res, statusCode) => {
      const url = `${this.appInfo.web_url}/${this.appInfo.locale}/shop/status/#${id}&${res.payment[0].email}`;
      window.open(url, `${id}`, 'nodeIntegration=no,height=600,width=1480')
    }).catch((statusCode) => {
      console.log(`Can't get payment information (${statusCode})`);
    });
  }
  

  setupOrder(e, id) {

    let sortClassName = '';
    if (this.order === 'asc') {
      this.order = 'desc';
      sortClassName = 'fa-sort-down';
    } else {
      this.order = 'asc';
      sortClassName = 'fa-sort-up';
    }

    /* Query icon */
    let elements = this.componentElem.querySelectorAll(`.sort-table-header i`);
    elements.forEach((element) => {
      element.classList.remove('fa-sort-up');
      element.classList.remove('fa-sort-down');
    });

    elements = e.target.parentElement.querySelectorAll(`i`);
    elements.forEach((element) => {
      element.classList.add(sortClassName);
    });

  }

  sortByName(e, id) {
    this.setupOrder(e, id);
    this.order_by = 'name';
    this.reload();
  }

  sortByEmail(e, id) {
    this.setupOrder(e, id);
    this.order_by = 'email';
    this.reload();
  }

  sortByCreated(e, id) {
    this.setupOrder(e, id);
    this.order_by = 'created';
    this.reload();
  }

}