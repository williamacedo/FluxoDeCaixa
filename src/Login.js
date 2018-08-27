import React, {Component} from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import firebase from './FirebaseConnection';

export default class Login extends Component {

  static navigationOptions = {
    title:'Login',
    headerStyle:{
      backgroundColor: '#FFFF00'
    },
    headerTintColor:'#000000'
  }

  constructor(props){
    super(props);
    this.state = {
      emailInput:'',
      senhaInput:''
    };

    this.entrar = this.entrar.bind(this);

    firebase.auth().signOut();
  }

  entrar() {
    if(this.state.emailInput != '' && this.state.senhaInput != '') {

      firebase.auth().onAuthStateChanged((user) =>{
        if(user) {
          this.props.navigation.navigate('Interna');
        }
      });

      firebase.auth().signInWithEmailAndPassword(
        this.state.emailInput,
        this.state.senhaInput
      ).catch((error)=>{
        alert(error.code);
      });

    }
  }

  render() {

    return(
      <View style={styles.container}>
        <Text>E-mail</Text>
        <TextInput style={styles.input} onChangeText={(emailInput) => this.setState({emailInput})} />
        <Text>Senha</Text>
        <TextInput style={styles.input} secureTextEntry={true} onChangeText={(senhaInput) => this.setState({senhaInput})} />

        <Button title="Entrar" onPress={this.entrar} />
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container:{
    margin:10
  },
  input:{
    height: 40,
    backgroundColor: '#CCCCCC',
    padding: 5,
    marginBottom: 10
  }
});
