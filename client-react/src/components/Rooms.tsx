import * as React from 'react';
import { Route, Link, Redirect, RouteComponentProps } from "react-router-dom";
import * as Server from '../Server';
import { RoomView } from '../dtos/Room.dto';

import '../styles/Rooms.less';

export interface RoomProps { roomId: number, refresh: Function }
export interface RoomState { room: RoomView, editMode: boolean }

class Room extends React.Component<RoomProps & RouteComponentProps, RoomState> {
    constructor() {
        super(undefined, undefined);
        this.state = { room: null, editMode: false };
    }

    async componentDidMount() {
        try {
            const id = this.props.roomId;
            const results = await Server.Get(`room/${id}`, undefined, this.props.history);
            this.setState({ room: results.data });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                this.props.history.push('/logout');
            }
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
                    </div>
                );
            }
        }
        return (<div />);
    }
}

// function RoomList(props: any) {
//     //console.log(props)
//     return (
//         <ul className='Rooms-list'>
//             {props.children}
//         </ul>
//     );
// }

interface RoomListProps { rooms: RoomView[] }
interface RoomListState { }

class RoomList extends React.Component<RoomListProps & RouteComponentProps, RoomListState> {
    render() {
        const rooms = this.props.rooms.map(room => <RoomListItem key={(room as RoomView).roomID} room={room} />);
        return (
            <ul className='Rooms-list'>
                {rooms}
            </ul>
        );
    }
}

interface RoomListItemProps { room: RoomView }
interface RoomListItemState { }

class RoomListItem extends React.Component<RoomListItemProps, RoomListItemState> {
    render() {
        const room = this.props.room;
        return (
            <li className='Rooms-list-item'>
                <Link to={`room/${room.roomID}`}>
                    <div className='label'>
                        {room.roomNumber}, {room.floorCaption}
                        <div className='Room-color-badge' style={{ background: room.floorColor }}></div>
                    </div>
                    <img src={room.defaultImageLink} alt='' />
                </Link>
            </li>
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
        this.setState({ rooms: await Server.GetAllBy('room', RoomView, this.props.history) });
    }

    render() {
        return (
            <div className='Rooms'>
                <header className="Rooms-header">Rooms Management</header>
                <div className='Rooms-content'>
                    <Route path='/rooms/' exact render={p => <RoomList {...p} rooms={this.state.rooms} />} />
                    <Route path='/room/:id' render={p => <Room roomId={p.match.params.id} {...p} refresh={this.fetchRooms}/>} />
                </div>
            </div>
        );
    }
}

export default Rooms;