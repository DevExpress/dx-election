import { Component, Input } from '@angular/core';
import { VotesService } from '../votes.service';

@Component({
    selector: 'app-basic-results',
    templateUrl: './basic-results.component.html',
    styleUrls: ['./basic-results.component.css'],
    providers: [ VotesService ]
})

export class BasicResultsComponent {

    private nationData: any;
    private chartData: Array<any>;
    private series: Array<any>;
    @Input() private _year: string;

    @Input()
    set year(year: string) {
        this._year = year;
        this.loadChartData();
    }

    constructor(private votes: VotesService){
        this.loadChartData();
    }

    loadChartData() {
        this.votes.getResultsForNation().then(data => {
            let d = data[this._year];

            this.fillCandidatesData(d);

            let result: Array<any> =  [
                { votesType: 'electoral' },
                { votesType: 'count' }
            ];

            let series: Array<any> = [];

            d.keys.forEach(key => {
                let type = d.data[key].type,
                    index = type === 0 ? 0 : type === 2 ? 1 : 2,
                    color = type === 0 ? '#3689d6' : type === 2 ? '#d8c7a7' : '#e55253';

                series[index] = {
                    valueField: key,
                    name: key,
                    color: color,
                    border: {
                        visible: true,
                        color: '#fff',
                        width: 1
                    },
                    hoverMode: 'none'
                };
                result[1][key] = d.data[key].electoral;
                result[0][key] = d.data[key].count;
            });

            this.series = series;
            this.chartData = result;
        });
    }

    fillCandidatesData(data: any){
        let dataForNation: any = { d: {}, r: {} },
            total = 0;

        data.keys.forEach(key => {
            let type = data.data[key].type;

            if(type === 2) {
                return;
            }

            let candiadateObject: any = type === 0 ? dataForNation.d : dataForNation.r;

            candiadateObject.name = key;
            candiadateObject.votes = data.data[key].count;
            candiadateObject.electoral = data.data[key].electoral;
            total += candiadateObject.votes;
        });

        dataForNation.d.percent = dataForNation.d.votes / total;
        dataForNation.r.percent = dataForNation.r.votes / total;

        this.nationData = dataForNation;
    }

}
