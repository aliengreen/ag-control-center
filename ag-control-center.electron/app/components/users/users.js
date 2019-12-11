import './users.scss'
import { ComponentTable } from '../componentTable'
import View from './users.html'
import moment from 'moment'
import { DetailsPanel } from '../details-panel/details-panel';
import { UserDisable } from '../modals/user_disable/user_disable';
import { UserEnable } from '../modals/user_enable/user_enable';
import { UserEdit } from '../modals/user_edit/user_edit';
import { UserResetPassword } from '../modals/user_reset_password/user_reset_password';
import { UserRemove } from '../modals/user_remove/user_remove';
import { GeoLocationEdit } from '../modals/geolocation_edit/geolocation_edit';

/**
 * User List Component
 * @extends Component
 */
export class Users extends ComponentTable {

  constructor(placeholderId, props) {
    super(placeholderId, props, View);

    this.loadData();

    moment.locale(this.appInfo.locale);

    // Initialize Details Panel
    this.infoComponent = new DetailsPanel('details-panel-placeholder', {
      dataset: props.dataset
    });

    // this.connection.userSessions('85330d36-0215-412d-bd93-a39c4596f5e6').then((res, statusCode) => {
    //   console.log(res);
    // });

  }


  /* Load users */
  loadData() {

    /* Start spinning loading animation */
    this.startLoading();

    /* Clear HTML table */
    this.refs['user-list'].innerHTML = '';

    this.connection.userList(this.search, (this.paginationCurrentPage - 1) * this.paginationPageSize, this.paginationPageSize, this.order, this.order_by).then((res, statusCode) => {

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
        console.log(row);
        if (index % 2) {
          classNames = '';
        }


        index++;
        let html = `<div class="columns is-marginless table-row ${classNames}" data-id="${row.uuid}" data-bind-clkcb="userSelectCallback">
        <div class="column is-3"><a href="#" data-id="${row.uuid}" data-bind-clkcb="userEditCallback">${metaData.name}</a></div>
        <div class="column is-3">
            <p>${row.email}</p>
            <strong class="is-size-7 has-text-grey-light" data-trn>
                ${row.status === 0 ? 'Inactive' : 'Active'}            
            </strong><span class="is-size-7 has-text-grey-light"> / </span><strong class="is-size-7 has-text-grey-light is-small">${row.type}</strong>
        </div>
        <div class="column is-2"><p class="is-size-7">${moment(row.created).format('D MMM YY h:mm A')}</p></div>
        <div class="column is-2">`

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


        let disenCallbackName = 'userDisableCallback';
        let disenTitle = 'Disable';

        if (row.status === 0) {
          disenCallbackName = 'userEnableCallback';
          disenTitle = 'Enable';
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
                <a href="#" class="dropdown-item" data-id="${row.uuid}" data-bind-clkcb="userEditCallback" data-trn>
                Edit
                </a>
                <a href="#" class="dropdown-item" data-id="${row.uuid}" data-bind-clkcb="${disenCallbackName}" data-trn>
                  ${disenTitle}
                </a>
                <a href="#" class="dropdown-item" data-id="${row.uuid}" data-bind-clkcb="userResetPasswordCallback" data-trn>
                Reset Password
                </a>
                <a href="#" class="dropdown-item" data-id="${row.uuid}" data-bind-clkcb="userGeolocationCallback" data-trn>
                Geolocation
                </a>
                <hr class="dropdown-divider">
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


  getView() {
    return View;
  }

  /* CALLBACKS */
  userRemoveCallback(e, id) {

    if (this.modal) {
      this.modal = null;
    }

    this.connection.getUserByUUID(id).then((res, statusCode) => {
      let user = res[0];
      this.modal = new UserRemove('modal-placeholder', {
        dataset: this.dataset,
        data: user,
        events: {
          deleteButton: event => {

            let form = this.modal.validateForm();
            if (form) {
              this.modal.startLoading();
              this.connection.userDelete(form, id).then((res, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                this.dataset.snackbar.show(this.polyglot.t('msg.user.delete', { name: user.email }), 'success');
                this.reload();
              }).catch((response, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                console.log(`Can't modify user (${response.statusMessage})`);
              });
            }
          },
        }
      });

      this.modal.showModalPage();

    }).catch((statusCode) => {
      console.log(`Can't getUserByUUID (${statusCode})`);
    });
  }

  userDisableCallback(e, id) {

    if (this.modal) {
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
              this.modal.removeModal();
              this.dataset.snackbar.show(this.polyglot.t('msg.user.disabled', { name: user.name }), 'success');
              this.reload();
            }).catch((response, statusCode) => {
              this.modal.stopLoading();
              this.modal.removeModal();
              console.log(`Can't modify user (${response.statusMessage})`);
            });
          },
        }
      });

      this.modal.showModalPage();

    }).catch((statusCode) => {
      console.log(`Can't getUserByUUID (${statusCode})`);
    });
  }

  userEnableCallback(e, id) {
    if (this.modal) {
      this.modal = null;
    }

    this.connection.getUserByUUID(id).then((res, statusCode) => {
      let user = JSON.parse(res[0].meta);
      this.modal = new UserEnable('modal-placeholder', {
        dataset: this.dataset,
        data: user,
        events: {
          enableButton: event => {
            this.modal.startLoading();
            this.connection.userModify('enable', id).then((res, statusCode) => {
              this.modal.stopLoading();
              this.modal.removeModal();
              this.dataset.snackbar.show(this.polyglot.t('msg.user.enabled', { name: user.name }), 'success');
              this.reload();
            }).catch((response, statusCode) => {
              this.modal.stopLoading();
              this.modal.removeModal();

              console.log(`Can't modify user (${response.statusMessage})`);
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
      window.open(`${this.appInfo.app_url}/pre_login/#${res.access_token}`, `${id}`, 'nodeIntegration=no,height=600,width=1480')
    }).catch((statusCode) => {
      console.log(`Can't pretend (${statusCode})`);
    });
  }

  userEditCallback(e, id) {

    if (this.modal) {
      this.modal = null;
    }

    this.connection.getUserByUUID(id).then((res, statusCode) => {
      let user = res[0];
      this.modal = new UserEdit('modal-placeholder', {
        dataset: this.dataset,
        data: user,
        events: {
          saveButton: event => {
            let user = this.modal.validateForm();
            if (user) {

              this.modal.startLoading();
              this.connection.userUpdate(user).then((res, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                this.dataset.snackbar.show(this.polyglot.t('msg.user.updated', { name: user.email }), 'success');
                this.reload();
              }).catch((response, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                console.log(`Can't modify user (${response.statusMessage})`);
              });

              this.modal.removeModal();
            }
          },
        }
      });

      this.modal.showModalPage();

    }).catch((statusCode) => {
      console.log(`Can't getUserByUUID (${statusCode})`);
    });
  }


  userResetPasswordCallback(e, id) {

    if (this.modal) {
      this.modal = null;
    }

    this.connection.getUserByUUID(id).then((res, statusCode) => {
      let user = res[0];
      this.modal = new UserResetPassword('modal-placeholder', {
        dataset: this.dataset,
        data: user,
        events: {
          saveButton: event => {
            let password = this.modal.validateForm();
            if (password) {

              this.modal.startLoading();
              this.connection.userUpdatePassword(password, id).then((res, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                this.dataset.snackbar.show(this.polyglot.t('msg.user.passwordreset', { name: user.email }), 'success');
                this.reload();
              }).catch((response, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                console.log(`Can't modify user (${response.statusMessage})`);
              });

              this.modal.removeModal();
            }
          },
        }
      });

      this.modal.showModalPage();

    }).catch((statusCode) => {
      console.log(`Can't getUserByUUID (${statusCode})`);
    });
  }

  userGeolocationCallback(e, id) {

    if (this.modal) {
      this.modal = null;
    }

    this.connection.getUserByUUID(id).then((res, statusCode) => {
      let user = res[0];
      let meta = JSON.parse(user.meta);
      let latlng = [41.739165, 44.756937];
      let zoomLevel = 12;

      if (meta.geo_location) {
        latlng = [meta.geo_location.lat, meta.geo_location.lng];
        zoomLevel = 18;
      }
      this.modal = new GeoLocationEdit('modal-placeholder', {
        dataset: this.dataset,
        options: { editable: true, latlng: latlng, zoomLevel: zoomLevel },
        data: user,
        events: {
          locationButton: event => {
            const latlng = this.modal.validateForm();
            if (latlng) {
              this.modal.locate(latlng, 18);
            }
          },
          saveButton: event => {
            let latlng = this.modal.validateForm();
            if (latlng) {
              this.modal.startLoading();

              meta.geo_location = { lat: latlng[0], lng: latlng[1] };
              user.meta = JSON.stringify(meta);
              this.connection.userUpdate(user).then((res, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                this.dataset.snackbar.show(this.polyglot.t('msg.user.updated', { name: meta.name }), 'success');
                // this.reload();
              }).catch((response, statusCode) => {
                this.modal.stopLoading();
                this.modal.removeModal();
                console.log(`Can't modify user (${response.statusMessage})`);
              });

              this.modal.removeModal();
            } else {
              alert(this.polyglot.t('Incorrect Latitude and Longitude'));
            }
          }
        }
      });

      this.modal.showModalPage();

    }).catch((statusCode) => {
      console.log(`Can't getUserByUUID (${statusCode})`);
    });
  }

  userSelectCallback(e, id) {
    this.connection.getUserByUUID(id).then((res, statusCode) => {
      let user = res[0];
      this.infoComponent.showInfo(user);
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

  selectTabUser(e, id) {

    const tabs = this.componentElem.querySelectorAll('.tab-details')
    tabs.forEach((elem) => { elem.classList.remove('is-active'); })
    const tabPages = this.componentElem.querySelectorAll('.tab-page')
    tabPages.forEach((elem) => { elem.classList.add('is-hidden'); })
    e.target.parentElement.classList.add('is-active');
    const tabUser = this.componentElem.querySelector(`#user-placeholder`);
    tabUser.classList.remove('is-hidden');
    // console.log(tab);
  }

  selectTabDevices(e, id) {

    const tabs = this.componentElem.querySelectorAll('.tab-details')
    tabs.forEach((elem) => { elem.classList.remove('is-active'); })
    const tabPages = this.componentElem.querySelectorAll('.tab-page')
    tabPages.forEach((elem) => { elem.classList.add('is-hidden'); })

    e.target.parentElement.classList.add('is-active');
    const tabDevices = this.componentElem.querySelector(`#devices-placeholder`);
    tabDevices.classList.remove('is-hidden');
  }
}