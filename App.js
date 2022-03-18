import 'react-native-gesture-handler';
import React, {Component} from 'react';
import { Text, TextInput, View } from 'react-native';
//import * as eva from '@eva-design/eva';
//import { ApplicationProvider, IconRegistry, Layout,} from '@ui-kitten/components';
//import { EvaIconsPack } from '@ui-kitten/eva-icons';
//import {AppNavigator}from './navigation';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import WelcomeScreen from './screens/welcome';
import SignUpScreen from './screens/signup';
import LogInScreen from './screens/login';
import HomeScreen from './screens/home';
import FriendsScreen from './screens/friends';
import FriendsPostsScreen from './screens/friendsposts';
import FriendsProfileScreen from './screens/friendsprofile';
import LogOutScreen from './screens/logout';
import ProfileScreen from './screens/profile';
import EditProfileScreen from './screens/editprofile';
import SearchScreen from './screens/search';
import FriendsRequestsScreen from './screens/friendsrequests';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <RootNavigator />
    </NavigationContainer>
    );
  }
  
}

export default App;

// Login and main app (stuff you need to be signed in for) stack
const RootNavigator = () => (
  <Stack.Navigator
    initialRouteName="LoginStack">
    <Stack.Screen name="LoginStack" component={LoginStack} options={{ headerShown: false }}/>
    <Stack.Screen name="DrawerStack" component={DrawerStack} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// login stack
const LoginStack = () => (
  <Stack.Navigator
    initialRouteName="Welcome">
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LogInScreen} />
    <Stack.Screen name="Signup" component={SignUpScreen} />     
  </Stack.Navigator>
);

// home stack
const HomeStack = () => (
  <Stack.Navigator
    initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />  
    <Stack.Screen name="Search" component={SearchScreen} />
  </Stack.Navigator>
);

// profile stack
const ProfileStack = () => (
  <Stack.Navigator
    initialRouteName="Profile">
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />  
    <Stack.Screen name="EditProfile" component={EditProfileScreen} />  
  </Stack.Navigator>
);

// friends stack
const FriendsStack = () => (
  <Stack.Navigator
    initialRouteName="Friends">
    <Stack.Screen name="Friends" component={FriendsScreen} options={{ headerShown: false }} />  
    <Stack.Screen name="FriendsProfile" component={FriendsProfileScreen} />
    <Stack.Screen name="FriendsPosts" component={FriendsPostsScreen} />
    <Stack.Screen name="FriendsRequests" component={FriendsRequestsScreen} />
  </Stack.Navigator>
);


//tab navigator (includes the stacks)
const TabNavigator = () => (
  <BottomTab.Navigator initialRouteName="HomeStack">
    <BottomTab.Screen
      options={{tabBarLabel: 'Friends',headerShown: false}}
      name="FriendsStack"
      component={FriendsStack}
    />
    <BottomTab.Screen
      options={{tabBarLabel: 'Home',headerShown: false}}
      name="HomeStack"
      component={HomeStack}
    />
    <BottomTab.Screen
      options={{tabBarLabel: 'Profile',headerShown: false}}
      name="ProfileStack"
      component={ProfileStack}
    />
  </BottomTab.Navigator>
);
// drawer stack()
const DrawerStack = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Spacebook" component={TabNavigator} />
    <Drawer.Screen name="LogOut" component={LogOutScreen} />
  </Drawer.Navigator>
);