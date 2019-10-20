import * as React from "react";
import { Hello } from "./components/Hello";

import "./style.less";
import { ButtonTest } from "./components/ButtonTest";

export interface AppProps { title: string }

export class App extends React.Component<AppProps, {}> {

    buttonOnClick() {
        console.log("Click!");
    }

    componentDidMount() {
        console.info(`Hi ${this.props.title}!`);
    }

    render() {
        return (
            <div id="App">
                <Hello compiler="TypeScript" framework="React" />
                <ButtonTest text="Click me" action={this.buttonOnClick} />
                <ButtonTest text="Click 2" action={this.buttonOnClick} />
                <ButtonTest text="Click abc" action={this.buttonOnClick} />
            </div>
        );
    }
}