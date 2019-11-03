import * as React from 'react';
import * as moment from 'moment';

export interface DateInputProps {
    date: string | Date
}

export default class DateInput extends React.Component<DateInputProps & React.InputHTMLAttributes<HTMLInputElement>, {}> {
    render() {
        const momento = moment(this.props.date);
        const format = 'YYYY-MM-DD';
        return (
            <input className={this.props.className}
                id={this.props.id}
                type='date' onChange={this.props.onChange}
                value={momento.format(format)}
                readOnly={this.props.readOnly || (!this.props.onChange && this.props.readOnly)}
                name={this.props.name}
            />
        );
    }
}