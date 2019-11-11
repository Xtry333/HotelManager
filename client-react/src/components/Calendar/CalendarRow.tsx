import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Reservation as ReservationDto } from '../../dtos/Reservation.dto';
import * as moment from 'moment';
import * as Server from '../../Server';

import './Timesheet.less';

export interface CalendarRowProps { activeRes: ReservationDto }
export interface CalendarRowState { hover: number, reservations: ReservationDto[] }

export class CalendarRow extends React.Component<CalendarRowProps & RouteComponentProps, CalendarRowState> {
    constructor(props: CalendarRowProps) {
        super(props as any);
        this.state = { hover: 0, reservations: [] };
    }

    componentDidMount() {
        const roomID = this.props.activeRes.room;
        if (roomID) {
            this.fetchReservationsForRoom(roomID);
        }
    }

    componentDidUpdate(prevProps: CalendarRowProps, prevState: CalendarRowState) {
        const roomID = parseInt(this.props.activeRes.room as any);
        if (roomID && parseInt(prevProps.activeRes.room as any) !== roomID) {
            this.fetchReservationsForRoom(roomID);
        }
    }

    fetchReservationsForRoom = async (roomID: number) => {
        const id = parseInt(roomID as any);
        try {
            if (id) {
                await Server.Get(`reservation/?room=${id}`).then(results => {
                    this.setState({ reservations: [...results.data] });
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as (EventTarget & HTMLDivElement);
        const id = target.getAttribute('data-reservation-id');
        this.setState({ hover: 0 });
        this.props.history.push(`/reservations/${id}`);
    }

    onEnterHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const target = e.target as (EventTarget & HTMLDivElement);
        const id = parseInt(target.getAttribute('data-reservation-id'));
        this.setState({ hover: id });
    }

    onLeaveHover = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        this.setState({ hover: 0 });
    }

    generateTimesheetContent(activeRes: ReservationDto, reservations: ReservationDto[]) {
        const daysOfWeek: JSX.Element[] = [];
        const numbers: JSX.Element[] = [];
        const slides: JSX.Element[] = [];

        const otherRes = reservations.filter(r => r.id !== this.props.activeRes.id);

        const lengthDays = moment.duration(moment(activeRes.end).valueOf() - moment(activeRes.start).valueOf()).asDays();
        const center = moment(activeRes.start).add(Math.floor(lengthDays / 2), 'days');
        const range = 15;
        const start = center.clone().subtract(range, 'days');
        const end = center.clone().add(range, 'days');

        let colorIndex = 0;
        for (let i = 0, tick = start.clone(), lastID = 0; tick <= end && i < 90; i++) {
            let error = false;
            tick.add(1, 'day');
            numbers.push(<td key={`number-${i}`} title={`${tick.format('YYYY-MM-DD, dddd')}`}>
                <span className={tick.startOf('day').isSame(moment().startOf('day')) ? 'today' : ''}>{`${tick.format('DD')}`}</span>
            </td>);
            daysOfWeek.push(<td key={`day-of-week-${i}`}>{`${tick.format('dd').substr(0, 1)}`}</td>);
            let slide: JSX.Element = null;
            for (const res of [this.props.activeRes, ...otherRes]) {
                const classNames = this.getSlideClassNames(res, tick);
                if (classNames) {
                    if (lastID !== res.id) {
                        colorIndex += 1;
                        colorIndex %= 2;
                    }
                    error = !!slide;
                    slide = <div key={`slide-${i}`} className={`${classNames}${colorIndex ? ' alt' : ''}${error ? ' error' : ''}`}
                        data-reservation-id={`${res.id}`} onMouseEnter={this.onEnterHover} 
                        onMouseLeave={this.onLeaveHover} onClick={this.onClick} />;
                    lastID = res.id;
                }
            }
            slides.push(<td key={`slide-rail-${i}`} className="slides-rail">{slide}</td>);
        }
        return { daysOfWeek, numbers, slides };
    }

    isHovered(reservation: ReservationDto) {
        return this.state.hover === parseInt(reservation.id as any);
    }

    getSlideClassNames(reservation: ReservationDto, tick: moment.Moment): string {
        const classNames: string[] = [];
        const start = moment(reservation.start);
        const end = moment(reservation.end);
        const day = "day";
        if (tick.isSameOrAfter(start) && tick.isBefore(end)) {
            classNames.push('slide');
            if (tick.startOf(day).isSame(start.startOf(day))) classNames.push("left");
            if (tick.startOf(day).isSame(end.subtract(1, day).startOf(day))) classNames.push("right");
            if (reservation.id === this.props.activeRes.id) classNames.push("active");
            if (this.isHovered(reservation)) classNames.push("hover");
        }
        return classNames.join(' ');
    }

    render() {
        const timesheet = this.generateTimesheetContent(this.props.activeRes, this.state.reservations);

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
