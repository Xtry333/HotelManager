import * as React from 'react';
import { Route, Link, Redirect, Switch, RouteComponentProps } from "react-router-dom";
import * as Server from '../Server';
import * as moment from 'moment';

import { ResSummaryView, Reservation as ReservationDto } from '../dtos/Reservation.dto';
import { ResourceError } from '../dtos/Error';
import { Guest as GuestDto } from '../dtos/Guest.dto';
import { SingleGuestView } from './Guests';

export interface ReservationProps { reservationId: number, refresh: Function }
export interface ReservationState { reservation: ResSummaryView, editMode: boolean, guest: GuestDto }

export class Reservation extends React.Component<ReservationProps & RouteComponentProps, ReservationState> {
    constructor() {
        super(undefined, undefined);
        this.state = { reservation: null, guest: null, editMode: false };
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        try {
            const resId = this.props.reservationId;
            await Server.Get(`reservation/${resId}`).then(results => {
                this.setState({ reservation: results.data });
            });
            const guestId = this.state.reservation.guestID;
            await Server.Get(`guest/${guestId}`).then(results => {
                this.setState({ guest: results.data });
            });
        } catch (error) {
            console.error(error);
        }
    }

    async deleteRes() {
        const resID = this.state.reservation.resID;
        const guestName = `${this.state.reservation.guestFirstname} ${this.state.reservation.guestLastname}`;
        const confirmation = window.confirm(`Are you sure you want to delete reservation ${resID} for ${guestName}?`);
        if (confirmation) {
            console.log(`Wow, staph! ${resID}`);
            await Server.Delete(`reservation/${resID}`);
            this.props.refresh();
            this.props.history.push(`/reservations`);
            //this.setState({redirectTo: '/reservations'});
        }
    }

    render() {
        const reservation = this.state.reservation;
        const guest = this.state.guest;
        if (reservation && guest) {
            return (
                <div>
                    <div className='ui step'>
                        <h5 className='ui header'>
                            Reservation for:
                        </h5>
                        <SingleGuestView guest={guest} />
                    </div>
                    <div className='ui buttons group'>
                        <button className="App-button ui orange button" onClick={e => { this.props.history.push(`/reservations/edit/${reservation.resID}`) }}>Edit</button>
                        <button className="App-button ui red button" onClick={e => { this.deleteRes() }}>Delete</button>
                    </div>
                </div>
            );
        }
        return (<div />);
    }
}

export interface EditReservationProps { reservationId: number, refresh: Function, editRes: boolean }
export interface EditReservationState { reservation: ResSummaryView }

class EditReservation extends React.Component<EditReservationProps & RouteComponentProps, EditReservationState> {
    constructor() {
        super(undefined, undefined);
        this.state = { reservation: null };
    }

    componentDidMount() {
        console.log(this.props);
        this.fetchData();
    }

    fetchData() {
        try {
            const id = this.props.reservationId;
            Server.Get(`reservation/${id}`).then(results => {
                this.setState({ reservation: results.data });
            }).catch(error => {
                if (error.response && error.response.status === 401) {
                    //this.setState({ singout: true });
                }
            });
        } catch (error) {

        }
    }

    render() {
        const reservation = this.state.reservation;
        if (reservation) {
            const list = Object.keys(reservation).map((k, i) => <input value={JSON.stringify((reservation as any)[k])} key={k} />);
            return (
                <div>
                    {list}
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
                reservations.push(<ReservationListItem key={r.resID} reservation={r} />);
            }
        }

        return (
            <div>
                <div className='ui icon input'>
                    <input type='text' onChange={this.props.onSearchChange} value={this.props.searchquery} placeholder="Search..." />
                    <i className="search icon"></i>
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

interface ReservationListItemProps { reservation: ResSummaryView }
interface ReservationListItemState { }

class ReservationListItem extends React.Component<ReservationListItemProps, ReservationListItemState> {
    render() {
        const reservation = this.props.reservation;
        return (
            <tr className='Reservation-list-item'>
                <td>
                    <Link to={`reservations/${reservation.resID}`}>
                        <div className='label circular ui button'>
                            {reservation.resID}
                        </div>
                    </Link>
                </td>
                <td>
                    <Link to={`guests/${reservation.guestID}`}>
                        {reservation.guestFirstname}
                    </Link>
                </td>
                <td>
                    <Link to={`guests/${reservation.guestID}`}>
                        {reservation.guestLastname}
                    </Link>
                </td>
                <td>
                    <i className='users icon' />
                    {reservation.numberOfPeople}
                </td>
                <td>
                    {moment(reservation.resStart).format('YYYY-MM-DD')}
                </td>
                <td>
                    {moment(reservation.resEnd).format('YYYY-MM-DD')}
                </td>
                <td>
                    <Link to={`rooms/${reservation.roomID}`}>
                        <div className='label circular ui button'>
                            {reservation.roomID}
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
        this.setState({ reservations: await Server.GetAllBy('reservation', ResSummaryView, this.props.history) });
    }

    onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchquery: event.target.value });
    }

    render() {
        return (
            <div className='Reservations'>
                <header className="Reservations-header ui header centered">Reservations Management</header>
                <div className='Reservations-content'>
                    <Switch>
                        <Route path='/reservations/' exact render={p =>
                            <ReservationList {...p} reservations={this.state.reservations} searchquery={this.state.searchquery} onSearchChange={this.onSearchChange} />
                        } />
                        <Route path='/reservations/edit/:id' render={p =>
                            <EditReservation reservationId={p.match.params.id} {...p} refresh={this.fetchReservations} editRes />
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