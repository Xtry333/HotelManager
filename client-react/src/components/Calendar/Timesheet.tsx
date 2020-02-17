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

    // onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const name = event.target.name;
    //     const value = event.target.value;
    //     const res: any = Object.assign({}, this.state.reservation);
    //     res[name] = value;
    //     this.setState({ reservation: res });
    // }

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
                    {calendar}
                </div>
            );
        }
        return (<div />);
    }
}
