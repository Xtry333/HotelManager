import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export interface CalendarRowProps { }
export interface CalendarRowState { }

class CalendarRow extends React.Component<CalendarRowProps & RouteComponentProps, CalendarRowState> {
    constructor() {
        super(undefined, undefined);
        this.state = { };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className='Calendar-row'>

            </div>
        );
    }
}
