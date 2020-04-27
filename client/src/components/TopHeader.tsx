import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface TopHeaderProps { }

export class TopHeader extends React.Component<TopHeaderProps & RouteComponentProps & React.HTMLProps<HTMLDivElement>, {}> {
    render() {
        return (
            <div className={this.props.className}>
                <div className="ui equal width grid">
                    <div className="left aligned column">
                        <button className="ui icon button" onClick={this.props.history.goBack}>
                            <i className="left arrow icon" />
                        </button>
                    </div>
                    <div className="ten wide column">
                        <header className="ui header centered">
                            <h2>{this.props.children}</h2>
                        </header>
                    </div>
                    <div className="right aligned column">
                        <button className="ui icon button" onClick={e => this.props.history.push(`/settings`)}>
                            <i className="cogs icon" />
                        </button>
                        <button className="ui icon button" onClick={e => this.props.history.push(`/user`)}>
                            <i className="user icon" />
                        </button>
                    </div>
                </div>
                <div className="ui divider" />
            </div>
        );
    }
}
