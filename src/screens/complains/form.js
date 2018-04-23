import React, {Component} from "react";
import {
    View,
    Spinner,
    Container,
    Header,
    Title,
    Button,
    Left,
    Right,
    Body,
    Icon,
    Text,
    Form,
    Item,
    Label,
    Input,
    Picker,
    Content,
    List,
    ListItem,
    Thumbnail,
    Grid,
    Col, Toast,
} from "native-base";

// import ImagePicker from 'react-native-image-picker';
import {ImagePicker} from 'expo'
//import MapView from 'react-native-maps';
import {MapView} from 'expo';

import styles from "./styles";
import {ApiUtils} from "../../helpers/network";
import {apiUrl} from "../../config";
import {Dimensions, AsyncStorage} from "react-native";
import {translate} from "react-i18next";
import {languageDetector} from "../../i18n";

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 36.8189700;
const LONGITUDE = 10.1657900;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

@translate(['complains', 'common'], {wait: true})
class ComplainsFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contact_id: -1,
            theme_id: null,
            municipality_id: null,
            subject: '',
            description: '',
            latitude: null,
            longitude: null,
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            images: [],
            videos: [],
            municipalities: [],
            themes: [],
            loading: false,
            lang: 'en',
            isRTL: false,
            validation: {
                subject: true,
                municipality_id: true,
                theme_id: true,
                description: true,
            }
        };
    }

    validForm() {
        this.setState({
            validation: {
                subject: (this.state.subject !== '' && this.state.subject !== null),
                municipality_id: (Number.isInteger(this.state.municipality_id) && this.state.municipality_id > 0),
                theme_id: (Number.isInteger(this.state.theme_id) && this.state.theme_id > 0),
                description: (this.state.description !== '' && this.state.description !== null),
            }
        });
        return (
            this.state.validation.subject &&
            this.state.validation.municipality_id &&
            this.state.validation.theme_id &&
            this.state.description
        )
    }

    componentDidMount() {
        languageDetector.detect((lang) => {
            this.state.lang = lang.split("-")[0];
            this.state.isRTL = (this.state.lang === 'ar');
            this.getMunicipalities().catch(e => e);
            this.getThemes().catch(e => e);
            this.locateUser();
            this.getUserId();
        });
    }

    submitComplain() {
        if (!this.validForm()) {
            Toast.show({
                text: this.props.t('common:validation'),
                type: "danger"
            });
            return;
        }

        let complain = {
            contact_id: this.state.contact_id,
            theme_id: this.state.theme_id,
            municipality_id: this.state.municipality_id,
            subject: this.state.subject,
            description: this.state.description,
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
        };
        this.setState({loading: true});
        return fetch(apiUrl + 'complains?lang=' + this.state.lang, {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(complain)
        })
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.state.images.forEach(attachment => {
                    this.uploadComplainsAttachment(responseJson.data.id, attachment)
                });
                this.setState({loading: false});
                this.props.navigation.navigate('ComplainsDetails', {id: responseJson.data.id})
            })
            .catch(e => {
                this.setState({loading: false});
            })
    }

    uploadComplainsAttachment(id, attachment) {
        const data = new FormData();
        const url = apiUrl + 'complains/' + id + '/upload?lang=' + this.state.lang;
        let uri = attachment.uri;
        let uriParts = uri.split('.');
        let fileType = uriParts[uriParts.length - 1];

        data.append('file', {
            uri: attachment.uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
        });
        fetch(url, {
            method: 'post',
            headers: {
                ContentType: 'multipart/form-data',
                Accept: 'application/json',
            },
            body: data
        }).then(res => {
            // console.log(res)
        }).catch(e => {
            // console.log(e)
        });
    }

    getUserId() {
        AsyncStorage.getItem('@User:id')
            .then((id) => {
                if (id !== null)
                    this.setState({
                        contact_id: parseInt(id),
                    });
                else
                    this.props.navigation.navigate('UserSettings')
            });
    }

    locateUser() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    },
                });
            },
            (error) => {
                // console.log(error.message)
            },
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
    }

    onRegionChange(region) {
        this.setState({
            region: {
                latitude: region.latitude,
                longitude: region.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
        });
    }

    async getMunicipalities() {
        return fetch(apiUrl + 'municipalities?lang=' + this.state.lang)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    municipalities: responseJson.data,
                    municipality_id: (responseJson.data[0] ? responseJson.data[0].id : null)
                })
            })
            .catch(e => e)
    }

    async getThemes() {
        return fetch(apiUrl + 'themes?lang=' + this.state.lang)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    themes: responseJson.data,
                    theme_id: (responseJson.data[0] ? responseJson.data[0].id : null)
                })
            })
            .catch(e => {
                Toast.show({
                    text: this.props.t('common:validation'),
                    type: "danger"
                });
            })
    }

    attachFromGallery() {
        ImagePicker.launchImageLibraryAsync({allowsEditing: false,}).then(response => {
            this.setState({
                images: this.state.images.concat([response])
            })
        });
    }

    attachFromCamera() {
        ImagePicker.launchCameraAsync({allowsEditing: false,}).then(response => {
            this.setState({
                images: this.state.images.concat([response])
            })
        });
    }

    render() {
        const {t} = this.props;
        if (this.state.loading) {
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
                            <Icon name={this.state.isRTL ? "arrow-forward" : "arrow-back"}/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{t('complains:form.title')}</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content style={{padding: 10}}>
                    <Form>
                        <Item floatingLabel error={(!this.state.validation.subject)}>
                            <Label>{t('complains:form.subject')}</Label>
                            <Input
                                onChangeText={(subject) => this.setState({subject})}
                                value={this.state.subject}
                            />
                        </Item>
                        <Picker
                            mode="dialog"
                            placeholder={t('complains:form.theme')}
                            note={false}
                            selectedValue={this.state.theme_id}
                            onValueChange={(theme_id) => this.setState({theme_id})}
                            style={{marginTop: 10, marginHorizontal: 10}}
                        >
                            {this.state.themes.map(function (data) {
                                return <Picker.Item label={data.name} value={data.id} key={data.id}/>;
                            })}
                        </Picker>

                        <Picker
                            mode="dialog"
                            placeholder={t('complains:form.municipality')}
                            note={false}
                            selectedValue={this.state.municipality_id}
                            onValueChange={(municipality_id) => this.setState({municipality_id})}
                            style={{marginTop: 10, marginHorizontal: 10}}
                        >
                            {this.state.municipalities.map(function (data) {
                                return <Picker.Item label={data.name} value={data.id} key={data.id}/>;
                            })}
                        </Picker>
                        <Item floatingLabel error={(!this.state.validation.description)}>
                            <Label>{t('complains:form.description')}</Label>
                            <Input
                                onChangeText={(description) => this.setState({description})}
                                value={this.state.description}
                                multiline={true}
                                numberOfLines={3}
                            />
                        </Item>
                        <Grid style={{marginTop: 10}}>
                            <Col>
                                <Button full light iconLeft
                                        onPress={this.attachFromGallery.bind(this)}>
                                    <Icon name='images'/>
                                </Button>
                            </Col>
                            <Col>
                                <Button full light iconLeft
                                        onPress={this.attachFromCamera.bind(this)}>
                                    <Icon name='camera'/>
                                </Button>
                            </Col>
                        </Grid>

                        <MapView
                            style={styles.mapForm}
                            showsUserLocation={true}
                            showsMyLocationButton={false}
                            loadingEnabled={true}
                            region={this.state.region}
                            onLongPress={(e) => this.onRegionChange(e.nativeEvent.coordinate)}
                        >
                            <MapView.Marker coordinate={this.state.region}/>
                            <MapView.Circle
                                radius={600}
                                strokeColor={'#74b9ff'}
                                fillColor={'#74b9ff'}
                                center={this.state.region}
                            />
                        </MapView>

                        <Button primary
                                style={{alignSelf: "center", padding: 10, marginTop: 10}}
                                onPress={this.submitComplain.bind(this)}>
                            <Text style={{color: '#F2F2F2'}}>{t('complains:form.submit')}</Text>
                        </Button>
                    </Form>

                    <List
                        dataArray={this.state.images}
                        renderRow={data =>
                            <ListItem>
                                <Thumbnail square size={80} source={{uri: data.uri}}/>
                                <Body style={{marginLeft: 5}}>
                                <Text note>{data.uri}</Text>
                                </Body>
                            </ListItem>}
                    />

                </Content>
            </Container>
        );
    }
}

export default ComplainsFrom;
