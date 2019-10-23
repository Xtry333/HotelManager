import * as React from 'react';
import { Route, Link, Redirect, RouteComponentProps } from "react-router-dom";
import { Guest as GuestDto } from '../dtos/Guest.dto'
import * as Server from '../Server';

export interface GuestProps { guestId: number, refresh: Function }
export interface GuestState { guest: GuestDto, editMode: boolean }

class Guest extends React.Component<GuestProps & RouteComponentProps, GuestState> {
    constructor() {
        super(undefined, undefined);
        this.state = { guest: null, editMode: false };
    }

    componentDidMount() {
        this.fetchGuest(this.props.guestId);
    }

    async fetchGuest(id: number) {
        try {
            const results = await Server.Get(`guest/${id}`, {}, this.props.history);
            this.setState({ guest: results.data });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        if (this.state.guest) {
            const guest = this.state.guest;
            //if (this.state.singout) { return (<Redirect to='/logout' />); }
            if (this.state.editMode) {
                const list = Object.keys(guest).map((k, i) => <input value={JSON.stringify((guest as any)[k])} key={k} />);
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
                        {guest.firstname}, {guest.lastname}, {guest.phoneNumber}

                        <button className="App-button" onClick={e => { this.setState({ editMode: true }) }}>Edit</button>
                    </div>
                );
            }
        }
        return (<div />);
    }
}

interface GuestListProps { guests: GuestDto[] }
interface GuestListState { }

class GuestList extends React.Component<GuestListProps, GuestListState> {
    render () {
    const guests = this.props.guests.map(guest => <GuestListItem key={guest.id} guest={guest} />);
    return (
        <table className='Guests-list'>
            <thead>
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
    );
    }
}


interface GuestListItemProps { guest: GuestDto }
interface GuestListItemState { }

class GuestListItem extends React.Component<GuestListItemProps, GuestListItemState> {
    render() {
        const guest = this.props.guest;
        return (
            <tr className='Guest-list-item'>
                <td>
                    <Link to={`guests/${guest.id}`}>
                        <div className='label'>
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
            </tr>
        );
    }
}

export interface GuestsProps { room: number }
export interface GuestsState { guests: GuestDto[] }

class Guests extends React.Component<GuestsProps, GuestsState> {
    constructor() {
        super(undefined, undefined);
        this.state = { guests: [] };
    }

    componentDidMount() {
        this.fetchGuests();
    }

    async fetchGuests() {
        this.setState({guests: await Server.GetAllByDTO(GuestDto)});
    }

    render() {
        return (
            <div className='Guests'>
                <header className="Guests-header">Guests Management</header>
                <div className='Guests-content'>
                    <Route path='/guests/' exact render={p => <GuestList {...p} guests={this.state.guests} />} />
                    <Route path='/guests/:id' render={p => <Guest guestId={p.match.params.id} {...p} refresh={this.fetchGuests} />} />
                </div>
            </div>
        );
    }
}

export default Guests;