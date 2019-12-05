import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SliderBox } from 'react-native-image-slider-box';
import * as MailComposer from 'expo-mail-composer';
import { Linking } from 'expo';
import axios from 'axios'


class Premium extends Component {
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

        axios.post('adress', body, { headers })
            .then(async response => {
                if(response.data.status == 200){
                    ("could not update statistics")
                }
            })
            .catch(error => { console.log("Feeds metrics error:" + error) })
    }

    details = async (post) => {
        await this.props.saveDetails(post)
        this.props.showDetails()
        this.metrics("detail")
    }
    render() {
        let d = this.props.post

        return (
            <View style={styles.premiun}>
                <View>
                    <SliderBox sliderBoxHeight={300} images={this.state.pictures} dotColor="#8FBD2A" />
                </View>

                <TouchableOpacity onPress={() => { this.details(d) }} >
                    <View style={styles.p_text} >

                        <View style={{ width: "100%", marginBottom: "1%" }}>
                            <Text style={{ color: "#454547", fontSize: 13, fontFamily: "SFCompactText-Regular" }}>{d.user.display_name}</Text>
                        </View>
                        <View style={{ width: "100%", marginBottom: "2%" }}>
                            <Text style={{ color: "#454547", fontSize: 18, fontFamily: "GothamRounded-Medium" }}>{d.title}</Text>
                        </View>
                        <View style={{ width: "100%", marginBottom: "2%" }}>
                            <Text style={{ color: "#949599", fontSize: 14, fontFamily: "SFProText-Regular" }}>{d.short_description}</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: "100%", marginBottom: "5%" }}>
                            {d.interests.map(i => <Text style={{ color: "#8FBD2A", fontSize: 12, fontFamily: "SFCompactText-Regular" }}>#{i.name} </Text>)}
                        </View>

                        <View style={styles.p_buttonCont}>
                            <View style={{ width: "50%", alignItems: "flex-start", justifyContent: "center" }}>
                                <TouchableOpacity style={styles.p_button} onPress={() => this.mail()}>
                                    <Text > <Ionicons name="ios-mail" size={18} color="#8FBD2A" /></Text><Text style={{ color: "#8FBD2A", fontSize: 14, fontFamily: "SFCompactText-Regular", textAlign: "center" }}>   Mandar Email</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: "50%", alignItems: "flex-end", justifyContent: "center" }}>
                                <TouchableOpacity style={styles.p_button} onPress={() => this.call()} >
                                    <Text> <Ionicons name="ios-call" size={18} color="#8FBD2A" /> </Text><Text style={{ color: "#8FBD2A", fontSize: 14, fontFamily: "SFCompactText-Regular", textAlign: "center" }}>   Llamar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View></TouchableOpacity>
            </View>
        )

    }
}
export default Premium

const styles = StyleSheet.create({


    premiun: {
        width: "100%",

    },
    p_image: {
        width: "100%",
        height: 300,
    },
    p_text: {
        width: "100%",
        padding: "5%"
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

    }
});