import React, {Component} from "react";
import {Image} from 'react-native';
import {
    Container,
    Header,
    Title,
    H1,
    H2,
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
    Thumbnail,
    List,
    ListItem,
} from "native-base";

import styles from "./styles";

import {ApiUtils} from "../../helpers/network";
import {apiUrl} from "../../config";
import {translate} from "react-i18next";
import {languageDetector} from "../../i18n";

const defaultCover = require("../../../assets/default/tunisia_flag.png");

@translate(['municipalities', 'common'], {wait: true})
class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            record: null,
            haveAttachments: false,
            lang: 'en',
            isRTL: false,
        };
    }

    getRecord(id) {
        return fetch(apiUrl + 'municipalities/' + id + '?lang=' + this.state.lang)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    record: responseJson.data,
                    haveAttachments: (responseJson.data.attachments.length > 0)
                });
            })
            .catch(e => e)
    }

    componentDidMount() {
        languageDetector.detect((lang) => {
            this.state.lang = lang.split("-")[0];
            this.state.isRTL = (this.state.lang === 'ar');
            let id = 1;
            if (this.props.navigation.state.params !== undefined)
                id = this.props.navigation.state.params.id;
            this.getRecord(id);
        });
    }

    render() {
        const {t} = this.props;
        if (this.state.record === null) {
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
                    <Title>{t('municipalities:details.title')}</Title>
                    </Body>
                    <Right/>
                </Header>

                <Content style={{padding: 20}}>
                    <H1>{this.state.record.name}</H1>
                    {this.state.haveAttachments ? (
                        <View style={{height: 320}}>
                            <DeckSwiper
                                dataSource={this.state.record.attachments}
                                renderItem={item =>
                                    <Image
                                        source={{uri: item.url}}
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
                    ) : <Image
                        source={defaultCover}
                        style={{
                            backgroundColor: '#9d9d9d',
                            height: 200,
                            width: '100%',
                            flex: 1,
                            alignSelf: 'center',
                            marginTop: 10
                        }}/>
                    }
                    <Text>{this.state.record.description}</Text>
                    <H2 style={{marginTop: 10}}>{t('municipalities:details.list')}</H2>

                    <View style={{paddingBottom: 20}}>
                        <List dataArray={this.state.record.complains}
                              renderRow={(item) =>
                                  <ListItem>
                                      <Body>
                                      <Text>{item.subject}</Text>
                                      <Text note>{item.description}</Text>
                                      </Body>

                                      <Right>
                                          <Icon
                                              name={this.state.isRTL ? "arrow-back" : "arrow-forward" }
                                              onPress={() => this.props.navigation.navigate('ComplainsDetails', {id: item.id})}/>
                                      </Right>
                                  </ListItem>
                              }>
                        </List>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default Details;
