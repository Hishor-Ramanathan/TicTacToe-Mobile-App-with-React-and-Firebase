import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';



const TicTacToe = () => {
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
    const [board, setBoard] = useState([['', '', ''],
    ['', '', ''],
    ['', '', '']
    ]);
    const [currentPlayer, setCurrentPlayer] = useState('X');

    const handlePress = (row, col) => {
        //kontrolliert das man nicht auf platzierte Felder wieder was legen wil
        if (board[row][col] !== '') {
            return;
        }

        //macht die Zug
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);








       // Kontrolliert ob jemand schon gewonnen hat
        const winningCombinations = [[[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
        ];
        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (
                board[a[0]][a[1]] === currentPlayer &&
                board[b[0]][b[1]] === currentPlayer &&
                board[c[0]][c[1]] === currentPlayer
            ) {
                alert(`Sie gewinnen!`);
                setBoard([['', '', ''],
                ['', '', ''],
                ['', '', '']
                ]);
                return;
            }
        }

        // Kontrolliert ob es ein unentschieden ist
        let isDraw = true;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    isDraw = false;
                    break;
                }
            }
        }
        if (isDraw) {
            alert('Unentschieden');
            setBoard([['', '', ''],
            ['', '', ''],
            ['', '', '']
            ]);
            return;
        }

        //Computers Zug
        var check = 1;
        do {
            row = Math.floor(Math.random() * 3);
            col = Math.floor(Math.random() * 3);
            if (board[row][col] == '') {
                check++;
            }
        } while (check == 1);
        newBoard[row][col] = "O";
        setBoard(newBoard);

        for (let i = 0; i < winningCombinations.length; i++) {
            const [a, b, c] = winningCombinations[i];
            if (
                board[a[0]][a[1]] === "O" &&
                board[b[0]][b[1]] === "O" &&
                board[c[0]][c[1]] === "O"
            ) {
                alert(`Computer O gewinnt!`);
                setBoard([['', '', ''],
                ['', '', ''],
                ['', '', '']
                ]);
                return;
            }
        }

          // Kontrolliert ob es ein unentschieden ist
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === '') {
                    isDraw = false;
                    break;
                }
            }
        }
        if (isDraw) {
            alert('Unentschieden');
            setBoard([['', '', ''],
            ['', '', ''],
            ['', '', '']
            ]);
            return;
        }

    };

    return (

        <View>
            <Text style={styles.header}>Üben</Text>
            <View style={styles.container}>

                {board.map((rows, rowIndex) =>
                    rows.map((_, colIndex) => (
                        <TouchableOpacity
                            key={`${rowIndex}-${colIndex}`}
                            style={styles.square}
                            onPress={() => handlePress(rowIndex, colIndex)}
                        >
                            <Text style={styles.text}>{board[rowIndex][colIndex]}</Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginTop: 100
    },
    square: {
        width: 130,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#000'
    },
    text: {
        fontSize: 60
    },
    header: {
        textAlign: 'center',
        marginTop: 70,
        fontWeight: 'bold',
        fontSize: 40
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 10,
        width: 65,
        height: 40
    },
    buttonText: {
        fontWeight: "bold",
    }

});

export default TicTacToe;

