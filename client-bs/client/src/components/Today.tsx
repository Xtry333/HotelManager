import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as Server from '../Server';
import { Reservation as ReservationDto } from '../dtos/Reservation.dto';

export interface TodayProps {
}

export interface TodayState {
    reservations: ReservationDto[];
}

class Today extends React.Component<RouteComponentProps & TodayProps, TodayState> {
    constructor(props: RouteComponentProps & TodayProps) {
        super(props);
        this.state = { reservations: [] };
    }

    componentDidMount() {
        this.getReservations();
    }

    getReservations = () => {
        Server.Get(`reservation/current`).then(results => {
            this.setState({ reservations: results.data });
        });
    }

    render() {
        return (
            <div className='Today'>
                <div className='Today-content'>
                    <ul className='Today-list'>
                        {this.state.reservations.map(r => <li>{JSON.stringify(r)}</li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Today;