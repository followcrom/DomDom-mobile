import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Pressable, Linking } from 'react-native';
import styles from './styles/Styles';


const openWebPage = () => {
  Linking.openURL('https://followcrom.online');
};




export default function LandingPage({ navigation }) {
  return (
    <ImageBackground source={require('./images/random_wisdom.png')} style={homePageStyles.backgroundImage}>

<View style={styles.content}>

      <View style={homePageStyles.titleContainer}>
        <Text style={homePageStyles.title}>RanDOM WisDOM</Text>
      </View>

      <View style={homePageStyles.buttonContainer}>

        <Pressable
  onPress={() => navigation.navigate('Text')}
  style={({ pressed }) => [
    {
      backgroundColor: pressed ? '#08b0f9' : '#fcba79',
      borderColor: pressed ? '#fff' : '#d62c8b',
    },
    homePageStyles.buttonHome
  ]}
>
  <View style={homePageStyles.textContainer}>
  <Text style={homePageStyles.buttonText}>TEXT</Text>
  </View>
</Pressable>

        <Pressable
  onPress={() => navigation.navigate('Speech')}
  style={({ pressed }) => [
    {
      backgroundColor: pressed ? '#08b0f9' : '#fcba79',
      borderColor: pressed ? '#fff' : '#d62c8b',
    },
    homePageStyles.buttonHome
  ]}
>
  <View style={homePageStyles.textContainer}>
  <Text style={homePageStyles.buttonText}>SPEECH</Text>
  </View>
</Pressable>

      </View>

      </View>
      
            {/* Footer */}
            <View style={styles.footer}>
      <TouchableOpacity onPress={openWebPage}>
          <Text style={styles.footerText}>followCrom.online</Text>
        </TouchableOpacity>
      </View>
      
    </ImageBackground>
  );
}


const homePageStyles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    padding: 0
  },

  button: {
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  titleContainer: {
    width: '100%',
    marginTop: 2,
  },

  title: {
    fontSize: 45,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#19acd7',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    activeOpacity: 1,
    position: 'absolute',
    bottom: '40%',
    width: '100%', // Ensure the container takes the full width of the screen
  },

  buttonHome: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderWidth: 2,
    borderRadius: 10,
    width: 120,
    height: 60,
    marginHorizontal: '15%',
  },
  
  buttonText: {
    fontSize: 20,
    color: '#d62c8b',
  },
  
});