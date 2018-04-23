import React, { Component } from "react";
import { ImageBackground, View, StatusBar, Image } from "react-native";
import { Container, Button, H3, Text } from "native-base";

import { translate } from 'react-i18next';

import styles from "./styles";

const launchScreenBg = require("../../../assets/static/images/slider/slide_0.png");
const launchScreenLogo = require("../../../assets/static/images/logo.png");


@translate(['home', 'common'], { wait: true })
class Home extends Component {

    accessToApplication() {
        // TODO Redirect to user form if no user is saved
    }

    render() {
        const { t, i18n, navigation } = this.props;
        return (
            <Container>
                <StatusBar barStyle="light-content" />
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
                    <View style={{ marginBottom: 80 }}>
                        <Button
                            primary
                            style={{ alignSelf: "center" }}
                            onPress={() => this.props.navigation.navigate("DrawerOpen")}
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
