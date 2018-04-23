import React, {Component} from "react";
import {ImageBackground, View, StatusBar, Image, AsyncStorage} from "react-native";
import {Container, Button, H3, Text} from "native-base";

import {translate} from 'react-i18next';

import styles from "./styles";
import UserSettings from "../settings/user";
import {apiUrl} from "../../config";
import {ApiUtils} from "../../helpers/network";

const launchScreenBg = require("../../../assets/static/images/slider/slide_0.png");
const launchScreenLogo = require("../../../assets/static/images/logo.png");


@translate(['home', 'common'], {wait: true})
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            name: null,
            email: null,
            is_connected: false,
        };
    }

    componentWillMount() {
        this.checkUser()
    }

    accessToApplication() {
        if (this.state.is_connected) {
            this.props.navigation.navigate("DrawerOpen");
            return
        }
        this.props.navigation.navigate("UserSettings")
    }

    checkUser() {
        return AsyncStorage.getItem('@User:id')
            .then(id => {
                if (id !== null) {
                    this.setState({
                        id: parseInt(id),
                    });
                }
                AsyncStorage.getItem('@User:name')
                    .then(name => {
                        if (name !== null) {
                            this.setState({
                                name,
                            });
                        }
                        AsyncStorage.getItem('@User:email')
                            .then(email => {
                                if (email !== null) {
                                    this.setState({
                                        email,
                                    });
                                }
                                this.setState({
                                    is_connected: (
                                        (this.state.id !== null) &&
                                        (this.state.name !== null) &&
                                        (this.state.email !== null)
                                    )
                                })
                            })
                    })


            })
    }

    // @TODO Implement online user identity control
    // checkUserID(id) {
    //     return fetch(apiUrl + 'contacts/' + id)
    //         .then(ApiUtils.checkStatus)
    //         .then(response => response.json())
    //         .then(responseJson => {
    //         })
    //         .catch(e => {
    //             this.state.is_connected = false
    //         })
    // }

    render() {
        const {t, i18n, navigation} = this.props;
        return (
            <Container>
                <StatusBar barStyle="light-content"/>
                <ImageBackground source={launchScreenBg} style={styles.imageContainer}>
                    <View style={styles.logoContainer}>
                        <Image
                            style={{width: 310, height: 190, alignSelf: "center"}}
                            source={launchScreenLogo}
                        />
                    </View>
                    <View
                        style={{
                            alignItems: "center",
                            marginBottom: 50,
                            backgroundColor: "transparent",
                            paddingHorizontal: 30
                        }}
                    >
                        <H3 style={styles.text}>{t('home:quote')}</H3>
                    </View>
                    <View style={{marginBottom: 80}}>
                        <Button
                            primary
                            style={{alignSelf: "center"}}
                            // onPress={() => this.props.navigation.navigate("DrawerOpen")}
                            onPress={this.accessToApplication.bind(this)}
                        >
                            <Text>{t('home:action')}</Text>
                        </Button>
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}

export default Home;
