import * as React from 'react';
import * as Server from '../../Server';
import { Guest as GuestDto } from '../../dtos/Guest.dto';
import { RouteComponentProps } from 'react-router';

interface CreateGuestDivProps {
    guest: GuestDto,
    onInputChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export class CreateGuestDiv extends React.Component<CreateGuestDivProps & React.HTMLProps<HTMLDivElement>, {}> {

    validatePesel = (e: any) => {
        const value = e.target.value;
        if (value.toString().length != 11 && value.toString().length > 0) {
            e.target.closest('div').classList.add("error");
        } else {
            e.target.closest('div').classList.remove("error");
        }
    }

    render() {
        const guest = this.props.guest;
        const onInputChange = this.props.onInputChange;
        if (!guest) return (<div />);
        return (
            <div className={this.props.className}>
                <h4 className="ui dividing header">Create Guest</h4>
                <label>Name</label>
                <div className="three fields">
                    <div className="field">
                        <input type="text" name="firstname" placeholder="First Name"
                            value={guest.firstname || ''} onChange={onInputChange} />
                    </div>
                    <div className="field">
                        <input type="text" name="lastname" placeholder="Last Name"
                            value={guest.lastname || ''} onChange={onInputChange} />
                    </div>
                </div>
                <label>Contact</label>
                <div className="three fields">
                    <div className="field">
                        <div className="ui input left icon">
                            <i className='mobile alternate icon' />
                            <input type="tel" name="phoneNumber" placeholder="Phone Number"
                                value={guest.phoneNumber || ''} onChange={onInputChange} required />
                        </div>
                    </div>
                    <div className="field">
                        <div className="ui input left icon">
                            <i className='mail icon' />
                            <input type="email" name="email" placeholder="Email Address"
                                value={guest.email || ''} required 
                                onChange={onInputChange} />
                        </div>
                    </div>
                </div>
                <label>Address</label>
                <div className="three fields">
                    <div className="field">
                        <input type="text" name="city" placeholder="City"
                            value={guest.city || ''} onChange={onInputChange} />
                    </div>
                    <div className="field">
                        <input type="text" name="streetName" placeholder="Street"
                            value={guest.streetName || ''} onChange={onInputChange} />
                    </div>
                </div>
                <label>Pesel</label>
                <div className="three fields">
                    <div className="ui input field">
                        <input type="number" name="pesel" placeholder="Pesel"
                            value={guest.pesel || ''} onChange={onInputChange}
                            minLength={11} maxLength={11} onInput={this.validatePesel} />
                    </div>
                </div>
                <label>Additional Guest Info</label>
                <div className="field">
                    <textarea name="additionalGuestInfo"
                        value={guest.additionalGuestInfo || ''} onChange={onInputChange} />
                </div>
                {this.props.children}
            </div>
        );
    }
}

interface CreateGuestViewProps { refresh: Function }
interface CreateGuestViewState { guest: GuestDto }

export class CreateGuestView extends React.Component<CreateGuestViewProps & RouteComponentProps, CreateGuestViewState> {
    constructor() {
        super(undefined, undefined);
        this.state = { guest: null };
    }

    componentDidMount() {
        this.setState({ guest: new GuestDto() });
    }

    onReset = () => {
        this.setState({ guest: new GuestDto() });
    }

    onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const newGuest = this.state.guest;
            const response = await Server.Post(`guest/`, { guest: newGuest });
            this.props.refresh();
            this.props.history.push(`/guests/${response.data.id}`);
        } catch (error) {
            console.error(error);
        }
    }

    onGuestInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        const guest: any = Object.assign({}, this.state.guest);
        guest[name] = value;
        this.setState({ guest: guest });
    }

    clearForm = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log(event);
    }

    render() {
        return (
            <form className="ui form" onSubmit={this.onSubmit} onReset={this.onReset} method="post">
                <CreateGuestDiv guest={this.state.guest} onInputChange={this.onGuestInputChange}>
                    <button className="ui teal button" type="submit">Create</button>
                    <button className="ui white button" type="reset">Clear</button>
                </CreateGuestDiv>
            </form>
        );
    }
}