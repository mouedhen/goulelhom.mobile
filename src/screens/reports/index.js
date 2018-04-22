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

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            active: false,
            records: [],
        };
    }
    getRecords() {
        return fetch(apiUrl + 'reports')
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
                })
            })
            .catch(e => e)
    }
    componentDidMount() {
        this.getRecords();
    }

    /*

    <View style={{flex: 1}}>
        <WebView
            bounces={false}
            scrollEnabled={false}
            source={{ uri: 'https://drive.google.com/viewerng/viewer?embedded=true&url=' + 'http://www.africau.edu/images/default/sample.pdf' }} />
    </View>
     */
    render() {
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
                    <Title>Reports</Title>
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
                                    <Text style={{color: '#F2F2F2'}}>READ REPORT</Text>
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

export default Events;
