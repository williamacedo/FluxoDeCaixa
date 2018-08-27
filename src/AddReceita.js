import React, {Component} from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import firebase from './FirebaseConnection';

export default class AddReceita extends Component {

  static navigationOptions = {
    title:'Adicionar Receita'
  }

  constructor(props) {
    super(props);
    this.state = {
      valor:''
    };

    console.disableYellowBox = true;

    this.add = this.add.bind(this);
}

  add() {
    if(this.state.valor != '') {

      let historico = firebase.database().ref('historico').child(firebase.auth().currentUser.uid);
      let user = firebase.database().ref('users').child(firebase.auth().currentUser.uid);
      let key = historico.push().key;

      historico.child(key).set({
        type:'receita',
        valor:this.state.valor
      });

      user.once('value')
      .then((snapshot)=>{
        let saldo = snapshot.val().saldo;

        saldo += parseFloat(this.state.valor);

        user.set({
          saldo:saldo
        });

        this.props.navigation.goBack();
      });

    }
  }

  render() {

    return(
      <View style={styles.container}>
        <Text>Quanto você quer adicionar</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={this.state.valor} onChangeText={(valor)=>this.setState({valor})} autoFocus={true} />
        <Button title="Adicionar" onPress={this.add} />
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    margin: 10
  },
  input:{
    height: 40,
    backgroundColor: '#DDDDDD',
    marginTop: 20
  }
});
