import * as React from 'react';
import {ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {backgroundImage} from './generalAssets';
import App from './App';

class ToggleGateModes extends React.Component {
    constructor(props) {
        super(props);

        this.getFirstButton = this.getFirstButton.bind(this);
        this.getSecondButton = this.getSecondButton.bind(this);
        this.openDoor = this.openDoor.bind(this);
    }

    openDoor(mode) {
        if (mode === 1 && this.props.device != null) {
            App.sendDataToBluetoothModule(this.props.device, '10002');
        }
    }

    componentDidMount() {
        this.openDoor(0);
    }

    getFirstButton() {
        if (this.props.modeSelected == 1) {
            return (
                <View style={styles.disabledButtonStyle}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => {
                            this.props.changeGateOpenMode(null);
                        }}>
                        <Text style={styles.textStyle}>Hands Free Mode</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                        this.openDoor(1);
                        this.props.changeGateOpenMode(1);
                    }}>
                    <Text style={styles.textStyle}>Hands Free Mode</Text>
                </TouchableOpacity>
            );
        }
    }

    getSecondButton() {
        if (this.props.modeSelected == 2) {
            return (
                <View style={styles.disabledButtonStyle}>
                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => {
                            this.props.changeGateOpenMode(null);
                        }}>
                        <Text style={styles.textStyle}>Notification Mode</Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={() => {
                        this.props.changeGateOpenMode(2);
                        if (this.props.device != null) {
                            App.sendPushNotificationToOpenDoor();
                        }
                    }}>
                    <Text style={styles.textStyle}>Notification Mode</Text>
                </TouchableOpacity>
            );
        }
    }

    render() {
        if (this.props.alcoholMode) {
            return (
                <ImageBackground source={backgroundImage} style={styles.container}>
                    <Text style={[styles.descriptionTextStyle, styles.textStyle]}>Alcohol Mode</Text>
                    <Text style={styles.descriptionTextStyle}>Breathe into the sensor to start the car</Text>
                    <TouchableOpacity onPress={() => {
                        this.props.toggleAlcoholMode();
                    }} style={styles.lowerPanel}>
                        <Text style={styles.textStyle}>Home Door Mode</Text>
                    </TouchableOpacity>
                </ImageBackground>
            );
        } else {
            return (
                <ImageBackground source={backgroundImage} style={styles.container}>
                    {this.getFirstButton()}
                    {this.getSecondButton()}
                    <TouchableOpacity onPress={() => {
                        this.props.toggleAlcoholMode();
                    }} style={styles.lowerPanel}>
                        <Text style={styles.textStyle}>Alcohol Mode</Text>
                    </TouchableOpacity>
                </ImageBackground>
            );
        }
    }
}

export default ToggleGateModes;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#1CD8B0',
    },
    textStyle: {
        fontSize: 24,
        textAlign: 'center',
    },
    descriptionTextStyle: {
        color: '#1CD8B0',
        fontSize: 20,
    },
    disabledButtonStyle: {
        width: '100%',
        alignItems: 'center',
        opacity: 0.2,
    },
    buttonStyle: {
        marginVertical: 30,
        backgroundColor: '#1CD8B0',
        width: '80%',
        height: 60,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 40,
    },
    lowerPanel: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: 60,
        backgroundColor: '#1CD8B0',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
