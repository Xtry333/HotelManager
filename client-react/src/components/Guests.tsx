import * as React from 'react';
import { Route, Link, Redirect, RouteComponentProps, Switch } from "react-router-dom";
import { Guest as GuestDto } from '../dtos/Guest.dto'
import * as Server from '../Server';
import { NotFound } from './NotFound';
import { CreateGuestView, CreateGuestDiv } from './Guests/CreateGuest';
import { TopHeader } from './TopHeader';

interface SingleGuestViewProps { guest: GuestDto, className?: string }
export function SingleGuestView({ guest, className }: SingleGuestViewProps) {
    if (guest) {
        return (
            <div className={className}>
                <header className='ui header'>
                    <Link to={`/guests/${guest.id}`}>
                        {guest.firstname} {guest.lastname}
                    </Link>
                </header>
                <div>
                    <i className='mobile alternate icon' />
                    <a href={`tel:${guest.phoneNumber}`}>{guest.phoneNumber}</a>
                </div>
                <div>
                    <i className='inbox icon' />
                    <a href={`mailto:${guest.email}`}>{guest.email}</a>
                </div>
                {(guest.city) ? (<div>
                    <i className='map marker alternate icon' />
                    <span>{guest.city}</span>
                </div>) : (<div />)}
            </div>
        );
    } else {
        return <div className={className} />;
    }
}

export interface GuestProps { guestId: number, refresh: Function, mode?: string }
export interface GuestState { guest: GuestDto, editMode: boolean }

class Guest extends React.Component<GuestProps & RouteComponentProps, GuestState> {
    constructor() {
        super(undefined, undefined);
        this.state = { guest: null, editMode: false };
    }

    componentDidMount() {
        this.fetchGuest(this.props.guestId);
        this.setState({ editMode: this.props.mode === 'edit' });
    }

    fetchGuest = async (id: number) => {
        try {
            const results = await Server.Get(`guest/${id}`);
            this.setState({ guest: results.data });
        } catch (error) {
            console.error(error);
        }
    }

    onGuestInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        const guest: any = Object.assign({}, this.state.guest);
        guest[name] = value;
        this.setState({ guest: guest });
    }

    onGuestEditSave = async (event: any) => {
        event.preventDefault();
        const guest = this.state.guest;
        await Server.Put(`guest/${guest.id}`, { guest: guest });
        this.setState({ editMode: false });
        this.props.refresh();
        this.props.history.push(`/guests/${guest.id}`);
    }

    deleteRes = async () => {
        const guestID = this.state.guest.id;
        const guestName = `${this.state.guest.firstname} ${this.state.guest.lastname}`;
        const confirmation = window.confirm(`Are you sure you want to delete ${guestName} from database?`);
        try {
            if (confirmation) {
                await Server.Delete(`guest/${guestID}`);
                this.props.refresh();
                this.props.history.push(`/guests`);
            }
        } catch (error) {
            console.error(error);
            window.alert(`Can not delete ${guestName}. Perhaps referenced somewhere.`);
        }
    }

    render() {
        const guest = this.state.guest;
        const editMode = this.state.editMode;
        if (guest) {
            return (
                <div className="Guest-single">
                    {editMode ?
                        (<form className="ui form" onSubmit={this.onGuestEditSave}>
                            <CreateGuestDiv guest={guest} onInputChange={this.onGuestInputChange} >
                                <div className="ui">
                                    <button className="ui green basic button">Save</button>
                                    <button className="ui orange basic button"
                                        onClick={e => {
                                            this.props.history.push(`/guests/${guest.id}`);
                                            this.setState({ editMode: false })
                                        }}>Cancel</button>
                                    <button className="ui red basic button"
                                        onClick={this.deleteRes}>Delete</button>
                                </div>
                            </CreateGuestDiv>
                        </form>
                        ) : (<div>
                            <div className="ui two column grid">
                                <div className="center aligned column">
                                    <div className="ui horizontal divider">Info</div>
                                    <SingleGuestView guest={guest} />
                                </div>

                                <div className="center aligned column">
                                    <div className="ui horizontal divider">Details</div>
                                    <div>
                                        <span>Pesel: </span> <span>{guest.pesel}</span>
                                    </div>
                                    <br />
                                    <div>
                                        <span>City: </span> <span>{guest.city}</span>
                                    </div>
                                    <div>
                                        <span>Street: </span> <span>{guest.streetName}</span>
                                    </div>
                                </div>
                                <div>
                                    <button className="ui teal basic button"
                                        onClick={e => {
                                            this.props.history.push(`/reservations/create/${guest.id}`);
                                        }}>Create Reservation</button>
                                    <button className="ui orange basic button"
                                        onClick={e => {
                                            this.props.history.push(`/guests/edit/${guest.id}`);
                                            this.setState({ editMode: true });
                                        }}>Edit</button>
                                </div>
                            </div>
                        </div>)}
                </div>
            );
        }
        return (<div />);
    }
}

interface GuestListProps { guests: GuestDto[], searchquery: string, onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void }
interface GuestListState { }

class GuestList extends React.Component<GuestListProps & RouteComponentProps, GuestListState> {
    render() {
        const guests = this.props.guests.map(guest => <GuestListItem key={guest.id} guest={guest} />);
        return (
            <div>
                <div className="ui input group">
                    <button className="ui teal button" onClick={e => { this.props.history.push(`/guests/create/`) }}>Create New</button>
                    <div className='ui icon input'>
                        <input type='text' onChange={this.props.onSearchChange} value={this.props.searchquery} placeholder="Search..." />
                        <i className="search icon"></i>
                    </div>
                </div>
                <table className='Guests-list ui table'>
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
            </div>
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
            </tr>
        );
    }
}

export interface GuestsProps { room: number }
export interface GuestsState { guests: GuestDto[], searchquery: string }

class Guests extends React.Component<GuestsProps & RouteComponentProps, GuestsState> {
    constructor() {
        super(undefined, undefined);
        this.state = { guests: [], searchquery: '' };
    }

    componentDidMount() {
        this.fetchGuests();
    }

    fetchGuests = async () => {
        this.setState({ guests: await Server.GetAllBy('guest', GuestDto) });
    }

    onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchquery: event.target.value });
    }

    render() {
        return (
            <div className='Guests'>
                <TopHeader {...this.props}>Guests Management</TopHeader>
                <div className="ui divider" />

                <div className='Guests-content'>
                    <Switch>
                        <Route path='/guests/' exact render={p =>
                            <GuestList {...p} guests={this.state.guests} onSearchChange={this.onSearchChange} searchquery={this.state.searchquery} />
                        } />
                        <Route path='/guests/edit/:id' render={p =>
                            <Guest guestId={p.match.params.id} {...p} refresh={this.fetchGuests} mode='edit' />
                        } />
                        <Route path='/guests/create/' render={p =>
                            <CreateGuestView {...p} refresh={this.fetchGuests} />
                        } />
                        <Route path='/guests/:id' render={p =>
                            <Guest guestId={p.match.params.id} {...p} refresh={this.fetchGuests} />
                        } />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default Guests;