import * as React from 'react';
import { Route, Link, Redirect, RouteComponentProps } from "react-router-dom";
import * as Server from '../Server';
import * as moment from 'moment';

import { ResSummaryView, Reservation as ReservationDto } from '../dtos/Reservation.dto';
import { ResourceError } from '../dtos/Error';

export interface ReservationProps { reservationId: number, refresh: Function }
export interface ReservationState { reservation: ResSummaryView, editMode: boolean }

export class Reservation extends React.Component<ReservationProps & RouteComponentProps, ReservationState> {
    constructor() {
        super(undefined, undefined);
        this.state = { reservation: null, editMode: false };
    }

    componentDidMount() {
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
        if (this.state.reservation) {
            const reservation = this.state.reservation;
            //if (this.state.singout) { return (<Redirect to='/logout' />); }
            //if (this.state.redirectTo) { return (<Redirect to={this.state.redirectTo} />); }
            if (this.state.editMode) {
                const list = Object.keys(reservation).map((k, i) => <input value={JSON.stringify((reservation as any)[k])} key={k} />);
                console.log(list);
                return (
                    <div className="Guest-single">
                        {list}
                    </div>
                );
            } else {
                //let index = 0;
                //const images = room.meta.images.map(v => <img key={v.id} src={v.imageLink} alt={`Zdjęcie ${index}`} />);
                return (
                    <div className="ui segment">
                        {reservation.guestFirstname}, {reservation.guestLastname}, {reservation.guestPhoneNumber}

                        <button className="App-button" onClick={e => { this.setState({ editMode: true }) }}>Edit</button>
                        <button className="App-button" onClick={e => { this.deleteRes() }}>Delete</button>
                    </div>
                );
            }
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
            if (r.guestFirstname.toLocaleLowerCase().includes(query) || r.guestLastname.toLocaleLowerCase().includes(query)) {
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
                    <Link to={`reservation/${reservation.resID}`}>
                        <div className='label circular ui button'>
                            {reservation.resID}
                        </div>
                    </Link>
                </td>
                <td>
                    <div className=''>
                        {reservation.guestFirstname}
                    </div>
                </td>
                <td>
                    <div className=''>
                        {reservation.guestLastname}
                    </div>
                </td>
                <td>
                    <div className=''>
                        {moment(reservation.resStart).format('YYYY-MM-DD')}
                    </div>
                </td>
                <td>
                    <div className=''>
                        {moment(reservation.resEnd).format('YYYY-MM-DD')}
                    </div>
                </td>
                <td>
                    <Link to={`room/${reservation.roomID}`}>
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
            <div className='Reservations ui segment'>
                <header className="Reservations-header ui header centered">Reservations Management</header>
                <div className='Reservations-content'>
                    <Route path='/reservations/' exact render={p =>
                        <ReservationList {...p} reservations={this.state.reservations} searchquery={this.state.searchquery} onSearchChange={this.onSearchChange} />
                    } />
                    <Route path='/reservation*/:id' render={p =>
                        <Reservation reservationId={p.match.params.id} {...p} refresh={this.fetchReservations} />
                    } />
                </div>
            </div>
        );
    }
}