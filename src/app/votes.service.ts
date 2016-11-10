import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class VotesService {

    private promise: Promise<any>;

    constructor(private http: Http) {

        this.promise = Observable.forkJoin(
            this.http.get('data/US2012Results.json').map((res: Response) => res.json()),
            this.http.get('data/US2016Results.json').map((res: Response) => res.json()),
            this.http.get('data/postals.json').map((res: Response) => res.json())
        ).toPromise();
    }

    getFullData() : Promise<any> {

        return new Promise((resolve, rejected) => {
            this.promise.then(data => {
                resolve({
                    fullData: [data[0], data[1]],
                    postal: data[2]
                });
            });
        });
    }

    getResultForState(postal: string, data: any): any {

        let result: any = {};
        data.fullData.forEach(yearData => {
            yearData.Votes.forEach(stateResult => {
                if(stateResult.State !== postal) { return; }

                result[yearData.Year] = {
                    total: stateResult.TotalVotesCount,
                    votes: stateResult.Votes
                };
            });
        });
        return this.setDemocracyResultsForYears(result);
    }

    getResultForCounty(fp: string, fips: string, data: any) : any {
        let postal = data.postal[fp],
            result: any = {};

        data.fullData.forEach(yearData => {
            yearData.Votes.forEach(stateResult => {
                if(stateResult.State !== postal) { return; }

                stateResult.CountyVotes.forEach(countyResult => {
                    if(countyResult.FIPS !== fips) { return; }

                    result[yearData.Year] = {
                        total: countyResult.TotalVotesCount,
                        votes: countyResult.Votes
                    };

                });
            });
        });
        return this.setDemocracyResultsForYears(result);
    }

    setDemocracyResultsForYears(result){
        ['2012', '2016'].forEach(year => {

            if(result[year] === undefined) { return result; }

            let votes = result[year],
                total = 0,
                gopType = 0,
                democracyType = 1,
                democracyCount = 0;

            votes.votes.forEach(candidateVotes => {
                if(democracyType === candidateVotes.CandidateType) {
                    democracyCount = candidateVotes.VotesCount;
                    total += candidateVotes.VotesCount;
                } else if(gopType === candidateVotes.CandidateType) {
                    total += candidateVotes.VotesCount;
                }
            });

            result['democracy' + year] = democracyCount / total;
        });
        return result;
    }

    getResultsForNation(): Promise<any> {

        return new Promise((resolve, rejected) => {
            this.getFullData().then(data => {

                let result: any = {};
                data.fullData.forEach(yearData => {
                    let candidatesData: Object = {},
                    keysArray: Array<string> = [];

                    yearData.Votes.forEach(stateResult => {

                        stateResult.Votes.forEach(vote => {
                            let name = vote.Name,
                                type = vote.CandidateType,
                                electoral = vote.ElectoralVotes,
                                count = vote.VotesCount;

                            if(candidatesData[name] === undefined) {
                                keysArray.push(name);
                                candidatesData[name] = {
                                    type: type,
                                    name: name,
                                    electoral: electoral,
                                    count: count
                                };
                            } else {
                                candidatesData[name].count += count;
                                candidatesData[name].electoral += electoral;
                            }
                        });

                        if(stateResult.AvailableElectoralVotes) {
                            candidatesData["Other"].electoral += stateResult.AvailableElectoralVotes;
                        }
                    });

                    result[yearData.Year] = {
                        data: candidatesData,
                        keys: keysArray
                    };
                });

                resolve(result);
            });
        });
    }
}
