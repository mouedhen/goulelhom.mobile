import React, {Component} from "react";
import {WebView} from 'react-native';
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
    View,
    Spinner,
} from "native-base";

import styles from "./styles";

class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            uri: null
        };
    }

    componentDidMount() {
        // TODO redirect on uri not defined
        let uri = 'https://drive.google.com/viewerng/viewer?embedded=true&url=' + 'http://www.africau.edu/images/default/sample.pdf';
        if (this.props.navigation.state.params !== undefined)
            uri = 'https://drive.google.com/viewerng/viewer?embedded=true&url=' + this.props.navigation.state.params.uri;
        this.setState({
            uri
        })
    }

    render() {
        if (this.state.uri === null) {
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
                    <Title>Report Reader</Title>
                    </Body>
                    <Right/>
                </Header>
                <View style={{flex: 1}}>
                    <WebView
                        bounces={false}
                        scrollEnabled={false}
                        source={{ uri: this.state.uri }} />
                </View>
            </Container>
        );
    }
}

export default Details;
