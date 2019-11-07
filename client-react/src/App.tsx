import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom';
import Nav from './components/Navigation';
import { Login, Logout } from './components/Login';
//import Future from './components/Future';
import Home from './components/Home';
import Rooms from './components/Rooms';
import Guests from './components/Guests/Guests';
import { Reservations } from './components/Reservations';
import { NotFound } from './components/NotFound';
import { Maitenance } from './components/Maitenance';
//import Confirmation from './components/Confirmation';

import './styles/style.less';

export interface AppState { token: string, user: any };

class App extends React.Component<{}, AppState> {
    state = { token: '', user: '' }

    componentDidMount() {
        document.title = 'Hotel Manager App';
    }

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
                    {/* <Route path='/confirmation/:id/:token' component={Confirmation} /> */}
                    <Route path='/maitenance' component={Maitenance} />
                    <Route path='/login' component={Login} />
                    <Route path='/logout' component={Logout} />
                    <Route render={props => (this.isUserLogged() ? (
                        <div className='App ui basic segment' style={{ left: '250px', maxWidth: '75vw' }}>
                            <Nav className='ui left rail' style={{ width: '200px', marginTop: '7%' }} {...props} />
                            <div className='App-content ui segment'>
                                <Switch>
                                    <Route path='/' exact component={Home} />
                                    {/* <Route path='/future/' component={Future} /> */}
                                    <Route path='/rooms/' component={Rooms} />
                                    <Route path='/reservations/' component={Reservations} />
                                    <Route path='/guests/' component={Guests} />
                                    <Route path='*' component={NotFound} />
                                </Switch>
                            </div>
                        </div>
                    ) : (<Login {...props} />))} />
                </Switch>
            </Router>
        );
    }
}

export default App;

// Render top App component inside DOM
ReactDOM.render(<App />, document.getElementById("root"));