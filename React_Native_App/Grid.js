import {StyleSheet, View} from 'react-native'
import * as React from 'react'

const grid = StyleSheet.create({
    col_1: {flex: 8.33 / 100, flexDirection: "column"},
    col_2: {flex: 16.66 / 100, flexDirection: "column"},
    col_3: {flex: 25 / 100, flexDirection: "column"},
    col_4: {flex: 33.33 / 100, flexDirection: "column"},
    col_5: {flex: 41.66 / 100, flexDirection: "column"},
    col_6: {flex: 50 / 100, flexDirection: "column"},
    col_7: {flex: 58.33 / 100, flexDirection: "column"},
    col_8: {flex: 66.66 / 100, flexDirection: "column"},
    col_9: {flex: 75 / 100, flexDirection: "column"},
    col_10: {flex: 83.33 / 100, flexDirection: "column"},
    col_11: {flex: 91.66 / 100, flexDirection: "column"},
    col_12: {flex: 100 / 100, flexDirection: "column"},
    row: {
        display: "flex",
        flexGrow: 0,
        flexBasis: "auto",
        flexDirection: "row",
        flexWrap: "wrap"
    }
});

export class Row extends React.Component {
    render() {
        return <View style={[this.props.style, grid.row]}
                     onLayout={this.props.onLayout}>
            {this.props.children}
        </View>
    }
}

export class Col extends React.Component {
    render() {
        return <View style={[grid["col_" + this.props.size], this.props.style]}>
            {this.props.children}
        </View>
    }
}
