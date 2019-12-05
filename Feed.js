import { StyleSheet, Text, View, RefreshControl, FlatList} from 'react-native';
import React, { Component } from 'react';
import axios from 'axios'
import Premium from './Premium';
import Free from './Free';
import Sponsor from './Sponsor';
import FeedHeader from './FeedHeader';
import Details from './Details';
import { isIphoneX } from 'react-native-iphone-x-helper'
import Footer from '../../components/Footer';


class Feed extends Component {
    constructor(props) {
        super(props)
        this.state = {
            zones: [],
            interests: [],
            data: [],
            page: 1,
            last_item_id: "",
            total_advertisings: 0,
            showDetails: false,
            saveDetails: {},
            refreshing: false
        }
    }

     componentDidMount=async()=> {
         this.props.getUserData()
        interests= []
        zones=[]
        JSON.parse(this.props.userData).interests.forEach(i=> interests.push(i.code))
        JSON.parse(this.props.userData).zones.forEach(z=> zones.push(z.code))
        this.setState({interests, zones})
        await this.getFeed()

    }

    getFeed = async (add) => {
        let last_item_id=""
        if(this.state.data && add){
         last_item_id = this.state.data[this.state.data.length - 1].id
        }
      

        let headers = {
            Auth: `Bearer ${this.props.internalToken}`
        }
        body = {
            "search_text": "",
            "limit": 10,
            "last_item_id": last_item_id,
            "interests": this.state.interests,
            "zones": this.state.zones,
            "page": this.state.page
        }
        axios.post('adress', body, { headers })
            .then(async response => {
                if(!add){
                    this.setState({data: response.data.content.data})
                }
                else{
                    let posts = this.state.data
                    response.data.content.data.forEach(d=>posts.push(d))
                    this.setState({ data: posts })
                }

                this.feedMetrics(response.data.content.data)
                
                return response.data.content.data
            })
            .catch(error => { console.log("feed error:" + error) })
    }

    feedMetrics( posts ) {
        let ids=[]
        posts.forEach(p=>ids.push(p.id))
        
        headers= {
            'Auth': `Bearer ${this.props.internalToken}`
        }
        body= {
            "advertisings": ids,
            "type_statistic": "feed"
        }
        axios.post('https://somosagro.cysonline.com.ar/api/send_statistics', body, {headers})
            .then(async response => {
                if(response.data.status !== 200){
                    console.log("could not update statistics")
                }
            })
            .catch(error => { console.log("Feeds metrics error:" + error) })
    }

   

    _onRefresh = () => {
        

        this.setState({ refreshing: true });
        this.getFeed().then(() => {
            this.setState({ refreshing: false });
        });
    }

    handleLoadMore=()=>{
        this.setState({page: this.state.page + 1}, ()=>{
            this.getFeed(true)
        })
    }


    showDetails = () => {
        this.setState({ showDetails: !this.state.showDetails })

    }
    saveDetails = async (post) => {
        await this.setState({ saveDetails: post })
    }

    scrollTop=()=>{
        this.flatListRef.scrollToIndex({animated: true,index:0})
    }
    render() {
        let os = "feed"
        if (isIphoneX()) {
            os = "feed_ios"
        }
        else {
            os = "feed"
        }
        return (<View style={styles.container}>
            <FeedHeader />
            {this.state.showDetails ? <Details internalToken={this.props.internalToken} showDetails={this.showDetails} post={this.state.saveDetails} /> : null}

            <FlatList 
            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} /> }
            style={styles[os]}   data={this.state.data}  keyExtractor={(item) => item.id}
            onEndReached={this.handleLoadMore}  onEndReachedThreshold={0}
            ref={(ref) => { this.flatListRef = ref; }}

            renderItem={(d)=>{
                if (d.item.type_advertising == "premium") {
                   return <Premium internalToken={this.props.internalToken} saveDetails={this.saveDetails} post={d.item} showDetails={this.showDetails} />

                }
                else if (d.item.type_advertising == "free") {
                    return <Free post={d.item} showDetails={this.showDetails} saveDetails={this.saveDetails} />
                }
                else if (d.item.type == "sponsor") {
                    return <Sponsor post={d.item} />
                }
            }}/>
                

            <Footer place={this.props.place} goToSearch={this.props.goToSearch} scrollTop={this.scrollTop} getFeed={this.getFeed} logOut={this.props.logOut} />
        </View>)
    }
}
export default Feed;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 15,

    },
    feed_ios: {
        width: "100%",
        marginBottom: 80,
        flex:1,

     
    },
    feed: {
        width: "100%",
        marginBottom: 60,
    },



});

// data block example
let jsondata = [

    {
        "id": 130,
        "type": "advertising",
        "title": "Vacas nuevas",
        "short_description": "Hola vendo cereales baratos mejor calidad, comunicarse a mi numero o mail para saber mas al respecto. Hola vendo cereales baratos mejor calidad, comunicarse a mi numero o mail para saber mas al respecto. Mejor cosecha en años",
        "description": "Trigos de la mejor calidad, cereales de todo tipo, recien cosechados. Mejor cosecha en años, para saber mas por favor comunicarse.",
        "days": 30,
        "price": 3000,
        "type_advertising": "premium",
        "user": {
            "username": "Cosechas.SA",
            "display_name": "Cosechas.SA",
            "email": "noelia@gmail.com",
            "phone_number": "011-789465"
        },
        "interests": [
            {
                "id": 5,
                "name": "Tractor",
                "code": "tractor",
                "icon": null
            },
            {
                "id": 47,
                "name": "Trigo",
                "code": "ganaderos",
                "icon": null
            },
            {
                "id": 47,
                "name": "Ganaderos",
                "code": "ganaderos",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 2,
                "name": "Cuyo",
                "code": "cuyo"
            }
        ],
        "media": [
            {
                "id": 368,
                "filename": "vaca.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1545407263-7ff5aa2ad921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
            },
            {
                "id": 369,
                "filename": "pasto.png",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 370,
                "filename": "homero.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ]
    },
    {
        "id": 164,
        "type": "advertising",
        "title": "Vendo terreno",
        "short_description": "Terreno en buenas condiciones para plantar o para tener vacas, no se inunda.",
        "description": "Mejores terrenos en todo el país, apto para trigo, apto para tener vacas o construir. Todo tipo de fines. Prevencion de inundaciones. Contacteme.",
        "days": 15,
        "price": null,
        "type_advertising": "free",
        "interests": [
            {
                "id": 5,
                "name": "Soja",
                "code": "soja",
                "icon": null
            },
            {
                "id": 5,
                "name": "Remate",
                "code": "soja",
                "icon": null
            },
            {
                "id": 5,
                "name": "Cursos",
                "code": "soja",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 1,
                "name": "Centro",
                "code": "centro"
            }
        ],
        "media": [
            {
                "id": 404,
                "filename": "soja.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1495013034289-3664878e32f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1983&q=80"
            }
        ],
        "user": {
            "username": "Inmobiliaria Agro",
            "display_name": "Jorge-Terrenos SA",
            "email": "sda@gmail.com",
            "phone_number": "011-789465"
        }
    },
    {
        "id": 164,
        "type": "advertising",
        "title": "Vendo Tractor barato",
        "short_description": "Tractor en buenas condiciones para plantar o aplanar, no se acaba la bateria.",
        "description": "Buen tractor mejores condiciones",
        "days": 15,
        "price": null,
        "type_advertising": "free",
        "interests": [
            {
                "id": 5,
                "name": "Soja",
                "code": "soja",
                "icon": null
            },
            {
                "id": 5,
                "name": "Ganadero",
                "code": "soja",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 1,
                "name": "Centro",
                "code": "centro"
            }
        ],
        "media": [
            {
                "id": 403,
                "filename": "soja.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1531299192269-7e6cfc8553bb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ],
        "user": {
            "username": "valuuuuuu",
            "display_name": "Jorge-Terrenos SA",
            "email": "sdafnfnfasdfasdfasdfnfnf@gmail.com",
            "phone_number": "011-789465"
        }
    },
    {
        "id": 129,
        "type": "advertising",
        "title": "Vaca bebe buena carne",
        "short_description": "las mejor soja para",
        "description": "si no la compras te arrepentis papa",
        "days": 30,
        "price": 3000,
        "type_advertising": "premium",
        "user": {
            "username": "Noelia_Bogado",
            "display_name": "Marcelo rodriguez",
            "email": "maerce-vacas@gmail.com",
            "phone_number": "01149940"
        },
        "interests": [
            {
                "id": 5,
                "name": "Soja",
                "code": "soja",
                "icon": null
            },
            {
                "id": 47,
                "name": "Ganaderos",
                "code": "ganaderos",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 2,
                "name": "Cuyo",
                "code": "cuyo"
            }
        ],
        "media": [
            {
                "id": 368,
                "filename": "vaca.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 369,
                "filename": "pasto.png",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 370,
                "filename": "homero.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ]
    },
    {
        "id": 128,
        "type": "advertising",
        "title": "Vacas nuevas",
        "short_description": "las mejor soja para veganos del mundo las mejor soja para veganos del mundo las mejor soja para veganos del",
        "description": "si no la compras te arrepentis papa",
        "days": 30,
        "price": 3000,
        "type_advertising": "premium",
        "user": {
            "username": "Noelia_Bogado",
            "display_name": "Noelia  Bogado",
            "email": "noelia@gmail.com",
            "phone_number": "011-789465"
        },
        "interests": [
            {
                "id": 5,
                "name": "Soja",
                "code": "soja",
                "icon": null
            },
            {
                "id": 47,
                "name": "Ganaderos",
                "code": "ganaderos",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 2,
                "name": "Cuyo",
                "code": "cuyo"
            }
        ],
        "media": [
            {
                "id": 368,
                "filename": "vaca.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            },
            {
                "id": 369,
                "filename": "pasto.png",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 370,
                "filename": "homero.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ]
    },
    {
        "id": 127,
        "type": "advertising",
        "title": "Vacas nuevas",
        "short_description": "Hola vendo cereales baratos mejor calidad, comunicarse a mi numero o mail para saber mas al respecto.",
        "description": "si no la compras te arrepentis papa",
        "days": 30,
        "price": 3000,
        "type_advertising": "premium",
        "user": {
            "username": "Noelia_Bogado",
            "display_name": "Raul Martinez",
            "email": "Raul.M.1999@gmail.com",
            "phone_number": "0117894595"
        },
        "interests": [
            {
                "id": 5,
                "name": "Cereales",
                "code": "soja",
                "icon": null
            },
            {
                "id": 47,
                "name": "Ganaderos",
                "code": "ganaderos",
                "icon": null
            },
            {
                "id": 47,
                "name": "Tractores",
                "code": "ganaderos",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 2,
                "name": "Cuyo",
                "code": "cuyo"
            }
        ],
        "media": [
            {
                "id": 368,
                "filename": "vaca.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1545407263-7ff5aa2ad921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
            },
            {
                "id": 369,
                "filename": "pasto.png",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 370,
                "filename": "homero.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ]
    },
    {
        "id": 126,
        "type": "advertising",
        "title": "Vacas nuevas",
        "short_description": "las mejor soja para veganos del mundo las mejor soja para veganos del mundo las mejor soja para veganos del",
        "description": "si no la compras te arrepentis papa",
        "days": 30,
        "price": 3000,
        "type_advertising": "premium",
        "user": {
            "username": "Noelia_Bogado",
            "display_name": "Noelia",
            "email": "noelia@gmail.com",
            "phone_number": "011-789465"
        },
        "interests": [
            {
                "id": 5,
                "name": "Soja",
                "code": "soja",
                "icon": null
            },
            {
                "id": 47,
                "name": "Ganaderos",
                "code": "ganaderos",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 2,
                "name": "Cuyo",
                "code": "cuyo"
            }
        ],
        "media": [
            {
                "id": 368,
                "filename": "vaca.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1545407263-7ff5aa2ad921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
            },
            {
                "id": 369,
                "filename": "pasto.png",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 370,
                "filename": "homero.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ]
    },
    {
        "id": 10,
        "type": "sponsor",
        "media": [
            {
                "id": 10,
                "filename": "archivo_sponsor_10.png",
                "absolute_url": "https://somosagro.cysonline.com.ar/media/2019/11/14/archivo-sponsor-10-5dcd498da9e75607310281.png"
            }
        ]
    },
    {
        "id": 125,
        "type": "advertising",
        "title": "Vacas nuevas",
        "short_description": "las mejor soja para veganos del mundo",
        "description": "si no la compras te arrepentis papa",
        "days": 30,
        "price": 3000,
        "type_advertising": "premium",
        "user": {
            "username": "Noelia_Bogado",
            "display_name": "Noelia",
            "email": "noelia@gmail.com",
            "phone_number": "011-789465"
        },
        "interests": [
            {
                "id": 5,
                "name": "Soja",
                "code": "soja",
                "icon": null
            },
            {
                "id": 47,
                "name": "Ganaderos",
                "code": "ganaderos",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 2,
                "name": "Cuyo",
                "code": "cuyo"
            }
        ],
        "media": [
            {
                "id": 368,
                "filename": "vaca.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1545407263-7ff5aa2ad921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
            },
            {
                "id": 369,
                "filename": "pasto.png",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 370,
                "filename": "homero.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ]
    },
    {
        "id": 124,
        "type": "advertising",
        "title": "Vacas nuevas",
        "short_description": "las mejor soja para veganos del mundo",
        "description": "si no la compras te arrepentis papa",
        "days": 30,
        "price": 3000,
        "type_advertising": "premium",
        "user": {
            "username": "Noelia_Bogado",
            "display_name": "Noelia Ganadera",
            "email": "noelia@gmail.com",
            "phone_number": "011-789465"
        },
        "interests": [
            {
                "id": 5,
                "name": "Soja",
                "code": "soja",
                "icon": null
            },
            {
                "id": 47,
                "name": "Ganaderos",
                "code": "ganaderos",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 2,
                "name": "Cuyo",
                "code": "cuyo"
            }
        ],
        "media": [
            {
                "id": 368,
                "filename": "vaca.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1545407263-7ff5aa2ad921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
            },
            {
                "id": 369,
                "filename": "pasto.png",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 370,
                "filename": "homero.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ]
    },
    {
        "id": 9,
        "type": "sponsor",
        "media": [
            {
                "id": 9,
                "filename": "archivo_sponsor_9.png",
                "absolute_url": "https://somosagro.cysonline.com.ar/media/2019/11/14/archivo-sponsor-10-5dcd498da9e75607310281.png"
            }
        ]
    },
    {
        "id": 123,
        "type": "advertising",
        "title": "Terreno de ganaderia",
        "short_description": "las mejor soja para veganos del mundo las mejor soja para veganos del mundo",
        "description": "si no la compras te arrepentis papa",
        "days": 30,
        "price": 3000,
        "type_advertising": "premium",
        "user": {
            "username": "Noelia_Bogado",
            "display_name": "Vendedor de terreno",
            "email": "noelia@gmail.com",
            "phone_number": "011-789465"
        },
        "interests": [
            {
                "id": 5,
                "name": "Soja",
                "code": "soja",
                "icon": null
            },
            {
                "id": 47,
                "name": "Ganaderos",
                "code": "ganaderos",
                "icon": null
            }
        ],
        "zones": [
            {
                "id": 2,
                "name": "Cuyo",
                "code": "cuyo"
            }
        ],
        "media": [
            {
                "id": 368,
                "filename": "vaca.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1545407263-7ff5aa2ad921?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"
            },
            {
                "id": 369,
                "filename": "pasto.png",
                "absolute_url": "https://images.unsplash.com/photo-1546445317-29f4545e9d53?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=946&q=80"
            },
            {
                "id": 370,
                "filename": "homero.jpg",
                "absolute_url": "https://images.unsplash.com/photo-1440428099904-c6d459a7e7b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
            }
        ]
    },

]

