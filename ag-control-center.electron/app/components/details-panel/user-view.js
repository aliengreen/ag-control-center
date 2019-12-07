// import './user-view.scss'
import template from './user-view.html'
import { Component } from '../component'
import moment from 'moment';

/**
 * User View Component
 * @extends Component
 */
export class UserView extends Component {
  /** UserView Component Constructor
   */
  constructor(placeholderId, props) {
    super(placeholderId, props, template)

  }


  /** Show user info when a user item is selected */
  async show(user) {

    let user_items = '';

    user_items += `
       <div  class="media">
        <div class="media-left">
          <span class="icon is-size-2">
            <i class="fa fa-user-o"></i>
          </span>
        </div>
        <div class="media-content">
          <p class="title is-4">${user.name}</p>
          <p class="subtitle is-6"><a href="tel:${user.email}">${user.email}</a></p>
        <h1>IDI NAXUI ANTONIO</h1>`;

    user_items += `</div>
      </div>`;


    this.refs.user_items.innerHTML = user_items;
    this.translateComponent();
  }

}