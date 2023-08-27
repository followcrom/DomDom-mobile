import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import { Audio, InterruptionModeAndroid  } from 'expo-av';
import styles from './styles/Styles';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function Meditations({ navigation }) {
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const [playbackDuration, setPlaybackDuration] = useState(0);
    const progress = playbackDuration > 0 ? (playbackPosition / playbackDuration) * 100 : 0;
    const [audioFiles, setAudioFiles] = useState([]);
    const [currentMeditationName, setCurrentMeditationName] = useState('Please select a meditation');




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
        const url = 'https://followcrom.online/meditations/meditations.json?' + new Date().getTime();
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

      async function playSelectedSound(url, name) {
        setCurrentMeditationName(name);
    
        // If a sound is already playing, stop and unload it first
        if (sound) {
            await sound.unloadAsync();
            setSound(null);
        }
    
        // Load the selected sound
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: url }
        );
        setSound(newSound);
    
        // Monitor when audio playback completes
        newSound.setOnPlaybackStatusUpdate(status => {
            if (status.didJustFinish) {
                setIsPlaying(false);
            }
            if (status.isLoaded) {
                setPlaybackPosition(status.positionMillis);
                setPlaybackDuration(status.durationMillis);
            }      
        });
    
        // Play the loaded sound
        await newSound.playAsync();
        setIsPlaying(true);
    }
    
    

    useEffect(() => {
    }, [playbackPosition, playbackDuration]);


    async function togglePlayback() {   
        if (isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
        } else {
            if (!sound) {
                showToast();
                return;
            }
            await sound.playAsync();
            setIsPlaying(true);
        }
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
            const newPosition = Math.min(status.durationMillis, status.positionMillis + 10000);
            await sound.setPositionAsync(newPosition);
        }
    }
    

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
    
        const paddedMinutes = String(minutes).padStart(2, '0');
        const paddedSeconds = String(seconds).padStart(2, '0');
    
        return `${paddedMinutes}:${paddedSeconds}`;
    }

    

    const showToast = () => {
        ToastAndroid.showWithGravityAndOffset(
          "Please select a meditation first",
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
      };
      

      useEffect(() => {
        // This is the event handler
        const handleBlur = () => {
          if (sound) {
            sound.stopAsync();
          }
        }; 
        // Add the event listener
        const unsubscribe = navigation.addListener('blur', handleBlur);
        // Return the cleanup function
        return unsubscribe;
      }, [sound, navigation]);


    return (
        <View contentContainerStyle={MedPageStyles.container}>
            <Text style={styles.title}>Meditations</Text>


            <FlatList
  contentContainerStyle={{ paddingVertical: 5, paddingHorizontal: 8 }}
  data={audioFiles}
  keyExtractor={(item) => item.name}
  renderItem={({ item, index }) => (
    <TouchableOpacity 
      style={[
        MedPageStyles.audioListItem, 
        { backgroundColor: index % 2 === 0 ? '#e0e0e0' : 'white' } // Alternate background colors
      ]}
      accessible={true} 
      accessibilityLabel={`Play sound ${item.name}`}
      onPress={() => playSelectedSound(item.url, item.name)}
    >
      <Text style={MedPageStyles.listItems}>{item.name}</Text>
    </TouchableOpacity>
  )}
/>



<Text style={MedPageStyles.currPlay}>{currentMeditationName}</Text>

            <View style={MedPageStyles.buttonRow}>


<MaterialCommunityIcons 
    style={styles.transportButtonsStyle} 
    name="step-backward" 
    size={36} 
    color={sound ? "blue" : "grey"} 
    onPress={skipBackward} 
    disabled={!sound}
/>


{isPlaying 
    ? <Ionicons style={styles.transportButtonsStyle} name="pause-circle-outline" size={48} color="orange" onPress={togglePlayback} />
    : <Ionicons 
        style={styles.transportButtonsStyle} 
        name="play-circle-outline" 
        size={48} 
        color={sound ? "green" : "grey"}
        onPress={togglePlayback}
      />
}


<Ionicons 
    style={styles.transportButtonsStyle}  
    name="stop-circle-outline" 
    size={48} 
    color={sound ? "red" : "grey"} 
    onPress={stopPlayback} 
    disabled={!sound}
/>


<MaterialCommunityIcons 
    style={styles.transportButtonsStyle} 
    name="step-forward" 
    size={36} 
    color={sound ? "blue" : "grey"} 
    onPress={skipForward} 
    disabled={!sound}
/>
</View>

            {/* Progress Bar */}
            <View style={MedPageStyles.outerProgressBarContainer}>
    <View style={MedPageStyles.progressBarContainer}>
                <View style={{ 
                    height: 20,
                    borderRadius: 10,
                    width: `${progress}%`,
                    backgroundColor: '#12abef',
                }} />
            </View></View>

            <Text style={MedPageStyles.currPlay}>
    {formatTime(playbackPosition)} / {formatTime(playbackDuration)}
</Text>


            </View>
    );
            }
    
    // Corresponding styles
    const MedPageStyles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'flex-start',
            alignItems: 'center',
        },

        audioListItem: {
            paddingVertical: 16, // Increase padding for better touch target size
            paddingHorizontal: 10,
            borderBottomWidth: 1, 
            borderBottomColor: '#ccc'
          },
          
          listItems: {
            textAlign: 'center',
            color: '#12abef',
            fontSize: 20
          },

        currPlay: {
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#FF7F00',
            fontSize: 18,
            paddingVertical: 10
          },

        buttonRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20
        },
        buttonStyle: {
            marginHorizontal: 10
        },

        outerProgressBarContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        progressBarContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            width: '80%',
            height: 24,
            backgroundColor: 'white',
            borderColor: '#007BFF',
            borderWidth: 2,
            borderRadius: 20,
            overflow: 'hidden'
        },
    });
    