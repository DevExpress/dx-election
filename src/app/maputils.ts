export class MapUtils {
    static parseMapData(layerDataPath: string, callback: (data: any) => void) {
        Promise.all(this.requestBinarySources(layerDataPath)).then(response => {
            let layerData = {};
            response.forEach((value: any) => {
                layerData[value.key] = value.response;
            });
            (<any>window).DevExpress.viz.vectormaputils.parse(layerData, { precision: 2 }, callback);
        })
    }

    private static requestBinarySources(sourcePath: string) {
        return ["shp", "dbf"].map(function(key) {
            return new Promise((resolve, reject) => {
                MapUtils.sendRequest(sourcePath + "." + key).then(response => {
                    resolve({ key: key, response: response });
                });
            });
        });
    }

    private static sendRequest(url: string) : Promise<any> {
        return new Promise(
            (resolve, reject) => {
                var request = new XMLHttpRequest();
                request["onreadystatechange"] = function() {
                    if(this.readyState === 4) {
                        if(this.status === 200) {
                            resolve(this.response);
                        } else {
                            resolve(null);
                        }
                    }
                };
                request.open('GET', url);
                request.responseType = 'arraybuffer';
                request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                request.send(null);
            }
        )
    }
}