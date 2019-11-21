import './editor.scss'
import template from './editor.html'
import { Component } from '../component'
import { NewStep2 } from '../wizard/new-step2'
import { AddEditView } from './add-edit-view'
import { ExportView } from './export-view'
import SettingsView from './settings.html'

/**
 * Map Editor Component
 * @extends Component
 */
export class MapEditor extends Component {
  /** MapEditor Component Constructor
   */
  constructor(placeholderId, props) {
    super(placeholderId, props, template)
    this._mapjson = props.mapjson;
    let self = this;
    this._mapComponent = props.mapComponent;
    this._currentSelectedIndex = -1;

    /* Create Settings view */
    this.settings = new NewStep2('modal-editor-settings', {
      dataset: props.dataset,
      events: {
        saveButton: event => {

          /* refresh output data */
          let data = this.settings.getData();
          this.triggerEvent('updateMap', { data });
          this.settings.closeModal();
        },
        cancelButton: event => {
          this.settings.closeModal();
        },
        closeButton: event => {
          this.settings.closeModal();
        },
      }
    });
    /* ----------------------- */

    /* Object list change event */
    this.refs['object-list'].addEventListener('change', (e) => {

      if (this._mapComponent.isEditing()) {
        this.refs['object-list'].selectedIndex = this._currentSelectedIndex;
        alert(`თქვენ არ გაქვთ დასრულებული რედაქტირება რუკაზე.`);
        return;
      }
      if (this._currentSelectedIndex !== -1) {
        this.updateCurrentObject();
        // let geometry = this._mapComponent.getGeometry();
        // this._dataset.data.features[this._currentSelectedIndex].geometry = geometry;
      }

      let selectedIndex = this.refs['object-list'].selectedIndex;
      if (selectedIndex !== -1) {
        this._currentSelectedIndex = selectedIndex;
        this.refs['removeButton'].removeAttribute('disabled');
        let feature = this._dataset.data.features[selectedIndex];
        this.triggerEvent('showFeature', { feature });
      } else {
        this._currentSelectedIndex = -1;
        this.refs['removeButton'].setAttributeNode(document.createAttribute("disabled"));
        this.triggerEvent('showFeature', { undefined });
      }
    });
    /* ----------------------- */

    /* Export button click event */
    this.refs['gear-button'].addEventListener('click', (e) => {
      this.settings.showModalPage(SettingsView);
    });
    /* ----------------------- */

    /* Export button click event */
    this.refs['exportButton'].addEventListener('click', (e) => {
      if (this.exportview === undefined) {
        this.exportview = new ExportView('modal-editor-export', {
          dataset: this._dataset,
          events: {
            saveObjectButton: (e) => {
              let data = this.exportview.getData();
              this._mapjson.exportToFile(data.filename, { include_pic: data.insertpic });
              this.exportview.closeModal();
            },
            cancelButton: event => {
              this.exportview.closeModal();
            },
            closeButton: event => {
              this.exportview.closeModal();
            },
          }
        });
      }

      this.exportview.showModalPage();

    });
    /* ----------------------- */

    /* Eidt button doubleclick event */
    this.refs['object-list'].addEventListener('dblclick', (e) => {
      let selectedIndex = this.refs['object-list'].selectedIndex;
      if (selectedIndex == -1) return;
      let addeditview = new AddEditView('modal-editor-addedit', {
        dataset: this._dataset,
        feature: this._dataset.data.features[selectedIndex],
        events: {
          saveObjectButton: (e) => {

            let obj = addeditview.getData();
            if (obj !== null) {
              addeditview.closeModal();
              addeditview.removaAllEvents();
              self._mapjson.updateObject(obj, selectedIndex);
              self.reload();
            }
          },
          cancelButton: event => {
            addeditview.removaAllEvents();
            addeditview.closeModal();
          },
          closeButton: event => {
            addeditview.removaAllEvents();
            addeditview.closeModal();
          },
        }
      });

      addeditview.showModalPage();
    });
    /* ----------------------- */

    /* Add button click event */
    this.refs['addButton'].addEventListener('click', (e) => {

      let addeditview = new AddEditView('modal-editor-addedit', {
        dataset: this._dataset,
        events: {
          saveObjectButton: (e) => {
            let obj = addeditview.getData();
            if (obj !== null) {

              addeditview.closeModal();
              addeditview.removaAllEvents();
              self._mapjson.addObject(obj);
              self.reload();
            }
          },
          cancelButton: event => {
            addeditview.removaAllEvents();
            addeditview.closeModal();
          },
          closeButton: event => {
            addeditview.removaAllEvents();
            addeditview.closeModal();
          },
        }
      });

      addeditview.showModalPage();
    });
    /* -------------------- */

    /* Remove button click event */
    this.refs['removeButton'].addEventListener('click', (e) => {
      let selectedIndex = this.refs['object-list'].selectedIndex;
      if (selectedIndex == -1) return;

      if (confirm(`ნამდვილად გსურთ ობიექტი '${this.refs['object-list'].options[selectedIndex].text}' წაშლა ?`)) {
        self._mapjson.removeObject(selectedIndex);
        this.refs['object-list'].remove(selectedIndex);
      }
    });
    /* ----------------------- */

  } /* End constructor */


  /** Reload objects in select field from dataset, please note, that this is heavy operation */
  reload() {
    let select = this.refs['object-list'];

    /* Remove all options from select */
    while (select.options.length > 0) {
      select.remove(0);
    }

    /* Propagate options in select TAG from dataset */
    this._dataset.data.features.forEach((elem) => {
      var option = document.createElement("option");
      option.text = elem.properties.title;
      select.add(option);
    });
  }

  /** Update current selected object geometry */
  updateCurrentObject() {
    if (this._currentSelectedIndex === -1) return;
    let geometry = this._mapComponent.getGeometry();
    this._dataset.data.features[this._currentSelectedIndex].geometry = geometry;
  }

  /** Update edit sidebar view */
  updateData(data) {
    this.settings.output = data;

    if (data.dataThumbBase64 !== null) {
      this.insertContent('thumb-image', data.dataThumbBase64);
    }
    this.insertContent('map-name', `${data.name}`);
    this.insertContent('map-version', `ვერსია: ${data.version}`);
    if (data.dimensio !== undefined) {
      this.insertContent('map-dimension', `ზომები: ${data.dimension.width}x${data.dimension.height}`);
    }
    this.reload();
  }

}