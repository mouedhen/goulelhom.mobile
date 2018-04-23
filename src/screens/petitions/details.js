import React, {Component} from "react";
import {AsyncStorage, Image} from 'react-native';
import {
    Container,
    Header,
    Title,
    H1,
    Toast,
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

import styles from "./styles";

import {ApiUtils} from "../../helpers/network";
import {apiUrl} from "../../config";
import moment from "moment/moment";

class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            record: null,
            haveAttachments: false,
            contact_id: null,
            haveSigned: false,
            moreSignatures: false,
        };
    }

    getRecord(id) {
        return fetch(apiUrl + 'petitions/' + id)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    record: responseJson.data,
                    haveAttachments: (responseJson.data.attachments.length > 0),
                    moreSignatures: (responseJson.data.requested_signatures_number < responseJson.data.signatures),
                });
                this.getUserId();
            })
            .catch(e => e)
    }

    componentDidMount() {
        let id = 4;
        if (this.props.navigation.state.params !== undefined)
            id = this.props.navigation.state.params.id;
        this.getRecord(id);
    }

    getUserId() {
        AsyncStorage.getItem('@User:id')
            .then((id) => {
                if (id !== null) {
                    this.setState({
                        contact_id: parseInt(id),
                        haveSigned: (this.state.record.signatories.findIndex(x => x.contact_id === parseInt(id)) !== -1),
                    });
                } else {
                    this.props.navigation.navigate('UserSettings')
                }
            });
    }

    signPetition() {
        let record = {
            contact_id: this.state.contact_id,
            petition_id: this.state.record.id,
        };
        this.setState({loading: true});
        return fetch(apiUrl + 'signatures', {
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
                this.setState({loading: false});
                this.getRecord(this.state.record.id);
                Toast.show({
                    text: "Thank you for your contribution",
                    duration: 3000
                });
            })
            .catch(e => {
                this.setState({loading: false});
                Toast.show({
                    text: "An error occurred, please try again later",
                    duration: 3000
                });
            })
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
                    <Title>Petition Details</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content style={{padding: 20}}>
                    <Body>
                    <Left>
                        <H1>{this.state.record.name}</H1>
                    </Left>
                    <Left>
                        <Text>Target: {this.state.record.target}</Text>
                    </Left>
                    {this.state.record.haveReachedObjective ? (
                        <Right><Icon name="star" style={{color: '#f1c40f'}}/></Right>) : null}
                    </Body>
                    <Text note style={{marginTop: 10}}>Requested signatures: {this.state.record.requested_signatures_number}</Text>
                    <Text note>Total signatures: {this.state.record.signatures}</Text>
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

                    <View style={{paddingBottom: 20, marginTop: 20}}>
                        {this.state.record.wasArchived ? (
                            <Button iconLeft
                                    transparent
                                    info
                                    disabled
                                    onPress={this.signPetition.bind(this)}>
                                <Icon name='create'/>
                                <Text>This petition was archived</Text>
                            </Button>
                            ) : (
                            <Button iconLeft
                                    transparent
                                    info
                                    disabled={this.state.haveSigned}
                                    onPress={this.signPetition.bind(this)}>
                                <Icon name='create'/>
                                {this.state.haveSigned ? (
                                    <Text>You have signed this petition</Text>
                                ) : (
                                    <Text>Sign the petition</Text>
                                )}
                            </Button>
                        )}
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Details;
