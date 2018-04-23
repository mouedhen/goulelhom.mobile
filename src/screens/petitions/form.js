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
    Col,
    Toast,
} from "native-base";

import {ImagePicker} from 'expo'
import NumericInput, {calcSize} from 'react-native-numeric-input'
import DateTimePicker from 'react-native-modal-datetime-picker';

import styles from "./styles";
import {ApiUtils} from "../../helpers/network";
import {apiUrl} from "../../config";
import {TouchableOpacity, AsyncStorage} from "react-native";

import moment from 'moment'


class ComplainsFrom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            end_date: null,
            name: '',
            description: '',
            theme_id: null,
            contact_id: null,
            organization: '',
            requested_signatures_number: '',
            loading: false,
            themes: [],
            images: [],
            isEndDateTimePickerVisible: false,
        };
    }

    _showDateTimePicker = () => this.setState({isEndDateTimePickerVisible: true});
    _hideDateTimePicker = () => this.setState({isEndDateTimePickerVisible: false});
    _handleDatePicked = (date) => {
        this.setState({
            end_date: date
        });
        this._hideDateTimePicker();
    };

    componentDidMount() {
        this.getThemes().catch(e => e);
        this.getUserId();
    }

    submitRecord() {
        let record = {
            name: this.state.name,
            description: this.state.description,
            end_date: moment(this.state.end_date).format(),
            theme_id: this.state.theme_id,
            contact_id: this.state.contact_id,
            organization: this.state.organization,
            requested_signatures_number: this.state.requested_signatures_number,
        };
        this.setState({loading: true});
        return fetch(apiUrl + 'petitions', {
            method: 'post',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(record)
        })
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.state.images.forEach(attachment => {
                    this.uploadAttachments(responseJson.data.id, attachment)
                });
                this.setState({loading: false});
                this.props.navigation.navigate('PetitionsDetails', {id: responseJson.data.id})
                return
            })
            .catch(e => {
                this.setState({loading: false});
                Toast.show({
                    text: "An error occurred, please try again later",
                    duration: 3000
                });
            })
    }

    uploadAttachments(id, attachment) {
        const data = new FormData();
        const url = apiUrl + 'petitions/' + id + '/upload';
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

    async getThemes() {
        return fetch(apiUrl + 'themes')
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    themes: responseJson.data,
                    theme_id: (responseJson.data[0] ? responseJson.data[0].id : null),
                })
            })
            .catch(e => e)
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
        if (this.state.loading) {
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
                    <Title>New Petition</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Title</Label>
                            <Input
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Target (organism name)</Label>
                            <Input
                                onChangeText={(organization) => this.setState({organization})}
                                value={this.state.organization}
                            />
                        </Item>
                        <Item style={{marginTop: 30}}>
                            <TouchableOpacity onPress={this._showDateTimePicker}>
                                {this.state.end_date ? (
                                    <Label>{moment(this.state.end_date).format('L')}</Label>
                                ) : (
                                    <Label>Select End Date</Label>
                                )}
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isEndDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                        </Item>
                        <Item style={{marginTop: 30}}>
                            <Label>Requested Signature</Label>
                            <NumericInput
                                totalWidth={calcSize(440)}
                                totalHeight={calcSize(80)}
                                iconSize={calcSize(25)}
                                step={1}
                                valueType='real'
                                minValue={0}
                                onChange={requested_signatures_number => this.setState({requested_signatures_number})}
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
                        <Item floatingLabel>
                            <Label>Description</Label>
                            <Input
                                onChangeText={(description) => this.setState({description})}
                                value={this.state.description}
                                multiline={true}
                                numberOfLines={6}
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
                        <Button primary
                                style={{alignSelf: "center", padding: 10, marginTop: 10}}
                                onPress={this.submitRecord.bind(this)}>
                            <Text style={{color: '#F2F2F2'}}>SUBMIT PETITION</Text>
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
