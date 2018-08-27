import React, {Component} from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import HistoricoItem from './HistoricoItem';
import firebase from './FirebaseConnection';

export default class Interna extends Component {

  static navigationOptions = {
    title:'Home',
    header: null
  }

  constructor(props) {
    super(props);
    this.state = {
      saldo:0,
      historico:[]
    };

    this.addDespesa = this.addDespesa.bind(this);
    this.addReceita = this.addReceita.bind(this);
    this.Sair = this.Sair.bind(this);

    console.disableYellowBox = true;

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {

        firebase.database().ref('users').child(user.uid).on('value', (snapshot) => {

          let state = this.state;
          state.saldo = snapshot.val().saldo;
          this.setState(state);

        });

        firebase.database().ref('historico').child(user.uid).on('value', (snapshot)=>{

          let state = this.state;
          state.historico = [];

          snapshot.forEach((childItem) => {
            state.historico.push({
              key:childItem.key,
              type:childItem.val().type,
              valor:childItem.val().valor
            });
          });

          this.setState(state);

        });

      } else {
        this.props.navigation.navigate('Home');
      }
    });
  }

  addReceita() {
    this.props.navigation.navigate('AddReceita');
  }

  addDespesa() {
    this.props.navigation.navigate('AddDespesa');
  }

  Sair() {
    firebase.auth().signOut();
  }

  render() {

    return(
      <View style={styles.container}>
        <View style={styles.saldoArea}>
          <Text style={styles.saldo}>Saldo: R$ {this.state.saldo} </Text>
        </View>
        <FlatList style={styles.historico} data={this.state.historico} renderItem={({item}) => <HistoricoItem data={item} />} />
        <View style={styles.botoesArea}>
          <Button title="Add Receita" onPress={this.addReceita} />
          <Button title="Add Despesa" onPress={this.addDespesa} />
          <Button title="Sair" onPress={this.Sair} />
        </View>
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  saldoArea:{
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#DDDDDD'
  },
  saldo:{
    textAlign: 'center',
    fontSize: 25
  },
  historico:{
    flex: 1
  },
  botoesArea:{
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#DDDDDD',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
});
