import * as React from "react";

export interface ButtonTestProps { text: string; action: any; }

export class ButtonTest extends React.Component<ButtonTestProps, {}> {
    render() {
        return (
            <div className="ButtonTest">
                <button onClick={this.props.action}>{this.props.text}</button>
            </div>
        );
    }
}