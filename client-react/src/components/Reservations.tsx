import * as React from 'react';
import { Route, Link, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import * as Server from '../Server';
import * as moment from 'moment';

import { ResSummaryView, Reservation as ReservationDto } from '../dtos/Reservation.dto';
import { ResourceError } from '../dtos/Error';
import { Guest as GuestDto } from '../dtos/Guest.dto';
import { SingleGuestView } from './Guests/Guests';
import { RoomView, Room } from '../dtos/Room.dto';
import DateInput from './DateInput';
import { CreateGuestDiv } from './Guests/CreateGuest';
import { TopHeader } from './TopHeader';
import { CalendarRow } from './Calendar/CalendarRow';

export interface ReservationProps { reservationId: number, refresh: Function, mode?: string }
export interface ReservationState { reservation: ReservationDto, guest: GuestDto, room: RoomView, editMode: boolean }

export class Reservation extends React.Component<ReservationProps & RouteComponentProps, ReservationState> {
    constructor() {
        super(undefined, undefined);
        this.state = { reservation: null, guest: null, room: null, editMode: false };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate() {
        //console.log('Component receivet update.');
        const mode = this.props.mode === 'edit';
        const resID = this.props.reservationId;
        if (this.state.editMode !== mode) {
            this.setState({ editMode: mode });
        }
        if (this.state.reservation && this.state.reservation.id.toString() !== resID.toString()) {
            //window.location.reload();
            this.fetchData();
        }
    }

    async fetchData(resID?: number) {
        try {
            const resId = resID || this.props.reservationId;
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
                                <textarea name='additionalResInfo' className='ui textarea' onChange={this.onChange} readOnly={!editMode} value={reservation.additionalResInfo || ''} />
                            </div>
                        </div>
                    </div>
                    <CalendarRow {...this.props} activeRes={this.state.reservation} from={new Date('2019-08-09')} />
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
        reservation.numberOfPeople = 1;
        if (this.props.guestId) {
            reservation.guest = parseInt(this.props.guestId as any);
        }
        this.setState({ reservation });
        if (this.props.guestId) {
            Server.Get(`guest/${this.props.guestId}`).then(results => {
                this.setState({ guest: results.data });
            });
        } else {
            const guest = new GuestDto();
            this.setState({ guest });
        }
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

    onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log('post');
        event.preventDefault();
        try {
            const newReservation = this.state.reservation;
            const newGuest = this.state.guest;
            const response = await Server.Post(`reservation/`, { reservation: newReservation, guest: newGuest });
            console.log(response)
            this.props.refresh();
            this.props.history.push(`/reservations/${response.data.id}`);
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const reservation = this.state.reservation;
        const guest = this.state.guest;
        if (reservation) {
            return (
                <div>
                    <form className="ui form" onSubmit={this.onSubmit}>
                        {!this.props.guestId ? (<CreateGuestDiv guest={guest} onInputChange={this.onGuestInputChange} />) : (<SingleGuestView guest={this.state.guest} />)}
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
                                    <input id="pricePerDay" name='pricePerDay' type='number' min={0}
                                        onChange={this.onReservationInputChange}
                                        value={reservation.pricePerDay || 0} required />
                                    <i className='money icon' />
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="roomId" className="ui">Room ID</label>
                            <div className='ui input left icon'>
                                <input id="roomId" name='room' type='number' min={0}
                                    onChange={this.onReservationInputChange} value={reservation.room || 0} />
                                <i className='home icon' />
                            </div>
                        </div>
                        <label>Additional Reservation Info</label>
                        <div className="field">
                            <textarea name="additionalResInfo" value={reservation.additionalResInfo} onChange={this.onReservationInputChange} />
                        </div>
                        <button className='ui teal button' type="submit">Create</button>
                    </form>
                </div>
            );
        }
        return (<div />);
    }
}

interface ReservationListProps { reservations: ResSummaryView[], simpleView?: boolean }
interface ReservationListState { }

export class ReservationList extends React.Component<ReservationListProps & RouteComponentProps, ReservationListState> {
    constructor() {
        super(undefined, undefined);
        this.state = {};
    }

    render() {
        const simpleView = this.props.simpleView || false;
        const reservations = this.props.reservations.map(
            r => <ReservationListItem {...this.props} key={r.resID} resView={r} simpleView={simpleView} />
        );
        return (
            <div>
                <table className='Guests-list ui selectable table'>
                    <thead className='ui header'>
                        <tr>
                            <th>ID</th>
                            {simpleView ? null : <th>Guest Name</th>}
                            {simpleView ? null : <th>Guest Lastname</th>}
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

interface ReservationListItemProps { resView: ResSummaryView, simpleView?: boolean }
interface ReservationListItemState { }

class ReservationListItem extends React.Component<ReservationListItemProps & RouteComponentProps, ReservationListItemState> {
    render() {
        const resView = this.props.resView;
        const simpleView = this.props.simpleView || false;
        return (
            <tr className='Reservation-list-item pointer' onClick={e => this.props.history.push(`/reservations/${resView.resID}`)}>
                <td>
                    <Link to={`reservations/${resView.resID}`}>
                        <div className='label circular ui button'>
                            {resView.resID}
                        </div>
                    </Link>
                </td>
                {simpleView ? null : <td>
                    <Link to={`guests/${resView.guestID}`}>
                        {resView.guestFirstname}
                    </Link>
                </td>}
                {simpleView ? null : <td>
                    <Link to={`guests/${resView.guestID}`}>
                        {resView.guestLastname}
                    </Link>
                </td>}
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
        const reservations: ResSummaryView[] = [];
        const query = this.state.searchquery.toLocaleLowerCase();
        if (query) {
            for (const r of this.state.reservations) {
                if (r.guestFirstname.toLocaleLowerCase().includes(query)
                    || r.guestLastname.toLocaleLowerCase().includes(query)
                    || `${r.guestFirstname} ${r.guestLastname}`.toLocaleLowerCase().includes(query)) {
                    reservations.push(r);
                }
            }
        } else {
            this.state.reservations.every(x => reservations.push(x));
        }

        return (
            <div className='Reservations'>
                <TopHeader {...this.props}>Reservations Management</TopHeader>
                <div className='Reservations-content'>
                    <Switch>
                        <Route path='/reservations/' exact render={p =>
                            <div>
                                <div className="ui four column grid">
                                    <div className="four wide left aligned column">
                                        <button className="ui teal fluid button"
                                            onClick={e => { this.props.history.push(`/reservations/create/`) }}>Create New</button>
                                    </div>
                                    <div className="eight wide center aligned column"></div>
                                    <div className="four wide right aligned column">
                                        <div className='ui icon fluid input'>
                                            <input type='text' onChange={this.onSearchChange}
                                                value={this.state.searchquery} placeholder="Search..." />
                                            <i className="search icon"></i>
                                        </div>
                                    </div>
                                </div>
                                <div className="ui hidden divider" />
                                <ReservationList {...p} reservations={reservations} />
                            </div>
                        } />
                        <Route path='/reservations/edit/:id' render={p =>
                            <Reservation reservationId={p.match.params.id} {...p} refresh={this.fetchReservations} mode='edit' />
                        } />
                        <Route path='/reservations/create/:id' render={p =>
                            <CreateReservationView guestId={p.match.params.id} {...p} refresh={this.fetchReservations} />
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