export class MapUtils {
    static parseMapData(layerDataPath: string, callback: (data: any) => void) {
        (<any>window).DevExpress.viz.vectormaputils.parse(layerDataPath, { precision: 2 }, callback);
    }
}