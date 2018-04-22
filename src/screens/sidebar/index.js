import React, {Component} from "react";
import {Image} from "react-native";
import {
    Content,
    Text,
    List,
    ListItem,
    Icon,
    Container,
    Left,
    Right,
    Badge,
} from "native-base";
import styles from "./style";

const drawerCover = require("../../../assets/static/bg.png");
const drawerImage = require("../../../assets/static/icon.png");

const data = [
    // {
    //     name: "Home",
    //     route: "Home",
    //     icon: "home",
    //     bg: "#f2f2f2"
    // },
    {
        name: "Complains",
        route: "Complains",
        icon: "camera",
        bg: "#f2f2f2"
    },
    {
        name: "Petitions",
        route: "Petitions",
        icon: "create",
        bg: "#f2f2f2"
    },
    {
        name: "Events",
        route: "Events",
        icon: "calendar",
        bg: "#f2f2f2"
    },
    {
        name: "Municipalities",
        route: "Municipalities",
        icon: "globe",
        bg: "#f2f2f2"
    },
    {
        name: "Reports",
        route: "Reports",
        icon: "book",
        bg: "#f2f2f2"
    },
    {
        name: "Press",
        route: "Press",
        icon: "chatboxes",
        bg: "#f2f2f2"
    },
    {
        name: "Settings",
        route: "Settings",
        icon: "settings",
        bg: "#f2f2f2"
    },
];

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shadowOffsetWidth: 1,
            shadowRadius: 4
        };
    }

    render() {
        return (
            <Container>
                <Content
                    bounces={false}
                    style={{flex: 1, backgroundColor: "#fff", top: -1}}
                >
                    <Image source={drawerCover} style={styles.drawerCover}/>
                    <Image square style={styles.drawerImage} source={drawerImage}/>

                    <List
                        dataArray={data}
                        renderRow={data =>
                            <ListItem
                                button
                                noBorder
                                onPress={() => this.props.navigation.navigate(data.route)}
                            >
                                <Left>
                                    <Icon
                                        active
                                        name={data.icon}
                                        style={{color: "#222222", fontSize: 26, width: 30}}
                                    />
                                    <Text>
                                        {data.name}
                                    </Text>
                                </Left>
                                {data.types &&
                                <Right style={{flex: 1}}>
                                    <Badge
                                        style={{
                                            borderRadius: 3,
                                            height: 25,
                                            width: 72,
                                            backgroundColor: data.bg
                                        }}
                                    >
                                        <Text>{`${data.types} Types`}</Text>
                                    </Badge>
                                </Right>}
                            </ListItem>}
                    />
                </Content>
            </Container>
        );
    }
}

export default SideBar;
