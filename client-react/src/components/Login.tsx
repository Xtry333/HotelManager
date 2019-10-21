import * as React from 'react';
import Server from '../Server';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import * as Crypto from 'crypto';

export const isUserLogged = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        //this.setState({ token, user });
        if (user && token && user.username) {
            return true;
        }
    } catch (error) {
        return false;
    }
    return false;
}

export interface LoginProps { }
export interface LoginState { loginError: boolean, username: string, password: string }

export class Login extends React.Component<LoginProps & RouteComponentProps, LoginState> {
    state = { loginError: false, username: '', password: '' };

    onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const sha256 = Crypto.createHash('sha256');
        const passwordHash = sha256.update(this.state.password).digest('hex');
        Server.post('/login', { username: this.state.username, passwordHash }).then(res => {
            if (res.data) {
                const user = res.data.user;
                const token = res.data.token;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                this.props.history.push('/');
            } else {
                this.setState({ loginError: true });
            }
        }).catch(error => {
            console.error(error);
        });
    }

    validateForm = () => {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'username') { this.setState({ [name]: value }); }
        if (name === 'password') { this.setState({ [name]: value }); }
    }

    render() {
        if (isUserLogged()) {
            return (<Redirect to='/'/>);
        }
        return (
            <div className='Login'>
                <header className='Login-header'>
                    <h2>Hello</h2>
                    <p>Please login</p>
                </header>
                <div>
                    <form className='Login-form' method='post' onSubmit={this.onSubmit}>
                        <div className='Login-input'>
                            <input name='username' type='text' placeholder='Username' value={this.state.username} onChange={this.onChange} />
                        </div>
                        <div className='Login-input'>
                            <input name='password' className={this.state.loginError ? 'invalid' : ''} type='password' placeholder='Password' value={this.state.password} onChange={this.onChange} />
                        </div>
                        <button type='submit' disabled={!this.validateForm()}>Login</button>
                        <div className='Login-error'>
                            {this.state.loginError}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export class Logout extends React.Component<{}, {}> {
    render() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            if (user) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                if (token) {
                    Server.delete('/token', { data: { token } });
                }
            }
        } catch (error) { }
        return (<Redirect to='/login' />);
    }
}