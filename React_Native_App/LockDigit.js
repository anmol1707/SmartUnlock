import * as React from 'react';
import NativeButton from './NativeButton';
import {verticalScale} from './constants';

export default class LockDigit extends React.Component {
    render() {
        return (
            <NativeButton textStyle={{color: '#00E6B5', fontSize: verticalScale(28), textAlign: 'center'}}
                          containerStyle={{paddingVertical: verticalScale(20), paddingHorizontal: verticalScale(20)}}
                          title={this.props.digit}
                          onPress={() => {
                              this.props.onPress(this.props.digit);
                          }}
                          centerAlign={true}/>
        );
    }
}
