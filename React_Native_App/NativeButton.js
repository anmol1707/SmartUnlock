import * as React from 'react';
import {Keyboard, StyleSheet, Text, TouchableOpacity,} from 'react-native';
import {Col, Row} from './Grid';
import {verticalScale} from './constants';

export default class NativeButton extends React.Component {

    constructor(props) {
        super(props);

        this.onPress = this.onPress.bind(this);

        this.state = {
            showDisabledText: false,
        };
    }

    render() {
        let title = this.props.title;

        return (
            <>
                <TouchableOpacity onPress={this.onPress}
                                  style={styles.buttonCenter}
                                  activeOpacity={this.props.disabled === true ? 1 : 0.2}
                                  disabled={false}>
                    <Row style={{width: '100%', justifyContent: "center"}}>
                        <Col style={{alignSelf: 'center'}} size={12}>
                            <Text
                                style={styles.buttonText}>
                                {title}
                            </Text>
                        </Col>
                    </Row>
                </TouchableOpacity>
            </>
        );
    }

    onPress(e) {
        if (!this.props.disabled) {
            Keyboard.dismiss();
            this.props.onPress(e);
        } else {
            this.setState({
                showDisabledText: true,
            });
        }
    }

}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        width: '100%',
        justifyContent: 'flex-start',
    },
    allCapsStyle: {
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    disabled: {
        opacity: 1,
    },
    buttonCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
        paddingVertical: verticalScale(20),
        width: '100%',
    },
    buttonText: {
        color: "#00E6B5",
        fontFamily: "300",
        fontSize: verticalScale(22),
        letterSpacing: 1,
    },
    activityIndicator: {
        transform: [{scale: 0.70}],
        marginTop: 3.5,
        marginLeft: 10,
    },
});
