import FileSaver from 'file-saver';

/** Location Search Service Class */
export class MapJSON {
    constructor() {
        this._dataset = {
            data: {
                type: 'FeatureCollection',
                name: '',
                version: 0.1, /* Initial version of Map file */
                changelog: '',
                dimension: {
                    width: 0,
                    height: 0
                },
                dataBase64: null,
                dataThumbBase64: null,
                features: []
            },
            modification: {
                datachanged: false
            }
        };
    }

    getDataSet() {
        return this._dataset;
    }

    /** add object in current dataset, return array index of newely added feature */
    addObject(obj) {
        let feature = this.objectToFeature(obj);
        this._dataset.data.features.push(feature);

        return this._dataset.data.features.length - 1;
        // console.log(this._dataset);
    }

    /** update object in given index, return array index of newely updated feature */
    updateObject(obj, index) {
        let feature = this.objectToFeature(obj);
        this._dataset.data.features[index] = feature;
        return index;
    }

    /** remove object from given index */
    removeObject(index) {
        this._dataset.data.features.splice(index, 1);
    }

    /** Convert object to geojson feature */
    objectToFeature(obj) {
        let feature = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'GeometryCollection',
                geometries: []
            }
        }

        feature.properties.title = obj.title;
        feature.properties.tag = obj.tag;
        feature.properties.note = obj.note;
        feature.properties.number = obj.number;
        feature.properties.location = obj.location;
        feature.properties.story = obj.story;

        return feature;
    }

    exportToFile(filename, options) {
        let dataBase64,dataThumbBase64;

        /* Backup for late use */
        dataBase64 = this._dataset.data.dataBase64;
        dataThumbBase64 = this._dataset.data.dataThumbBase64;
        
        if(!options.include_pic) {
            this._dataset.data.dataBase64 = null;
            this._dataset.data.dataThumbBase64 = null;
        }

        let json = JSON.stringify(this._dataset.data, null, 1);
        var file = new File([json], filename, { type: "application/json;charset=utf-8" });
        FileSaver.saveAs(file);

        /* restore */
        this._dataset.data.dataBase64 = dataBase64;
        this._dataset.data.dataThumbBase64 = dataThumbBase64;
    }


    /** Read MAP JSON file
     * @param { file } read from file object
     * @param { callback } onload callback
    */
    readFromFile(file, callback) {

        if (file === undefined) {
            console.error('faild: file is empty');
            return;
        }

        var reader = new FileReader();
        reader.onload = (e) => {
            this.json = JSON.parse(e.target.result);
            if (callback) {
                this._dataset.data = this.json;
                callback(this._dataset.data);
            }
        };
        reader.readAsText(file);

    }


}