// import './user_disable.scss'
import { Component } from '../../component'
import transactions_view from './transactions_view.html'


/**
 * Transactions View Component
 * @extends Component
 */
export class TransactionsView extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, transactions_view);

    let elements = this.componentElem.querySelectorAll('.close-button');
    elements.forEach((element) => {
      element.addEventListener('click', () => {
        this.removeModal();
      });
    });

    if (props.data) {
      this.setValue('name', props.data.firstname + ' ' + props.data.lastname);

      this.viewTransactions(props.data);
    }
  }

  viewTransactions(payment) {
    let order_transactions = JSON.parse(payment.order_transactions);

    let html = '';

    for (let i = 0; i < order_transactions.length; i++) {
      const meta = order_transactions[i].meta;
      if (meta === null) {
        html += `<div class="columns">
        <div class="column is-1">${i}</div>
        <div class="column is-2">${order_transactions[i].status}</div>
        <div class="column is-9"></div>
        </div>`;
      } else {
        html += `<div class="columns">
      <div class="column is-1">${i}</div>
      <div class="column is-2">${order_transactions[i].status}</div>
        <div class="column is-9">
        <p class="is-size-7 has-text-grey">Card Number: ${meta.card_number}</p>
        <p class="is-size-7 has-text-grey">RRN: ${meta.rrn}</p>
        <p class="is-size-7 has-text-grey">Result: ${meta.result}</p>
        <p class="is-size-7 has-text-grey">Result Code: ${meta.result_code}</p>
        <p class="is-size-7 has-text-grey">Display: ${meta.result_code_desc_display}</p>
        <p class="is-size-7 has-text-grey">Desc EN: ${meta.result_code_desc_en}</p>
        <p class="is-size-7 has-text-grey">Desc KA: ${meta.result_code_desc_ka}</p>
        
      
        </div>
      </div>`;
      }
    }

    this.refs['transactions-list'].innerHTML += html;
  }

  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}