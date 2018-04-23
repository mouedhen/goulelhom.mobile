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
import {translate, I18n} from "react-i18next";
import {languageDetector} from "../../i18n";

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 36.8189700;
const LONGITUDE = 10.1657900;
const LATITUDE_DELTA = 0.4;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

@translate(['complains', 'common'], {wait: true})
class Complains extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: true,
            active: false,
            complains: [],
            geoComplains: [],
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            noRecords: false,
            lang: 'en'
        };
    }

    getComplains() {
        return fetch(apiUrl + 'complains?lang=' + this.state.lang)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    geoComplains: responseJson.data.filter(claim => claim.latitude !== null).map(claim => {
                        return {
                            id: claim.id,
                            title: claim.subject,
                            description: claim.description,
                            color: claim.theme.color,
                            latitude: parseFloat(claim.latitude),
                            longitude: parseFloat(claim.longitude),
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }
                    }),
                    complains: responseJson.data.map(claim => {
                        let cover = null;
                        if (claim.attachments.length > 0) {
                            cover = claim.attachments[0];
                        }
                        return {
                            ...claim,
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
            this.getComplains();
        });
    }

    render() {
        const {t} = this.props;
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
                    <Title>{t('complains:index.title')}</Title>
                    </Body>
                    <Right/>
                </Header>
                <Tabs tabBarUnderlineStyle={{backgroundColor: '#b71c1c'}} tabBarPosition={'top'}>
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
                                {this.state.geoComplains.map(function (data) {
                                    return <MapView.Marker
                                        coordinate={data}
                                        title={data.title}
                                        description={data.description}
                                        key={data.id}
                                        pinColor={data.color}
                                    />;
                                })}
                            </MapView>

                            <Button style={styles.button} full Info
                                    onPress={() => this.props.navigation.navigate('ComplainsForm')}>
                                <Text>{t('complains:index.action')}</Text>
                            </Button>
                        </View>
                    </Tab>
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
                                <Text style={{marginTop: 10, color: '#555'}}>{t('complains:index.noComplains')}</Text>
                            </View>
                        ) : (
                            <Content style={{backgroundColor: '#f2f2f2', padding: 10}}>
                                {this.state.complains.map(function (data) {
                                    return <Card key={data.id} style={{flex: 0, backgroundColor: '#fff'}}>
                                        <CardItem>
                                            <Body>
                                            <Text style={{fontWeight: 'bold', color: data.theme.color, fontSize: 20}}>
                                                {data.subject}
                                            </Text>
                                            <Text note>{data.municipality.name}</Text>
                                            <Text note>{data.theme.name}</Text>
                                            {data.cover ? (
                                                <Image
                                                    source={{uri: data.cover.url}}
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
                                                    onPress={() => data.props.navigation.navigate('ComplainsDetails', {id: data.id})}>
                                                <Text style={{color: '#F2F2F2'}}>{t('common:details')}</Text>
                                            </Button>
                                            </Body>
                                        </CardItem>
                                    </Card>;
                                })}
                            </Content>
                        )}
                    </Tab>
                </Tabs>
            </Container>
        );
    }
}

export default Complains;
