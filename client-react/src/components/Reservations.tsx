import * as React from 'react';
import { Route, Link, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import * as Server from '../Server';
import * as moment from 'moment';

import { ResSummaryView, Reservation as ReservationDto } from '../dtos/Reservation.dto';
import { ResourceError } from '../dtos/Error';
import { Guest as GuestDto } from '../dtos/Guest.dto';
import { SingleGuestView } from './Guests';
import { RoomView, Room } from '../dtos/Room.dto';
import DateInput from './DateInput';

export interface ReservationProps { reservationId: number, refresh: Function, mode?: string }
export interface ReservationState { reservation: ReservationDto, guest: GuestDto, room: RoomView, editMode: boolean }

export class Reservation extends React.Component<ReservationProps & RouteComponentProps, ReservationState> {
    constructor() {
        super(undefined, undefined);
        this.state = { reservation: null, guest: null, room: null, editMode: false };
    }

    componentDidMount() {
        this.fetchData();
        this.setState({ editMode: this.props.mode === 'edit' });
    }

    async fetchData() {
        try {
            const resId = this.props.reservationId;
            await Server.Get(`reservation/${resId}`).then(results => {
                this.setState({ reservation: results.data });
            });
            const guestId = this.state.reservation.guest;
            Server.Get(`guest/${guestId}`).then(results => {
                this.setState({ guest: results.data });
            });
            const roomId = this.state.reservation.room;
            Server.Get(`room/${roomId}`).then(results => {
                this.setState({ room: results.data });
            });
        } catch (error) {
            console.error(error);
        }
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        const res: any = Object.assign({}, this.state.reservation);
        res[name] = value;
        this.setState({ reservation: res });
    }

    onReservationSave = async () => {
        const res = this.state.reservation;
        await Server.Put(`reservation/${res.id}`, { reservation: res });
        this.setState({ editMode: false });
        this.props.refresh();
        this.props.history.goBack();
    }

    deleteRes = async () => {
        const resID = this.state.reservation.id;
        const guestName = `${this.state.guest.firstname} ${this.state.guest.lastname}`;
        const confirmation = window.confirm(`Are you sure you want to delete reservation ${resID} for ${guestName}?`);
        if (confirmation) {
            console.log(`Wow, staph! ${resID}`);
            await Server.Delete(`reservation/${resID}`);
            this.props.refresh();
            this.props.history.push(`/reservations`);
        }
    }

    render() {
        const reservation = this.state.reservation;
        const guest = this.state.guest;
        const room = this.state.room;
        const editMode = this.state.editMode;
        if (reservation && guest && room) {
            return (
                <div>
                    <div className="ui horizontal divider">Guest</div>
                    <div className='ui'>
                        <SingleGuestView guest={guest} className='ui basic segment' />
                    </div>
                    <div className="ui horizontal divider">Details</div>
                    <div className='ui form'>
                        <div className='field'>
                            <div className="ui right labeled input">
                                <label htmlFor="resAdded" className="ui label date-label">Created: </label>
                                <DateInput id='resAdded' className='ui date input' name='added' date={this.state.reservation.added} readOnly={true} />
                                <div className="ui basic label date-label">
                                    {`${moment(this.state.reservation.added).format('dddd')}, ${moment(this.state.reservation.added).from()}`}
                                </div>
                            </div>
                        </div>
                        <div className="inline fields">
                            <div className='field'>
                                <div className="ui right labeled input">
                                    <label htmlFor="resStart" className="ui label date-label">Check-in: </label>
                                    <DateInput id='resStart' className='ui date input' name='start' date={this.state.reservation.start} readOnly={!editMode} onChange={this.onChange} />
                                    <div className="ui basic label date-label">
                                        {`${moment(this.state.reservation.start).format('dddd')}, ${moment(this.state.reservation.start).from()}`}
                                    </div>
                                </div>
                            </div>
                            <div className='field'>
                                <div className="ui right labeled input">
                                    <label htmlFor="resEnd" className="ui label date-label">Check-out: </label>
                                    <DateInput id='resEnd' className='ui date input' name='end' date={this.state.reservation.end} readOnly={!editMode} onChange={this.onChange} />
                                    <div className="ui basic label date-label">
                                        {`${moment(this.state.reservation.end).format('dddd')}, ${moment(this.state.reservation.end).from()}`}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label>Nights: </label>
                            <span>
                                {Math.ceil((new Date(reservation.end).getTime() -
                                    new Date(reservation.start).getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                        </div>
                        <div>
                            <i className='users icon' />
                            {reservation.numberOfPeople}/{room.spots}
                        </div>
                        <div className='ui form'>
                            <div className='ui left corner labeled textarea'>
                                <textarea name='additionalResInfo' className='ui textarea' onChange={this.onChange} readOnly={!editMode} value={reservation.additionalResInfo} />
                                <div className="ui left corner label">
                                    <i className='info icon' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="ui hidden horizontal divider"></div>
                    {editMode ?
                        (<div className="ui separate buttons">
                            <button className="ui green basic button"
                                onClick={this.onReservationSave}>Save</button>
                            <button className="ui orange basic button"
                                onClick={e => {
                                    this.props.history.push(`/reservations/${reservation.id}`);
                                    this.setState({ editMode: false })
                                }}>Cancel</button>
                            <button className="ui red basic button"
                                onClick={this.deleteRes}>Delete</button>
                        </div>
                        ) : (<div className="ui separate buttons">
                            <button className="ui orange basic button"
                                onClick={e => {
                                    this.props.history.push(`/reservations/edit/${reservation.id}`);
                                    this.setState({ editMode: true });
                                }}>Edit</button>
                        </div>)}
                </div>
            );
        }
        return (<div />);
    }
}

export interface CreateReservationViewProps { refresh: Function, guestId?: number }
export interface CreateReservationViewState { reservation: ReservationDto, guest: GuestDto }

class CreateReservationView extends React.Component<CreateReservationViewProps & RouteComponentProps & React.HTMLProps<HTMLElement>, CreateReservationViewState> {
    constructor() {
        super(undefined, undefined);
        this.state = { reservation: null, guest: null };
    }

    componentDidMount() {
        const reservation = new ReservationDto();
        const guest = new GuestDto();
        reservation.numberOfPeople = 1;
        if (this.props.guestId) {
            reservation.guest = this.props.guestId;
        }
        this.setState({ reservation, guest });
    }

    onGuestInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        const guest: any = Object.assign({}, this.state.guest);
        guest[name] = value;
        this.setState({ guest: guest });
    }

    onReservationInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        const res: any = Object.assign({}, this.state.reservation);
        res[name] = value;
        this.setState({ reservation: res });
    }

    onSubmit = async (event: React.FormEvent<HTMLDivElement>) => {
        event.preventDefault();
        try {
        const newReservation = this.state.reservation;
        const newGuest = this.state.guest;
        const reservation: any = await Server.Post(`reservation/`, { reservation: newReservation, guest: newGuest });
        this.props.refresh();
        this.props.history.push(`/reservations/${reservation.id}`);
        } catch (error) {

        }
    }

    render() {
        const reservation = this.state.reservation;
        const guest = this.state.guest;
        if (reservation) {
            return (
                <div>
                    <div className="ui form" onSubmit={this.onSubmit}>
                        {guest ? (<div>
                            <h4 className="ui dividing header">Create Guest</h4>
                            <label>Name</label>
                            <div className="three fields">
                                <div className="field">
                                    <input type="text" name="firstname" placeholder="First Name" value={guest.firstname} />
                                </div>
                                <div className="field">
                                    <input type="text" name="lastname" placeholder="Last Name" value={guest.lastname} />
                                </div>
                            </div>
                            <label>Contact</label>
                            <div className="three fields">
                                <div className="field">
                                    <div className="ui input left icon">
                                        <i className='mobile alternate icon' />
                                        <input type="tel" name="phoneNumber" placeholder="Phone Number" value={guest.phoneNumber} />
                                    </div>
                                </div>
                                <div className="field">
                                    <div className="ui input left icon">
                                        <i className='mail icon' />
                                        <input type="email" name="email" placeholder="Email Address" value={guest.email} required />
                                    </div>
                                </div>
                            </div>
                            <label>Address</label>
                            <div className="three fields">
                                <div className="field">
                                    <input type="text" name="city" placeholder="City" value={guest.city} />
                                </div>
                                <div className="field">
                                    <input type="text" name="streetName" placeholder="Street" value={guest.streetName} />
                                </div>
                            </div>
                            <label>Pesel</label>
                            <div className="three fields">
                                <div className="field">
                                    <input type="number" name="pesel" placeholder="Pesel" value={guest.pesel} />
                                </div>
                            </div>
                            <label>Additional Info</label>
                            <div className="field">
                                <textarea name="additionalGuestInfo" />
                            </div>
                        </div>) : (<div />)}
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
                                    <input id="numberOfPeople" name='numberOfPeople' type='number' onChange={this.onReservationInputChange}
                                        value={reservation.numberOfPeople} min="1" required />
                                    <i className='users icon' />
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="pricePerDay" className="ui">Price per Day</label>
                                <div className='ui input left icon'>
                                    <input id="pricePerDay" name='pricePerDay' type='number' onChange={this.onReservationInputChange}
                                        value={reservation.pricePerDay} required/>
                                    <i className='money icon' />
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="pricePerDay" className="ui">Price per Day</label>
                            <div className='ui input left icon'>
                                <input id="pricePerDay" name='pricePerDay' type='number' onChange={this.onReservationInputChange} value={reservation.pricePerDay} />
                                <i className='money icon' />
                            </div>
                        </div>
                        <button className='ui teal button' type="submit">Create</button>
                    </div>
                </div>
            );
        }
        return (<div />);
    }
}

interface ReservationListProps { reservations: ResSummaryView[], searchquery: string, onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void }
interface ReservationListState { }

class ReservationList extends React.Component<ReservationListProps & RouteComponentProps, ReservationListState> {
    constructor() {
        super(undefined, undefined);
        this.state = { searchquery: '' };
    }

    render() {
        //const reservations = this.props.reservations.map(reservation => <ReservationListItem key={reservation.resID} reservation={reservation} />);
        const reservations: JSX.Element[] = [];
        const query = this.props.searchquery.toLocaleLowerCase();
        for (const r of this.props.reservations) {
            if (!query || r.guestFirstname.toLocaleLowerCase().includes(query) || r.guestLastname.toLocaleLowerCase().includes(query) || `${r.guestFirstname} ${r.guestLastname}`.toLocaleLowerCase().includes(query)) {
                reservations.push(<ReservationListItem key={r.resID} resView={r} />);
            }
        }

        return (
            <div>
                <div className="ui input group">
                    <button className="ui teal button" onClick={e => { this.props.history.push(`/reservations/create/`) }}>Create New</button>
                    <div className='ui icon input'>
                        <input type='text' onChange={this.props.onSearchChange} value={this.props.searchquery} placeholder="Search..." />
                        <i className="search icon"></i>
                    </div>
                </div>

                <table className='Guests-list ui table'>
                    <thead className='ui header'>
                        <tr>
                            <th>ID</th>
                            <th>Guest Name</th>
                            <th>Guest Lastname</th>
                            <th>People</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Room</th>
                        </tr>
                    </thead>
                    <tbody className=''>
                        {reservations}
                    </tbody>
                </table>
            </div>
        );
    }
}

interface ReservationListItemProps { resView: ResSummaryView }
interface ReservationListItemState { }

class ReservationListItem extends React.Component<ReservationListItemProps, ReservationListItemState> {
    render() {
        const resView = this.props.resView;
        return (
            <tr className='Reservation-list-item'>
                <td>
                    <Link to={`reservations/${resView.resID}`}>
                        <div className='label circular ui button'>
                            {resView.resID}
                        </div>
                    </Link>
                </td>
                <td>
                    <Link to={`guests/${resView.guestID}`}>
                        {resView.guestFirstname}
                    </Link>
                </td>
                <td>
                    <Link to={`guests/${resView.guestID}`}>
                        {resView.guestLastname}
                    </Link>
                </td>
                <td>
                    <i className='users icon' />
                    {resView.numberOfPeople}
                </td>
                <td>
                    {moment(resView.resStart).format('YYYY-MM-DD')}
                </td>
                <td>
                    {moment(resView.resEnd).format('YYYY-MM-DD')}
                </td>
                <td>
                    <Link to={`rooms/${resView.roomID}`}>
                        <div className='label circular ui button'>
                            {resView.roomID}
                        </div>
                    </Link>
                </td>
            </tr>
        );
    }
}

interface ReservationsProps { }
interface ReservationsState { reservations: ResSummaryView[], searchquery: string }

export class Reservations extends React.Component<ReservationsProps & RouteComponentProps, ReservationsState> {
    constructor() {
        super(undefined, undefined);
        this.state = { reservations: [], searchquery: '' };
    }

    componentDidMount() {
        this.fetchReservations();
    }

    fetchReservations = async () => {
        this.setState({ reservations: await Server.GetAllBy('reservation/summary', ResSummaryView) });
    }

    onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchquery: event.target.value });
    }

    render() {
        return (
            <div className='Reservations'>
                <header className="Reservations-header ui header centered">
                    <h2>
                        Reservations Management
                    </h2>
                </header>
                <div className='Reservations-content'>
                    <Switch>
                        <Route path='/reservations/' exact render={p =>
                            <ReservationList {...p} reservations={this.state.reservations} searchquery={this.state.searchquery} onSearchChange={this.onSearchChange} />
                        } />
                        <Route path='/reservations/edit/:id' render={p =>
                            <Reservation reservationId={p.match.params.id} {...p} refresh={this.fetchReservations} mode='edit' />
                        } />
                        <Route path='/reservations/create/' render={p =>
                            <CreateReservationView {...p} refresh={this.fetchReservations} />
                        } />
                        <Route path='/reservations/:id' render={p =>
                            <Reservation reservationId={p.match.params.id} {...p} refresh={this.fetchReservations} />
                        } />
                    </Switch>
                </div>
            </div>
        );
    }
}