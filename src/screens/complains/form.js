import React, {Component} from "react";
import {
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
    Col,
} from "native-base";

import ImagePicker from 'react-native-image-picker';
import MapView from 'react-native-maps';

import styles from "./styles";
import {ApiUtils} from "../../helpers/network";
import {apiUrl} from "../../config";
import {Dimensions} from "react-native";

let {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 36.8189700;
const LONGITUDE = 10.1657900;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Realm = require('realm');
import {UserSchema, SettingsSchema} from '../../schemas'

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
        };
    }

    componentDidMount() {
        this.getMunicipalities().catch(e => e);
        this.getThemes().catch(e => e);
        this.locateUser();
        this.getUserId();
    }

    submitComplain() {

        this.state.images.forEach(attachment => {
            this.uploadComplainsAttachment(1, attachment)
        })

        return

        let complain = {
            contact_id: this.state.contact_id,
            theme_id: this.state.theme_id,
            municipality_id: this.state.municipality_id,
            subject: this.state.subject,
            description: this.state.description,
            latitude: this.state.region.latitude,
            longitude: this.state.region.longitude,
        };
        console.log(complain)
        return fetch(apiUrl + 'complains', {
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
                console.log(responseJson)
                // this.props.navigation.navigate('Settings')
            })
            .catch(e => {
                console.log(e)
            })
    }

    uploadComplainsAttachment(id, attachment) {
        const data = new FormData();
        const url = apiUrl + 'complains/' + id + '/upload';
        data.append('file', {
            uri: attachment.uri,
            type: attachment.type,
            name: attachment.fileName,
        });
        fetch(url, {
            method: 'post',
            headers: {
                ContentType: 'multipart/form-data',
                Accept: 'application/json',
            },
            body: data
        }).then(res => {
            console.log(res)
        }).catch(e => {
            console.log(e)
        });
    }

    getUserId() {
        Realm.open({
            schema: [UserSchema, SettingsSchema],
            schemaVersion: 3,
            migration: function (oldRealm, newRealm) {
                newRealm.deleteAll();
            }
        }).then(realm => {
            let savedUser = realm.objects('Users').slice(0, 1)[0];
            this.setState({
                realm,
                contact_id: (savedUser ? savedUser.id : -1),
            });
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
            (error) => console.log(error.message),
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
        return fetch(apiUrl + 'municipalities')
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
        return fetch(apiUrl + 'themes')
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    themes: responseJson.data,
                    theme_id: (responseJson.data[0] ? responseJson.data[0].id : null)
                })
            })
            .catch(e => e)
    }

    addPhoto() {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // let source = response;
                this.setState({
                    images: this.state.images.concat([response])
                })
            }
        });
    }

    addVideo() {
        const options = {
            title: 'Video Picker',
            takePhotoButtonTitle: 'Take Video...',
            mediaType: 'video',
            videoQuality: 'medium'
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled video picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // let source = {uri: response.uri};
                this.setState({
                    images: this.state.images.concat([response])
                })
            }
        });
    }

    render() {
        return (
            <Container style={styles.container}>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('Complains')}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>New Complain</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Subject</Label>
                            <Input
                                onChangeText={(subject) => this.setState({subject})}
                                value={this.state.subject}
                            />
                        </Item>
                        <Picker
                            mode="dialog"
                            placeholder="Theme"
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
                            placeholder="Municipality"
                            note={false}
                            selectedValue={this.state.municipality_id}
                            onValueChange={(municipality_id) => this.setState({municipality_id})}
                            style={{marginTop: 10, marginHorizontal: 10}}
                        >
                            {this.state.municipalities.map(function (data) {
                                return <Picker.Item label={data.name} value={data.id} key={data.id}/>;
                            })}
                        </Picker>
                        <Item floatingLabel>
                            <Label>Description</Label>
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
                                        onPress={this.addPhoto.bind(this)}>
                                    <Icon name='images'/>
                                </Button>
                            </Col>
                            <Col>
                                <Button full light iconLeft
                                        onPress={this.addVideo.bind(this)}>
                                    <Icon name='film'/>
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
                            <Text style={{color: '#F2F2F2'}}>SUBMIT COMPLAIN</Text>
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
