import * as React from 'react';
import { Link, RouteComponentProps } from "react-router-dom";
import { Guest as GuestDto } from '../../dtos/Guest.dto';

interface GuestListProps {
    guests: GuestDto[];
    searchquery: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface GuestListState {
}

export class GuestList extends React.Component<GuestListProps & RouteComponentProps, GuestListState> {
    render() {
        const guests = this.props.guests.map(guest => <GuestListItem {...this.props} key={guest.id} guest={guest} />);
        return (<div>
            <div className="ui input group">
                <button className="ui teal button" onClick={e => { this.props.history.push(`/guests/create/`); }}>Create New</button>
                <div className='ui icon input'>
                    <input type='text' onChange={this.props.onSearchChange} value={this.props.searchquery} placeholder="Search..." />
                    <i className="search icon"></i>
                </div>
            </div>
            <table className='Guests-list ui selectable table'>
                <thead className='ui header'>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Lastname</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {guests}
                </tbody>
            </table>
        </div>);
    }
}

interface GuestListItemProps {
    guest: GuestDto;
}

interface GuestListItemState {}

class GuestListItem extends React.Component<GuestListItemProps & RouteComponentProps, GuestListItemState> {
    render() {
        const guest = this.props.guest;
        return (<tr className='Guest-list-item' onClick={e => this.props.history.push(`/guests/${guest.id}`)} style={{ cursor: 'pointer' }}>
            <td>
                <Link to={`guests/${guest.id}`}>
                    <div className='label ui circular button'>
                        {guest.id}
                    </div>
                </Link>
            </td>
            <td>
                <div className=''>
                    {guest.firstname}
                </div>
            </td>
            <td>
                <div className=''>
                    {guest.lastname}
                </div>
            </td>
            <td>
                <div className=''>
                    {guest.email}
                </div>
            </td>
            <td>
                <div className=''>
                    {guest.phoneNumber}
                </div>
            </td>
        </tr>);
    }
}
