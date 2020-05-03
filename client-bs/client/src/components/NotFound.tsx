import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class NotFound extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <header className='ui icon header'>
                    <div className="ui statistic">
                        <div className="value">404</div>
                        <div className="label">Not Found</div>
                    </div>
                    <i className='cogs icon' />
                    <h1 className='ui header'>
                        <div className="sub header">Path <code>{this.props.location.pathname}</code> has not been found.</div>
                    </h1>
                </header>
            </div>
        );
    }
}