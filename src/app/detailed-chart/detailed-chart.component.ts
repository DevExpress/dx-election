import { Component, Input, ViewChild } from '@angular/core';
import { DxScrollViewComponent } from 'devextreme-angular/ui/scroll-view';

@Component({
    selector: 'app-detailed-chart',
    templateUrl: './detailed-chart.component.html',
    styleUrls: ['./detailed-chart.component.css']
})

export class DetailedChartComponent {

    @ViewChild(DxScrollViewComponent) scrollView:DxScrollViewComponent;

    private _year: string;
    private dataSource: any;
    private statesChartData: any = [];

    @Input()
    set year(year: string) {
        this._year = year;
        this.processChartData();
    }

    @Input()
    set data(data: string) {
        this.dataSource = data;
        this.processChartData();
    }

    processChartData() {

        if(!this.dataSource) {
            return;
        }

        let result: Array<any> = [];

        this.dataSource.features.forEach(data => {

            let votesTotal = 0,
                name = data.properties.NAME === 'District of Columbia' ? 'D.C.' : data.properties.NAME,
                color = data.properties['democracy' + this._year] < 0.5 ? '#3688d5' : '#e45252',
                stateData: any = { name: name + '_' + color };

            data.properties.votes[this._year].votes.forEach(candidateData => {
                votesTotal += candidateData.VotesCount;
            });

            data.properties.votes[this._year].votes.slice(0, 2).forEach(candidateData => {
                stateData['VotesPercent' + candidateData.CandidateType] = Math.round(candidateData.VotesCount / votesTotal * 100);
            });

            result.push(stateData);
        });

        this.statesChartData = result;

        this.scrollView.instance.scrollTo(0);
    }

    customizeVoteLabelText(args) {
        return args.value + ' %';
    }

    customizeArgLabelText(arg) {
        let parsedArg = arg.value.split('_');
        return '<span style="font-weight: bold; color:' + parsedArg[1] + ';">' + parsedArg[0] + '</span>';
    }

}