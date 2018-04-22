import React, { Component } from "react";
import { ImageBackground, View, StatusBar, Image } from "react-native";
import { Container, Button, H3, Text } from "native-base";

import styles from "./styles";

const launchScreenBg = require("../../../assets/static/images/slider/slide_0.png");
const launchScreenLogo = require("../../../assets/static/images/logo.png");

class Home extends Component {

    accessToApplication() {
        // TODO Redirect to user form if no user is saved
    }

    render() {
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
                            backgroundColor: "transparent"
                        }}
                    >
                        <H3 style={styles.text}>Peoples' power is stronger than the people in the power</H3>
                    </View>
                    <View style={{ marginBottom: 80 }}>
                        <Button
                            primary
                            style={{ alignSelf: "center" }}
                            onPress={() => this.props.navigation.navigate("DrawerOpen")}
                        >
                            <Text>Enter</Text>
                        </Button>
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}

export default Home;
