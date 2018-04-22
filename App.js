import React from "react";
import Setup from "./src/boot/setup";
import { AppLoading } from 'expo';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf"),
        });
        this.setState({ loading: false });
    }

    render() {
        if (this.state.loading) {
            return <AppLoading />;
        }
        return <Setup />;
    }
}
