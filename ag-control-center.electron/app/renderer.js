/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

// import './index.css';
import './main.scss';

import { Header } from './components/header/header'
import { MapJSON } from './services/mapjson'
import { Connection } from './services/connection'
import { LoginController } from './components/login/controller'
import { Users } from './components/users/users'
import { Wizard } from './components/wizard/wizard'
import template from './index.html'
import enlng from './lng/en.json'
import kalng from './lng/ka.json'
import Polyglot from 'node-polyglot'



/* check if we are in electron framework */
let electron = window && window.process && window.process.type;



/** Main UI Controller Class */
class ViewController {

  /** Initialize Application */
  constructor() {

    this._appInfo = {
      title: 'AG Center',
      version: 0.1,
      app_url: 'https://app-dev.aliengreen.ge'
    }

    this.polyglot = new Polyglot({ phrases: kalng });

    this._isload = false;

    if (electron) {
      console.log('We are in electron framework');
      this.initializeMainProcessMenuCmd();
    }

    /* Set document titile */
    document.title = `${this._appInfo.title} ${this._appInfo.version}`;
    if (!electron) {
      document.getElementById('app').outerHTML = template;
    }
    this.initializeComponents();

  }

  /** Initialize Components with data and event listeners */
  initializeComponents() {

    // Initialize Map JSON service
    this.mapjson = new MapJSON();

    // Initialize connection service
    this.connection = new Connection({
      events: {
        error: event => {
          let response = event.detail;
          if (response.statusCode > 200) {
            if (response.statusCode === 401) {
              alert(this.polyglot.t('The access token expired')); 
              this.connection.setCookie('accessToken', '', -9999999);
              location.reload();
            } else {
              alert(this.polyglot.t(response.statusMessage));
            }
          }
        },
      }
    });

    let dataset = {
      connection: this.connection,
      mapjson: this.mapjson,
      polyglot: this.polyglot,
      appInfo: this._appInfo
    }

    // Initialize Header
    this.headerComponent = new Header('header-placeholder');
    // this.connection.setCookie('accessToken', '', -9999999);

    if (!this.connection.hasAccessToken()) {
      // Initialize Login component
      this.loginController = new LoginController('container-placeholder', {
        dataset: dataset,
        events: {
          login: event => {
            let response = event.detail;
            this.createWizard(dataset);
          }
        }
      });
    } else {


      this.createWizard(dataset);
    }

    /* Set app version */
    let elements = document.querySelectorAll('.app-version');
    elements.forEach((element) => {
      element.innerHTML = this._appInfo.version;
    });

    /* Set changelog */
    let changeLogElem = document.querySelector('#changelog-placeholder');
    if (changeLogElem) {
      changeLogElem.innerHTML += `<h6>ვერსია 0.1</h6>`;
      changeLogElem.innerHTML += `<p>საწყისი ბეტა ვერსია</p>`;
    }

  }

  createWizard(dataset) {
    this.wizard = new Wizard('container-placeholder', {
      dataset: dataset,
      events: {
        userList: event => {
          this.wizard.closeModal();

          this.users = new Users('container-placeholder', {
            dataset: dataset,
            events: {

            }
          });
        },
        closeButton: event => {
          alert('Aba ras shvebi');
        }
      }
    });
  }

  initializeMainProcessMenuCmd() {

    const { ipcRenderer } = require('electron');

    /* Open about window by catching message from main electron process */
    ipcRenderer.on('aboutWindow', (event, message) => {
      const refElems = document.querySelectorAll('.modal')
      refElems.forEach((elem) => { elem.classList.remove('is-active'); })
      document.querySelector('#legal-notice-modal').classList.add("is-active");
    })
    /* ---------------- */

    /* Create new wizard by catching message from main electron process */
    ipcRenderer.on('new', (event, message) => {
      // if (!this.wizard.isActive()) {
      location.reload();
      // }

    })
    /* ---------------- */

  }
}

window.ctrl = new ViewController();
