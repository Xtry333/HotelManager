import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import * as Server from '../../Server';
import { Payment as PaymentDto } from '../../dtos/Payment.dto';

export interface PaymentsDivProps {
    reservationID: number;
}

export interface PaymentsDivState {
    payment: PaymentDto;
}

export default class PaymentsDiv extends React.Component<PaymentsDivProps, PaymentsDivState> {
    constructor(props: PaymentsDivProps) {
        super(props);
        this.state = { payment: null };
    }

    async fetchData(resID?: number) {
        try {
            const resId = resID || this.props.reservationID;
            await Server.Get(`payment/${resId}`).then(results => {
                this.setState({ payment: results.data });
            });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}