import React, {Component} from "react";
import {Image, WebView} from 'react-native';
import {
    View,
    Container,
    Header,
    Title,
    Text,
    Button,
    Icon,
    Left,
    Right,
    Body,
    Content,
    Card,
    CardItem,
} from "native-base";

import {ApiUtils} from "../../helpers/network";
import {apiUrl} from "../../config";

import {translate} from "react-i18next";
import {languageDetector} from "../../i18n";

@translate(['press', 'common'], {wait: true})
class Press extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            active: false,
            records: [],
            noRecords: false,
            lang: 'en',
        };
    }

    getRecords() {
        return fetch(apiUrl + 'press?lang=' + this.state.lang)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    records: responseJson.data.map(record => {
                        let cover = null;
                        if (record.attachments.length > 0) {
                            cover = record.attachments[0];
                        }
                        return {
                            ...record,
                            cover,
                            props: this.props
                        }
                    }),
                    noRecords: (responseJson.data.length < 1)
                })
            })
            .catch(e => e)
    }

    componentDidMount() {
        languageDetector.detect((lang) => {
            this.state.lang = lang.split("-")[0];
            this.getRecords();
        });
    }

    render() {
        const {t} = this.props;
        if (this.state.noRecords) {
            return (
                <Container>
                    <Header hasTabs>
                        <Left>
                            <Button
                                transparent
                                onPress={() => this.props.navigation.navigate("DrawerOpen")}
                            >
                                <Icon name="ios-menu"/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>{t('press:index.title')}</Title>
                        </Body>
                        <Right/>
                    </Header>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Icon style={{fontSize: 60, color: '#555'}} name="paper-plane" />
                        <Text style={{marginTop: 10, color: '#555', textAlign: 'center'}}>{t('press:index.no')}</Text>
                    </View>
                </Container>
            )
        }
        return (
            <Container>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.navigate("DrawerOpen")}
                        >
                            <Icon name="ios-menu"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{t('press:index.title')}</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content style={{backgroundColor: '#f2f2f2', padding: 10}}>
                    {this.state.records.map(function (data) {
                        return <Card key={data.id} style={{flex: 0, backgroundColor: '#fff'}}>
                            <CardItem>
                                <Body>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                    {data.name}
                                </Text>
                                {data.cover ? (
                                    <Image
                                        source={{uri: data.cover.uri}}
                                        style={{
                                            backgroundColor: '#9d9d9d',
                                            height: 400,
                                            width: '100%',
                                            flex: 1,
                                            alignSelf: 'center',
                                            marginTop: 10
                                        }}/>
                                ) : null
                                }
                                <Text style={{marginTop: 10}}>
                                    {data.description}
                                </Text>
                                <Button primary
                                        style={{alignSelf: "center", padding: 10, marginTop: 10}}
                                        onPress={() => data.props.navigation.navigate('PressDetails', {url: data.url})}>
                                    <Text style={{color: '#F2F2F2'}}>{t('press:index.read')}</Text>
                                </Button>
                                </Body>
                            </CardItem>
                        </Card>;
                    })}
                </Content>
            </Container>
        );
    }
}

export default Press;
