import React, {Component} from 'react'
import {
    Container,
    Content,
    Header,
    Right,
    Left,
    Button,
    Body,
    Title,
    Icon,
    Form,
    Item,
    Label,
    Input,
    Text,
} from 'native-base'

import {ApiUtils} from '../../helpers/network'
import {apiUrl} from "../../config";

import {AsyncStorage} from "react-native"
import {translate} from "react-i18next";
import {languageDetector} from "../../i18n";

@translate(['settings', 'common'], {wait: true})
class UserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            name: '',
            phone_number: '',
            email: '',
            address: '',
            loading: false,
            lang: 'en',
            isRTL: false,
        }
    }

    componentWillMount() {
        languageDetector.detect((lang) => {
            this.state.lang = lang.split("-")[0];
            this.state.isRTL = (this.state.lang === 'ar');
            this.getUserData();
        });
    }

    storeUserData(user) {
        AsyncStorage.setItem('@User:id', String(user.id));
        AsyncStorage.setItem('@User:name', String(user.name));
        AsyncStorage.setItem('@User:phone_number', String(user.phone_number));
        AsyncStorage.setItem('@User:email', String(user.email));
        AsyncStorage.setItem('@User:address', String(user.address));
    }

    getUserData() {
        AsyncStorage.getItem('@User:id')
            .then((id) => {
                if (id !== null)
                    this.setState({
                        id: parseInt(id),
                    });
            });
        AsyncStorage.getItem('@User:name')
            .then((name) => {
                if (name !== null)
                    this.setState({
                        name: (name !== 'null' && name !== 'undefined' ? name : null),
                    });
            });
        AsyncStorage.getItem('@User:phone_number')
            .then((phone_number) => {
                if (phone_number !== null)
                    this.setState({
                        phone_number: (phone_number !== 'null' && phone_number !== 'undefined' ? phone_number : null),
                    });
            });
        AsyncStorage.getItem('@User:email')
            .then((email) => {
                if (email !== null)
                    this.setState({
                        email: (email !== 'null' && email !== 'undefined' ? email : null),
                    });
            });
        AsyncStorage.getItem('@User:address')
            .then((address) => {
                if (address !== null)
                    this.setState({
                        address: (address !== 'null' && address !== 'undefined' ? address : null),
                    });
            });
    }

    submitUser() {
        if (this.state.id === -1) {
            return fetch(apiUrl + 'contacts', {
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    phone_number: this.state.phone_number,
                    email: this.state.email,
                    address: this.state.address,
                })
            })
                .then(ApiUtils.checkStatus)
                .then(response => response.json())
                .then(responseJson => {
                    this.storeUserData(responseJson.data);
                    this.props.navigation.goBack(null)
                })
                .catch(e => {
                    console.log(e)
                })
        } else {
            return fetch(apiUrl + 'contacts/' + this.state.id, {
                method: 'put',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: this.state.name,
                    phone_number: this.state.phone_number,
                    email: this.state.email,
                    address: this.state.address,
                })
            })
                .then(ApiUtils.checkStatus)
                .then(response => response.json())
                .then(responseJson => {
                    this.storeUserData(responseJson.data);
                    this.props.navigation.goBack(null)
                    return;
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }

    render() {
        const {t} = this.props;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => {
                            this.props.navigation.goBack(null)
                        }}>
                            <Icon name={this.state.isRTL ? "arrow-forward" : "arrow-back" }/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{t('settings:form.title')}</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>{t('settings:form.name')}</Label>
                            <Input
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>{t('settings:form.name')}</Label>
                            <Input
                                onChangeText={(email) => this.setState({email})}
                                value={this.state.email}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>{t('settings:form.email')}</Label>
                            <Input
                                onChangeText={(phone_number) => this.setState({phone_number})}
                                value={this.state.phone_number}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>{t('settings:form.address')}</Label>
                            <Input
                                multiline={true}
                                numberOfLines={5}
                                onChangeText={(address) => this.setState({address})}
                                value={this.state.address}
                            />
                        </Item>
                        <Button primary
                                style={{alignSelf: "center", padding: 10, marginTop: 10}}
                                onPress={this.submitUser.bind(this)}>
                            <Text style={{color: '#F2F2F2'}}>{t('common:save')}</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        )
    }
}

export default UserForm;
