import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import React, { Component } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'expo';



class Sponsor extends Component {
    constructor() {
        super()
        this.state = {
         pictures:[],
         link:""
        }
    }
componentDidMount(){
   let  pictures =[]
    this.props.post.media.forEach(m => pictures.push(m.absolute_url))
    this.setState({pictures})

    Image.getSize(pictures[0], (width, height) => {
        // calculate image width and height 
        const screenWidth = Dimensions.get('window').width
        const scaleFactor = width / screenWidth
        const imageHeight = height / scaleFactor
        this.setState({imgWidth: screenWidth, imgHeight: imageHeight})
      })
}


    render() {
        let post = this.props.post
        let {imgWidth, imgHeight} = this.state
                        return (
                            <View style={styles.sponsor}>
                                <TouchableOpacity onPress={()=>{Linking.openURL(post.link)}}>
                                <Image style={{ width: imgWidth, height:imgHeight}} source={{uri: this.state.pictures[0]}}/>

                                </TouchableOpacity>
                            </View>
                        )
                    
    }
}
export default Sponsor

const styles = StyleSheet.create({
sponsor:{
    width: "100%",
    borderTopColor: "#949599",
    borderTopWidth:1,
    borderBottomColor: "#949599",
    borderBottomWidth: 1,
    
    
}
});