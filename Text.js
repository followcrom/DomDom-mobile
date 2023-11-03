import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  ToastAndroid,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TextPage({ navigation }) {
  const [outputText, setOutputText] = useState("");
  const [phraseId, setPhraseId] = useState(0);
  const [title, setTitle] = useState("");
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    // Initial check
    const { width, height } = Dimensions.get("window");
    setIsLandscape(width > height);

    // Listen to changes
    const handleOrientationChange = ({ window: { width, height } }) => {
      setIsLandscape(width > height);
    };
    Dimensions.addEventListener("change", handleOrientationChange);
  }, []);

  // Clean up: Remove the event listener
  //   return () => {
  //     Dimensions.removeEventListener("change", handleOrientationChange);
  //   };
  // }, []);

  useEffect(() => {
    getRandomPhrase();
  }, []);

  const getRandomPhrase = async () => {
    try {
      setOutputText("Loading...");
      const response = await fetch(
        "https://ur3fnc2j12.execute-api.eu-west-2.amazonaws.com/getPhraseStage/getphrase"
      );
      const data = await response.json();

      // Check if data and data.id are defined before proceeding
      if (data && data.id !== undefined && data.phrase !== undefined) {
        console.log(data);
        setOutputText(data.phrase);
        setPhraseId(data.id);
        setTitle(data.title);
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
    <ScrollView contentContainerStyle={textPageStyles.container}>
      <Image
        source={require("./images/random_wisdom_landscape.jpg")}
        style={textPageStyles.image}
      />

      <View style={textPageStyles.textContainer} onTouchEnd={showToast}>
        {title && <Text style={textPageStyles.title}>{title}</Text>}
        <Text
          style={[
            textPageStyles.textOutput,
            isLandscape && textPageStyles.textOutputLandscape,
          ]}
        >
          {outputText}
        </Text>
      </View>

      <View style={textPageStyles.buttonContainer}>
        <TouchableOpacity
          style={textPageStyles.buttonIcon}
          onPress={getRandomPhrase}
        >
          <Ionicons name="bulb-outline" size={48} color="white" />
          <Text style={textPageStyles.buttonText}>Generate Wisdom</Text>
        </TouchableOpacity>
      </View>

      <View style={textPageStyles.buttonContainer}>
        <TouchableOpacity
          style={textPageStyles.buttonIcon}
          onPress={() => navigation.navigate("Search")}
        >
          <MaterialCommunityIcons
            name="database-search-outline"
            size={48}
            color="white"
          />
          <Text style={textPageStyles.buttonText}>Search Widsom</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Specific styles for TextPage component
const textPageStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  image: {
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    borderRadius: 2,
    marginBottom: 5,
  },

  textContainer: {
    width: "90%",
    alignSelf: "center", // Add this line to center the content
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: 10,
    // marginBottom: 10,
    textAlign: "center",
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

  buttonContainer: {
    alignItems: "center",
    width: 300,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#007BFF",
    borderColor: "#FFF",
    borderWidth: 2.5,
    borderRadius: 20,
    padding: 10,
  },

  buttonIcon: {
    flexDirection: "row",
    // justifyContent: 'center',
    // alignItems: 'center',
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10, // Add some space between the icon and text
    padding: 16,
  },
});
