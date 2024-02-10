// icons: https://ionic.io/ionicons
// https://oblador.github.io/react-native-vector-icons/

// styles/Styles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  content: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
  },

  text: {
    fontSize: 20,
    textAlign: "center",
  },

  textContainer: {
    width: "90%",
    marginLeft: "5%",
    marginTop: 10,
    marginBottom: 10,
    // backgroundColor: "#fff",
    // borderColor: '#000',
    // borderWidth: 3,
    // borderRadius: 15,
  },

  textOutput: {
    fontSize: 20,
    textAlign: "left",
    padding: 10,
  },

  transportButtonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly", // or 'space-around' or 'space-evenly'
    alignItems: "center",
  },

  transportButtonsStyle: {
    margin: 10, // Adds space around each button
  },

  buttonContainer: {
    alignItems: "center",
    width: 280,
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
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10, // Add some space between the icon and text
    padding: 10,
  },

  footerText: {
    fontSize: 28,
    color: "#000",
    marginTop: 5,
    marginBottom: 5,
    textAlign: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFF",
    // "#f39b51"
  },
});
