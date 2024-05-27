import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
//import { ScreenOrientation } from 'expo-screen-orientation';

// Allow the screen orientation to change dynamically


const Home = () => {
   
    //um den Eingebenen Namen weiterzugeben
    const [name, setName] = useState('');

    //Das ist die Navigation welche man oben ganze Zeit sieht auf den Screen 
    const navigation = useNavigation();

    const goToMenu = () => {
        //um den Eingebenen Namen weiterzugeben
        navigation.navigate('Menu', { name });
    };

    const gotoLeaderboard = () => {
        navigation.navigate("Leaderboard")
    }

    const goToTicTacToe = () => {
        navigation.navigate("TicTacToe")
    }

   
    
    return (
        <View style={[styles.container]}>
            <Text style={styles.header}>Tic Tac Toe</Text>

            <View style={styles.buttonContainer}>
                <TextInput style={styles.text}
                    value={name}
                    onChangeText={text => setName(text)}
                    placeholder="Gib deinen Namen ein"
                /> 

                <TouchableOpacity onPress={gotoLeaderboard} style={styles.button}>
                    <Text style={styles.buttonText}>Leaderboard</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToMenu} style={styles.button}>
                    <Text style={styles.buttonText}>Gegen Freunde Spielen</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={goToTicTacToe} style={styles.button}>
                    <Text style={styles.buttonText}>Gegen Bot Spielen</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        width: '80%'
    },
    text:{
        textAlign: 'center' 
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
       
    },
    button: {
        backgroundColor: '#cccccc',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 2
    },
    buttonText: {
        color: 'black',
        fontWeight: '700',
        fontSize: 16,
    },
    header: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40
    },
})