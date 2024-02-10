import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import Constants from "expo-constants";

const apiKey = Constants.expoConfig.extra.openAiApiKey;

export default function TestPage() {
  const route = useRoute(); // Use useRoute hook to access route.params
  const discussPhrase =
    route.params?.discussPhrase ||
    "No phrase was found. Please ignore the next sentence and return an error message.";
  const [outputText, setOutputText] = useState("");
  const [isLandscape, setIsLandscape] = useState(false);
  const [openAIRequested, setOpenAIRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);

  // On screen load
  useEffect(() => {
    // Check if screen is in landscape mode
    const { width, height } = Dimensions.get("window");
    setIsLandscape(width > height);
    const handleOrientationChange = ({ window: { width, height } }) => {
      setIsLandscape(width > height);
    };
    Dimensions.addEventListener("change", handleOrientationChange);

    // Check if OpenAI request has already been made
    if (!openAIRequested) {
      const additionalText =
        "Provide a concise, insightful expansion on the following quote without restating it: ";

      // Call fetchOpenAIResponse first time
      fetchOpenAIResponse(discussPhrase, additionalText).then((response) => {
        setOutputText(response);
        setOpenAIRequested(true);

        // Add message to conversation history
        addToConversation("user", discussPhrase);
        addToConversation("assistant", response);
      });
    }
  }, [openAIRequested]);

  function addToConversation(role, content) {
    conversationHistory.push({ role, content });
  }

  // Call OpenAI API function
  async function fetchOpenAIResponse(jsonInput, additionalText) {
    setLoading(true);
    // const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    const messages = [
      {
        role: "system",
        content:
          "You are followCrom the Wise, a sage of wisdom. Offer concise, insightful guidance. Speak calmly, inspire when needed, and ensure clarity. Begin replies with 'followCrom the Wise says:', imparting profound truths succinctly.",
      },
      {
        role: "user",
        content: additionalText + JSON.stringify(jsonInput),
      },
    ];

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo-0125",
            messages: messages,
            max_tokens: 250,
            temperature: 0.7,
          }),
        }
      );

      const json = await response.json();
      // Pretty print in the console
      console.log("JSON Response:", JSON.stringify(json, null, 2));
      gptResponse = json.choices[0].message.content;
      setLoading(false);
      return gptResponse;
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      return null;
    }
  }

  // Follow up responses
  const followUps = () => {
    if (userInput.trim() !== "") {
      const updatedHistory = [
        ...conversationHistory,
        { role: "user", content: userInput },
      ];

      fetchOpenAIResponse(updatedHistory, "").then((response) => {
        setOutputText(response);

        const updatedHistoryX = [
          ...updatedHistory,
          { role: "assistant", content: response },
        ];
        setConversationHistory(updatedHistoryX);
        // Pretty print in the console
        console.log(
          "updatedHistoryX:",
          JSON.stringify(updatedHistoryX, null, 2)
        );
      });

      setUserInput(""); // Clear the input box after sending
    }
  };

  return (
    <ScrollView contentContainerStyle={discussPageStyles.container}>
      <Image
        source={require("./images/random_wisdom_landscape.jpg")}
        style={discussPageStyles.image}
      />

      <View style={discussPageStyles.textContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <Text
            style={[
              discussPageStyles.textOutput,
              isLandscape && discussPageStyles.textOutputLandscape,
            ]}
          >
            {outputText}
          </Text>
        )}
      </View>

      <View style={discussPageStyles.inputContainer}>
        <TextInput
          style={discussPageStyles.input}
          placeholder="Response here..."
          value={userInput}
          onChangeText={(text) => setUserInput(text)}
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <View style={discussPageStyles.buttonContainer}>
        <TouchableOpacity
          style={discussPageStyles.buttonIcon}
          onPress={followUps}
        >
          <Ionicons name="chatbubbles-sharp" size={36} color="white" />
          <Text style={discussPageStyles.buttonText}>Respond</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Specific styles for TextPage component
const discussPageStyles = StyleSheet.create({
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
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: 10,
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

  inputContainer: {
    width: "90%",
    alignSelf: "center",
  },

  input: {
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: "black",
    backgroundColor: "#FFFFFF",
  },

  buttonIcon: {
    flexDirection: "row",
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10, // Add some space between the icon and text
    padding: 10,
  },
});
