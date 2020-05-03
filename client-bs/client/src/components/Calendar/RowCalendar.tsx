import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Reservation as ReservationDto } from '../../dtos/Reservation.dto';
import * as moment from 'moment';
import * as Server from '../../Server';

import './Timesheet.less';
import { Room } from '../../dtos/Room.dto';
import { Link } from 'react-router-dom';

export interface RowCalendarProps { activeRes?: ReservationDto, activeRoomID?: number, centerDate?: moment.Moment, headless?: boolean }
export interface RowCalendarState { hover: number, reservations: ReservationDto[] }

export class RowCalendar extends React.Component<RowCalendarProps & RouteComponentProps, RowCalendarState> {
    constructor(props: RowCalendarProps & RouteComponentProps) {
        super(props);
        this.state = { hover: 0, reservations: [] };
    }

    componentDidMount() {
        const roomID = this.props.activeRoomID || this.props.activeRes.room;
        if (roomID) {
            this.fetchReservationsForRoom(roomID);
        }
    }

    componentDidUpdate(prevProps: RowCalendarProps, prevState: RowCalendarState) {
        const id = this.props.activeRoomID || this.props.activeRes.room;
        const roomID = parseInt(id as any);
        if (roomID && this.props.activeRes) {
            if (parseInt(prevProps.activeRes.room as any) !== roomID) {
                this.fetchReservationsForRoom(roomID);
            }
        } else {
            if (parseInt(prevProps.activeRoomID as any) !== roomID) {
                this.fetchReservationsForRoom(roomID);
            }
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
        const roomLabel = (
            <td>
                <Link to={`/rooms/${activeRes ? activeRes.room : this.props.activeRoomID}`}>
                    <div className='ui circular label button'>
                        {activeRes ? activeRes.room : this.props.activeRoomID}
                    </div>
                </Link>
            </td>);
        const daysOfWeek: JSX.Element[] = [<td />];
        const numbers: JSX.Element[] = [<td />];
        const slides: JSX.Element[] = [roomLabel];

        const otherRes = activeRes ? reservations.filter(r => r.id !== activeRes.id) : reservations.filter(x => true);

        const lengthDays = activeRes ? moment.duration(moment(activeRes.end).valueOf()
            - moment(activeRes.start).valueOf()).asDays() : 0;
        const centerDate = activeRes ? moment(activeRes.start).add(Math.floor(lengthDays / 2), 'days') : this.props.centerDate;
        const range = 16;
        const start = centerDate.clone().subtract(range, 'days');
        const end = centerDate.clone().add(range, 'days');

        let colorIndex = 0;
        for (let i = 0, tick = start.clone(), lastID = 0; tick <= end && i < 90; i++) {
            let error = false;
            tick.add(1, 'day');
            numbers.push(
                <td key={`number-${i}`} title={`${tick.format('YYYY-MM-DD, dddd')}`}>
                    <span className={tick.startOf('day').isSame(moment().startOf('day')) ? 'today' : ''}>{`${tick.format('DD')}`}</span>
                </td>
            );
            daysOfWeek.push(<td key={`day-of-week-${i}`}>{`${tick.format('dd').substr(0, 1)}`}</td>);
            let slide: JSX.Element = null;
            for (const res of [activeRes, ...otherRes]) {
                if (res === null || res === undefined)
                    continue;
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
            slides.push(<td key={`slide-rail-${i}`}>{slide}</td>);
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
            if (this.props.activeRes && reservation.id === this.props.activeRes.id) classNames.push("active");
            if (this.isHovered(reservation)) classNames.push("hover");
        }
        return classNames.join(' ');
    }

    render() {
        const timesheet = this.generateTimesheetContent(this.props.activeRes, this.state.reservations);

        return (
            <table className="timesheet-table">
                <tbody>
                    {!this.props.headless ?
                        <tr className="days-of-week-rail">{timesheet.daysOfWeek}</tr> : undefined}
                    {!this.props.headless ?
                        <tr className="day-numbers-rail">{timesheet.numbers}</tr> : undefined}
                    <tr className="slides-rail">{timesheet.slides}</tr>
                </tbody>
            </table>
        );
    }
}
