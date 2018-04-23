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
import {translate} from "react-i18next";
import {languageDetector} from "../../i18n";

@translate(['petitions', 'common'], {wait: true})
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
            requested_signatures_number: 0,
            loading: false,
            themes: [],
            images: [],
            isEndDateTimePickerVisible: false,
            lang: 'en',
            isRTL: false,
            validation: {
                end_date: true,
                name: true,
                description: true,
                theme_id: true,
                organization: true,
                requested_signatures_number: true,
            }
        };
    }

    validForm() {
        this.setState({
            validation: {
                end_date: (this.state.end_date !== null),
                name: (this.state.name !== '' && this.state.name !== null),
                theme_id: (Number.isInteger(this.state.theme_id) && this.state.theme_id > 0),
                requested_signatures_number: (Number.isInteger(this.state.requested_signatures_number) && this.state.requested_signatures_number > 0),
                organization: (this.state.organization !== '' && this.state.organization !== null),
                description: (this.state.description !== '' && this.state.description !== null),
            }
        });
        return (
            this.state.validation.end_date &&
            this.state.validation.name &&
            this.state.validation.theme_id &&
            this.state.validation.requested_signatures_number &&
            this.state.validation.organization &&
            this.state.description
        )
    }

    _showDateTimePicker = () => this.setState({isEndDateTimePickerVisible: true});
    _hideDateTimePicker = () => this.setState({isEndDateTimePickerVisible: false});
    _handleDatePicked = (date) => {
        console.log(moment().isSameOrBefore(moment(date)))
        this.setState({
            end_date: date
        });
        this._hideDateTimePicker();
    };

    componentDidMount() {
        languageDetector.detect((lang) => {
            this.state.lang = lang.split("-")[0];
            this.state.isRTL = (this.state.lang === 'ar');
            this.getThemes().catch(e => e);
            this.getUserId();
        });
    }

    submitRecord() {
        if (!this.validForm()) {
            Toast.show({
                text: this.props.t('common:validation'),
                type: "danger"
            });
            return;
        }

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
        return fetch(apiUrl + 'petitions?lang=' + this.state.lang, {
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
                    text: this.props.t('common:error'),
                    duration: 3000
                });
            })
    }

    uploadAttachments(id, attachment) {
        const data = new FormData();
        const url = apiUrl + 'petitions/' + id + '/upload?lang=' + this.state.lang;
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
        return fetch(apiUrl + 'themes?lang=' + this.state.lang)
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
                            <Icon name={this.state.isRTL ? "arrow-forward" : "arrow-back" }/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{t('petitions:form.title')}</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content style={{padding: 10}}>
                    <Form>
                        <Item floatingLabel error={(!this.state.validation.name)}>
                            <Label>{t('petitions:form.name')}</Label>
                            <Input
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                            />
                        </Item>
                        <Item floatingLabel error={(!this.state.validation.organization)}>
                            <Label>{t('petitions:form.target')}</Label>
                            <Input
                                onChangeText={(organization) => this.setState({organization})}
                                value={this.state.organization}
                            />
                        </Item>
                        <Item style={{marginTop: 30}} error={(!this.state.validation.end_date)}>
                            <TouchableOpacity onPress={this._showDateTimePicker}>
                                {this.state.end_date ? (
                                    <Label>{moment(this.state.end_date).format('L')}</Label>
                                ) : (
                                    <Label>{t('petitions:form.date')}</Label>
                                )}
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isEndDateTimePickerVisible}
                                onConfirm={this._handleDatePicked}
                                onCancel={this._hideDateTimePicker}
                            />
                        </Item>
                        <Item style={{marginTop: 30}}>
                            <Label>{t('petitions:form.signatures')}</Label>
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
                            placeholder={t('petitions:form.theme')}
                            note={false}
                            selectedValue={this.state.theme_id}
                            onValueChange={(theme_id) => this.setState({theme_id})}
                            style={{marginTop: 10, marginHorizontal: 10}}
                        >
                            {this.state.themes.map(function (data) {
                                return <Picker.Item label={data.name} value={data.id} key={data.id}/>;
                            })}
                        </Picker>
                        <Item floatingLabel error={(!this.state.validation.description)}>
                            <Label>{t('petitions:form.description')}</Label>
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
                            <Text style={{color: '#F2F2F2'}}>{t('petitions:form.submit')}</Text>
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
