import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';



class Free extends Component {
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
    details= async(post)=>{
        await this.props.saveDetails(post)
         this.props.showDetails()
     }

    render() {
        let post = this.props.post

        return (
            <View style={styles.free}>
                    <View style={styles.f_image}>
                    <View style={styles.f_image_inner}>
                        <Image style={{ height: "100%", width: "100%" }} source={{ uri: this.state.pictures[0] }} />
                    </View>
                </View>
                <TouchableOpacity style={styles.f_text} onPress={()=>{this.details(post)}}>
                <View >
                    <View style={styles.f_text_inner}>
                        <View style={{ width: "100%", height:"13%"  }}>
                            <Text style={{ color: "#454547", fontSize: 13, fontFamily: "SFCompactText-Regular" }}>{post.user.display_name}</Text>
                        </View>
                        <View style={{ width: "100%", height:"25%"  }}>
                            <Text style={{ color: "#454547", fontSize: 18, fontFamily: "GothamRounded-Medium" }}>{post.title}</Text>
                        </View>
                        <View style={{ width: "100%", height:"50%"  }}>
                            <Text style={{ color: "#949599", fontSize: 14, fontFamily: "SFProText-Regular" }}>{post.short_description}</Text>
                        </View>
                        <View style={{ flexDirection: "row", width: "100%", height:"10%" }}>
                        {post.interests.map(i => <Text style={{ color: "#8FBD2A", fontSize: 13, fontFamily: "SFCompactText-Regularr" }}>#{i.name} </Text>)}
                       </View>
                    </View></View>
                </TouchableOpacity>
                


                
            </View>
        )

    }
}
export default Free

const styles = StyleSheet.create({
    free: {
        height: 230,
        width: "100%",
        flexDirection: "row",
   
    },
    f_text: {
        width: "50%",
        borderColor: "blue",
        justifyContent: "center",
     

    },
    f_text_inner: {
        height: "90%",
        width: "95%",
     
    },
    f_image: {
        width: "50%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
   
    },
    f_image_inner: {
        width: "90%",
        height: "90%",
        
    }

});