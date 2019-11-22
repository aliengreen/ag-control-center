import './users.scss'
import { Component } from '../component'
import View from './users.html'
import paginate from 'jw-paginate'
import { UserDisable } from '../modals/user_disable/user_disable';
import { UserRemove } from '../modals/user_remove/user_remove';

/**
 * User List Component
 * @extends Component
 */
export class Users extends Component {

  constructor(placeholderId, props) {
    super(placeholderId, props, View);

    if (props.dataset) {
      this.dataset = props.dataset;
      this.connection = props.dataset.connection;
      this.appInfo = props.dataset.appInfo;
    }

    this.search = '';
    this.paginationCurrentPage = 1;
    this.paginationPageSize = 10;
    this.loadUsers();

    let prevElem = this.getPrevElement();
    prevElem.addEventListener('click', (e) => {
      if (!e.target.hasAttribute('disabled')) {
        this.paginationCurrentPage--;
        this.loadUsers();
      }
    });

    let nextElem = this.getNextElement();
    nextElem.addEventListener('click', (e) => {
      if (!e.target.hasAttribute('disabled')) {
        this.paginationCurrentPage++;
        this.loadUsers();
      }
    });

    let selElem = this.getElementByClassName('.select-pagesize');
    selElem.addEventListener('change', (e) => {
      this.paginationPageSize = e.target.value;
      this.loadUsers();
    });

    let searchElem = this.getElementByClassName('.search-field');
    let inputElem = this.getElementByClassName('.input-button');
    inputElem.addEventListener('click', (e) => {
      this.search = searchElem.value;
      this.paginationCurrentPage = 1;
      this.loadUsers();
    });

    searchElem.addEventListener('keyup', (e) => {
      if (e.keyCode == 13) {
        // Cancel the default action, if needed
        e.preventDefault();
        this.search = searchElem.value;
        this.paginationCurrentPage = 1;
        this.loadUsers();
      }
    });
  }

  getPrevElement() {
    return this.getElementByClassName('.pagination-previous');
  }

  getNextElement() {
    return this.getElementByClassName('.pagination-next');
  }

  /* Load users */
  loadUsers() {

    /* Start spinning loading animation */
    this.startLoading();

    /* Clear HTML table */
    this.refs['user-list'].innerHTML = '';


    this.connection.userList(this.search, (this.paginationCurrentPage - 1) * this.paginationPageSize, this.paginationPageSize).then((res, statusCode) => {

      /* Add paginaiton footer */
      this.addPaginationNumbers(res.total, this.paginationCurrentPage, this.paginationPageSize);

      /* Set total user count */
      this.setValue('total', res.total);

      /* Stop spinning loading animation */
      this.stopLoading();

      if (res.rows.length == 0) {
        this.addMessage();
      }
      let index = 0;

      res.rows.forEach((row) => {

        let devices = JSON.parse(row.devices);

        let metaData = JSON.parse(row.meta);
        let classNames = '';
        // console.log(row);
        if (index % 2) {
          classNames = '';
        }
        index++;
        let html = `<div class="columns is-marginless table-row ${classNames}">
        <div class="column is-1 is-medium">
        <label class="checkbox">
            <input type="checkbox">
        </label>
        </div>
        <div class="column is-3"><a href="#">${metaData.name}</a></div>
        <div class="column is-3">${row.email}</div>
        <div class="column is-2">`;

        if (devices) {
          for (let i = 0; i < devices.length; i++) {
            if (devices[i].data) {
              const services = devices[i].data.services.join('/');
              const status_online = devices[i].data.offline_notified ? 'is-danger' : 'is-success';
              html += `<a class="tag ${status_online}">${services}</a>`;
            } else {
              html += `<span class="tag is-danger">${devices[i].device_uuid}</span>`;
            }
          }
        } else {
          html += `<span class="tag is-warning" data-trn>no device</span>`;
        }

        html += `</div> 
        
        <div class="column is-2">
          <div class="action-group">
            <button class="button is-rounded is-small" data-id="${row.uuid}" data-bind-clkcb="userPretendCallback" data-trn>Pretend</button>
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
                <a href="#" class="dropdown-item" data-id="${row.uuid}" data-bind-clkcb="userDisableCallback" data-trn>
                  Disable
                </a>
                <a href="#" class="dropdown-item" data-id="${row.uuid}" data-bind-clkcb="userRemoveCallback" data-trn>
                  Delete
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>
        </div>`;

        this.refs['user-list'].innerHTML += html;
      });


      this.bindCallbacks();
      this.translateComponent();

    }).catch((statusCode) => {

      /* Stop spinning loading animation */
      this.stopLoading();
      console.log(`Can't get user list (${statusCode})`);
    });
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
          this.loadUsers();
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

  getView() {
    return View;
  }


  /* CALLBACKS */
  userRemoveCallback(e, id) {
    
    if(this.modal) {
      this.modal = null;
    }

    this.modal = new UserRemove('modal-placeholder', {
      dataset: this.dataset,
      events: {
        deleteButton: event => {
          console.log('Delete 2');
        },
      }
    });

    this.modal.showModalPage();
  }

  userDisableCallback(e, id) {

    if(this.modal) {
      this.modal = null;
    }

    this.connection.getUserByUUID(id).then((res, statusCode) => {
      let user = JSON.parse(res[0].meta);
      this.modal = new UserDisable('modal-placeholder', {
        dataset: this.dataset,
        data: user,
        events: {
          disableButton: event => {
            this.modal.startLoading();
            this.connection.userModify('disable', id).then((res, statusCode) => {
              this.modal.stopLoading();
              this.modal.closeModal();
              this.dataset.snackbar.show(this.polyglot.t('msg.user.disabled', {name: user.name}));
            }).catch((statusCode) => {
              this.modal.stopLoading();
              console.log(`Can't modify user (${statusCode})`);
            });
          },
        }
      });
  
      this.modal.showModalPage();
    
    }).catch((statusCode) => {
      console.log(`Can't getUserByUUID (${statusCode})`);
    });
  }

  userPretendCallback(e, id) {
    this.connection.pretend(id).then((res, statusCode) => {
      window.open(`${this.appInfo.app_url}/pre_login/#${res.access_token}`, `${id}`, 'nodeIntegration=no,height=600,width=1200')
    }).catch((statusCode) => {
      console.log(`Can't pretend (${statusCode})`);
    });
  }
}