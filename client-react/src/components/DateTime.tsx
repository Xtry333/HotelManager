import * as React from 'react';
import moment = require('moment');

export default class DateTime extends React.Component<{dateTime: string | Date, format?: string, editable?:boolean, onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void}, {}> {
    render() {
        const momento = moment(this.props.dateTime);
        const format = this.props.format || 'YYYY-MM-DD hh:mm';
        return this.props.editable ? (
            <time dateTime={momento.toString()}>
                {momento.format(format)}
                {this.props.children}
            </time>
        ) : (
            <input type='date' onChange={this.props.onChange} value={momento.toString()}>
            </input>
        );
    }
}