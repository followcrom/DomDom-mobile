import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles/Styles';

export default function SearchPage({ navigation }) {
    const [outputText, setOutputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchPerformed, setSearchPerformed] = useState(false);



    const handleSearch = () => {
        const searchTerm = searchQuery;

        fetch('https://c7h8lmqr9l.execute-api.eu-west-2.amazonaws.com/searchPhraseStage/searchphrase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ searchTerm }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                const responseBody = JSON.parse(data.body);
                if (responseBody.Items && responseBody.Items.length > 0) {
                    setSearchResults(responseBody.Items);
                    setCurrentIndex(0); // Reset currentIndex to 0
                    setOutputText(responseBody.Items[0].phrase); // Show the first result
                } else {
                    setSearchResults([]);
                    setOutputText("No matches found for your search term");
                    setCurrentIndex(0); // Reset currentIndex to 0 when no matches are found
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        console.log('Searching for:', searchQuery);
        setSearchPerformed(true);
    };


    const handleNext = () => {
        if (currentIndex < searchResults.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    useEffect(() => {
        if (searchResults.length > 0 && currentIndex < searchResults.length) {
            setOutputText(searchResults[currentIndex].phrase);
        }
    }, [currentIndex, searchResults]);



    return (
        <ScrollView contentContainerStyle={searchPageStyles.container}>
            <Text style={styles.title}>Search for Wisdom:</Text>

            <TextInput
                style={searchPageStyles.input}
                value={searchQuery}
                onChangeText={text => setSearchQuery(text.toLowerCase())}
                autoCorrect={false}
                autoCapitalize="none"
            />


            <View style={searchPageStyles.buttonContainer}>
                <TouchableOpacity
                    style={searchPageStyles.buttonIcon}
                    onPress={handleSearch}
                >
                    <Ionicons name="search-outline" size={48} color='white' />
                    <Text style={searchPageStyles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {
  searchPerformed && (
    <View style={styles.textContainer}>
      <Text style={styles.textOutput}>{outputText}</Text>
    </View>
  )
}



            {/* Conditionally render the buttonRow2 */}
            {searchResults.length > 0 && (
                <View style={styles.buttonRow2}>
                    <Ionicons
                        style={styles.buttonStyle}
                        name="play-skip-back-circle-outline"
                        size={48}
                        color="green"
                        onPress={handlePrevious}
                    />
                    <Ionicons
                        style={styles.buttonStyle}
                        name="play-skip-forward-circle-outline"
                        size={48}
                        color="orange"
                        onPress={handleNext}
                    />
                </View>
            )}

            {/* Conditionally render the currentIndex */}
            {searchResults.length > 0 && (
                <Text style={searchPageStyles.result}>{currentIndex + 1} of {searchResults.length}</Text>
            )}
        </ScrollView>
    );
}


// Specific styles for SearchPage component
const searchPageStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    input: {
        width: '80%',
        borderColor: 'gray',
        borderWidth: 1,
        margin: 10,
        padding: 5,
    },

    result: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 15,
        color: '#d62c8b',
        textAlign: 'center',
    },

    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '60%',
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#12abef',
        borderColor: '#FFF',
        borderWidth: 2,
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