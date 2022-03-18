import React, { Component } from 'react';
import { View, Text, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView,TextInput } from 'react-native-gesture-handler';

class HomeScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
            userid:"",
            posttext:"",
         search:"",
          useremail:"s",
          isLoading: true,
          listData: [],
          searchData:[],
          token:"",
          friendid:""

        }
      }
    render(){
        if (this.state.isLoading){
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>Loading..</Text>
              </View>
            );
          }else{
            return (
              <ScrollView>
                <Text>Home Screen</Text>
                <View style={{flexDirection:'row'}}>
                <TextInput placeholder="type id in to send friend request"
                 onChangeText={(friendid) => this.setState({friendid})}
                 value={this.state.friendid}
                 style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Send Friend Request"
                    onPress={() => this.sendfriendrequest()} />
                    </View>
                <View style={{flexDirection:'row'}}>
                <TextInput placeholder="Search for a person"
                 onChangeText={(search) => this.setState({search})}
                 value={this.state.search}
                 style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Search"
                    onPress={() => this.getSearchData()} />
                    </View>
                <FlatList
                      data={this.state.searchData}
                      renderItem={({item}) => (
                          <View>
                        
                            <Text>{item.user_givenname} {item.user_familyname}: User ID {item.user_id}</Text>
     
                        </View>
                      )}
                      keyExtractor={(item,index) => item.user_id.toString()}
                    />
                    <View style={{flexDirection:'row'}}>
                <TextInput placeholder="Type Post here"
                 onChangeText={(posttext) => this.setState({posttext})}
                 value={this.state.posttext}
                 style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Post"
                    onPress={() => this.submitPost()} />
                    </View>
              </ScrollView>
            );
          }
    } 
    submitPost = () => {
        let to_send = {
            
                text: this.state.posttext
              
          };
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userid.toString()+"/post", {
            method: 'post',
            headers: {
              'X-Authorization':  this.state.token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
          console.log("post sent");
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        })
      }
    sendfriendrequest = () => {
    
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.friendid.toString()+"/friends", {
            method: 'post',
            headers: {
              'X-Authorization':  this.state.token
            }
        })
        .then((response) => {
          console.log("request sent");
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        })
      }
    getSearchData = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/search?q="+this.state.search.toString(), {
              'headers': {
                'X-Authorization':  value
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                  this.props.navigation.navigate('LoginStack',{ screen: 'Welcome' });
                }else{
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
                searchData: responseJson,
                
                token:value
              });
              this.forceUpdate();
            })
            .catch((error) => {
                console.log(error);
            })
      }
    
    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
        this.getData();
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }
      getData = async () => {
        const uid= await AsyncStorage.getItem('@userid');
        const uem = await AsyncStorage.getItem('@loggedinemail');
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/search", {
              'headers': {
                'X-Authorization':  value
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                  this.props.navigation.navigate('LoginStack',{ screen: 'Welcome' });
                }else{
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                listData: responseJson,
                useremail:uem,
                userid:uid,
                token:value
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }
    
      checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if (value == null) {
            this.props.navigation.navigate('LoginStack',{ screen: 'Welcome' });
        }
      };
    
}

export default HomeScreen;

