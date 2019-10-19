import * as React from "react";
import { Hello } from "./components/Hello";

import "./style.less";

export interface AppProps { title: "React App!" }

export class App extends React.Component<AppProps, {}> {
    componentDidMount() {
        console.info(`Hi ${this.props.title}`);
    }

    render() {
        return (
            <div id="App">
                <Hello compiler="TypeScript" framework="React" />
            </div>
        );
    }
}