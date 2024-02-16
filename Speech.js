import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Linking,
  ScrollView,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Foundation,
} from "@expo/vector-icons";
import { Audio, InterruptionModeAndroid } from "expo-av";
import styles from "./styles/Styles";

export default function SpeechPage({ navigation }) {
  const [audioFiles, setAudioFiles] = useState([]);
  const [sound, setSound] = useState();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isSoundLoaded, setIsSoundLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [historyStack, setHistoryStack] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  const opacityValue = React.useRef(new Animated.Value(0.5)).current;
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  let animation;

  // Set up the audio mode to play in the background
  useEffect(() => {
    async function setAudioMode() {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playsInSilentModeAndroid: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    }
    setAudioMode();
  }, []);

  const fetchAudioFiles = async () => {
    try {
      const url =
        "https://followcrom.online/moments/moments.json?" +
        new Date().getTime();
      const response = await fetch(url);

      if (!response.ok) {
        console.error("HTTP error", response.status);
      } else {
        const data = await response.json();
        setAudioFiles(data);
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  async function toggleSound() {
    // If no sound is loaded, play a new sound
    if (!sound) {
      // Invoke the playNewSound logic here
      await playNewSound();
      // After successfully loading and playing the sound
      setIsPlaying(true);
    } else {
      // If a sound is already loaded
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        // If a sound is already loaded, toggle between pause and play
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else {
        console.log("Sound object is not ready");
      }
    }
  }

  async function playNewSound() {
    // If a sound is already playing, stop it
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
    }

    // Update the history stack
    setHistoryStack([...historyStack, currentIndex]);

    // Select a random audio file from the array
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const audioFile = audioFiles[randomIndex];
    setCurrentAudio(audioFile);
    setCurrentIndex(randomIndex);

    // Load the sound with background playback
    const { sound: newSound } = await Audio.Sound.createAsync({
      uri: audioFile.url,
    });
    setSound(newSound);

    await newSound.playAsync();
    setIsPlaying(true);

    // Set up a callback for when the sound finishes playing
    newSound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
        setSound(null);
      }
    });
  }

  // When you go backward:
  async function playPrevious() {
    // Make a copy of the history stack and pop the last index
    const newHistoryStack = [...historyStack];
    const lastPlayedIndex = newHistoryStack.pop();

    if (
      newHistoryStack.length === 0 ||
      typeof lastPlayedIndex === "undefined"
    ) {
      console.log("No previous sound to play.");
      return;
    }

    // Update the history stack
    setHistoryStack(newHistoryStack);
    console.log("newHistory stack:", newHistoryStack);

    // Stop and unload the current sound, if any
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (error) {
        console.error("Error stopping or unloading sound:", error);
      }
      setSound(null);
    }

    // Safety check before loading and playing the previous sound
    if (audioFiles[lastPlayedIndex]) {
      try {
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: audioFiles[lastPlayedIndex].url,
        });
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
        // Update the current index
        setCurrentIndex(lastPlayedIndex);
      } catch (error) {
        console.error("Error playing previous sound:", error);
      }
    } else {
      console.error("Invalid index for previous sound.");
    }
  }

  // skip back to the beginning of the sound
  async function replaySound() {
    try {
      // If a sound is already playing, stop and unload it first
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }

      if (currentIndex !== null && currentIndex < audioFiles.length) {
        // Load and play the sound at currentIndex
        const audioFile = audioFiles[currentIndex];
        const { sound: newSound } = await Audio.Sound.createAsync({
          uri: audioFile.url,
        });

        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } else {
        console.log("No sound to play");
      }
    } catch (error) {
      console.log("Error in replaySound:", error);
    }
  }

  async function stopSound() {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsSoundLoaded(false);
      setIsPlaying(false);
    }
  }

  // pulse animation
  const startPulsing = () => {
    animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(opacityValue, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]),
      ])
    );
    animation.start();
  };

  // pulse animation useEffect
  useEffect(() => {
    if (isPlaying) {
      startPulsing();
    } else {
      if (animation) {
        animation.stop();
      }
      // Reset the animated values to their initial states
      opacityValue.setValue(0.5);
      scaleValue.setValue(1);
    }
  }, [isPlaying]);

  // Links
  const openfC = () => {
    Linking.openURL("https://followcrom.online");
  };

  const opengH = () => {
    Linking.openURL("https://github.com/followcrom");
  };

  const openContact = () => {
    Linking.openURL("https://followcrom.online/contact/contact.php");
  };

  const openLi = () => {
    Linking.openURL("https://www.linkedin.com/in/followCrom/");
  };
  // End Links

  // This will run when the screen is blurred (exited)
  useEffect(() => {
    const resetPage = async () => {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
        setIsPlaying(false);
      }
    };
    // Add the event listener
    const unsubscribe = navigation.addListener("blur", resetPage);
    // Remove the 'blur' event listener
    return unsubscribe;
  }, [sound, navigation]);

  return (
    <ScrollView contentContainerStyle={speechPageStyles.container}>
      <Text style={styles.title}>Momento Contento</Text>

      {/* Transport controls  */}
      <View style={styles.transportButtonsRow}>
        <Ionicons
          style={styles.transportButtonsStyle}
          name="play-skip-back-circle-outline"
          size={48}
          color="blue"
          onPress={playPrevious}
          disabled={!sound}
        />

        <Ionicons
          style={styles.transportButtonsStyle}
          name="reload-circle-outline"
          size={48}
          color="#f39b51"
          onPress={replaySound}
          // disabled={!sound}
        />

        <Ionicons
          style={styles.transportButtonsStyle}
          name={isPlaying ? "pause-circle-outline" : "play-circle-outline"}
          size={48}
          color={isPlaying ? "#a999d2" : "green"}
          onPress={toggleSound}
        />

        <Ionicons
          style={styles.transportButtonsStyle}
          name="stop-circle-outline"
          size={48}
          color="red"
          onPress={stopSound}
        />

        <Ionicons
          style={styles.transportButtonsStyle}
          name="play-skip-forward-circle-outline"
          size={48}
          color="blue"
          onPress={playNewSound}
          disabled={!sound}
        />
      </View>

      {/* Pulsing animation  */}
      <View style={speechPageStyles.animationContainer}>
        <Animated.View
          style={{
            opacity: opacityValue,
            transform: [{ scale: scaleValue }],
          }}
        >
          <Foundation name="sound" size={80} color="white" />
        </Animated.View>
      </View>

      {/* Extras  */}
      <View style={speechPageStyles.divider}></View>

      <Text style={speechPageStyles.subtitle}>Try a meditation:</Text>

      <View style={speechPageStyles.buttonContainer}>
        <TouchableOpacity
          style={speechPageStyles.buttonIcon}
          onPress={() => navigation.navigate("Meditations")}
        >
          <Ionicons name="partly-sunny-outline" size={48} color="white" />
          <Text style={speechPageStyles.buttonText}>Meditations</Text>
        </TouchableOpacity>
      </View>

      <View style={speechPageStyles.divider}></View>

      <Text style={speechPageStyles.subtitle}>Visit me online:</Text>

      {/* Linked buttons  */}
      <View style={speechPageStyles.iconButtonsRow}>
        <Ionicons
          style={speechPageStyles.iconButtons}
          name="logo-github"
          size={38}
          color="black"
          onPress={() => {
            opengH();
          }}
        />

        <Ionicons
          style={speechPageStyles.iconButtons}
          name="globe-outline"
          size={38}
          color="#12abef"
          onPress={() => {
            openfC();
          }}
        />

        <Ionicons
          style={speechPageStyles.iconButtons}
          name="mail-open-outline"
          size={38}
          color="grey"
          onPress={() => {
            openContact();
          }}
        />

        <Ionicons
          style={speechPageStyles.iconButtons}
          name="logo-linkedin"
          size={38}
          color="blue"
          onPress={() => {
            openLi();
          }}
        />
      </View>

      <View style={speechPageStyles.divider}></View>

      <Text style={speechPageStyles.subtitle}>Thanks to:</Text>

      {/* Technologies  */}
      <View style={speechPageStyles.iconButtonsRow}>
        <Ionicons
          style={speechPageStyles.iconButtons}
          name="logo-nodejs"
          size={28}
          color="blue"
        />

        <Ionicons
          style={speechPageStyles.iconButtons}
          name="logo-react"
          size={28}
          color="purple"
        />

        <Ionicons
          style={speechPageStyles.iconButtons}
          name="logo-javascript"
          size={28}
          color="green"
        />

        <MaterialCommunityIcons
          style={speechPageStyles.iconButtons}
          name="aws"
          size={28}
          color="red"
        />

        <MaterialCommunityIcons
          style={speechPageStyles.iconButtons}
          name="lambda"
          size={28}
          color="orange"
        />
      </View>
    </ScrollView>
  );
}

// Styles for SpeechPage component
const speechPageStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  animationContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Radius of the circle (half of the diameter)
    borderWidth: 2.5,
    borderColor: "white",
    backgroundColor: "#31788a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },

  buttonContainer: {
    alignItems: "center",
    width: 300,
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: "#007BFF",
    borderColor: "#FFF",
    borderWidth: 2.5,
    borderRadius: 20,
    padding: 10,
  },

  buttonIcon: {
    flexDirection: "row",
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
    padding: 16,
  },

  subtitle: {
    marginTop: 0,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF7F00",
    textAlign: "center",
  },

  divider: {
    borderBottomColor: "#007BFF",
    borderBottomWidth: 2,
    alignSelf: "stretch",
    marginLeft: "10%",
    width: "80%",
    marginTop: 10,
    marginBottom: 10,
  },

  iconButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  iconButtons: {
    margin: 15,
  },
});
