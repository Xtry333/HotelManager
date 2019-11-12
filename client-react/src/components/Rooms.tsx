import * as React from 'react';
import { Route, Link, Redirect, RouteComponentProps } from "react-router-dom";
import * as Server from '../Server';
import { RoomView } from '../dtos/Room.dto';
import { TopHeader } from './TopHeader';
import { RowCalendar } from './Calendar/RowCalendar';
import moment = require('moment');

//import '../styles/Rooms.less';

export interface RoomProps { roomId: number, refresh: Function, mode?: string }
export interface RoomState { room: RoomView, editMode: boolean }

class Room extends React.Component<RoomProps & RouteComponentProps, RoomState> {
    constructor() {
        super(undefined, undefined);
        this.state = { room: null, editMode: false };
    }

    async componentDidMount() {
        try {
            const id = this.props.roomId;
            const results = await Server.Get(`room/${id}`);
            this.setState({ room: results.data });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this.props.history.push('/logout');
            }
        }
    }

    componentDidUpdate() {
        const mode = this.props.mode === 'edit';
        if (this.state.editMode !== mode) {
            this.setState({ editMode: mode });
        }
    }

    render() {
        if (this.state.room) {
            const room = this.state.room;
            if (this.state.editMode) {
                const list = Object.keys(room).map((k, i) => <li key={k}>{k}: {JSON.stringify((room as any)[k])}</li>);
                console.log(list);
                return (
                    <div className="Room-single">
                        {list}
                    </div>
                );
            } else {
                let index = 0;
                const images = room.images.map(v => <img key={v.id} src={v.imageLink} alt={`Zdjęcie ${index}`} />);
                return (
                    <div className="Room-single">
                        {room.roomID}, {room.roomNumber}, {room.floorCaption}, {room.spots} {(room as any).spotsTag}
                        <div>
                            {images}
                        </div>
                        <button className="App-button" onClick={e => { this.setState({ editMode: true }) }}>Edit</button>
                        <RowCalendar centerDate={moment().startOf('week').add(13, 'days')} activeRoomID={this.state.room.roomID} {...this.props} />
                    </div>
                );
            }
        }
        return (<div />);
    }
}

interface RoomListProps { rooms: RoomView[] }
interface RoomListState { }

class RoomList extends React.Component<RoomListProps & RouteComponentProps, RoomListState> {
    render() {
        const rooms = this.props.rooms.map(room => <RoomListItem key={(room as RoomView).roomID} room={room} />);
        return (
            <div className='ui link centered cards'>
                {rooms}
            </div>
        );
    }
}

interface RoomListItemProps { room: RoomView }
interface RoomListItemState { }

class RoomListItem extends React.Component<RoomListItemProps, RoomListItemState> {
    render() {
        const room = this.props.room;
        return (
            <Link to={`rooms/${room.roomID}`} className='card'>
                <div className='content'>
                    <span className='ui centered header'>Room {room.floorNumber}{room.roomNumber}</span>
                </div>
                <div className="image">
                    <img src={room.defaultImageLink} alt='' />
                </div>
                <div className='extra content'>
                    <i className="bed icon" />
                    <span className=''>{room.spots}</span>

                    <span className='right floated'>
                        {room.floorCaption}
                        &nbsp;
                        <i className="tag icon" style={{ color: room.floorColor }} />
                    </span>
                </div>

            </Link>
        );
    }
}

export interface RoomsProps { };
export interface RoomsState { rooms: RoomView[] };

class Rooms extends React.Component<RoomsProps & RouteComponentProps, RoomsState> {
    constructor() {
        super(undefined, undefined);
        this.state = { rooms: [] };
    }

    componentDidMount() {
        this.fetchRooms();
    }

    fetchRooms = async () => {
        this.setState({ rooms: await Server.GetAllBy('room', RoomView) });
    }

    render() {
        return (
            <div className='Rooms'>
                <TopHeader {...this.props}>Rooms Management</TopHeader>
                <div className='Rooms-content'>
                    <Route path='/rooms/' exact render={p =>
                        <RoomList {...p} rooms={this.state.rooms} />
                    } />
                    <Route path='/rooms/edit/:id' render={p =>
                        <Room roomId={p.match.params.id} {...p} refresh={this.fetchRooms} mode='edit' />
                    } />
                    <Route path='/rooms/:id' render={p =>
                        <Room roomId={p.match.params.id} {...p} refresh={this.fetchRooms} />
                    } />
                </div>
            </div>
        );
    }
}

export default Rooms;