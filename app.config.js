export default {
  expo: {
    name: "Random Wisdom",
    description:
      "Find peace in the daily chaos with curated wisdom from mindful minds.",
    slug: "MyFirstHandiApp",
    version: "1.2.1",
    orientation: "default",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      resizeMode: "contain",
    },
    updates: {
      fallbackToCacheTimeout: 0,
      checkAutomatically: "ON_LOAD",
      url: "https://u.expo.dev/8f510697-9131-48d2-93a3-7155d99ded95",
    },
    assetBundlePatterns: ["**/*"],
    android: {
      package: "online.followcrom.RandomWisdom",
      versionCode: 6,
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    androidStatusBar: {
      translucent: false,
      barStyle: "dark-content",
      backgroundColor: "#fff",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    extra: {
      eas: {
        projectId: "8f510697-9131-48d2-93a3-7155d99ded95",
      },
      openAiApiKey: process.env.OPENAI_API_KEY,
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
