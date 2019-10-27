import * as React from 'react';
import { NavLink, Link, RouteComponentProps } from 'react-router-dom';
import '../styles/Navigation.less';
import { SystemLogout } from './Login';

export default class Navigation extends React.Component<{ className?: string, style?: React.CSSProperties } & RouteComponentProps, {}> {
    render() {
        return (
            <div className={`Nav ${this.props.className}`} style={this.props.style}>
                <div className='ui sticky' style={{ position: 'sticky', top: '43px' }}>
                    <nav className='Nav ui vertical menu'>
                        <NavLink activeClassName='active' className='Nav-link item bold-text' exact to='/'>Home</NavLink>
                        <NavLink activeClassName='active' className='Nav-link item' to='/today'>Today</NavLink>
                        <NavLink activeClassName='active' className='Nav-link item' to='/future'>Future</NavLink>
                        <NavLink activeClassName='active' className='Nav-link item' to='/timesheet'>Timesheet</NavLink>
                        <NavLink activeClassName='active' className='Nav-link item' to='/rooms'>Room Management</NavLink>
                        <NavLink activeClassName='active' className='Nav-link item' to='/guests'>Guest Management</NavLink>
                        <NavLink activeClassName='active' className='Nav-link item' to='/reservations'>Reservations</NavLink>
                        {/* <Link className='Nav-link item' to='#' onClick={e => SystemLogout}>Logout</Link> */}
                        <a className='Nav-link item' onClick={e => {SystemLogout(this.props.history)}}>Logout</a>
                    </nav>
                </div>
            </div>
        );
    }
}