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

import moment from 'moment'
import {languageDetector} from "../../i18n";
import {translate} from "react-i18next";

@translate(['reports', 'common'], {wait: true})
class Reports extends Component {

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
        return fetch(apiUrl + 'reports?lang=' + this.state.lang)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    records: responseJson.data.map(event => {
                        return {
                            ...event,
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
                        <Title>{t('reports:index.title')}</Title>
                        </Body>
                        <Right/>
                    </Header>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Icon style={{fontSize: 60, color: '#555'}} name="paper-plane"/>
                        <Text style={{marginTop: 10, color: '#555'}}>{t('reports:no')}</Text>
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
                    <Title>{t('reports:index.title')}</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content style={{backgroundColor: '#f2f2f2', padding: 10}}>
                    {this.state.records.map(function (data) {
                        return <Card key={data.id} style={{flex: 0, backgroundColor: '#fff'}}>
                            <CardItem>
                                <Body>
                                <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                    {data.title}
                                </Text>
                                <Text note>Date : {moment(data.published_at).format("L")}</Text>
                                {data.thumb_uri ? (
                                    <Image
                                        source={{uri: data.thumb_uri}}
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
                                        onPress={() => data.props.navigation.navigate('ReportsDetails', {uri: data.document_uri})}>
                                    <Text style={{color: '#F2F2F2'}}>{t('reports:index.read')}</Text>
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

export default Reports;
