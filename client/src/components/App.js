import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Nav from './Navigation';
import Future from './Future';
import Rooms from './Rooms';
import Guests from './Guests';
import Reservations from './Reservations';
import { Login, Logout } from './Login';
import Confirmation from './Confirmation';
import Home from './Home';
import './css/App.css';

class App extends React.Component {
    state = { token: null, user: null }

    isUserLogged = () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            //this.setState({ token, user });
            if (user && token && user.username) {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/confirmation/:id/:token' component={Confirmation} />
                    <Route path='/login' component={Login} />
                    <Route path='/logout' component={Logout} />
                    <Route render={props => (this.isUserLogged() ? (
                        <div className='App'>
                            <Nav />
                            <div className='App-content'>
                                <Route path='/' exact component={Home} />
                                <Route path='/future/' component={Future} />
                                <Route path='/room*' component={Rooms} />
                                <Route path='/reservation*/' component={Reservations} />
                                <Route path='/guests/' component={Guests} />
                            </div>
                        </div>
                    ) : (<Redirect to='/login' />))} />
                </Switch>
            </Router>
        );
    }
}

export default App;