import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import * as Server from '../../Server';
import { Payment as PaymentDto } from '../../dtos/Payment.dto';

export interface PaymentsDivProps {
    reservationID: number;
}

export interface PaymentsDivState {
    payments: PaymentDto;
}

export default class PaymentsDiv extends React.Component<PaymentsDivProps, PaymentsDivState> {
    constructor(props: PaymentsDivProps) {
        super(props);
        this.state = { payments: null };
    }

    async fetchData(resID?: number) {
        try {
            const resId = resID || this.props.reservationID;
            await Server.Get(`payment/${resId}`).then(results => {
                this.setState({ payments: results.data });
            });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        if (!this.state.payments)
            return (<div />);
        return (
            <div>

            </div>
        );
    }
}