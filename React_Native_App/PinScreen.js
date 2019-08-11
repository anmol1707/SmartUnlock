import * as React from 'react';
import {AsyncStorage, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {backgroundImage} from './generalAssets';
import LockKeyboard from './LockKeyboard';
import {verticalScale} from './constants';
import App from './App';

class PinScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pin: [],
        };

        this.pinInput = this.pinInput.bind(this);
        this.deletePinKey = this.deletePinKey.bind(this);
        this.sendData = this.sendData.bind(this);
    }

    pinInput(input) {
        let pin = this.state.pin;
        if (pin.length < 4) {
            pin.push(input);
            this.setState({
                pin: pin,
            });
        }
    }

    deletePinKey() {
        let pin = this.state.pin;
        if (pin.length > 0) {
            pin.splice(pin.length - 1);
            this.setState({
                pin: pin,
            });
        }
    }

    sendData() {
        let device = this.props.device;
        let pinToSend = this.state.pin.join('');
        AsyncStorage.setItem("securityKey", pinToSend);
        pinToSend += '1';
        this.setState({
            pin: [],
        });
        App.sendDataToBluetoothModule(device, pinToSend);
    }

    render() {
        let {pin} = this.state;
        return (
            <ImageBackground source={backgroundImage} style={styles.container}>
                <View style={{
                    width: '100%',
                    height: '80%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={styles.pinInputContainer}>
                        <View style={styles.displayPinRow}>
                            {pin.map((number) => {
                                return <Text key={number+"random-abc"} style={styles.digitsStyle}>{number}</Text>;
                            })}
                        </View>

                        <View style={styles.headingRow}>
                            <Text style={styles.enterPinText}>
                                Enter Pin
                            </Text>
                        </View>
                    </View>
                    <LockKeyboard
                        deletePinKey={this.deletePinKey}
                        pinInput={this.pinInput}/>
                    <TouchableOpacity
                        onPress={this.sendData}
                        disabled={pin.length !== 4}>
                        <Text style={[styles.submitButtonText, {opacity: pin.length === 4 ? 1 : 0.2}]}>Submit</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        );
    }

}

export default PinScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#1CD8B0',
    },
    submitButtonText: {
        color: '#00E6B5',
        fontSize: verticalScale(24),
        marginVertical: verticalScale(20),
    },
    digitsStyle: {
        marginHorizontal: verticalScale(10),
        color: '#00E6B5',
        fontSize: verticalScale(24),
    },
    pinInputContainer: {
        marginVertical: verticalScale(20),
    },
    displayPinRow: {
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: verticalScale(30),
        flexDirection: 'row',
    },
    headingRow: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    enterPinText: {
        fontSize: verticalScale(18),
        fontWeight: '700',
        color: '#00E6B5',
    },
});
