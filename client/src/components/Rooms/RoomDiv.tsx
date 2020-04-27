import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { RoomView as RoomViewDto } from '../../dtos/Room.dto';

import './Room.less';

export interface RoomDivProps {
    room: RoomViewDto;
}

export interface RoomDivState { }

export default class RoomDiv extends React.Component<RoomDivProps & React.HTMLProps<HTMLElement> & RouteComponentProps, RoomDivState> {
    constructor(props: RoomDivProps & React.HTMLProps<HTMLElement> & RouteComponentProps) {
        super(props);
        this.state = { room: null };
    }

    render() {
        const room = this.props.room;
        if (!room)
            return (<div />);
        return (
            <div className="res-image-container" style={this.props.style}>
                {/* <div className='content'>
                    <span className='ui centered header'>Room {room.floorNumber}{room.roomNumber}</span>
                </div> */}
                <div className="image" onClick={e => this.props.history.push(`/rooms/${room.roomID}`)}>
                    <img src={room.defaultImageLink} />
                </div>
            </div>
        );
    }
}