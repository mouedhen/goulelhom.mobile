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
import {translate} from "react-i18next";
import {languageDetector} from "../../i18n";

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 36.8189700;
const LONGITUDE = 10.1657900;
const LATITUDE_DELTA = 0.4;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

@translate(['complains', 'common'], {wait: true})
class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            complain: null,
            haveAttachments: false,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            lang: 'en',
            isRTL: false,
        };
    }

    getComplain(id) {
        return fetch(apiUrl + 'complains/' + id + '?lang=' + this.state.lang)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    complain: {
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
            })
            .catch(e => e)
    }

    componentDidMount() {
        languageDetector.detect((lang) => {
            this.state.lang = lang.split("-")[0];
            this.state.isRTL = (this.state.lang === 'ar');
            let id = 1;
            if (this.props.navigation.state.params !== undefined)
                id = this.props.navigation.state.params.id;
            this.getComplain(id);
        });
    }

    render() {
        const {t} = this.props;
        if (this.state.complain === null) {
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
                    <Title>{t('complains:details.title')}</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content style={{padding: 20}}>
                    <H1>{this.state.complain.subject}</H1>
                    <Text note>{this.state.complain.municipality.name}</Text>
                    <Text note>{this.state.complain.theme.name}</Text>
                    {this.state.haveAttachments ? (
                        <View style={{height: 320}}>
                            <DeckSwiper
                                dataSource={this.state.complain.attachments}
                                renderItem={item =>
                                    <Image
                                        source={{uri: item.url}}
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
                    <Text>{this.state.complain.description}</Text>
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
