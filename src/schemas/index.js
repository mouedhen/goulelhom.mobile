export const UserSchema = {
    name: 'Users',
    properties: {
        id: {type: 'int'},
        name: {type: 'string'},
        email: {type: 'string', optional: true},
        phone: {type: 'string', optional: true},
        address: {type: 'string', optional: true},
    }
};

export const SettingsSchema = {
    name: 'Settings',
    properties: {
        geoLocate: {type: 'bool', default: true},
        lang: {type: 'string', default: 'en'},
    }
};
