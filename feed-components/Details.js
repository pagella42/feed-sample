import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { isIphoneX } from 'react-native-iphone-x-helper'
import { SliderBox } from 'react-native-image-slider-box';
import * as MailComposer from 'expo-mail-composer';
import { Linking } from 'expo';
import axios from 'axios'


class Details extends Component {
    constructor() {
        super()
        this.state = {
            pictures: []
        }
    }
    componentDidMount() {
        let pictures = []
        this.props.post.media.forEach(m => pictures.push(m.absolute_url))
        this.setState({ pictures })
    }
    call() {
        let post = this.props.post
        Linking.openURL(`tel://${post.user.phone_number}`)
        this.metrics("call")
    }
    mail() {
        let post = this.props.post

        MailComposer.composeAsync({ recipients: [`${post.user.email}`], subject: `Consulta por ${post.title} - SomosAgro`, body: `¡Hola ${post.user.display_name}! Me comunico por tu publicacion de "${post.title}" en Somos Agro.`, })
        this.metrics("email")
    }
    metrics(type) {
        headers = {
            'Auth': `Bearer ${this.props.internalToken}`
        }
        body = {
            "advertisings": [this.props.post.id],
            "type_statistic": type
        }

        axios.post('https://somosagro.cysonline.com.ar/api/send_statistics', body, { headers })
            .then(async response => {
                if(response.data.status == 200){
                    ("could not update statistics")
                }
            })
            .catch(error => { console.log("Feeds metrics error:" + error) })
    }
    render() {
        let post = this.props.post
        let os = "header_android"
        if (isIphoneX()) {
            os = "header_ios"
        }

        return (
            <View style={styles.container}>

                <View style={styles[os]}>
                    <View style={{ width: "25%", paddingLeft: "5%" }}>
                        <TouchableOpacity onPress={this.props.showDetails}>
                            <Text> <Ionicons name="ios-arrow-back" size={32} color="#8FBD2A" /></Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: 50, width: "50%", justifyContent: 'center', alignItems: "center" }}>
                        <Text style={{ color: "#8FBD2A", fontSize: 22, fontFamily: "GothamRounded-Medium", textAlign: "center" }}>Publicación</Text>
                    </View>
                    <View style={{ width: "25%" }}></View>
                </View>

                <ScrollView style={{ width: "100%" }}>

                    <SliderBox sliderBoxHeight={300} images={this.state.pictures} dotColor="#8FBD2A" />

                    <View style={styles.contentContainer}>

                        <View style={{ width: "100%", marginBottom:"5%" }}>
                            <Text style={{ color: "#454547", fontSize: 18, fontFamily: "GothamRounded-Medium" }}>{post.title}</Text>
                        </View>

                        <View style={styles.summary}>

                            <View style={styles.oneSummary}><View style={styles.circleCont}><Text><Ionicons name="md-person" size={25} color="#949599" /></Text></View><Text style={{ color: "#949599", fontSize: 13, fontFamily: "SFCompactText-Regular" }}> {post.user.display_name}</Text></View>

                            <View style={styles.oneSummary}>
                                <View style={styles.circleCont}>
                                    <Text>
                                        <Ionicons name="md-pricetag" size={25} color="#949599" />
                                    </Text>
                                </View>
                                {post.interests.map(i => <Text style={{ color: "#949599", fontSize: 13, fontFamily: "SFCompactText-Regular" }}>{i.name}. </Text>)}
                            </View>

                            <View style={styles.oneSummaryBottom}><View style={styles.circleCont}><Text><Ionicons name="ios-pin" size={25} color="#949599" /></Text></View>{post.zones.map(i => <Text style={{ color: "#949599", fontSize: 13, fontFamily: "SFCompactText-Regular" }}>{i.name}. </Text>)}</View>
                        </View>

                        <View style={{ width: "100%",marginTop:"5%"}}>
                            <Text style={{ color: "#454547", fontSize: 14, fontFamily: "SFProText-Regular" }}>{post.short_description}</Text>
                        </View>

                        <View style={{ width: "100%",marginTop:"5%"}}>
                            <Text style={{ color: "#949599", fontSize: 14, fontFamily: "SFProText-Regular" }}>{post.description}</Text>
                        </View>

                    </View>
                    <View style={{width:"100%", height: 150}}></View>
                </ScrollView>
                    <View style={styles.p_buttonCont}>
                        <View style={{ width: "50%", alignItems: "flex-start", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.p_button} onPress={() => this.mail()}>
                                <Text> <Ionicons name="ios-mail" size={18} color="#8FBD2A" /></Text><Text style={{ color: "#8FBD2A", fontSize: 14, fontFamily: "SFCompactText-Regular", textAlign: "center" }}>   Mandar Email</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: "50%", alignItems: "flex-end", justifyContent: "center" }}>
                            <TouchableOpacity style={styles.p_button} onPress={() => this.call()} >
                                <Text> <Ionicons name="ios-call" size={18} color="#8FBD2A" /> </Text><Text style={{ color: "#8FBD2A", fontSize: 14, fontFamily: "SFCompactText-Regular", textAlign: "center" }}>   Llamar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

            </View>
        )

    }
}
export default Details

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "white",
        zIndex: 20,

    },
    header_ios: {
        width: "100%",
        height: 70,
        borderBottomColor: "#818386",
        borderBottomWidth: 0.5,
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    header_android: {
        width: "100%",
        height: 70,
        borderBottomColor: "#818386",
        borderBottomWidth: 0.5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        flexDirection: "row"

    },
    contentContainer: {
        width: "100%",
        padding: "5%",

    },
    summary: {
        height: 150,

        width: "100%"
    },
    circleCont: {
        backgroundColor: "#F5F5F5",
        borderRadius: 50,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        marginRight: "5%"
    },
    oneSummary: {
        flexDirection: "row",
        width: "100%",
        height: 50,
        borderBottomColor: "#EBEBEB",
        borderBottomWidth: 1,
        alignItems: "center"
    },
    oneSummaryBottom: {
        flexDirection: "row",
        width: "100%",
        height: 50,
        alignItems: "center"
    },
    p_button: {
        height: 35,
        width: "90%",
        backgroundColor: "#F5F5F5",
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: "row"
    },
    p_buttonCont: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingLeft:"5%",
        paddingRight:"5%",
        position:"absolute",
        bottom:0,
        marginBottom: 50
    }
});