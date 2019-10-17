import React from 'react';
import Backend from './Backend';
import './css/Confirmation.css';

class Confirmation extends React.Component {
    state = { confirmation: {} };

    componentDidMount() {
        this.getConfirmation(this.props.match.params);
    }

    getConfirmation = async ({ token, id }) => {
        if (token && id) {
            const response = await Backend.get(`confirm/json/${id}/${token}`)
            if (response) {
                this.setState({ confirmation: response.data });
            }
        }
    }

    render() {
        return (
            <div className='Confirmation'>
                <header className="Confirmation-header">Confirmation page</header>
                <div className='Confirmation-content'>
                    <textarea value={JSON.stringify(this.state.confirmation, null, 2)} readOnly rows={25} cols={100} />
                </div>
            </div>
        );
    }
}

export default Confirmation;