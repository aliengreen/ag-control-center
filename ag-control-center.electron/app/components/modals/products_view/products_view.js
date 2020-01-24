// import './user_disable.scss'
import { Component } from '../../component'
import products_view from './products_view.html'
import moment from 'moment'

/**
 * Products View Component
 * @extends Component
 */
export class ProductsView extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, products_view);

    let elements = this.componentElem.querySelectorAll('.close-button');
    elements.forEach((element) => {
      element.addEventListener('click', () => {
        this.removeModal();
      });
    });


    this.data = props.data;

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
    shipping_amount = shipping_amount.toFixed(2);
    
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


  /** Remove all events and close modal container (make inactive) */
  removeModal() {
    this.removaAllEvents();
    this.closeModalPage(this.componentElem);
  }

}