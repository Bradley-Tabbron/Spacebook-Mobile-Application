import React, { Component } from 'react';
import { View, Text, Button, FlatList} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView,TextInput } from 'react-native-gesture-handler';

class FriendsScreen extends Component {
    constructor(props){
        super(props);
    
        this.state = {
          isLoading: true,
          friendsData: [],
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
                <Text>Friends Screen</Text>
                <Button
                    title="FriendsPosts"
                    onPress={() => this.props.navigation.navigate("FriendsPosts")}
                />
                <Button
                    title="Friend Requests"
                    onPress={() => this.props.navigation.navigate("FriendsRequests")}
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
            </ScrollView>
        );}
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

export default FriendsScreen;