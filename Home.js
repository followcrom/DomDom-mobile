import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
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
        <TouchableOpacity style={homePageStyles.buttonHome} onPress={() => navigation.navigate('Text')}>
          <Text style={homePageStyles.buttonText}>TEXT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={homePageStyles.buttonHome} onPress={() => navigation.navigate('Speech')}>
          <Text style={homePageStyles.buttonText}>SPEECH</Text>
        </TouchableOpacity>
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
    position: 'absolute',
    bottom: '40%',
    width: '100%', // Ensure the container takes the full width of the screen
  },

  buttonHome: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fcba79',
    padding: 0,
    borderColor: '#d62c8b',
    borderWidth: 2,
    borderRadius: 10,
    width: 120,
    height: 60,
    marginHorizontal: '15%',
  },

  buttonText: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: '#d62c8b',
  },
});