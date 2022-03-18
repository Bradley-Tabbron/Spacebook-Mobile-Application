import React, { Component } from 'react';
import { View, Text, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView,TextInput } from 'react-native-gesture-handler';

class FriendsRequestsScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          isLoading: true,
          requestsData: [],
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
                <View style={{flexDirection:'row'}}>
                <TextInput placeholder="type id here"
                 onChangeText={(friendid) => this.setState({friendid})}
                 value={this.state.friendid}
                 style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Accept Request"
                    color="green"
                    onPress={() => this.acceptfriendrequest()} />
                    <Button
                    title="Reject Request"
                    color="red"
                    onPress={() => this.rejectfriendrequest()} />
                    </View>
                <Text>People who have sent you friend requests and their id's</Text>
                <FlatList
                      data={this.state.requestData}
                      renderItem={({item}) => (
                          <View>
                        
                            <Text>{item.user_givenname} {item.user_familyname}: User ID {item.user_id}</Text>
                            
                        </View>
                      )}
                      keyExtractor={(item,index) => item.user_id.toString()}
                    />

            </ScrollView>
        );}
    } 
    acceptfriendrequest = () => {
    
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+this.state.friendid.toString(), {
            method: 'post',
            headers: {
              'X-Authorization':  this.state.token
            }
        })
        .then((response) => {
          console.log("request accepted");
          this.forceUpdate();
          this.props.navigation.navigate("Friends");
        })
        .catch((error) => {
          console.log(error);
        })
      }
      rejectfriendrequest = () => {
    
        return fetch("http://localhost:3333/api/1.0.0/friendrequests/"+this.state.friendid.toString(), {
            method: 'delete',
            headers: {
              'X-Authorization':  this.state.token
            }
        })
        .then((response) => {
          console.log("request rejected");
          this.getData;
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
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/friendrequests", {
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
                requestData: responseJson,
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

export default FriendsRequestsScreen;