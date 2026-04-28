import React, { useRef, useState, useEffect } from "react";
import { Stack } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { HeaderRightButton, HeaderLeftButton } from "@/components/HeaderButtons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BRAND = {
  primary: "#E91E8C",
  text: "#1A1A2E",
  textSecondary: "#888888",
};

const WEBVIEW_URL =
  "https://saas-appointment-manager-beauty-businesses-i25icg96.sites.blink.new";

function BrandedLoadingOverlay({ visible }: { visible: boolean }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const progressLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // Start looping progress bar
    progressLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(progressWidth, {
          toValue: SCREEN_WIDTH,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(progressWidth, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ])
    );
    progressLoop.current.start();

    return () => {
      progressLoop.current?.stop();
    };
  }, [progressWidth]);

  useEffect(() => {
    if (!visible) {
      progressLoop.current?.stop();
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, opacity]);

  return (
    <Animated.View
      style={[styles.loadingOverlay, { opacity }]}
      pointerEvents={visible ? "auto" : "none"}
    >
      <View style={styles.loadingContent}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>✂️</Text>
        </View>
        <Text style={styles.appName}>Chik-Chak</Text>
        <Text style={styles.tagline}>Beauty Appointment Manager</Text>
      </View>
      <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
    </Animated.View>
  );
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <Stack.Screen
        options={{
          title: "Appointment Manager",
          headerShown: false,
          headerRight: () => <HeaderRightButton />,
          headerLeft: () => <HeaderLeftButton />,
        }}
      />
      <View style={styles.container}>
        <WebView
          source={{ uri: WEBVIEW_URL }}
          style={styles.webview}
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          onLoadStart={() => {
            console.log("[WebView iOS] Loading started:", WEBVIEW_URL);
            setLoading(true);
          }}
          onLoadEnd={() => {
            console.log("[WebView iOS] Loading ended");
            setLoading(false);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log("[WebView iOS] Error:", nativeEvent);
          }}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit={true}
        />
        <BrandedLoadingOverlay visible={loading} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(233,30,140,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: "700",
    color: BRAND.text,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 14,
    color: BRAND.textSecondary,
    fontWeight: "400",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: BRAND.primary,
    borderRadius: 2,
  },
});
