import { Component } from '../component'
import View from './export-view.html'

/**
 * Export View
 * @extends Component
 */
export class ExportView extends Component {

    constructor(placeholderId, props) {
        super(placeholderId, props, View);

        this._feature = props.feature;
    }

    onload() {
        this.focus('file-name-input');
    }

    getView() {
        return View;
    }

    getData() {

        let output = {
            fielname: null,
            insertpic: true
        }

        output.filename = this.getValue(this.refs['file-name-input']);
        if (!output.filename.length) {
            alert('ფაილის სახელი სავალდებულოა');
            return null;
        }

        output.insertpic = this.refs['insert-pic-checkbox'].checked;

        return output;
    }
}