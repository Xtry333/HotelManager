import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Reservation as ReservationDto } from '../../dtos/Reservation.dto';
import * as moment from 'moment';
import * as Server from '../../Server';

import './Timesheet.less';

export interface CalendarRowProps { from: Date, to?: Date, specificRes: ReservationDto }
export interface CalendarRowState { hover: { [key: string]: boolean }, reservations: ReservationDto[] }

export class CalendarRow extends React.Component<CalendarRowProps & RouteComponentProps, CalendarRowState> {
    constructor(props: CalendarRowProps) {
        super(undefined);
        this.state = { hover: {}, reservations: [props.specificRes] };
    }

    componentDidMount() {
        this.fetchReservationsForRoom(this.props.specificRes.room);
    }

    fetchReservationsForRoom = async (roomID: number) => {
        try {
            await Server.Get(`reservation/?room=${roomID}`).then(results => {
                this.setState({ reservations: [...results.data] });
            });
        } catch (error) {
            console.error(error);
        }
    }

    onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as (EventTarget & HTMLDivElement);
        const id = target.getAttribute('data-reservation-id');
        this.props.history.push(`/reservations/${id}`);
    }

    onEnterHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as (EventTarget & HTMLDivElement);
        const id = target.getAttribute('data-reservation-id');
        const newHover = Object.assign({}, this.state.hover);
        newHover[id] = true;
        this.setState({ hover: newHover });
    }

    onLeaveHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as (EventTarget & HTMLDivElement);
        const id = target.getAttribute('data-reservation-id');
        const newHover = Object.assign({}, this.state.hover);
        newHover[id] = false;
        this.setState({ hover: newHover });
    }

    generateTimesheetContent(specificRes: ReservationDto, resGroup: ReservationDto[]) {
        const daysOfWeek: JSX.Element[] = [];
        const numbers: JSX.Element[] = [];
        const slides: JSX.Element[] = [];

        const lengthDays = moment.duration(moment(specificRes.end).valueOf() - moment(specificRes.start).valueOf()).asDays();
        const center = moment(specificRes.start).add(Math.floor(lengthDays / 2), 'days');
        const range = 15;
        const start = center.clone().subtract(range, 'days');
        const end = center.clone().add(range, 'days');

        let colorIndex = 0;
        for (let i = 0, tick = start.clone(); tick <= end && i < 90; i++) {
            tick.add(1, 'day');
            numbers.push(<td key={`number-${i}`}>{`${tick.format('DD')}`}</td>);
            daysOfWeek.push(<td key={`day-of-week-${i}`}>{`${tick.format('dd').substr(0, 1)}`}</td>);
            let slide: JSX.Element = null;
            for (const res of [...resGroup, this.props.specificRes]) {
                const classNames = this.getSlideClassNames(res, tick);
                slide = classNames ? <div key={`slide-${i}`} className={classNames} data-reservation-id={`${res.id}`}
                    onMouseEnter={this.onEnterHover} onMouseLeave={this.onLeaveHover} onClick={this.onClick} /> : slide;
            }
            slides.push(<td key={`slide-rail-${i}`} className="slides-rail">{slide}</td>);
        }
        return { daysOfWeek, numbers, slides };
    }

    isHovered(reservation: ReservationDto) {
        return this.state.hover[reservation.id.toString()];
    }

    getSlideClassNames(reservation: ReservationDto, tick: moment.Moment): string {
        const classNames: string[] = [];
        const start = moment(reservation.start);
        const end = moment(reservation.end);
        const day = 'day';
        if (tick.isSameOrAfter(start) && tick.isBefore(end)) {
            classNames.push('slide');
            if (tick.startOf(day).isSame(start.startOf(day))) classNames.push('left');
            if (tick.startOf(day).isSame(end.subtract(1, 'day').startOf(day))) classNames.push('right');
            if (this.isHovered(reservation)) classNames.push('hover');
        }
        return classNames.join(' ');
    }

    render() {
        const timesheet = this.generateTimesheetContent(this.props.specificRes, this.state.reservations);

        return (
            <div className="ui segment">
                <table className="timesheet-table">
                    <tbody>
                        <tr className="numbers">{timesheet.daysOfWeek}</tr>
                        <tr className="numbers">{timesheet.numbers}</tr>
                        <tr>{timesheet.slides}</tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
