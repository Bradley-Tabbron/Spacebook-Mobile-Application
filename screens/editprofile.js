import React, { Component } from 'react';
import { View, Text,Button } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

class EditProfileScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            token:"s",
            isLoading: true,
            userid:"0",
            userfname:"w",
            usersname:"d",
            useremail:"s",
            userinfo:"f",
            first_name: "",
            last_name: "",
            email: ""
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
              <View>
                <Text
                    style={{
                        fontWeight:'bold',
                        fontSize:18,
                        paddingHorizontal:10,
                        marginTop:10,
                        marginBottom:20,
                        color:'black',
                    }}>
                        Edit Information</Text>
               <TextInput
                    placeholder="Enter your first name..."
                    onChangeText={(first_name) => this.setState({first_name})}
                    value={this.state.first_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your last name..."
                    onChangeText={(last_name) => this.setState({last_name})}
                    value={this.state.last_name}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <Button
                    title="Update Profile"
                    onPress={() => this.editprofile()}
                />
                <Text>{this.state.userfname} {this.state.usersname}</Text>
                <Text>{this.state.useremail}</Text>
              </View>
            );
    };}

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
      
        this.getData();
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }

      editprofile = () => {
        let to_send = {};
        if (this.state.userfname != this.state.first_name){
          to_send['first_name'] = this.state.first_name;
        }
    
        if (this.state.usersname != this.state.last_name){
          to_send['last_name'] = this.state.last_name;
        }
    
        if (this.state.useremail != this.state.email){
          to_send['email'] = this.state.email;
        }
    
        console.log(JSON.stringify(to_send));
    
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userid.toString(), {
            method: 'PATCH',
            headers: {
              'content-type': 'application/json',
              'X-Authorization':  this.state.token
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
          console.log("Profile Edited");
          this.forceUpdate();
          this.props.navigation.navigate("Profile");
        })
        .catch((error) => {
          console.log(error);
        })
      }
    
      getData = async () => {
        const uid = await AsyncStorage.getItem('@userid');
        const uem = await AsyncStorage.getItem('@loggedinemail');
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+uid.toString(), {
              'headers': {
                'X-Authorization':  value
              }
            })
            .then((response) => {
                if(response.status === 200){
                    return response.json()
                }else if(response.status === 401){
                  this.props.navigation.navigate('LoginStack',{ screen: 'Welcome' });
                }else if(response.status === 404){
                    this.props.navigation.navigate('LoginStack',{ screen: 'Welcome' });
                }else{
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
                isLoading: false,
                userinfo: responseJson,
                userfname:responseJson.first_name,
                usersname: responseJson.last_name,
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

export default EditProfileScreen;