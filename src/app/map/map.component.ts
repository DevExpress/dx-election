import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { StatesService } from '../states.service';
import { CountiesService } from '../counties.service';
import { DxVectorMapComponent } from 'devextreme-angular/ui/vector-map';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    providers: [ StatesService, CountiesService ]
})

export class MapComponent {
    @ViewChild(DxVectorMapComponent) vectorMap: DxVectorMapComponent;

    private defaultBounds: Array<number> = [-130, 23, -59, 49];

    private layers: Array<any> = [];
    private bounds: Array<number> = this.defaultBounds;
    private prevBounds: Array<number> = this.defaultBounds;
    private tooltip: any = {
        customizeTooltip: this.customizeTooltip.bind(this),
        enabled: true
    };
    private title = '&nbsp;';
    private subtitle = '&nbsp;';
    private usaLayerOpacity = 1;

    private dataSource: any = null;
    private countyDataSource: any = null;

    private showBackButton = false;

    private isMapCentered = true;
    private currentMapCenter: Array<any> = [];

    @Input() private year: string;

    @Output() onViewChanged = new EventEmitter<any>();

    constructor(private statesService: StatesService, private countiesService: CountiesService){
        this.loadStatesMap();
    }

    loadStatesMap() {
        this.statesService.getFullData().then(data => {
            this.dataSource = data;
            this.onViewChanged.emit(this.dataSource);
            this.showBackButton = false;
        });
    }

    mapClick(e: any) {
        if(e.target === undefined) { return; }

        let code = e.target.attribute('STATEFP');
        let stateName = e.target.attribute('NAME');

        if(e.target.layer.index !== 0) { return; }// counties layer
        if(code === '02' || code === '15') { return; } // no data for Alaska & Hawaii

        this.bounds = this.statesService.getBoundsByCode(code);
        this.isMapCentered = true;

        this.countiesService.getLayerData(code).then(data => {
            this.countyDataSource = data;
            this.usaLayerOpacity = 0.3;
            this.onViewChanged.emit(this.countyDataSource);
            this.showBackButton = true;
            this.title = stateName;
        });

        this.vectorMap.instance.showLoadingIndicator();
    }

    backToStates() {
        this.loadStatesMap();
        this.bounds = this.defaultBounds;
        this.isMapCentered = true;
        this.countyDataSource = null;
        this.usaLayerOpacity = 1;
        this.title = '&nbsp;';
        this.subtitle = '&nbsp;';
    }

    centerMap() {
        this.vectorMap.instance.center(null)
        this.vectorMap.instance.zoomFactor(null);
    }

    centerChanged(e: any) {
        if(this.prevBounds !== this.bounds)
            this.currentMapCenter = e.center;
        else
            this.isMapCentered = this.currentMapCenter[0] == e.center[0] && this.currentMapCenter[1] == e.center[1];
        this.prevBounds = this.bounds;
    }

    initialized(e: any) {
        this.currentMapCenter = e.component.instance().center();
    }

    customizeTooltip(info: any){
        let html = '<div class="tooltip-name">' + info.attribute('NAME') + '</div>',
            votesObj: any = info.attribute('votes')[this.year],
            votesArray: Array<any> = votesObj.votes,
            total = votesObj.total,
            electoralVotes: Array<any> = [],
            votesString = '',
            electoralVotesString = '';

        votesArray.forEach(vote => {
            let count = vote.VotesCount,
                percent = Math.round(count / total * 10000) / 100,
                name = vote.Name,
                type = vote.CandidateType,
                electoral = vote.ElectoralVotes;

            if(electoral > 0) {
                electoralVotes.push({ name: name, electoralVotes: electoral, type: type });
            }

            if(count > 0) {
                votesString += (
                    '<div>' +
                    '<span class="candidate-square type' + type + '"></span>' +
                    '<span class="candidate-name">' + name + '</span> ' +
                    '<span class="candidate-bold">' + percent + '%</span> ' +
                    '(<span class="candidate-count">' + count + '</span>)' +
                    '</div>'
                );
            }
        });

        html += votesString;

        if(electoralVotes.length > 0) {
            electoralVotesString += '<div class="electoral-votes">';

            electoralVotes.forEach(vote => {
                electoralVotesString +=
                    '<div>' +
                    '<span class="candidate-square type' + vote.type + '"></span>' +
                    '<span class="candidate-bold">' + vote.electoralVotes + '</span> electoral ' + (vote.electoralVotes == '1' ? 'vote' : 'votes') + ' going to ' +
                    '<span class="candidate-bold">' + vote.name + '</span> ' +
                    '</div>';
            });

            electoralVotesString += '</div>';
        }

        html += electoralVotesString;

        return {
            html: html
        }
    }



}


