import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { Audio, InterruptionModeAndroid } from "expo-av";
import styles from "./styles/Styles";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function MeditationPlayer({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const progress =
    playbackDuration > 0 ? (playbackPosition / playbackDuration) * 100 : 0;
  const [currentMeditationName, setCurrentMeditationName] = useState("");
  const { audioUrl, title } = route.params;

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

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setIsPlaying(false);
    }
    if (status.isLoaded) {
      setPlaybackPosition(status.positionMillis);
      setPlaybackDuration(status.durationMillis);
    }
  };

  async function loadAndPlaySound(url, name) {
    setIsLoading(true);
    setCurrentMeditationName(name);

    // If a sound is already playing, stop and unload it first
    if (sound) {
      await sound.unloadAsync();
    }

    // Load the selected sound
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
    setSound(newSound);
    setIsLoading(false);

    // Monitor when audio playback completes
    newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    // Play the loaded sound
    await newSound.playAsync();
    setIsPlaying(true);
  }

  // Using the function in useEffect to load the initial sound
  useEffect(() => {
    let isCancelled = false;
    async function loadInitialSound() {
      if (!isCancelled) {
        await loadAndPlaySound(audioUrl, title);
      }
    }
    loadInitialSound();

    return () => {
      isCancelled = true;
      sound?.unloadAsync();
    };
  }, [audioUrl, title]);

  useEffect(() => {}, [playbackPosition, playbackDuration]);

  async function togglePlayback() {
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  }

  async function stopPlayback() {
    await sound.stopAsync();
    setIsPlaying(false);
  }

  async function skipBackward() {
    if (sound) {
      const status = await sound.getStatusAsync();
      const newPosition = Math.max(0, status.positionMillis - 10000);
      await sound.setPositionAsync(newPosition);
    }
  }

  async function skipForward() {
    if (sound) {
      const status = await sound.getStatusAsync();
      const newPosition = Math.min(
        status.durationMillis,
        status.positionMillis + 10000
      );
      await sound.setPositionAsync(newPosition);
    }
  }

  function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedMinutes}:${paddedSeconds}`;
  }

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
    <ImageBackground
      source={require("./images/tile.png")}
      style={playerStyles.bgTiles}
      resizeMode="repeat"
    >
      <ScrollView contentContainerStyle={playerStyles.container}>
        <View style={playerStyles.closeContainer}>
          <Ionicons
            name="close-circle-outline"
            size={40}
            color="white"
            onPress={() => navigation.goBack()}
          />
        </View>
        <Image
          source={require("./images/random_wisdom_landscape.jpg")}
          style={playerStyles.image}
        />

        {isLoading && <ActivityIndicator size="large" color="#fff" />}

        <Text style={playerStyles.title}>{currentMeditationName}</Text>

        <View style={playerStyles.transportContainer}>
          <View style={playerStyles.buttonRow}>
            <MaterialCommunityIcons
              style={styles.transportButtonsStyle}
              name="step-backward"
              size={36}
              color="blue"
              onPress={skipBackward}
            />

            {isPlaying ? (
              <Ionicons
                style={styles.transportButtonsStyle}
                name="pause-circle-outline"
                size={48}
                color="orange"
                onPress={togglePlayback}
              />
            ) : (
              <Ionicons
                style={styles.transportButtonsStyle}
                name="play-circle-outline"
                size={48}
                color="green"
                onPress={togglePlayback}
              />
            )}

            <Ionicons
              style={styles.transportButtonsStyle}
              name="stop-circle-outline"
              size={48}
              color="red"
              onPress={stopPlayback}
            />

            <MaterialCommunityIcons
              style={styles.transportButtonsStyle}
              name="step-forward"
              size={36}
              color="blue"
              onPress={skipForward}
            />
          </View>

          {/* Progress Bar */}
          <View style={playerStyles.outerProgressBarContainer}>
            <View style={playerStyles.progressBarContainer}>
              <View
                style={{
                  height: 20,
                  borderRadius: 10,
                  width: `${progress}%`,
                  backgroundColor: "#12abef",
                }}
              />
            </View>
          </View>

          <Text style={playerStyles.currPlay}>
            {formatTime(playbackPosition)} / {formatTime(playbackDuration)}
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

// Corresponding styles
const playerStyles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  bgTiles: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  transportContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
    borderRadius: 10,
    margin: 20,
  },

  closeContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
  },

  image: {
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    borderRadius: 2,
    marginBottom: 5,
  },

  title: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 30,
    paddingVertical: 10,
  },

  currPlay: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#FF7F00",
    fontSize: 18,
    paddingVertical: 10,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  buttonStyle: {
    marginHorizontal: 10,
  },

  outerProgressBarContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    zIndex: 1,
    // backgroundColor: "#fff",
  },
  progressBarContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "80%",
    height: 24,
    backgroundColor: "white",
    borderColor: "#007BFF",
    borderWidth: 2,
    borderRadius: 20,
    overflow: "hidden",
  },
});
