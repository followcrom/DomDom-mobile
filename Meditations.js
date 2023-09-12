import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";

export default function Meditations({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Short", "Medium", "Long"];
  const [audioFiles, setAudioFiles] = useState([]);

  const TabBar = ({ tabs, activeTab, setActiveTab }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 5,
        }}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity key={index} onPress={() => setActiveTab(index)}>
            <Text
              style={{
                color: activeTab === index ? "#FF7F00" : "grey",
                borderBottomWidth: activeTab === index ? 2 : 0,
                borderBottomColor:
                  activeTab === index ? "#FF7F00" : "transparent",
                fontSize: 15,
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const fetchAudioFiles = async () => {
    try {
      let url =
        "https://followcrom.online/meditations/meditations_short.json?" +
        new Date().getTime();

      if (activeTab === 1) {
        url =
          "https://followcrom.online/meditations/meditations_medium.json?" +
          new Date().getTime();
      }

      if (activeTab === 2) {
        url =
          "https://followcrom.online/meditations/meditations_long.json?" +
          new Date().getTime();
      }

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
  }, [activeTab]);

  const handlePress = (url, name) => {
    console.log(
      `Navigating to MeditationPlayer with URL: ${url} and name: ${name}`
    );
    navigation.navigate("MeditationPlayer", { audioUrl: url, title: name });
  };

  return (
    <View contentContainerStyle={medPageStyles.container}>
      <Text style={medPageStyles.title}>Please choose a meditation:</Text>

      <View>
        <TabBar tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        <FlatList
          contentContainerStyle={medPageStyles.listContainer}
          data={audioFiles}
          keyExtractor={(item) => item.name}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                medPageStyles.listItem,
                { backgroundColor: index % 2 === 0 ? "#e0e0e0" : "white" }, // Alternate background colors
              ]}
              accessible={true}
              accessibilityLabel={`Play sound ${item.name}`}
              onPress={() => handlePress(item.url, item.name)}
            >
              <Text style={medPageStyles.listItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

// Corresponding styles
const medPageStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "normal",
    color: "#000",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },

  listContainer: {
    paddingVertical: 5,
    paddingHorizontal: 0,
  },

  listItem: {
    paddingVertical: 16, // Increase padding for better touch target size
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  listItemText: {
    textAlign: "center",
    color: "#12abef",
    fontSize: 20,
  },
});
