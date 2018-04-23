import {
    PixelRatio,
} from 'react-native';

export default {
    container: {
        backgroundColor: "#F2F2F2"
    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    mapForm: {
        height: 200,
    },
    button: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },

    avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 75,
        width: 150,
        height: 150
    }
};
