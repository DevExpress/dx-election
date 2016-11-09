import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-year-switcher',
    templateUrl: './year-switcher.component.html',
    styleUrls: ['./year-switcher.component.css']
})

export class YearSwitcherComponent {
    @Input() private year: string;
    @Output() onYearChanged = new EventEmitter<string>();

    changeYear(year: string) {
        if(year === this.year) { return; }
        this.year = year;
        this.onYearChanged.emit(this.year);
    }
}

