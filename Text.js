import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons  } from '@expo/vector-icons';
import styles from './styles/Styles';

export default function TextPage({ navigation }) {
  const [outputText, setOutputText] = useState('');
  const [phraseId, setPhraseId] = useState(0);
  const [totalPhrases, setTotalPhrases] = useState(0);

  useEffect(() => {
    getRandomPhrase();
  }, []);

  const getRandomPhrase = async () => {
    setOutputText("Loading...");

    try {
        const response = await fetch('https://ur3fnc2j12.execute-api.eu-west-2.amazonaws.com/getPhraseStage/getphrase');
        const data = await response.json();
        console.log(data);
        setOutputText(data.phrase);
        setPhraseId(data.id);
        setTotalPhrases(data.total);
        return data.phrase;
    } catch (err) {
        console.error(err);
        setOutputText('An error occurred while fetching the phrase.');
        return 'An error occurred while fetching the phrase.';
    }
};


  return (
    <ScrollView contentContainerStyle={textPageStyles.container}>
      <Text style={styles.title}>Put it into Words</Text>

      <View style={styles.textContainer}>
        <Text style={styles.textOutput}>{outputText}</Text>
      </View>

      <Text style={textPageStyles.phraseNo}>
        Wisdom {phraseId} of {totalPhrases}
      </Text>

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
          <Text style={textPageStyles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}


// Specific styles for TextPage component
const textPageStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  subtitle: {
    fontSize: 20,
    color: '#d62c8b',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },

  phraseNo: {
    fontSize: 15,
    color: '#d62c8b',
    marginBottom: 15,
    textAlign: 'center',
  },

  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
    backgroundColor: '#12abef',
    borderColor: '#FFF',
    borderWidth: 2.5,
    borderRadius: 20,
    padding: 10,
  },

  buttonIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10, // Add some space between the icon and text
    padding: 10,
  },
});