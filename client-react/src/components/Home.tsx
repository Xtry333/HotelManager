import * as React from 'react';
import { RouteComponentProps } from 'react-router';

class Home extends React.Component<RouteComponentProps> {
    render() {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        const token = localStorage.getItem('token') || '';
        return (
            <div className='Home'>
                <header className="ui centered header">
                    <h2>Hello {user.firstname}</h2>
                    <p>Choose your path</p>
                    <div className="ui buttons">
                        <button className="ui teal button" onClick={e => this.props.history.push(`/guests/create/`)}>
                            Create Guest
                        </button>
                        <button className="ui teal button" onClick={e => this.props.history.push(`/reservations/create/`)}>
                            Create Reservation
                        </button>
                    </div>
                </header>
            </div>
        );
    }
}

export default Home;