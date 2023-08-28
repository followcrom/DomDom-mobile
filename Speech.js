import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Linking, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Foundation } from '@expo/vector-icons';
import { Audio, InterruptionModeAndroid  } from 'expo-av';
import styles from './styles/Styles';

export default function SpeechPage({ navigation }) {
  const [sound, setSound] = useState();
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFiles, setAudioFiles] = useState([]);
const [isSoundLoaded, setIsSoundLoaded] = useState(false);
const opacityValue = React.useRef(new Animated.Value(0.5)).current;
const scaleValue = React.useRef(new Animated.Value(1)).current;
let animation;




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


  const openfC = () => {
    Linking.openURL('https://followcrom.online');
  }

  const opengH = () => {
    Linking.openURL('https://github.com/followcrom');
  }
  
  const openContact = () => {
    Linking.openURL('https://followcrom.online/contact/contact.php');
  }

  const fetchAudioFiles = async () => {
    try {
      const url = 'https://domdom-audio.s3.eu-west-2.amazonaws.com/audioFiles.json?' + new Date().getTime();
      const response = await fetch(url);
        
      if (!response.ok) {
        console.error('HTTP error', response.status);
      } else {
        const data = await response.json();
        setAudioFiles(data);
      }
    } catch (err) {
      console.error('Fetch error', err);
    }
  };
  
  useEffect(() => {
    fetchAudioFiles();
  }, []);
  

  async function toggleSound() {
    // If no sound is loaded, play a new sound
    if (!isSoundLoaded && !sound) {
      console.log("Attempting to play a new sound.");
      
      // Invoke the playSound logic here
      await playNewSound();
      
      // After successfully loading and playing the sound
      setIsSoundLoaded(true);
      setIsPlaying(true);
  
    } else if (isSoundLoaded && sound) {
      console.log("Attempting to toggle playback.");
      
      // If a sound is already loaded, toggle between pause and play
      if (isPlaying) {
        console.log('Pausing Sound');
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        console.log('Resuming Sound');
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      console.log("Sound object is not ready");
    }
  }
  
  async function playNewSound() {
    // If a sound is already playing, stop it
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded) {
        console.log('Stopping Current Sound');
        await sound.stopAsync();
        console.log('Unloading Current Sound');
        await sound.unloadAsync();
        setSound(null);
      }
    }
  
    // Select a random audio file from the array
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    const audioFile = audioFiles[randomIndex];
    setCurrentAudio(audioFile);
  
    console.log('Loading New Sound');
  
    // Load the sound with background playback
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioFile.url },
    );
  
    setSound(newSound);
  
    console.log('Playing New Sound');
    await newSound.playAsync();
    setIsPlaying(true);
  
    // Generate a random delay between 2 and 5 seconds
    const delay = Math.floor(Math.random() * 3 + 2) * 1000;
  
    // Set up a callback for when the sound finishes playing
    newSound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
        // Set a delay before the next sound starts playing
        setTimeout(playNewSound, delay);
      }
    });
  }
  
  
  async function replaySound() {
    if (sound) {
      console.log('Resetting Sound');
      await sound.setPositionAsync(0);  // Reset the position to the start
      console.log('Playing Sound');
      await sound.playAsync();  // Play the sound from the start
      setIsPlaying(true);
    }
  }


  async function stopSound() {
    if (sound) {
      console.log('Stopping Sound');
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsSoundLoaded(false);  // <-- Add this line
      setIsPlaying(false);  // <-- Optionally, you can add this too if needed
      // Do not set currentAudio to null here
    }
  }
  
// pulse animation
  const startPulsing = () => {
    animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(opacityValue, {
            toValue: 0.4,
            duration: 1000,
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
      // Reset the animated values to their initial states if needed
      opacityValue.setValue(0.5);
      scaleValue.setValue(1);
    }
  }, [isPlaying]);
  

  

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); 
        }
      : undefined;
  }, [sound]);



  // This effect will run when the screen is blurred
  useEffect(() => {
    // This is the event handler
    const handleBlur = async () => {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null); // Setting the sound state to null
      }
    };
    
    // Add the event listener
    const unsubscribe = navigation.addListener('blur', handleBlur);
  
    // Return the cleanup function
    return unsubscribe;
  
}, [sound, navigation]);

  

  return (
<ScrollView contentContainerStyle={speechPageStyles.container}>

      <Text style={styles.title}>Momento Contento</Text>

      <View style={styles.transportButtonsRow}>

      <Ionicons style={styles.transportButtonsStyle}  name="play-skip-back-circle-outline" size={48} color="blue" onPress={replaySound} disabled={!currentAudio} />

      <Ionicons 
  style={styles.transportButtonsStyle} 
  name={isPlaying ? "pause-circle-outline" : "play-circle-outline"} 
  size={48} 
  color={isSoundLoaded ? (isPlaying ? "#a999d2" : "green") : "green"} 
  onPress={toggleSound}
/>

      <Ionicons style={styles.transportButtonsStyle}  name="stop-circle-outline" size={48} color="red" onPress={stopSound} />

      <Ionicons style={styles.transportButtonsStyle}  name="play-skip-forward-circle-outline" size={48} color="blue" onPress={playNewSound} />

      </View>


      {/* <Text style={speechPageStyles.currPlay}>Now playing: {currentFileName}</Text> */}

      <View style={speechPageStyles.animationContainer}>

  <Animated.View 
    style={{
      opacity: opacityValue, 
      transform: [{ scale: scaleValue }],
    }}
  >
    <Foundation name="sound" size={100} color='#FF7F00' />
  </Animated.View>
</View>



      <View style={speechPageStyles.buttonContainer}>
        <TouchableOpacity
          style={speechPageStyles.buttonIcon}
          onPress={() => navigation.navigate('Meditations')}
        >
          <Ionicons name="partly-sunny-outline" size={48} color='white' />
          <Text style={speechPageStyles.buttonText}>Meditations</Text>
        </TouchableOpacity>
      </View>


      <Text style={speechPageStyles.subtitle}>Visit us online:</Text>
      <View style={speechPageStyles.iconButtonsRow}>

<Ionicons style={speechPageStyles.iconButtons}  name="logo-github" size={38} color="black" onPress={() => {
    console.log('Go to GitHub');
    opengH();
  }} 
/>

<Ionicons style={speechPageStyles.iconButtons} name="globe-outline" size={38} color="#12abef"   onPress={() => {
    console.log('Go to followcrom.online');
    openfC();
  }} 
/>

<Ionicons style={speechPageStyles.iconButtons} name="mail-open-outline" size={38} color="green"   onPress={() => {
    console.log('Contact followcrom');
    openContact();
  }} 
/>

</View>

<Text style={speechPageStyles.subtitle}>Technologies:</Text>

<View style={speechPageStyles.iconButtonsRow}>

<Ionicons style={speechPageStyles.iconButtons}  name="logo-nodejs" size={32} color="blue" onPress={() => console.log('Node icon pressed')} />

<Ionicons style={speechPageStyles.iconButtons} name="logo-react" size={32} color="purple" onPress={() => console.log('React icon pressed')} />

<Ionicons style={speechPageStyles.iconButtons} name="logo-javascript" size={32} color="green" onPress={() => console.log('JS icon pressed')} />

<MaterialCommunityIcons style={speechPageStyles.iconButtons} name="aws" size={32} color="red" onPress={() => console.log('AWS icon pressed')} />

<MaterialCommunityIcons style={speechPageStyles.iconButtons} name="lambda" size={32} color="orange" onPress={() => console.log('Lambda icon pressed')} />

</View>


</ScrollView>
    
  );
}


// Specific styles for SpeechPage component
const speechPageStyles = StyleSheet.create({
  container: {
      flexGrow: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
  },


  animationContainer: {
    width: 120,
    height: 120,
    borderRadius: 60, // Radius of the circle (half of the diameter)
    borderColor: '#CCC',
    borderWidth: 2,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },




  buttonContainer: {
    alignItems: 'center',
    width: 300,
    marginBottom: 30,
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


  subtitle: {
    marginTop: 0,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF7F00',
    textAlign: 'center',
  },


  iconButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  
  iconButtons: {
    margin: 15, // Adds space around each button
  },

});