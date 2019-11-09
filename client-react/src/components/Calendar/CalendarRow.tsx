import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Reservation as ReservationDto } from '../../dtos/Reservation.dto';
import * as moment from 'moment';

import './Timesheet.less';

export interface CalendarRowProps { from: Date, to?: Date, specificRes: ReservationDto }
export interface CalendarRowState { }

export class CalendarRow extends React.Component<CalendarRowProps & RouteComponentProps, CalendarRowState> {
    constructor() {
        super(undefined);
        this.state = {};
    }

    componentDidMount() {

    }

    onHover(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        (e as any).target.classList.add('hover');
    }

    onLeaveHover(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        (e as any).target.classList.remove('hover');
    }

    generateTimesheetContent(specificRes: ReservationDto, resGroup: ReservationDto[]) {
        let colorIndex = 0;
        const range = 30;
        for (const res of resGroup) {

        }
    }

    render() {
        const daysofWeek = [];
        const numbers = [];
        const slides = [];
        const res = { f: moment(this.props.specificRes.start), t: moment(this.props.specificRes.end) };
        const lengthDays = moment.duration(res.t.valueOf() - res.f.valueOf()).asDays();
        const center = res.f.clone().add(Math.floor(lengthDays / 2), 'days');
        const range = moment.duration(30, 'days').asDays() / 2;
        const start = center.clone().subtract(range, 'days');
        const end = center.clone().add(range, 'days');

        let tick = start.clone();

        const format = "YYYY-MM-DD";

        for (let i = 0; tick <= end && i < 90; i++) {
            tick.add(1, 'day');
            numbers.push(<td>{`${tick.format('DD')}`}</td>);
            let classNames = '';
            if (tick.startOf('day').isSame(res.f.startOf('day'))) classNames += " left";
            if (tick.startOf('day').isSame(res.t.startOf('day'))) classNames += " right";
            const slide = tick.isSameOrAfter(res.f) && tick.isSameOrBefore(res.t) ? <div key={i} data-assignedId={this.props.specificRes.id.toString()} className={`slide${classNames}`}
                onMouseEnter={e => this.onHover(e)} onMouseLeave={e => this.onLeaveHover(e)} /> : null;
            slides.push(<td className="slides-rail">{slide}</td>);
            daysofWeek.push(<td>{`${tick.format('dd').substr(0, 1)}`}</td>);
        }

        // for (let i = 1; i < 31; i++) {
        //     const d = new Date(`2019-08-${i}`);
        //     numbers.push(<td>{`${i}`}</td>);
        //     let slide = d >= res.f && d <= res.t ? <div key={i} className="slide"/> : <div/>;
        //     if (d.getTime()==res.f.getTime()) slide = <div className="slide left"/>
        //     if (d.getTime() == res.t.getTime()) slide = <div className="slide right"/>
        //     slides.push(<td className="slides-rail">{slide}</td>);
        // }

        return (
            <div className="ui segment">
                <table className="timesheet-table">
                    <tbody>
                        <tr className="numbers">
                            {daysofWeek}
                        </tr>
                        <tr className="numbers">
                            {numbers}
                        </tr>
                        <tr>
                            {slides}
                        </tr>
                    </tbody>
                </table>

            </div>
        );
    }
}
