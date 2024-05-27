import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native';
import { useEffect, useState } from "react";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { DeviceMotion } from 'expo-sensors';



const Leaderboard = () => {
    const navigation = useNavigation();
    const goToHome = () => {
        navigation.navigate("Home")
    }

    useEffect(() => {
        //Schüttel short-cut zum Home zu gelangen
        DeviceMotion.addListener(data => {
            const { acceleration } = data;
            if (acceleration.x > 40 || acceleration.y > 40 || acceleration.z > 40) {
                navigation.navigate("Home")
                Alert.alert("Zurück", "Sie sind wieder im Home")
            }
        });
    }, []);
    const [friends, setFriends] = useState([]);
    //Verbindet sich mit Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyAYepCo31QscKt3b05ChdvvPe6ZhU6HHZ8",
        authDomain: "tik-tac-toe-763e8.firebaseapp.com",
        databaseURL: "https://tik-tac-toe-763e8-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "tik-tac-toe-763e8",
        storageBucket: "tik-tac-toe-763e8.appspot.com",
        messagingSenderId: "564715586315",
        appId: "1:564715586315:web:c77d45fdc77826c537d80e",
        measurementId: "G-XENGBFXZME"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    //Bekommt alle Freunde von Firebase
    async function getfriends(db) {
        const friendsCol = collection(db, 'friends');
        const friendsSnapshot = await getDocs(friendsCol, {
            orderBy: ('won', 'asc')
        });
        const friends = friendsSnapshot.docs.map(doc => doc.data());
        return friends;
    }
    //tut die Freund von der Datenbank in ein Array 
    async function fetchData() {
        const friends = await getfriends(db);
        setFriends(friends);
    }



    useEffect(() => {

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            {friends.map((friends, index) => (
                //geht durch jede Freund und zeigt die an
                <View key={friends.name} style={styles.playerContainer}>
                    <Text style={styles.rankText}>#{index + 1}</Text>
                    <Text style={styles.nameText}>{friends.name}</Text>
                    <Text style={styles.recordText}>{friends.won} Gewonnen, {friends.lost} Verloren</Text>
                </View>
            ))}

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    playerContainer: {

        alignItems: 'center',
        marginBottom: 16
    },
    rankText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8
    },
    nameText: {
        fontSize: 24,
        marginRight: 8
    },
    recordText: {
        fontSize: 18
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: 'grey',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        margin: 2
    },
    buttonText: {
        color: 'red',
        fontWeight: '700',
        fontSize: 16,
    },
});

export default Leaderboard;
