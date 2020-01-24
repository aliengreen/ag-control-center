// import './user_disable.scss'
import { Component } from '../../component'
import transactions_view from './transactions_view.html'
import moment from 'moment'

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

    this.refs['add-note'].addEventListener('click', () => {

      let note = this.refs['input-note'].value;

      if (note.length) {
        this.startLoading();
        this.connection.paymentUpdateStatus(this.data.order_id, this.refs['select-status'].value, note).then((res, statusCode) => {
          this.connection.getPayment(this.data.order_id).then((res, statusCode) => {
            const payment = res.payment[0];
            this.viewTransactions(payment);
            this.stopLoading();
            this.dataset.snackbar.show(this.polyglot.t('msg.payment.addstatus.success'), 'success');
          }).catch((statusCode) => {
            this.stopLoading();
            this.dataset.snackbar.show(this.polyglot.t('msg.payment.addstatus.fail'), 'dainger');
            console.log(`Can't getPayment (${statusCode})`);
          });
        }).catch((statusCode) => {
          this.stopLoading();
          this.dataset.snackbar.show(this.polyglot.t('msg.payment.addstatus.fail'), 'dainger');
          console.log(`Can't update payment status (${statusCode})`);
        });
      }
    });

    this.data = props.data;

    if (props.data) {
      let data = props.data;
      this.setValue('name', props.data.firstname + ' ' + props.data.lastname);
      this.viewTransactions(props.data);
    }
  }

  viewTransactions(payment) {
    this.refs['transactions-list'].innerHTML = '';
    let order_transactions = JSON.parse(payment.order_transactions);

    let html = '';

    for (let i = 0; i < order_transactions.length; i++) {
      const meta = order_transactions[i].meta;
      let meta_html = '';

      let order_badge = 'warning';
      let order_title = order_transactions[i].status;

      if (meta) {
        if (meta.result === "ok") {
          order_badge = 'success';
        } else if (meta.result === "failed") {
          order_badge = 'danger';
        }
      }


      if (meta === null) {
        html += `<div class="columns">
        <div class="column is-3"><p class="tag is-${order_badge}">${order_title}</p></div>
        <div class="column is-5"></div>
        <div class="column is-3 is-size-7"><p>${moment(order_transactions[i].created).format('D MMM YY h:mm A')}</p></div>
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

        if (meta.note) {
          meta_html += `<p class="is-size-7 has-text-black">Note: ${meta.note}</p>`;
        }


        html += `<div class="columns">
      <div class="column is-3"><p class="tag is-${order_badge}">${order_title}</p></div>
        <div class="column is-5">
        ${meta_html}
        </div>
        <div class="column is-3 is-size-7">${moment(order_transactions[i].created).format('D MMM YY h:mm A')}</div>
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