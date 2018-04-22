import React, {Component} from "react";
import {
    View,
    Spinner,
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

import {AsyncStorage} from "react-native"

class Settings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            geoLocate: true,
            name: '',
        };
    }

    getName() {
        AsyncStorage.getItem('@User:name')
            .then(name => {
                if (name !== null) {
                    this.setState({
                        name,
                    });
                }
            })
    }

    getIsGeoLocalisable() {
        AsyncStorage.getItem('@Settings:geoLocate')
            .then(geoLocate => {
                if (geoLocate !== null) {
                    this.setState({
                        geoLocate: (geoLocate === "true"),
                    });
                }
            })
    }

    componentWillMount() {
        this.getName();
        this.getIsGeoLocalisable();
    }

    changeGeoLocate(value) {
        AsyncStorage.setItem('@Settings:geoLocate', String(value))
            .then(() => {
                this.setState({
                    geoLocate: value,
                });
            })
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
