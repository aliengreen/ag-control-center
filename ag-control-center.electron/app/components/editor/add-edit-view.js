import { Component } from '../component'
import View from './add-edit-view.html'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

/**
 * Add/Edit View
 * @extends Component
 */
export class AddEditView extends Component {

    constructor(placeholderId, props) {
        super(placeholderId, props, View);

        this._feature = props.feature;
        /* Configure CKEditor4 */
        ClassicEditor
            .create(this.componentElem.querySelector('#editor'), {
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'],
                heading: {
                    options: [
                        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
                    ]
                }
            })
            .then(editor => {
                this._editor = editor;

                if (this._feature !== undefined) {
                    this.insertContent('title-input', this._feature.properties.title);
                    if (this._feature.properties.data !== undefined) {
                        this._editor.setData(this._feature.properties.data.story);
                    } else if(this._feature.properties.story !== undefined) {
                        this._editor.setData(this._feature.properties.story);
                    }
                    this.refs['location-checkbox'].checked = this._feature.properties.location;
                    this.insertContent('tag-input', this._feature.properties.tag);
                    this.insertContent('number-input', this._feature.properties.number);
                    this.insertContent('note-textarea', this._feature.properties.note.join('\n'));
                }

            })
            .catch(error => {
                console.error(error);
            });
        /* -------------- */
    }

    onload() {
        // console.log(this._feature);

    }

    getView() {
        return View;
    }

    getData() {

        let output = {
            title: null,
            story: null,
            location: false,
            tag: '',
            number: null,
            note: []
        }

        output.title = this.getValue(this.refs['title-input']);
        if (!output.title.length) {
            alert('ობიექტის დასახელება სავალდებულოა');
            return null;
        }

        output.story = this._editor.getData();
        if (!output.story.length) {
            alert('ობიექტის ტექსტი სავალდებულოა');
            return null;
        }

        output.tag = this.getValue(this.refs['tag-input']);
        if (!output.tag.length) {
            alert('ობიექტის ტეგი(ები) სავალდებულოა');
            return null;
        }

        output.number = this.getValue(this.refs['number-input']);
        if (!output.number.length) {
            alert('ობიექტის ნომერი სავალდებულოა');
            return null;
        }

        output.location = this.refs['location-checkbox'].checked;
        let note = this.getValue(this.refs['note-textarea']);
        if (note.length) {
            output.note = note.split('\n');
            output.note = output.note.filter(function (el) {
                return (el != '');
            });
        }

        // console.log(output);

        return output;
    }
}