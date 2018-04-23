import React, {Component} from "react";
import {Dimensions, Image} from 'react-native';
import {
    Container,
    Header,
    Title,
    H1,
    Text,
    Button,
    Icon,
    Left,
    Right,
    Body,
    View,
    DeckSwiper,
    Content,
    Spinner,
} from "native-base";
import { MapView } from 'expo';

import styles from "./styles";

import {ApiUtils} from "../../helpers/network";
import {apiUrl} from "../../config";

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 36.8189700;
const LONGITUDE = 10.1657900;
const LATITUDE_DELTA = 0.4;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

import moment from 'moment'

class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            record: null,
            haveAttachments: false,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }
        };
    }

    getComplain(id) {
        return fetch(apiUrl + 'events/' + id)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    record: {
                        ...responseJson.data,
                    },
                    region: {
                        latitude: parseFloat(responseJson.data.latitude),
                        longitude: parseFloat(responseJson.data.longitude),
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                    haveAttachments: (responseJson.data.attachments.length > 0)
                });
                console.log(responseJson.data.attachments.length)
            })
            .catch(e => e)
    }

    componentDidMount() {
        let id = 1;
        if (this.props.navigation.state.params !== undefined)
            id = this.props.navigation.state.params.id;
        this.getComplain(id);
    }

    render() {
        if (this.state.record === null) {
            return (
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Spinner color='#c0392b'/>
                    <Text>Loading...</Text>
                </View>
            )
        }
        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.goBack(null)}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Event Details</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content style={{padding: 20}}>
                    <H1>{this.state.record.title}</H1>
                    <Text note>Date : {moment(this.state.record.start_date).format('L')}</Text>
                    {this.state.haveAttachments ? (
                        <View style={{height: 320}}>
                            <DeckSwiper
                                dataSource={this.state.record.attachments}
                                renderItem={item =>
                                    <Image
                                        source={{uri: item.uri}}
                                        style={{
                                            backgroundColor: '#9d9d9d',
                                            height: 300,
                                            width: '100%',
                                            alignSelf: 'center',
                                            marginTop: 10
                                        }}/>
                                }
                            />
                        </View>
                    ) : null}
                    <Text>{this.state.record.description}</Text>
                    <MapView
                        style={{...styles.mapForm, marginTop: 10}}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        loadingEnabled={true}
                        region={this.state.region}
                    >
                        <MapView.Marker coordinate={this.state.region}/>
                        <MapView.Circle
                            radius={600}
                            strokeColor={'#74b9ff'}
                            fillColor={'#74b9ff'}
                            center={this.state.region}
                        />
                    </MapView>
                </Content>
            </Container>
        );
    }
}

export default Details;
