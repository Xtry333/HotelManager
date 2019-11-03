import * as React from 'react';
import moment = require('moment');

export interface DateInputProps {
    id?: string,
    name?: string,
    date: string | Date,
    readOnly?: boolean,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
    className?: string
};

export default class DateInput extends React.Component<DateInputProps, {}> {
    render() {
        const momento = moment(this.props.date);
        const format = 'YYYY-MM-DD';
        return (
            <input className={this.props.className}
                id={this.props.id}
                type='date' onChange={this.props.onChange}
                value={momento.format(format)}
                readOnly={this.props.readOnly || !this.props.onChange}
                name={this.props.name}
            />
        );
    }
}