import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { MapUtils } from './maputils';
import { VotesService } from './votes.service';

@Injectable()
export class CountiesService {

    private promise: Promise<any>;

    constructor(private votes: VotesService) {

        this.promise = new Promise((resolve, reject) => {

            let featureCollection: Array<any> = [];

            MapUtils.parseMapData('data/county', (data) => {

                votes.getFullData().then(votesData => {
                    data.features.forEach(feature => {
                        let stateFp = feature.properties['STATEFP'],
                            fips = feature.properties['GEOID'];

                        if(featureCollection[stateFp] === undefined) {
                            featureCollection[stateFp] = [];
                        }

                        let result = votes.getResultForCounty(stateFp, fips, votesData);
                        feature.properties.votes = result;
                        ['2012', '2016'].forEach(year => {
                            feature.properties['democracy' + year] = result['democracy' + year];
                        });

                        featureCollection[stateFp].push(feature);
                    });

                    resolve(featureCollection);
                });
            });
        });

    }

    getLayerData(stateFp: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let result = {
                type: 'FeatureCollection',
                features: {}
            };

            this.promise.then(featureCollection => {
                result.features = featureCollection[stateFp].sort((a, b) => {
                    if(a.properties['NAME'] > b.properties['NAME']) { 
                        return 1;
                    } else {
                        return -1;
                    }
                });
                resolve(result);
            });
        });
    }
}