// icons: https://ionic.io/ionicons
// https://oblador.github.io/react-native-vector-icons/


// styles/Styles.js
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#d62c8b',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
},

  text: {
    fontSize: 20,
    textAlign: 'center',
  },

  textContainer: {
    width: '95%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 2.5,
    borderRadius: 15,
  },

  textOutput: {
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },

  buttonRow2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',  // or 'space-around' or 'space-evenly'
    alignItems: 'center',
    paddingVertical: 15,
  },
  
  buttonStyle: {
    margin: 10, // Adds space around each button
  },
});