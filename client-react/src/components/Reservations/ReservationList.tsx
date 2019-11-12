import * as React from 'react';
import { RouteComponentProps, Link } from "react-router-dom";
import * as moment from 'moment';

import { ResSummaryView } from '../../dtos/Reservation.dto';

interface ReservationListProps {
    reservations: ResSummaryView[];
    simpleView?: boolean;
}
interface ReservationListState {
}

export class ReservationList extends React.Component<ReservationListProps & RouteComponentProps, ReservationListState> {
    constructor(props: ReservationListProps & RouteComponentProps) {
        super(props);
        this.state = {};
    }
    render() {
        const simpleView = this.props.simpleView || false;
        const reservations = this.props.reservations.map(r => <ReservationListItem {...this.props} key={r.resID} resView={r} simpleView={simpleView} />);
        reservations.reverse();
        return (<div>
            <table className='Guests-list ui selectable table'>
                <thead className='ui header'>
                    <tr>
                        <th>ID</th>
                        {simpleView ? null : <th>Guest Name</th>}
                        {simpleView ? null : <th>Guest Lastname</th>}
                        <th>People</th>
                        <th>Deposit</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Room</th>
                    </tr>
                </thead>
                <tbody className=''>
                    {reservations}
                </tbody>
            </table>
        </div>);
    }
}
interface ReservationListItemProps {
    resView: ResSummaryView;
    simpleView?: boolean;
}
interface ReservationListItemState {
}

class ReservationListItem extends React.Component<ReservationListItemProps & RouteComponentProps, ReservationListItemState> {
    render() {
        const resView = this.props.resView;
        const simpleView = this.props.simpleView || false;
        return (<tr className='Reservation-list-item pointer' onClick={e => this.props.history.push(`/reservations/${resView.resID}`)}>
            <td>
                <div className='ui label circular'>
                    {resView.resID}
                </div>
            </td>
            {simpleView ? null : <td>
                {resView.guestFirstname}
            </td>}
            {simpleView ? null : <td>
                {resView.guestLastname}
            </td>}
            <td>
                <i className='users icon' />
                {resView.numberOfPeople}/{resView.roomSpots}
            </td>
            <td>
                {resView.depoAmount ? `${resView.depoAmount} PLN` : null}
            </td>
            <td>
                {moment(resView.resStart).format('YYYY-MM-DD')}
            </td>
            <td>
                {moment(resView.resEnd).format('YYYY-MM-DD')}
            </td>
            <td>
                <Link to={`rooms/${resView.roomID}`} onClick={e => e.stopPropagation()}>
                    <div className='label circular ui button'>
                        {resView.roomID}
                    </div>
                </Link>
            </td>
        </tr>);
    }
}
