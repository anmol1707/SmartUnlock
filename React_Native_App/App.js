import * as React from 'react';
import {ActivityIndicator, AsyncStorage, PermissionsAndroid, Platform, StyleSheet, View,} from 'react-native';

import {BleManager} from 'react-native-ble-plx';
import PinScreen from './PinScreen';
import Base64 from './Base64';
import {Buffer} from 'buffer';
import ToggleGateModes from './ToggleGateModes';
import PushNotification from 'react-native-push-notification';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.manager = new BleManager();
        this.state = {
            alcoholMode: false,
            device: null,
            mode: 2,
            gateOpenMode: null,
        };

        this.scanAndConnect = this.scanAndConnect.bind(this);
        this.changeGateOpenMode = this.changeGateOpenMode.bind(this);
        this.toggleAlcoholMode = this.toggleAlcoholMode.bind(this);
        this.notificationListener = this.notificationListener.bind(this);
        this.processDataFromBle = this.processDataFromBle.bind(this);
    }

    notificationListener(notification) {
        if(this.state.device != null) {
            App.sendDataToBluetoothModule(this.state.device, "10004");
        }
    }

    static sendPushNotificationToOpenDoor() {
        PushNotification.localNotification({
            title: 'Open Door ',
            message: 'Do you wish to open the door?',
            actions: '["Yes"]',
        });
    }

    static sendDataToBluetoothModule(device, data, callbackFunction) {
        device.writeCharacteristicWithoutResponseForService(
            'FEE0',
            'FEE1',
            new Buffer(data).toString('base64'),
        ).then((value) => {
            if (callbackFunction) {
                callbackFunction();
            }
        }).catch((err) => {
            alert('Error sending data');
        });
    }

    changeGateOpenMode(newMode) {
        this.setState({
            gateOpenMode: newMode,
        });
    }

    toggleAlcoholMode() {
        App.sendDataToBluetoothModule(this.state.device, '10003');
    }

    scanAndConnect() {
        this.manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.warn('error ', error);
                return;
            }
            if (device.name === 'BLE SPS') {
                this.manager.stopDeviceScan();
                device.connect()
                    .then((device) => {
                        device.discoverAllServicesAndCharacteristics()
                            .then((device) => {
                                this.setState({
                                    device: device,
                                }, () => {
                                    AsyncStorage.getItem('securityKey')
                                        .then((data) => {
                                            if (data) {
                                                data = data + '1';
                                                App.sendDataToBluetoothModule(device, data, null);
                                            } else {
                                                this.setState({
                                                    mode: 1,
                                                });
                                            }
                                        })
                                        .catch((error) => {
                                            alert(error);
                                        });
                                });
                            })
                            .catch((err) => {
                                alert('Error connecting to device');
                            });
                    })
                    .catch((error) => {
                        this.scanAndConnect();
                    });
            }
        });
    }

    componentDidMount() {
        AsyncStorage.getItem("gateOpenMode").then((data) => {
            this.setState({
                gateOpenMode: data
            });
        });

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    this.scanAndConnect();
                } else {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            this.scanAndConnect();
                        } else {
                            alert('Not enough permissions to use bluetooth');
                        }
                    });
                }
            });
        }

        PushNotification.configure({
            onNotification: this.notificationListener
        });
    }

    async processDataFromBle(result) {
        return new Promise((resolve, reject) => {
            if (result == '0') {
                this.setState({
                    mode: 1
                }, () => {
                    resolve();
                });
            }
            if (result == '2') {
                this.setState({
                    gateOpenMode: null,
                }, () => {
                    resolve();
                });
            } else if (result == '3') {
                this.setState({
                    alcoholMode: !this.state.alcoholMode,
                }, () => {
                    resolve();
                });
            } else if (result == '4') {
                alert('Gate will open!');
                resolve();
            } else if (result == '5') {
                this.setState({
                    mode: 2,
                    alcoholMode: true
                }, () => {
                    resolve();
                });
            } else if (result == '6') {
                this.setState({
                    mode: 2,
                    alcoholMode: false
                }, () => {
                    if(this.state.gateOpenMode == 1) {
                        App.sendDataToBluetoothModule(this.state.device, '10002');
                    } else if (this.state.gateOpenMode == 2) {
                        App.sendPushNotificationToOpenDoor();
                    }
                    resolve();
                });
            }
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.gateOpenMode != this.state.gateOpenMode) {
            AsyncStorage.setItem("gateOpenMode", this.state.gateOpenMode);
        }

        if (prevState.device == null && this.state.device != null) {

            this.state.device.onDisconnected(() => {
                this.scanAndConnect();
                this.setState({
                    device: null
                });
            });

            this.state.device.monitorCharacteristicForService('FEE0', 'FEE1', async (err, characteristic) => {
                let result = Base64.atob(characteristic.value);
                let promises = result.split('').map((value) => {
                    return this.processDataFromBle(value);
                });
                await promises.reduce(async (previousPromise, currentPromise) => {
                    await previousPromise;
                    await currentPromise;
                }, Promise.resolve());
            });
        }
    }

    render() {
        if (this.state.mode === 0) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size={'large'} style={{width: '100%', height: '100%'}}/>
                </View>
            );
        } else if (this.state.mode === 1) {
            return (
                <View style={styles.container}>
                    <PinScreen
                        device={this.state.device}/>
                </View>
            );
        } else if (this.state.mode === 2) {
            return (
                <View style={styles.container}>
                    <ToggleGateModes
                        alcoholMode={this.state.alcoholMode}
                        toggleAlcoholMode={this.toggleAlcoholMode}
                        device={this.state.device}
                        modeSelected={this.state.gateOpenMode}
                        changeGateOpenMode={this.changeGateOpenMode}/>
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        margin: 10,
    },
    row: {
        margin: 10,
    },
});
