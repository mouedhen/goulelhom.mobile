import React, {Component} from "react";
import {Dimensions, Image} from 'react-native';
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
    Tabs,
    Tab,
    TabHeading,
    Content,
    Card,
    CardItem,
} from "native-base";
import {MapView} from 'expo';

import styles from "./styles";

import {ApiUtils} from "../../helpers/network";
import {apiUrl} from "../../config";

import moment from 'moment'

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 36.8189700;
const LONGITUDE = 10.1657900;
const LATITUDE_DELTA = 0.4;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Events extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            active: false,
            records: [],
            geoRecords: [],
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            noRecords: false,
        };
    }

    getRecords() {
        return fetch(apiUrl + 'events')
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    geoRecords: responseJson.data.filter(event => event.latitude !== null).map(event => {
                        return {
                            id: event.id,
                            title: event.title,
                            description: event.description,
                            latitude: parseFloat(event.latitude),
                            longitude: parseFloat(event.longitude),
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }
                    }),
                    records: responseJson.data.map(event => {
                        let cover = null;
                        if (event.attachments.length > 0) {
                            cover = event.attachments[0];
                        }
                        return {
                            ...event,
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
        this.getRecords();
    }

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
                    <Title>Events</Title>
                    </Body>
                    <Right/>
                </Header>
                <Tabs tabBarUnderlineStyle={{backgroundColor: '#b71c1c'}} tabBarPosition={'top'}>
                    <Tab heading={
                        <TabHeading style={{backgroundColor: '#F2F2F2'}}>
                            <Icon name="albums" style={{color: '#b71c1c'}}/>
                        </TabHeading>
                    }>
                        {this.state.noRecords ? (
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Icon style={{fontSize: 60, color: '#555'}} name="paper-plane"/>
                                <Text style={{marginTop: 10, color: '#555'}}>No events until now, come back
                                    later...</Text>
                            </View>
                        ) : (
                            <Content style={{backgroundColor: '#f2f2f2', padding: 10}}>
                                {this.state.records.map(function (data) {
                                    return <Card key={data.id} style={{flex: 0, backgroundColor: '#fff'}}>
                                        <CardItem>
                                            <Body>
                                            <Text style={{fontWeight: 'bold', fontSize: 20}}>
                                                {data.title}
                                            </Text>
                                            <Text note>Date : {moment(data.start_date).format("L")}</Text>
                                            {data.cover ? (
                                                <Image
                                                    source={{uri: data.cover.uri}}
                                                    style={{
                                                        backgroundColor: '#9d9d9d',
                                                        height: 200,
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
                                                    onPress={() => data.props.navigation.navigate('EventsDetails', {id: data.id})}>
                                                <Text style={{color: '#F2F2F2'}}>DETAILS</Text>
                                            </Button>
                                            </Body>
                                        </CardItem>
                                    </Card>;
                                })}
                            </Content>
                        )}
                    </Tab>
                    <Tab heading={
                        <TabHeading style={{backgroundColor: '#F2F2F2'}}>
                            <Icon name="map" style={{color: '#b71c1c'}}/>
                        </TabHeading>
                    }>
                        <View style={styles.view}>
                            <MapView
                                style={styles.map}
                                showsUserLocation={true}
                                showsMyLocationButton={false}
                                loadingEnabled={true}
                                region={this.state.region}
                            >
                                {this.state.geoRecords.map(function (data) {
                                    return <MapView.Marker
                                        coordinate={data}
                                        title={data.title}
                                        description={data.description}
                                        key={data.id}
                                        pinColor={data.color}
                                    />;
                                })}
                            </MapView>
                        </View>
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default Events;
