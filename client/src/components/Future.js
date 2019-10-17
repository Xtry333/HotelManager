import React from 'react';
import { Redirect } from "react-router-dom";
import { Get } from './Backend';
import './css/Future.css';

class Future extends React.Component {
    state = { date: '', singout: false };

    componentDidMount() {
        this.getFuture('');
    }

    getFuture = async (date) => {
        try {
            const response = await Get(`future/${date}`);
            const items = response.data.rooms.map(x => <li key={x.roomID}>{x.roomNumber}, {x.floorCaption}</li>);
            const resDate = response.data.date;
            this.setState({ items, date: resDate });
        } catch (error) {
            if (error.response.status === 401) {
                this.setState({ singout: true });
            }
        }
    }

    onDatePickerInput = (event) => {
        const value = event.target.value;
        this.getFuture(value);
    }

    render() {
        if (this.state.singout) {
            return (<Redirect to='/logout' />);
        }
        return (
            <div className='Future'>
                <header className="Future-header">Work for next days</header>
                <div className='Future-content'>
                    <input type='date' id='inputDatePicker' onChange={this.onDatePickerInput} value={this.state.date}></input>
                    <ul className='Future-list'>
                        {this.state.items}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Future;