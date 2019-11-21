
import { Component } from '../component'
import View from './new-step1.html'

/**
 * New Step 1 View
 * Display create new map 
 * @extends Component
 */
export class NewStep1 extends Component {

    constructor(placeholderId, props) {
        super(placeholderId, props, View);

    }

    getView() {
        return View;
    }


}