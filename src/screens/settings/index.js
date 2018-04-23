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
import {translate} from "react-i18next";

@translate(['settings', 'common'], {wait: true})
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
        const {t} = this.props;
        return (
            <Container>
                <Header>
                    <Left>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.navigate("DrawerOpen")}
                        >
                            <Icon name="ios-menu"/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>{t('settings:index.title')}</Title>
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
                            <Text>{t('settings:index.profile')}</Text>
                            </Body>
                            <Right>
                                <Text>{this.state.name}</Text>
                                <Icon name="arrow-forward" onPress={() => {
                                    this.props.navigation.navigate('UserSettings')
                                }}/>
                            </Right>
                        </ListItem>

                    </List>
                </Content>
            </Container>
        );
    }
}

export default Settings;
