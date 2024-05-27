import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { useEffect, useState } from "react";
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, updateDoc, doc, collection } from 'firebase/firestore';



const screenWidth = Dimensions.get('window').width;


const Menu = ({ route }) => {

  const navigation = useNavigation();

  const goToMenu = () => {
    navigation.navigate("Menu")
  }

  const gotoLeaderboard = () => {
    navigation.navigate("Leaderboard")
  }

  const goToTicTacToe = () => {
    navigation.navigate("TicTacToe")
  }
  const goToHome = () => {
    navigation.navigate("Home")
  }
  const [player, setPlayer] = useState('');
  useEffect(() => {
    //nimmt den Namen von Menu
    const { name } = route.params;
    setPlayer(name);
    setChallenger1(name);
    setTurn(name);
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
  const [turn, setTurn] = useState();

  const handlePress = (row, col) => {
    //kontrolliert das man nicht auf platzierte Felder wieder was legen will
    if (currentPlayer == "O") {
      setTurn(challenger1);
    } else {
      setTurn(challenger2);
    }
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
        var won = '';
        var lost = '';
        var challenger = 0;
        if (currentPlayer == "X") {
          won = challenger1;
          lost = challenger2
          challenger = 1;
        } else {
          won = challenger2;
          lost = challenger1;
          challenger = 2;
        }
        updateFriends(db, won, lost, challenger);
        setTurn(challenger1);
        Alert.alert(

          'Gratulation!',
          `Spieler ${won} gewinnt\nWollen Sie sehen, ob sich was beim Leaderboard verändert hat?`,
          [
            {
              text: 'Zum Leaderboard',
              onPress: (gotoLeaderboard)
            },
            { text: 'Weiter' },
          ],
          { cancelable: false },
        );
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
      alert('Unentschieden!');
      setBoard([['', '', ''],
      ['', '', ''],
      ['', '', '']
      ]);
      setTurn(challenger1);
      return;
    }

    //Wechselt Spieler

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

  };

  const [isVisible, setIsVisible] = useState(true);
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const [friends, setFriends] = useState([]);
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
  //bekommt Freunde von der datenbank
  async function getfriends(db) {
    const friendsCol = collection(db, 'friends');
    const friendsSnapshot = await getDocs(friendsCol, {
      orderBy: ('won', 'asc')
    });
    const friends = friendsSnapshot.docs.map(doc => doc.data());

    return friends;
  }
  //Addiert den Sieg und den Verlust den Spieler an
  async function updateFriends(db, winner, loser, challenger) {
    var won = 0;
    var lost = 0;
    //geht durch die listen von Freunden um die wins und loses vom eingeben Namen geherauszufinden
    const friends = await getfriends(db);
    for (const x of friends) {
      if (x.name == player) {
        won = x.won;
        lost = x.lost;
      }
    }
    if (challenger == 1) {
      const winnerRef = doc(db, "friends", winner);
      await updateDoc(winnerRef, { won: won + 1 });
      const loserRef = doc(db, "friends", loser);
      await updateDoc(loserRef, { lost: parseInt(challengerLost2) + 1 });
    } else {
      const winnerRef = doc(db, "friends", winner);
      await updateDoc(winnerRef, { won: parseInt(challengerWon2) + 1 });
      const loserRef = doc(db, "friends", loser);
      await updateDoc(loserRef, { lost: lost + 1 });
    }

  };
  async function fetchData() {
    const friends = await getfriends(db);
    setFriends(friends);
  }



  useEffect(() => {

    fetchData();
  }, []);

  const togglePopOut = () => {
    setIsVisible(!isVisible);
  }

  const renderFriendsList = () => {
    return (
      <ScrollView>
        {friends.map(friend => {
          //Zeigt alle Freunde an Sieg und Verluste
          return (
            <TouchableOpacity key={friend.id} onPress={() => toggleChallengeModal(friend)}>
              <View style={styles.friendItem}>
                <Text style={styles.friendName}>{friend.name}</Text>
                <Text style={styles.friendScore}>{friend.won}/{friend.lost}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };
  //Um Popup auf zurufen
  const toggleChallengeModal = (friend) => {
    setChallengeModalVisible(!challengeModalVisible);
    setSelectedFriend(friend);
  }


  const [challenger2, setChallenger2] = useState('');
  const [challengerWon2, setChallengerWon2] = useState('');
  const [challengerLost2, setChallengerLost2] = useState('');
  const [challenger1, setChallenger1] = useState('');

  const challenge2 = (friendName, friendwon, friendlost) => {
    setChallenger2(friendName);
    setChallengerLost2(friendlost);
    setChallengerWon2(friendwon);
    setChallengeModalVisible(false);
    setIsVisible(false);
  }
  const renderChallengeModal = () => {
    return (
      //Popup von Freundinformation 
      <View style={styles.challengeModal}>
        <TouchableOpacity onPress={() => challenge2(selectedFriend.name.toString(), selectedFriend.won.toString(), selectedFriend.lost.toString())}>
          <Text style={styles.challengeModalText}>Herausfordern</Text>
        </TouchableOpacity>
        <Text style={styles.challengeModalText}>{selectedFriend.name}</Text>
        <Text style={styles.challengeModalText}>{selectedFriend.won}/{selectedFriend.lost}</Text>
        <TouchableOpacity onPress={() => setChallengeModalVisible(false)}>
          <Text style={styles.challengeModalText}>Schliessen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePopOut}>
        <Text style={styles}>Menu</Text>
      </TouchableOpacity>
      <Text style={styles.header}>{challenger1} gegen {challenger2}</Text>
      <Text style={styles}>{turn} ist dran</Text>
      <View style={styles.containerMain}>

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
      {isVisible && (
        //Das ist das Menu was auf der Seite auf
        <View style={[styles.popOut, { width: screenWidth * 0.6 }]}>
          <Text style={styles.buttonText}>Online</Text>
          {renderFriendsList()}
      
          <Text style={styles.otherOptionsText}>Andere Optionen</Text>
          <TouchableOpacity onPress={gotoLeaderboard}>
            <Text style={styles.optionsText}>Leaderboard</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToTicTacToe}>
            <Text style={styles.optionsText}>Bot üben</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={togglePopOut}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
        </View>
      )}
      {challengeModalVisible && renderChallengeModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  containerMain: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 50
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
    fontWeight: 'bold',
    fontSize: 30,
  },
  square: {
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000'
  },
  buttonText: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: 'green',
  },
  popOut: {
    position: 'absolute',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    top: 0,
    bottom: 0,
    backgroundColor: '#cccccc',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#aaaaaa',
  },
  friendName: {
    fontSize: 20,
    color: 'black',
  },
  friendScore: {
    fontSize: 16,
    color: 'gray',
  },
  otherOptionsText: {
    color: 'black',
    marginTop: 10,
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  optionsText: {
    color: 'black',
    marginTop: 10,
    fontSize: 16,
  },
  challengeModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeModalText: {
    fontSize: 20,
    color: 'white',
    margin: 10,
  },
  arrow: {
    fontSize: 60,
    paddingLeft: 100,
  },
  text: {
    fontSize: 60
  },
});

export default Menu;

