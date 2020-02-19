import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { Reservation as ReservationDto, Reservation } from '../../dtos/Reservation.dto';
import { Guest as GuestDto } from '../../dtos/Guest.dto';
import { RoomView as RoomViewDto } from '../../dtos/Room.dto';
import { SingleGuestView } from '../Guests/Guests';
import DateInput from '../DateInput';
import { CreateGuestDiv } from '../Guests/CreateGuest';
import { RowCalendar } from '../Calendar/RowCalendar';
import * as Server from '../../Server';

import { Dropdown, DropdownOnSearchChangeData, DropdownProps } from 'semantic-ui-react'
import moment = require('moment');

const dateFormat = 'YYYY-MM-DD';

export interface CreateReservationViewProps {
    refresh: Function;
    guestID?: number;
    roomID?: number;
}

export interface CreateReservationViewState {
    reservation: ReservationDto;
    guest: GuestDto;
    freeRooms: RoomViewDto[];
}

export class CreateReservationView extends React.Component<CreateReservationViewProps & RouteComponentProps & React.HTMLProps<HTMLElement>, CreateReservationViewState> {
    constructor(props: CreateReservationViewProps & RouteComponentProps) {
        super(props);
        this.state = { reservation: null, guest: null, freeRooms: [] };
    }

    componentDidMount() {
        const reservation = new ReservationDto();
        reservation.numberOfPeople = 1;
        if (this.props.guestID) {
            reservation.guest = parseInt(this.props.guestID as any);
        }
        if (this.props.roomID) {
            reservation.room = parseInt(this.props.roomID as any);
        }
        this.setState({ reservation });
        Server.Get(`room/`).then(results => {
            this.setState({ freeRooms: results.data });
        });
        if (this.props.guestID) {
            Server.Get(`guest/${this.props.guestID}`).then(results => {
                this.setState({ guest: results.data });
            });
        }
        else {
            const guest = new GuestDto();
            this.setState({ guest });
        }
    }

    componentDidUpdate(prevProps: CreateReservationViewProps & RouteComponentProps, prevState: CreateReservationViewState) {
        if (prevState && prevState.reservation) {
            if ((prevState.reservation.start != this.state.reservation.start ||
                prevState.reservation.end != this.state.reservation.end) &&
                this.state.reservation.start && this.state.reservation.end) {
                this.fetchAvailableRooms(this.state.reservation.start, this.state.reservation.end);
            }
        }
    }

    onGuestInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        const guest: any = Object.assign({}, this.state.guest);
        guest[name] = value;
        this.setState({ guest: guest });
    };

    onReservationInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        const res: any = Object.assign({}, this.state.reservation);
        res[name] = value;
        this.setState({ reservation: res });
    };

    onRoomDropdownChange = (event: React.SyntheticEvent<HTMLElement, Event>, data: DropdownProps) => {
        const res: Reservation = Object.assign({}, this.state.reservation);
        res.room = parseInt(data.value.toString());
        this.setState({ reservation: res });
    };

    fetchAvailableRooms = async (start: string | Date, end: string | Date) => {
        if (start && end) {
            const startDate = moment(start).format(dateFormat);
            const endDate = moment(end).format(dateFormat);
            const response = await Server.Get(`room/free/${startDate}/${endDate}`);
            this.setState({ freeRooms: response.data });
        }
    };

    mapRoomsForDropdown = (rooms: RoomViewDto[]) => {
        return rooms.map((r: RoomViewDto) => {
            return {
                key: r.roomID,
                value: r.roomID,
                text: `Room ${r.floorNumber}${r.roomNumber}, ${r.floorCaption}, beds: ${r.spots}`
            }
        });
    };

    onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log('post');
        event.preventDefault();
        try {
            const newReservation = this.state.reservation;
            const newGuest = this.state.guest;
            const response = await Server.Post(`reservation/`, { reservation: newReservation, guest: newGuest });
            console.log(response);
            this.props.refresh();
            this.props.history.push(`/reservations/${response.data.id}`);
        }
        catch (error) {
            console.error(error);
        }
    };

    render() {
        const reservation = this.state.reservation;
        const guest = this.state.guest;
        if (reservation) {
            return (<div>
                <form className="ui form" onSubmit={this.onSubmit}>
                    {!this.props.guestID ? (<CreateGuestDiv guest={guest} onInputChange={this.onGuestInputChange} />) : (<SingleGuestView guest={this.state.guest} />)}
                    <h4 className="ui dividing header">Create Reservation</h4>
                    <div className="two fields">
                        <div className="field">
                            <label htmlFor="resStart" className="ui">Check In</label>
                            <div className='ui input left icon'>
                                <DateInput id="resStart" name='start' onChange={this.onReservationInputChange} date={reservation.start} required />
                                <i className='right arrow icon' />
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="resEnd" className="ui">Check Out</label>
                            <div className='ui input left icon'>
                                <DateInput id="resEnd" name='end' onChange={this.onReservationInputChange} date={reservation.end} required />
                                <i className='suitcase icon' />
                            </div>
                        </div>
                    </div>
                    <div className="two fields">
                        <div className="field">
                            <label htmlFor="numberOfPeople" className="ui">Number Of People</label>
                            <div className='ui input left icon'>
                                <input id="numberOfPeople" name='numberOfPeople' type='number' onChange={this.onReservationInputChange} value={reservation.numberOfPeople || ''} min={1} required />
                                <i className='users icon' />
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="pricePerDay" className="ui">Price per Day</label>
                            <div className='ui input left icon'>
                                <input id="pricePerDay" name='pricePerDay' type='number' min={0} onChange={this.onReservationInputChange} value={reservation.pricePerDay || ''} required />
                                <i className='money icon' />
                            </div>
                        </div>
                    </div>
                    <div className="field">
                        <div className="ui segment">
                            <RowCalendar activeRes={this.state.reservation} history={this.props.history} location={this.props.location} match={this.props.match} />
                        </div>
                        <label htmlFor="roomId" className="ui">Room</label>
                        <Dropdown
                            name='room' fluid search selection
                            placeholder='Select Room'
                            options={this.mapRoomsForDropdown(this.state.freeRooms)}
                            value={reservation.room}
                            onChange={this.onRoomDropdownChange}
                        />
                    </div>
                    <label>Additional Reservation Info</label>
                    <div className="field">
                        <textarea name="additionalResInfo" value={reservation.additionalResInfo || ''} onChange={this.onReservationInputChange} />
                    </div>
                    <button className='ui teal button' type="submit">Create</button>
                </form>
            </div>);
        }
        return (<div />);
    }
}
