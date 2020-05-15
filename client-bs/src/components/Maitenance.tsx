import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Maitenance extends React.Component<RouteComponentProps, {}> {
    render() {
        return (
            <div style={{textAlign: 'center'}}>
                <header className='ui icon header'>
                    <div className="ui statistic">
                        <div className="value">404</div>
                        <div className="label">Server Not Found</div>
                    </div>
                    <i className='cogs icon' />
                    <h1 className='ui header'>
                        <div className="sub header">Cannot reach server. Perhaps you are offline?</div>
                    </h1>
                </header>
            </div>
        );
    }
}