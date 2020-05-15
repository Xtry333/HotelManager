import * as React from 'react';
import { RouteComponentProps } from "react-router-dom";
import * as Server from '../../Server';
import { Payment as PaymentDto } from '../../dtos/Payment.dto';
import moment = require('moment');

import { Button, Header, Icon, Modal, Input, Select, Dropdown } from 'semantic-ui-react'

export interface PaymentsDivProps {
    reservationID: number;
}

export interface PaymentsDivState {
    payments: PaymentDto[];
    modalOpen: boolean;
    modalPaymentAmount: number;
    modalPaymentType: string;
}

export default class PaymentsDiv extends React.Component<PaymentsDivProps, PaymentsDivState> {
    constructor(props: PaymentsDivProps) {
        super(props);
        this.state = { payments: null, modalOpen: false, modalPaymentAmount: 0, modalPaymentType: 'payment' };
    }

    paymentOptions = [{ text: 'Payment', value: 'payment' }, { text: 'Deposit', value: 'deposit' }];

    handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })

    handleSubmit = () => {
        const data = { type: this.state.modalPaymentType, amount: this.state.modalPaymentAmount }
        Server.Put(`payment/${this.props.reservationID}`, data);
        this.setState({ modalOpen: false })
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
                <td className="right aligned">{parseFloat(x.amount as any).toFixed(2)} PLN</td>
                <td>{x.type}</td>
            </tr>));
        const sum = this.state.payments.reduce((a, b) => a + parseFloat(b.amount as any), 0);
        return (
            <div>
                <table className="ui table">
                    <thead>
                        <tr>
                            <th className="eigth wide">Date</th>
                            <th className="right aligned three wide">Amount</th>
                            <th className="three wide">Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th className="right aligned">Total</th><th className="right aligned">{sum.toFixed(2)} PLN</th>
                            <th className="right aligned">
                                <button className="ui primary labeled fluid icon button" onClick={this.handleOpen}>
                                    <i className="money icon"></i>
                                    Add
                                </button>
                            </th>
                        </tr>
                    </tfoot>
                </table>
                <Modal open={this.state.modalOpen} onClose={this.handleClose} size='small' >
                    <Header icon='money' content='Add Payment' />
                    <Modal.Content>
                        <p>Please select the type and enter payment amount:</p>
                        <Input type='text' value={this.state.modalPaymentAmount}
                            onChange={(e, d) => this.setState({ modalPaymentAmount: d.value as any })}>
                        </Input><br />
                        <Dropdown
                            selection
                            options={this.paymentOptions}
                            value={this.state.modalPaymentType}
                            onChange={(e, d) => this.setState({ modalPaymentType: d.value as string })}>
                        </Dropdown>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='red' onClick={this.handleClose} inverted>
                            <Icon name='x' /> Cancel
                        </Button>
                        <Button color='green' onClick={this.handleSubmit} inverted>
                            <Icon name='checkmark' /> Confirm
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        );
    }
}