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
      let data = props.data;
      this.setValue('name', props.data.firstname + ' ' + props.data.lastname);

      console.log(data);
      this.setValue('id', `(${data.id_card})`);
      this.setValue('address', data.address);
      this.setValue('city', data.city);
      this.setValue('phone', data.phone);
      this.setValue('email', data.email);

      this.viewProducts(props.data);
      this.viewTransactions(props.data);
    }
  }


  viewProducts(payment) {
    let products = JSON.parse(payment.products);

    let html = '';
    let total_price = 0;
    for (let i = 0; i < products.length; i++) {

      html += `<div class="columns">
      <div class="column is-4">${products[i].title}</div>
      <div class="column is-4">${products[i].quantity}</div>
      <div class="column is-4">${products[i].price}</div>
      </div>`;
      total_price += parseFloat(products[i].price) * parseInt(products[i].quantity);
    }
    // ((349-150.07)/349)*100


    // let total_amount_gel = parseFloat(payment.total_amount_gel) - parseFloat(payment.shipping_amount_gel);
    let total_amount = total_price - ((total_price * payment.discount_percent) / 100)
    let shipping_amount = payment.total_amount_gel.toFixed(2) - total_amount.toFixed(2);

    if (payment.discount_percent) {
      // Discount percent
      html += `<div class="columns">
    <div class="column is-8 has-background-light"><strong class="pull-right" data-trn>Discount:</strong></div>
    <div class="column is-4 has-background-light"><strong>${payment.discount_percent}%</strong></div>
    </div>`;


      // Discount code
      html += `<div class="columns">
    <div class="column is-8 has-background-light"><strong class="pull-right" data-trn>Discount Code:</strong></div>
    <div class="column is-4 has-background-light"><strong>${payment.discount_code}</strong></div>
    </div>`;
    }

    if (shipping_amount) {
      // Shipping
      html += `<div class="columns">
        <div class="column is-8 has-background-light"><strong class="pull-right" data-trn>Shipping:</strong></div>
        <div class="column is-4 has-background-light"><strong>${shipping_amount}</strong></div>
        </div>`;
    }

    // Total Amount
    html += `<div class="columns">
    <div class="column is-8 has-background-light"><strong class="pull-right" data-trn>Total:</strong></div>
    <div class="column is-4 has-background-light"><strong>${payment.total_amount_gel.toFixed(2)}</strong></div>
    </div>`;

    this.refs['product-list'].innerHTML += html;

    this.translateComponent();
  }


  viewTransactions(payment) {
    let order_transactions = JSON.parse(payment.order_transactions);

    let html = '';

    for (let i = 0; i < order_transactions.length; i++) {
      const meta = order_transactions[i].meta;

      let meta_html = '';



      if (meta === null) {
        html += `<div class="columns">
        <div class="column is-1">${i}</div>
        <div class="column is-2">${order_transactions[i].status}</div>
        <div class="column is-9"></div>
        </div>`;
      } else {

        if (meta.uuid) {
          meta_html += `<p class="is-size-7 has-text-grey">UUID: ${meta.uuid}</p>`;
        }

        if (meta.card_number) {
          meta_html += `<p class="is-size-7 has-text-grey">Card Number: ${meta.card_number}</p>`;
        }

        if (meta.rrn) {
          meta_html += `<p class="is-size-7 has-text-grey">RRN: ${meta.rrn}</p>`;
        }

        if (meta.result) {
          meta_html += `<p class="is-size-7 has-text-grey">Result: ${meta.result}</p>`;
        }

        if (meta.result_code) {
          meta_html += `<p class="is-size-7 has-text-grey">Result Code: ${meta.result_code}</p>`;
        }

        if (meta.result_code_desc_display) {
          meta_html += `<p class="is-size-7 has-text-grey">Display: ${meta.result_code_desc_display}</p>`;
        }

        if (meta.result_code_desc_en) {
          meta_html += `<p class="is-size-7 has-text-grey">Desc EN: ${meta.result_code_desc_en}</p>`;
        }

        if (meta.result_code_desc_ka) {
          meta_html += `<p class="is-size-7 has-text-grey">Desc KA: ${meta.result_code_desc_ka}</p>`;
        }


        html += `<div class="columns">
      <div class="column is-1">${i}</div>
      <div class="column is-2">${order_transactions[i].status}</div>
        <div class="column is-9">
        ${meta_html}
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