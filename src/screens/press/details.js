import React, {Component} from "react";
import {WebView} from 'react-native';
import {
    Container,
    Header,
    Title,
    Text,
    Button,
    Icon,
    Left,
    Right,
    Body,
    View,
    Spinner,
} from "native-base";

import styles from "./styles";
import {translate} from "react-i18next";
import {languageDetector} from "../../i18n";

@translate(['press', 'common'], {wait: true})
class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            url: null,
            lang: 'en',
            isRTL: false,
        };
    }

    componentDidMount() {
        languageDetector.detect((lang) => {
            this.state.lang = lang.split("-")[0];
            this.state.isRTL = (this.state.lang === 'ar');
            let url = 'https://www.goulelhom.org/';
            if (this.props.navigation.state.params !== undefined)
                url = this.props.navigation.state.params.url;
            this.setState({
                url
            })
        });
    }

    render() {
        const {t} = this.props;
        if (this.state.url === null) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Spinner color='#c0392b'/>
                    <Text>{t('common:loading')}</Text>
                </View>
            )
        }
        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name={this.state.isRTL ? "arrow-forward" : "arrow-back" }/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{t('press:details.title')}</Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={{flex: 1}}>
                    <WebView
                        source={{
                            uri: this.state.url,
                        }}
                        startInLoadingState
                        scalesPageToFit
                        javaScriptEnabled
                        style={{ flex: 1 }}
                    />
                </View>
            </Container>
        );
    }
}

export default Details;
