import * as React from 'react';
import { Route, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import * as Server from '../../Server';
import * as moment from 'moment';
import * as queryString from 'query-string'

import { ResSummaryView, Reservation as ReservationDto } from '../../dtos/Reservation.dto';
import { ResourceError } from '../../dtos/Error';
import { Guest as GuestDto } from '../../dtos/Guest.dto';
import { SingleGuestView } from '../Guests/Guests';
import { RoomView, Room } from '../../dtos/Room.dto';
import DateInput from '../DateInput';
import { TopHeader } from '../TopHeader';
import { RowCalendar } from '../Calendar/RowCalendar';
import { ReservationList } from './ReservationList';
import { CreateReservationView } from './CreateReservation';
import RoomDiv from '../Rooms/RoomDiv';
import PaymentsDiv from './PaymentsDiv';

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
                    <div className="ui two column grid">
                        <div className="column center aligned">
                            <div className="ui horizontal divider">Guest</div>
                            <SingleGuestView guest={guest} className='ui basic segment' />
                        </div>
                        <div className="column">
                            <RoomDiv room={room} match={this.props.match} location={this.props.location} history={this.props.history} />
                        </div>
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
                        <div className="ui segment">
                            <RowCalendar {...this.props} activeRes={this.state.reservation} />
                        </div>
                        <div>
                            <label>Nights: </label>
                            <span>
                                {Math.ceil((new Date(reservation.end).getTime() -
                                    new Date(reservation.start).getTime()) / (1000 * 60 * 60 * 24))}
                            </span>
                        </div>
                        <div>
                            <label>Total Cost: </label>
                            <span>
                                {Math.ceil((new Date(reservation.end).getTime() -
                                    new Date(reservation.start).getTime()) / (1000 * 60 * 60 * 24)) * reservation.pricePerDay}
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
                    <PaymentsDiv reservationID={this.props.reservationId} />

                    <div className="ui hidden horizontal divider"></div>
                    {editMode ?
                        (<div className="ui separate buttons">
                            <button className="ui green basic button"
                                onClick={this.onReservationSave}>Save</button>
                            <button className="ui orange basic button"
                                onClick={e => {
                                    this.props.history.push(`/reservations/${reservation.id}`);
                                    this.setState({ editMode: false });
                                    this.fetchData();
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
                                <div style={{ marginTop: '14px' }}>
                                    <ReservationList {...p} reservations={reservations} />
                                </div>
                            </div>
                        } />
                        <Route path='/reservations/edit/:id' render={p =>
                            <Reservation reservationId={p.match.params.id} {...p} refresh={this.fetchReservations} mode='edit' />
                        } />
                        <Route path='/reservations/create/' render={p => {
                            const query = queryString.parse(p.location.search);
                            return <CreateReservationView guestID={parseInt(query.guestID as any)} roomID={parseInt(query.roomID as any)} {...p} refresh={this.fetchReservations} />
                        }} />
                        <Route path='/reservations/:id' render={p =>
                            <Reservation reservationId={p.match.params.id} {...p} refresh={this.fetchReservations} />
                        } />
                    </Switch>
                </div>
            </div>
        );
    }
}