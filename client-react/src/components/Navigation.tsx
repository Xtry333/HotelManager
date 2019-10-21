import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

class Navigation extends React.Component {
    render() {
        return (
            <nav className='Nav'>
                {/* <div className='Nav-header'>
                    <h2>Hotel Manager</h2>
                </div> */}
                <ul className='Nav-ul'>
                    <li><NavLink activeClassName='is-active' className='Nav-link' exact to='/'>Home</NavLink></li>
                    <li><NavLink activeClassName='is-active' className='Nav-link' to='/today'>Today</NavLink></li>
                    <li><NavLink activeClassName='is-active' className='Nav-link' to='/future'>Future</NavLink></li>
                    <li><NavLink activeClassName='is-active' className='Nav-link' to='/timesheet'>Timesheet</NavLink></li>
                    <li><NavLink activeClassName='is-active' className='Nav-link' to='/rooms'>Room Management</NavLink></li>
                    <li><NavLink activeClassName='is-active' className='Nav-link' to='/guests'>Guest Management</NavLink></li>
                    <li><NavLink activeClassName='is-active' className='Nav-link' to='/reservations'>Reservations</NavLink></li>
                    <li><Link className='Nav-link' to='/logout'>Logout</Link></li>
                </ul>
            </nav>
        );
    }
}

export default Navigation;
