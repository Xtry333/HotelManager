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
export interface LoginState { loginError: string, username: string, password: string }

export class Login extends React.Component<LoginProps & RouteComponentProps, LoginState> {
    state = { loginError: '', username: '', password: '' };

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
                const oldLoc = this.props.location;
                this.props.history.push('/');
                this.props.history.push(oldLoc);
            } else {
                this.setState({ loginError: 'Invalid password' });
            }
        }).catch(error => {
            if (error.response.status === 406) {
                this.setState({ loginError: 'Invalid password' });

            }
            console.error(error.response.status);
        });
    }

    validateForm = () => {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        const value = event.target.value;
        if (name === 'username') { this.setState({ username: value }); }
        if (name === 'password') { this.setState({ password: value }); }
    }

    render() {
        if (isUserLogged()) {
            return (<Redirect to='/' />);
        }
        return (
            <div className='ui middle aligned center aligned grid'>
                <div className='six wide column' style={{ marginTop: '55px' }}>
                    <header className='ui segment'>
                        <h2 className='ui header'>Hello</h2>
                        <p>Please login to use this App.</p>
                    </header>
                    <form className='ui large form' method='post' onSubmit={this.onSubmit}>
                        <div className='ui stacked segment'>
                            <div className="field">
                                <div className='ui left icon input'>
                                    <input name='username' type='text' placeholder='Username' value={this.state.username} onChange={this.onChange} />
                                    <i className="user icon"></i>
                                </div>
                            </div>
                            <div className="field">
                                <div className='ui left icon input'>
                                    <input name='password' className={this.state.loginError ? ' error' : ''} type='password' placeholder='Password' value={this.state.password} onChange={this.onChange} />
                                    <i className="lock icon"></i>
                                </div>
                                {this.state.loginError ? (<div className='ui error red basic label pointing up fluid'>
                                    {this.state.loginError}
                                </div>) : (<div />)}
                            </div>
                            <button type='submit' className='ui fluid large gray submit button' disabled={!this.validateForm()}>Login</button>

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

export function SystemLogout() {
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
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
}