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

// const Realm = require('realm');

// import {UserSchema, SettingsSchema} from '../../schemas'

class UserForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: -1,
            name: '',
            phone_number: '',
            email: '',
            address: '',
            realm: null,
        }
    }

    componentWillMount() {
        // Realm.open({
        //     schema: [UserSchema, SettingsSchema],
        //     schemaVersion: 3,
        //     migration: function (oldRealm, newRealm) {
        //         newRealm.deleteAll();
        //     }
        // }).then(realm => {
        //     let savedUser = realm.objects('Users').slice(0, 1)[0];
        //     this.setState({
        //         realm,
        //         id: (savedUser ? savedUser.id : -1),
        //         name: (savedUser ? savedUser.name : ''),
        //         phone_number: (savedUser ? savedUser.phone_number : ''),
        //         email: (savedUser ? savedUser.email : ''),
        //         address: (savedUser ? savedUser.address : ''),
        //     });
        // });
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
                    // this.state.realm.write(() => {
                    //     this.state.realm.create('Users', {
                    //         id: (responseJson.data.id ? responseJson.data.id : -1),
                    //         name: (responseJson.data.name ? responseJson.data.name : ''),
                    //         email: (responseJson.data.email ? responseJson.data.email : ''),
                    //         phone_number: (responseJson.data.phone_number ? responseJson.data.phone_number : ''),
                    //         address: (responseJson.data.address ? responseJson.data.address : ''),
                    //     });
                    // });
                    this.props.navigation.navigate('Settings')
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
                    // this.state.realm.write(() => {
                    //     let savedUser = this.state.realm.objects('Users').slice(0, 1)[0];
                    //     savedUser.id = (responseJson.data.id ? responseJson.data.id : -1);
                    //     savedUser.name = (responseJson.data.name ? responseJson.data.name : '');
                    //     savedUser.email = (responseJson.data.email ? responseJson.data.email : '');
                    //     savedUser.phone_number = (responseJson.data.phone_number ? responseJson.data.phone_number : '');
                    //     savedUser.address = (responseJson.data.address ? responseJson.data.address : '');
                    // });
                    this.props.navigation.navigate('Settings')
                })
                .catch(e => {
                    console.log(e)
                })
        }
    }

    render() {
        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => {this.props.navigation.navigate('Settings')}}>
                            <Icon name="arrow-back"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>User Information</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Your name</Label>
                            <Input
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Your email address</Label>
                            <Input
                                onChangeText={(email) => this.setState({email})}
                                value={this.state.email}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Your phone number</Label>
                            <Input
                                onChangeText={(phone_number) => this.setState({phone_number})}
                                value={this.state.phone_number}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Your address</Label>
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
                            <Text style={{color: '#F2F2F2'}}>SAVE</Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        )
    }
}

export default UserForm;
