import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import React, { Component } from 'react';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { Platform } from '@unimodules/core';



class FeedHeader extends Component {
    constructor() {
        super()
        this.state = {
        }
    }



    render() {
        if(isIphoneX()){
        return (
            <View style={styles.container_ios}>
                <View style={{ height:40, width:80, justifyContent: 'center', alignItems: "center"}}>
                   <Image source={require("../../assets/icons/header.png")} style={{resizeMode: "contain", width:80, height:40}}  />
                </View>
            </View>
        )}
        else{
            return (
                <View style={styles.container_android}>
                    <View style={{ height:40, width:80, justifyContent: 'center', alignItems: "center" }}>
                       <Image source={require("../../assets/icons/header.png")} style={{resizeMode: "contain", width:80, height:40}}  />
                    </View>
                </View>
            )
        }
    }
}
export default FeedHeader

const styles = StyleSheet.create({
    container_ios: {
        width:"100%",
        height: 70,
        borderBottomColor: "#818386",
        borderBottomWidth:0.5,
        marginTop:40,
        alignItems:"center",
        justifyContent:"center"
    },
    container_android: {
        width:"100%",
        height: 70,
        borderBottomColor: "#818386",
        borderBottomWidth:0.5,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
   

    }
});