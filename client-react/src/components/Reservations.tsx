import * as React from 'react';
import { Route, Link, Redirect, RouteComponentProps } from "react-router-dom";
import * as Server from '../Server';

import { ResSummaryView, Reservation as ReservationDto } from '../dtos/Reservation.dto';
import { ResourceError } from '../dtos/Error';

export interface ReservationProps { reservationId: number, refresh: Function }
export interface ReservationState { reservation: ResSummaryView, editMode: boolean }

class Reservation extends React.Component<ReservationProps & RouteComponentProps, ReservationState> {
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
                    <div className="Guest-single">
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
interface ReservationListProps { reservations: ResSummaryView[] }
interface ReservationListState { }

class ReservationList extends React.Component<ReservationListProps & RouteComponentProps, ReservationListState> {
    render() {
        const reservations = this.props.reservations.map(reservation => <ReservationListItem key={reservation.resID} reservation={reservation} />);
        return (
            <table className='Guests-list'>
                <thead>
                    <tr><th>ID</th><th>Start</th><th>End</th><th>Room</th></tr>
                </thead>
                <tbody>
                    {reservations}
                </tbody>
            </table>
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
                        <div className='label'>
                            {reservation.resID}
                        </div>
                    </Link>
                </td>
                <td>
                    <div className=''>
                        {reservation.resStart}
                    </div>
                </td>
                <td>
                    <div className=''>
                        {reservation.resEnd}
                    </div>
                </td>
                <td>
                    <Link to={`room/${reservation.roomID}`}>
                        <div className='label'>
                            {reservation.roomID}
                        </div>
                    </Link>
                </td>
            </tr>
        );
    }
}

interface ReservationsProps { }
interface ReservationsState { searchquery: string, reservations: ResSummaryView[] }

class Reservations extends React.Component<ReservationsProps, ReservationsState> {
    constructor() {
        super(undefined, undefined);
        this.state = { searchquery: '', reservations: [] };
    }

    componentDidMount() {
        this.fetchReservations();
    }

    async fetchReservations() {
        this.setState({ reservations: await Server.GetAllByDTO(ResSummaryView) });
    }

    render() {
        return (
            <div className='Reservations'>
                <header className="Reservations-header">Reservations Management</header>
                <div className='Reservations-content'>
                    <Route path='/reservations/' exact render={p => <ReservationList {...p} reservations={this.state.reservations} />} />
                    <Route path='/reservation*/:id' render={p =>
                        <Reservation reservationId={p.match.params.id} {...p} refresh={this.fetchReservations} />
                    } />
                </div>
            </div>
        );
    }
}

export default Reservations;