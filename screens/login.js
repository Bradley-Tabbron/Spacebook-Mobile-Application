import React, { Component } from 'react';
import { Button, StyleSheet } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
class LogInScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: ""
        }
    }

    render(){
        return (
            <ScrollView>
            <TextInput
                    placeholder="Enter your email..."
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput
                    placeholder="Enter your password..."
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry
                    style={{padding:5, borderWidth:1, margin:5}}
                />
            <Button
                title="Login"
                onPress={() => this.login()}
            />
        </ScrollView>
        );
    } 
    login = async () => {
        return fetch("http://localhost:3333/api/1.0.0/login", {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong';
            }
        })
        .then(async (responseJson) => {
                console.log(responseJson);
                await AsyncStorage.setItem('@session_token', responseJson.token);
                await AsyncStorage.setItem('@loggedinemail', this.state.email);
                await AsyncStorage.setItem('@userid',responseJson.id);
                this.props.navigation.navigate('DrawerStack');
        })
        .catch((error) => {
            console.log(error);
        })
    }
}

export default LogInScreen;

const Styles = StyleSheet.create({
  container: {
      flex:1,
      backgroundColor: 'white',
  },
});


