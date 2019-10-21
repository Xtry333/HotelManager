import * as React from 'react';

class Home extends React.Component {
    render() {
        const user = JSON.parse(localStorage.getItem('user')) || {};
        return (
            <div className="Home">
                <header className="Home-header">
                    <h2>Hello {user.firstname}</h2>
                    <p>Choose your path</p>
                </header>
            </div>
        );
    }
}

export default Home;