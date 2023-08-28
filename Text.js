import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import styles from './styles/Styles';

export default function TextPage({ navigation }) {
  const [outputText, setOutputText] = useState('');
  const [phraseId, setPhraseId] = useState(0);
  

  useEffect(() => {
    getRandomPhrase();
  }, []);

  const getRandomPhrase = async () => {
    try {
      setOutputText("Loading...");
      const response = await fetch('https://ur3fnc2j12.execute-api.eu-west-2.amazonaws.com/getPhraseStage/getphrase');
      const data = await response.json();
      
      // Check if data and data.id are defined before proceeding
      if (data && data.id !== undefined && data.phrase !== undefined) {
        console.log(data);
        setOutputText(data.phrase);
        setPhraseId(data.id);
      } else {
        console.error("Received unexpected data structure:", data);
        setOutputText("An error occurred. Please try again.");
      }
    } catch (err) {
      console.log("Caught an error:", err);
      console.error(err);
      setOutputText("An error occurred. Please try again.");
    }
  };
  


const showToast = () => {
  ToastAndroid.show(phraseId.toString(), ToastAndroid.SHORT);
};


  return (
    <ScrollView contentContainerStyle={styles.container}>

<Image
      source={require('./images/random_wisdom_landscape.png')} style={textPageStyles.image} />


      <Text style={styles.title}>Put it into Words</Text>

      <View style={styles.textContainer} onTouchEnd={showToast}>
      <Text style={styles.textOutput}>{outputText}</Text>
    </View>


      <View style={textPageStyles.buttonContainer}>
        <TouchableOpacity
          style={textPageStyles.buttonIcon}
          onPress={getRandomPhrase}
        >
          <Ionicons name="bulb-outline" size={48} color='white' />
          <Text style={textPageStyles.buttonText}>Generate Wisdom</Text>
        </TouchableOpacity>
      </View>


      <View style={textPageStyles.buttonContainer}>
        <TouchableOpacity
          style={textPageStyles.buttonIcon}
          onPress={() => navigation.navigate('Search')}
        >
          <MaterialCommunityIcons name="database-search-outline" size={48} color='white' />
          <Text style={textPageStyles.buttonText}>Search Widsom</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}


// Specific styles for TextPage component
const textPageStyles = StyleSheet.create({
  image: {
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center'
},

  buttonContainer: {
    alignItems: 'center',
    width: 300,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#007BFF',
    borderColor: '#FFF',
    borderWidth: 2.5,
    borderRadius: 20,
    padding: 10,
  },

  buttonIcon: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10, // Add some space between the icon and text
    padding: 16,
  },
});