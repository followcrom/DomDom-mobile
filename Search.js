import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles/Styles";

export default function SearchPage() {
  const [outputText, setOutputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [phraseId, setPhraseId] = useState(0);
  const [title, setTitle] = useState("");

  const handleSearch = () => {
    const searchTerm = searchQuery.trim();

    // Check if the search term is empty.
    if (!searchTerm) {
      setOutputText("Please enter a search term.");
      setSearchPerformed(true);
      return; // Exit the function early.
    }

    setOutputText("Searching...");
    setSearchPerformed(true);

    fetch(
      "https://c7h8lmqr9l.execute-api.eu-west-2.amazonaws.com/searchPhraseStage/searchphrase",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const responseBody = JSON.parse(data.body);
        if (responseBody.Items && responseBody.Items.length > 0) {
          setSearchResults(responseBody.Items);
          setCurrentIndex(0);
          setOutputText(responseBody.Items[0].phrase);
          setPhraseId(responseBody.Items[0].id);
          setTitle(responseBody.Items[0].title);
        } else {
          setSearchResults([]);
          setOutputText("No matches found for your search term.");
          setCurrentIndex(0);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    console.log("Searching for:", searchQuery);
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
      setPhraseId(searchResults[currentIndex].id);
      setTitle(searchResults[currentIndex].title || null);
    }
  }, [currentIndex, searchResults]);

  const showToast = () => {
    ToastAndroid.show(phraseId.toString(), ToastAndroid.SHORT);
  };

  return (
    <ScrollView contentContainerStyle={searchPageStyles.container}>
      <Text style={styles.title}>Search for Wisdom</Text>

      <TextInput
        style={searchPageStyles.input}
        value={searchQuery}
        accessibilityLabel="Search input field"
        onChangeText={(text) => setSearchQuery(text.toLowerCase())}
        autoCorrect={false}
        autoCapitalize="none"
        placeholder="Enter a search term..."
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonIcon} onPress={handleSearch}>
          <MaterialCommunityIcons
            name="comment-search-outline"
            size={48}
            color="white"
          />
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {searchPerformed && (
        <View style={searchPageStyles.textContainer} onTouchEnd={showToast}>
          {title && <Text style={searchPageStyles.title}>{title}</Text>}
          <Text style={searchPageStyles.textOutput}>{outputText}</Text>
        </View>
      )}

      {/* Conditionally render the buttonRow2 */}
      {searchResults.length > 0 && (
        <View style={styles.transportButtonsRow}>
          <Ionicons
            style={styles.transportButtonsStyle}
            name="play-skip-back-outline"
            size={36}
            color="orange"
            onPress={handlePrevious}
          />
          <Ionicons
            style={styles.transportButtonsStyle}
            name="play-skip-forward-outline"
            size={36}
            color="green"
            onPress={handleNext}
          />
        </View>
      )}

      {/* Conditionally render the currentIndex */}
      {searchResults.length > 0 && (
        <Text style={searchPageStyles.result}>
          {currentIndex + 1} of {searchResults.length}
        </Text>
      )}
    </ScrollView>
  );
}

// Specific styles for SearchPage component
const searchPageStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  input: {
    width: "80%",
    height: 56,
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: "#fff",
  },

  textContainer: {
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007BFF",
    textAlign: "center",
    paddingTop: 10,
  },

  textOutput: {
    fontSize: 20,
    textAlign: "left",
    padding: 10,
  },

  textOutputLandscape: {
    fontSize: 20,
    textAlign: "center",
    padding: 10,
  },

  result: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 15,
    color: "#FF7F00",
    textAlign: "center",
  },
});
