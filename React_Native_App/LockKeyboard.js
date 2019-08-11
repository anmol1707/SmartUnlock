import {Image, StyleSheet, TouchableOpacity, View} from "react-native";
import * as React from "react";
import {Col, Row} from './Grid';
import LockDigit from './LockDigit';
import {pinScreenBackspace} from './generalAssets';
import {verticalScale} from './constants';

export default class LockKeyboard extends React.Component {

    render() {
        return (
            <View style={styles.pinKeyboard}>
                <Row>
                    <Col key={"1_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="1" onPress={this.props.pinInput}/>
                    </Col>
                    <Col key={"2_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="2" onPress={this.props.pinInput}/>
                    </Col>
                    <Col key={"3_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="3" onPress={this.props.pinInput}/>
                    </Col>
                </Row>
                <Row>
                    <Col key={"4_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="4" onPress={this.props.pinInput}/>
                    </Col>
                    <Col key={"5_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="5" onPress={this.props.pinInput}/>
                    </Col>
                    <Col key={"6_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="6" onPress={this.props.pinInput}/>
                    </Col>
                </Row>
                <Row>
                    <Col key={"7_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="7" onPress={this.props.pinInput}/>
                    </Col>
                    <Col key={"8_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="8" onPress={this.props.pinInput}/>
                    </Col>
                    <Col key={"9_random"} size={4} style={styles.pinColumn}>
                        <LockDigit digit="9" onPress={this.props.pinInput}/>
                    </Col>
                </Row>
                <Row>
                    <Col size={4} style={styles.pinColumn} />
                    <Col size={4} style={styles.pinColumn}>
                        <TouchableOpacity onPress={this.props.deletePinKey} style={{flex: 1}}>
                            <Image source={pinScreenBackspace} style={styles.deleteButton}/>
                        </TouchableOpacity>
                    </Col>
                    <Col size={4} style={styles.pinColumn} />
                </Row>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pinKeyboard: {
        justifyContent: "space-around",
        alignItems: "center",
        height: "60%",
        width: "80%",
        alignSelf: "center"
    },
    pinColumn: {
        justifyContent: "center",
        alignItems: "center"
    },
    pinButton: {
        fontSize: verticalScale(14),
        color: "#00E6B5",
        textAlign: "center",
        fontWeight: "700"
    },
    deleteButton: {
        maxWidth: verticalScale(42),
        alignSelf: "stretch",
        flex: 1,
        resizeMode: "contain"
    }
});
