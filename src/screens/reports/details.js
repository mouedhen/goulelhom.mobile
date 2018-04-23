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

@translate(['reports', 'common'], {wait: true})
class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uri: null,
            lang: 'en',
            isRTL: false,
        };
    }

    componentDidMount() {
        languageDetector.detect((lang) => {
            this.state.lang = lang.split("-")[0];
            this.state.isRTL = (this.state.lang === 'ar');
            // TODO redirect on uri not defined
            let uri = 'https://drive.google.com/viewerng/viewer?embedded=true&url=' + 'http://www.africau.edu/images/default/sample.pdf';
            if (this.props.navigation.state.params !== undefined)
                uri = 'https://drive.google.com/viewerng/viewer?embedded=true&url=' + this.props.navigation.state.params.uri;
            this.setState({
                uri
            })
        });
    }

    render() {
        const {t} = this.props;
        if (this.state.uri === null) {
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
                    <Title>{t('reports:index.title')}</Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={{flex: 1}}>
                    <WebView
                        bounces={false}
                        scrollEnabled={false}
                        source={{ uri: this.state.uri }} />
                </View>
            </Container>
        );
    }
}

export default Details;
