import React, {Component} from "react";
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
    Content,
    List,
    ListItem,
    Switch,
    Separator,
} from "native-base";

// import {UserSchema, SettingsSchema} from '../../schemas'

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            realm: null,
            lang: 'en',
            geoLocate: true,
            name: '',
        };
    }

    componentWillMount() {
        // Realm.open({
        //     schema: [UserSchema, SettingsSchema],
        //     schemaVersion: 3,
        //     migration: function (oldRealm, newRealm) {
        //         newRealm.deleteAll();
        //     }
        // }).then(realm => {
        //     realm.write(() => {
        //         if (realm.objects('Settings').length < 1) {
        //             realm.create('Settings', {geoLocate: true, lang: 'en'});
        //         }
        //         let settings = realm.objects('Settings').slice(0, 1)[0];
        //         let savedUser = realm.objects('Users').slice(0, 1)[0];
        //         this.setState({
        //             realm,
        //             lang: settings.lang,
        //             geoLocate: settings.geoLocate,
        //             name: (savedUser ? savedUser.name : ''),
        //         });
        //     });
        // });
    }

    switchLang(value) {
        // this.state.realm.write(() => {
        //     let settings = this.state.realm.objects('Settings').slice(0, 1)[0];
        //     settings.lang = value;
        //     this.setState({
        //         lang: value
        //     });
        // });
    }

    changeGeoLocate(value) {
        // console.log(this.state)
        // this.state.realm.write(() => {
        //     let settings = this.state.realm.objects('Settings').slice(0, 1)[0];
        //     settings.geoLocate = value;
        //     this.setState({
        //         geoLocate: value
        //     });
        // });
    }

    render() {
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
                    <Title>Settings</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    <Separator style={{backgroundColor: '#E0e0e0'}}/>
                    <List>
                        <ListItem icon>
                            <Left>
                                <Icon name="contact"/>
                            </Left>
                            <Body>
                            <Text>Profile</Text>
                            </Body>
                            <Right>
                                <Text>{this.state.name}</Text>
                                <Icon name="arrow-forward" onPress={() => {
                                    this.props.navigation.navigate('UserSettings')
                                }}/>
                            </Right>
                        </ListItem>
                        <ListItem icon>
                            <Left>
                                <Icon name="pin"/>
                            </Left>
                            <Body>
                            <Text>Geolocation</Text>
                            </Body>
                            <Right>
                                <Switch
                                    onValueChange={this.changeGeoLocate.bind(this)}
                                    value={this.state.geoLocate}/>
                            </Right>
                        </ListItem>

                    </List>
                </Content>
            </Container>
        );
    }
}

export default Settings;
