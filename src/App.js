import React, { Component } from "react";
import {Root} from 'native-base'
import {StackNavigator, DrawerNavigator} from 'react-navigation'

import SideBar from './screens/sidebar'
import Home from './screens/home'
import Complains from './screens/complains'
import ComplainsDetails from './screens/complains/complains-details'
import ComplainsForm from './screens/complains/form'
import Settings from './screens/settings'
import UserSettings from './screens/settings/user'

import {NetInfo, Alert} from "react-native";

const Drawer = DrawerNavigator(
    {
        Home: {screen: Home},
        Complains: {screen: Complains},
        ComplainsDetails: {screen: ComplainsDetails},
        ComplainsForm: {screen: ComplainsForm},
        Settings: {screen: Settings},
        UserSettings: {screen: UserSettings},
    },
    {
        initialRouteName: "ComplainsForm",
        contentOptions: {
            activeTintColor: "#e91e63"
        },
        contentComponent: props => <SideBar {...props} />
    }
);

const AppNavigator = StackNavigator(
    {
        Drawer: {screen: Drawer},
    },
    {
        initialRouteName: "Drawer",
        headerMode: "none"
    }
);

class App extends Component {

    handleFirstConnectivityChange(connectionInfo) {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (!isConnected) {
                Alert.alert(
                    'Error connection',
                    'You need to be connected to the internet to use the application...',
                )
            }
        });
        NetInfo.removeEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    componentDidMount() {
        NetInfo.isConnected.fetch().then(isConnected => {
            if (!isConnected) {
                Alert.alert(
                    'Error connection',
                    'You need to be connected to the internet to use the application...',
                )
            }
        });
        NetInfo.addEventListener(
            'connectionChange',
            this.handleFirstConnectivityChange
        );
    }

    render() {
        return (
            <Root>
                <AppNavigator/>
            </Root>
        );
    }
}

export default App;