import React, { Component } from 'react';
import { View, Text, Button, Image,StyleSheet,FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, TextInput } from 'react-native-gesture-handler';

class ProfileScreen extends Component {
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
            postdata:"w",
            postidnum:"",
            posttextnew:"",
            photo:'./assets/defaultprofile.jpg'
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
                <View
                style={{flexDirection:'row',
                marginTop:20,
                marginLeft:10,
                alignItems:'center',}}>
                    <Image
                     style={{
                         height:60,
                         width:60,
                         borderRadius:50,
                     }}
                     source={require('./assets/defaultprofile.jpg')}/>

                
                <View>
                    <Text
                    style={{
                        fontWeight:'400',
                        fontSize:20,
                        paddingHorizontal:10,
                        marginLeft:10,
                        color:'blue',
                    }}>
                      9
                    </Text>
                    <Text
                    style={{
                        fontSize:20,
                        paddingHorizontal:10,
                        color:'grey',
                    }}>
                      Posts
                    </Text>
                </View>
                <View>
                    <Text
                    style={{
                        fontWeight:'400',
                        fontSize:20,
                        paddingHorizontal:10,
                        marginLeft:10,
                        color:'blue',
                    }}>
                      23
                    </Text>
                    <Text
                    style={{
                        fontSize:20,
                        paddingHorizontal:10,
                        color:'grey',
                    }}>
                      Friends
                    </Text>
                </View>
                <View>
                    <Text
                    style={{
                        fontWeight:'400',
                        fontSize:20,
                        paddingHorizontal:10,
                        marginLeft:10,
                        color:'blue',
                    }}>
                      2
                    </Text>
                    <Text
                    style={{
                        fontSize:20,
                        paddingHorizontal:10,
                        color:'grey',
                    }}>
                      Requests
                    </Text>
                </View>
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
                      {this.state.userfname} {this.state.usersname}
                    </Text>
                    <Button title='Edit Profile' 
                     onPress={() => this.props.navigation.navigate('EditProfile')}/>
                        
                <TextInput placeholder="Type Post ID here"
                 onChangeText={(postidnum) => this.setState({postidnum})}
                 value={this.state.postidnum}
                 style={{padding:5, borderWidth:1, margin:5}}
                />
                <TextInput placeholder="Type Updated Post here here"
                 onChangeText={(posttextnew) => this.setState({posttextnew})}
                 value={this.state.posttextnew}
                 style={{padding:5, borderWidth:1, margin:5}}
                />
                <View style={{flexDirection:'row'}}>
                <Button
                    title="Delete Post"
                    color="red"
                    onPress={() => this.deletePost()} />
                    <Button
                    title="Update Post"
                    onPress={() => this.updatePost()} />
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
                        Your Posts</Text>
                        <FlatList
                      data={this.state.postdata}
                      renderItem={({item}) => (
                          <View>
                        
                            <Text>Post ID: {item.post_id}: {item.text}</Text>
                            
                        </View>
                      )}
                    keyExtractor={(item,index) => item.post_id.toString()}  
                    />
            </ScrollView>
        );}
    } 

    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
          this.checkLoggedIn();
        });
      
        this.getData();
        this.getpostData();
      }
    
      componentWillUnmount() {
        this.unsubscribe();
      }

      updatePost = () => {
        let to_send = {text: this.state.posttextnew};
        
        console.log(JSON.stringify(to_send));
    
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userid.toString()+"/post/"+this.state.postidnum.toString(), {
            method: 'PATCH',
            headers: {
              'content-type': 'application/json',
              'X-Authorization':  this.state.token
            },
            body: JSON.stringify(to_send)
        })
        .then((response) => {
          console.log("Post Updated");
          this.getpostData();
          this.forceUpdate();
        })
        .catch((error) => {
          console.log(error);
        })
      }

      deletePost = () => {
        return fetch("http://localhost:3333/api/1.0.0/user/"+this.state.userid.toString()+"/post/"+this.state.postidnum.toString(), {
            method: 'delete',
            headers: {
              'X-Authorization':  this.state.token
            }
        })
        .then((response) => {
          console.log("post deleted");
          this.getpostData();
        })
        .catch((error) => {
          console.log(error);
        })
      }

      getpostData = async () => {
        const uid = await AsyncStorage.getItem('@userid')
        const value = await AsyncStorage.getItem('@session_token');
        return fetch("http://localhost:3333/api/1.0.0/user/"+uid.toString()+"/post", {
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
                postdata: responseJson,
                token:value
              })
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
                  this.props.navigation.navigate("Login");
                }else if(response.status === 404){
                    this.props.navigation.navigate("Login");
                }else{
                    throw 'Something went wrong';
                }
            })
            .then((responseJson) => {
              this.setState({
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

      get_profile_image = async () => {
        const value = await AsyncStorage.getItem('@session_token');
        const uid = await AsyncStorage.getItem('@userid');
        fetch("http://localhost:3333/api/1.0.0/user/"+uid+"/photo", {
          method: 'GET',
          headers: {
            'X-Authorization': value
          }
        })
        .then((res) => {
          return res.blob();
        })
        .then((resBlob) => {
          let data = URL.createObjectURL(resBlob);
          this.setState({
            photo: data,
            isLoading: false
          });
        })
        .catch((err) => {
          console.log("error", err)
        });
      }
}

export default ProfileScreen;

const styles = StyleSheet.create({});
//code to create a document picker 
//const [fileResponse, setFileResponse] = useState([]);

//  const handleDocumentSelection = useCallback(async () => {
 //   try {
 //     const response = await DocumentPicker.pick({
     //   presentationStyle: 'fullScreen',
     // });
    //  setFileResponse(response);
    //} catch (err) {
     // console.warn(err);
   // }
 // }, []);