import React, { Component } from 'react';
import { View, Text, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView,TextInput } from 'react-native-gesture-handler';

class FriendsPostsScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          isLoading: true,
          friendsData: [],
          token:"",
          friendid:"",
          postid:"",
          postdata:""

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
                <Text>Friends Posts Screen</Text>
                <TextInput placeholder="type friend id here"
                 onChangeText={(friendid) => this.setState({friendid})}
                 value={this.state.friendid}
                 style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput placeholder="type post id here"
                 onChangeText={(postid) => this.setState({postid})}
                 value={this.state.postid}
                 style={{padding:5, borderWidth:1, margin:5}}
                />
                <View style={{flexDirection:'row'}}>
                <Button
                    title="View Friends Posts"
                    onPress={() => this.getpostData()} />
                <Button
                    title="Like"
                    color="green"
                    onPress={() => this.likepost()} />
                    <Button
                    title="Unlike"
                    color="red"
                    onPress={() => this.unlikepost()} />
                    </View>
                 <Text
                    style={{
                        fontWeight:'bold',
                        fontSize:18,
                        paddingHorizontal:10,
                        marginTop:10,
                        marginBottom:20,
                        color:'black',
                    }}>
                        Your Friends</Text>
                        <FlatList
                      data={this.state.friendsData}
                      renderItem={({item}) => (
                          <View>
                        
                            <Text>{item.user_givenname} {item.user_familyname}: User ID {item.user_id}</Text>
                            
                        </View>
                      )}
                      keyExtractor={(item,index) => item.user_id.toString()}
                    />
                    <Text
                    style={{
                        fontWeight:'bold',
                        fontSize:18,
                        paddingHorizontal:10,
                        marginTop:10,
                        marginBottom:20,
                        color:'black',
                    }}>
                        Your Friends Posts</Text>
                        <FlatList
                      data={this.state.postdata}
                      renderItem={({item}) => (
                          <View>
                        
                            <Text>Post ID: {item.post_id}: {item.text} :Likes {item.numLikes}</Text>
                            
                        </View>
                      )}
                    keyExtractor={(item,index) => item.post_id.toString()}  
                    />

            </ScrollView>);}
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
      likepost = () => {
    
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.friendid.toString()+"/post/"+this.state.postid.toString()+"/like", {
            method: 'post',
            headers: {
              'X-Authorization':  this.state.token
            }
        })
        .then((response) => {
          console.log("post liked");
          this.getpostData();
        })
        .catch((error) => {
          console.log(error);
        })
      }
      unlikepost = () => {
    
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.friendid.toString()+"/post/"+this.state.postid.toString()+"/like", {
            method: 'delete',
            headers: {
              'X-Authorization':  this.state.token
            }
        })
        .then((response) => {
          console.log("post unliked");
          this.getpostData();
        })
        .catch((error) => {
          console.log(error);
        })
      }
      getpostData = async () => {
        const uid = await AsyncStorage.getItem('@userid')
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.friendid.toString()+"/post", {
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
                postdata: responseJson,
                token:value
              })
            })
            .catch((error) => {
                console.log(error);
            })
      }
      getData = async () => {
        const uid = await AsyncStorage.getItem('@userid')
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+uid.toString()+"/friends", {
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
                friendsData: responseJson,
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

export default FriendsPostsScreen;