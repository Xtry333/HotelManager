import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import * as Server from '../../Server';
import { Payment as PaymentDto, Deposit as DepositDto } from '../../dtos/Payment.dto';
import moment = require('moment');

export interface PaymentsDivProps {
    reservationID: number;
}

export interface PaymentsDivState {
    payments: PaymentDto[] & DepositDto[];
}

export default class PaymentsDiv extends React.Component<PaymentsDivProps, PaymentsDivState> {
    constructor(props: PaymentsDivProps) {
        super(props);
        this.state = { payments: null };
    }

    componentDidMount() {
        this.fetchData();
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

        const rows = this.state.payments.map(x => (
            <tr key={x.dtoName + x.id}>
                <td>{moment(x.added).format("YYYY-MM-DD HH:mm")}</td>
                <td className="right aligned">{parseFloat(x.amount as any)} PLN</td>
                <td>{x.dtoName}</td>
            </tr>));
        const sum = this.state.payments.reduce((a, b) => a + parseFloat(b.amount as any), 0);
        return (
            <div>
                <table className="ui table">
                    <thead>
                        <tr>
                            <th className="eigth wide">Date</th>
                            <th className="right aligned two wide">Amount</th>
                            <th className="four wide">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th className="right aligned">Total</th><th className="right aligned">{sum} PLN</th>
                            <th className="right aligned">
                                <button className="ui primary labeled fluid icon button">
                                    <i className="money icon"></i>
                                    Add
                                </button>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        );
    }
}