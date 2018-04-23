import React, {Component} from "react";
import {Root} from 'native-base'
import {StackNavigator, DrawerNavigator} from 'react-navigation'
import {translate} from 'react-i18next';
import i18n from './i18n';

import SideBar from './screens/sidebar'
import Home from './screens/home'
import Complains from './screens/complains'
import ComplainsDetails from './screens/complains/details'
import ComplainsForm from './screens/complains/form'
import Petitions from './screens/petitions'
import PetitionsDetails from './screens/petitions/details'
import PetitionsForm from './screens/petitions/form'
import Events from './screens/events'
import EventsDetails from './screens/events/details'
import Municipalities from './screens/municipalities'
import MunicipalitiesDetails from './screens/municipalities/details'
import Reports from './screens/reports'
import ReportsDetails from './screens/reports/details'
import Press from './screens/press'
import PressDetails from './screens/press/details'
import Settings from './screens/settings'
import UserSettings from './screens/settings/user'

import {NetInfo, Alert} from "react-native";

const Drawer = DrawerNavigator(
    {
        Home: {screen: Home},
        Complains: {screen: Complains},
        ComplainsDetails: {screen: ComplainsDetails},
        ComplainsForm: {screen: ComplainsForm},
        Petitions: {screen: Petitions},
        PetitionsDetails: {screen: PetitionsDetails},
        PetitionsForm: {screen: PetitionsForm},
        Events: {screen: Events},
        EventsDetails: {screen: EventsDetails},
        Municipalities: {screen: Municipalities},
        MunicipalitiesDetails: {screen: MunicipalitiesDetails},
        Reports: {screen: Reports},
        ReportsDetails: {screen: ReportsDetails},
        Press: {screen: Press},
        PressDetails: {screen: PressDetails},
        Settings: {screen: Settings},
        UserSettings: {screen: UserSettings},
    },
    {
        initialRouteName: "Home",
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

const WrappedStack = () => {
    return (
        <Root>
            <AppNavigator screenProps={{t: i18n.getFixedT()}}/>
        </Root>
    )
};

const ReloadAppOnLanguageChange = translate('common', {
    bindI18n: 'languageChanged',
    bindStore: false
})(WrappedStack);

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
            <ReloadAppOnLanguageChange/>
        );
    }
}

export default App;