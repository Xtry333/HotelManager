import * as React from 'react';
import { Route, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import * as Server from '../../Server';
import * as moment from 'moment';

import { ResSummaryView, Reservation as ReservationDto } from '../../dtos/Reservation.dto';
import { ResourceError } from '../../dtos/Error';
import { Guest as GuestDto } from '../../dtos/Guest.dto';
import { SingleGuestView } from '../Guests/Guests';
import { RoomView as RoomDto, Room } from '../../dtos/Room.dto';
import DateInput from '../DateInput';
import { TopHeader } from '../TopHeader';
import { RowCalendar } from './RowCalendar';
import { ReservationList } from '../Reservations/ReservationList';
import { CreateReservationView } from '../Reservations/CreateReservation';
import RoomDiv from '../Rooms/RoomDiv';
import PaymentsDiv from '../Reservations/PaymentsDiv';

export interface TimesheetProps { }
export interface TimesheetState { rooms: RoomDto[], centerDate: moment.Moment }

export class Timesheet extends React.Component<TimesheetProps & RouteComponentProps, TimesheetState> {
    constructor(props: TimesheetProps & RouteComponentProps) {
        super(props);
        this.state = { rooms: [], centerDate: moment() };
    }

    componentDidMount() {
        this.fetchRooms();
    }

    async fetchRooms() {
        try {
            Server.Get(`room/`).then(results => {
                this.setState({ rooms: results.data });
            });
        } catch (error) {
            console.error(error);
        }
    }

    onDateChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        this.setState({ centerDate: moment(value) });
    }

    onDateInc = () => {
        this.setState({ centerDate: this.state.centerDate.clone().add(1, 'day') });
    }

    onDateDec = () => {
        this.setState({ centerDate: this.state.centerDate.clone().subtract(1, 'day') });
    }

    // onReservationSave = async () => {
    //     const res = this.state.reservation;
    //     await Server.Put(`reservation/${res.id}`, { reservation: res });
    //     this.setState({ editMode: false });
    //     this.props.refresh();
    //     this.props.history.goBack();
    // }


    render() {
        const rooms = this.state.rooms;
        const centerDate = this.state.centerDate;
        if (rooms) {
            const calendar = rooms.map(room => <RowCalendar key={room.roomID} {...this.props} centerDate={centerDate} activeRoomID={room.roomID} />);
            return (
                <div>
                    <div className='three fields'>
                        <div className="ui icon button" onClick={this.onDateDec} tabIndex={0}>
                            <i className="left arrow icon"></i>
                        </div>
                        <div className='ui input'>
                            <DateInput onChange={this.onDateChange} date={this.state.centerDate.format('YYYY-MM-DD')} />
                        </div>
                        <div className="ui icon button" onClick={this.onDateInc} tabIndex={2}>
                            <i className="right arrow icon"></i>
                        </div>
                    </div>
                    {calendar}
                </div>
            );
        }
        return (<div />);
    }
}
