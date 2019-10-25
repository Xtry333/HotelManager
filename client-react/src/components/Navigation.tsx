import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
//import '../styles/Navigation.less';

export default class Navigation extends React.Component {
    render() {
        return (
            <div className='three wide column'>
                <nav className='Nav ui vertical fluid tabular menu'>
                    <NavLink activeClassName='active' className='Nav-link item' exact to='/'>Home</NavLink>
                    <NavLink activeClassName='active' className='Nav-link item' to='/today'>Today</NavLink>
                    <NavLink activeClassName='active' className='Nav-link item' to='/future'>Future</NavLink>
                    <NavLink activeClassName='active' className='Nav-link item' to='/timesheet'>Timesheet</NavLink>
                    <NavLink activeClassName='active' className='Nav-link item' to='/rooms'>Room Management</NavLink>
                    <NavLink activeClassName='active' className='Nav-link item' to='/guests'>Guest Management</NavLink>
                    <NavLink activeClassName='active' className='Nav-link item' to='/reservations'>Reservations</NavLink>
                    <Link className='Nav-link item' to='/logout'>Logout</Link>
                    {/* <div className='Nav-header'>
                    <h2>Hotel Manager</h2>
                </div> */}
                    {/* <ul className='Nav-ul'>
                    <li><NavLink activeClassName='active' className='Nav-link item' exact to='/'>Home</NavLink></li>
                    <li><NavLink activeClassName='active' className='Nav-link item' to='/today'>Today</NavLink></li>
                    <li><NavLink activeClassName='active' className='Nav-link item' to='/future'>Future</NavLink></li>
                    <li><NavLink activeClassName='active' className='Nav-link item' to='/timesheet'>Timesheet</NavLink></li>
                    <li><NavLink activeClassName='active' className='Nav-link item' to='/rooms'>Room Management</NavLink></li>
                    <li><NavLink activeClassName='active' className='Nav-link item' to='/guests'>Guest Management</NavLink></li>
                    <li><NavLink activeClassName='active' className='Nav-link item' to='/reservations'>Reservations</NavLink></li>
                    <li><Link className='Nav-link' to='/logout'>Logout</Link></li> 
                </ul>*/}
                </nav>
            </div>
        );
    }
}