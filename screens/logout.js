import React, { Component } from 'react';
import { View, Text,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class LogOutScreen extends Component {
    render(){
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Log Out Screen</Text>
                <Button
                    title="Log Out"
                    onPress={() => this.logout()}
                />
            </View>
        );
    } 
    constructor(props){
        super(props);

        this.state = {
            token: ''
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });        
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate('LoginStack',{ screen: 'Welcome' });
        }
    }

    logout = async () => {
        let token = await AsyncStorage.getItem('@session_token');
        await AsyncStorage.removeItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate('LoginStack',{ screen: 'Welcome' });
            }else if(response.status === 401){
                this.props.navigation.navigate('LoginStack',{ screen: 'Welcome' });
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }
}

export default LogOutScreen;