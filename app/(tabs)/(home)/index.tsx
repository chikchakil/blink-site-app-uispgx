import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";

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
    <View style={styles.container}>
      <WebView
        source={{ uri: WEBVIEW_URL }}
        style={styles.webview}
        onLoadStart={() => {
          console.log("[WebView Android] Loading started:", WEBVIEW_URL);
          setLoading(true);
        }}
        onLoadEnd={() => {
          console.log("[WebView Android] Loading ended");
          setLoading(false);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log("[WebView Android] Error:", nativeEvent);
        }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={true}
      />
      <BrandedLoadingOverlay visible={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 48,
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
