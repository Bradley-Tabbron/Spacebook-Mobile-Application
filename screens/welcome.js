import React, { Component } from 'react';
import { View, Text,Button,StyleSheet,Image } from 'react-native';

class WelcomeScreen extends Component {
    render(){
        return (
            <View style={Styles.container}>
                <View style={Styles.screenTitleView}>
                    <Image
                    source={require('./assets/logo.jpg')}
                    style={{width:150,height:150}}
                    />
                    <Text style={Styles.descriptionStyle}>Welcome To Spacebook</Text>
                </View>
                <View>
                <Button
                title="Login"
                onPress={() => this.props.navigation.navigate('Login')}
                 />
                 <Button
                title="Sign Up"
                onPress={() => this.props.navigation.navigate('Signup')}
                 />
                </View>
            </View>
        );
    } 
}

export default WelcomeScreen;

const Styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white',
    },
    screenTitleView: {
        flex:0.5,
        width:'100%',
        top:70,
        justifyContent:'flex-start',
        alignItems:'center',
        paddingHorizontal:25,
    },
    descriptionStyle:{
        fontSize:25,
        fontWeight:'bold',
    }
  });