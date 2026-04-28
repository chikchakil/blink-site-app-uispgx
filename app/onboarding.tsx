import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar, Bell, TrendingUp } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BRAND = {
  primary: "#E91E8C",
  primaryMuted: "rgba(233,30,140,0.10)",
  background: "#FAFAFA",
  text: "#1A1A2E",
  textSecondary: "#6B6B8A",
};

const SLIDES = [
  {
    id: 0,
    title: "Your Beauty, Scheduled",
    subtitle:
      "Manage all your appointments in one place. Never miss a booking again.",
    Icon: Calendar,
  },
  {
    id: 1,
    title: "Smart Reminders",
    subtitle:
      "Get notified before every appointment. Stay on top of your schedule effortlessly.",
    Icon: Bell,
  },
  {
    id: 2,
    title: "Grow Your Business",
    subtitle:
      "Track clients, manage services, and grow your beauty business with ease.",
    Icon: TrendingUp,
  },
];

function AnimatedPressable({
  onPress,
  style,
  children,
}: {
  onPress: () => void;
  style?: object;
  children: React.ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  const animateOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={animateIn}
        onPressOut={animateOut}
        onPress={onPress}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const goToSlide = useCallback(
    (index: number) => {
      Animated.timing(translateX, {
        toValue: -index * SCREEN_WIDTH,
        duration: 320,
        useNativeDriver: true,
      }).start();
      setCurrentIndex(index);
    },
    [translateX]
  );

  const handleNext = useCallback(() => {
    console.log("[Onboarding] Next button pressed, current slide:", currentIndex);
    if (currentIndex < SLIDES.length - 1) {
      goToSlide(currentIndex + 1);
    } else {
      handleComplete();
    }
  }, [currentIndex, goToSlide, handleComplete]);

  const handleSkip = useCallback(() => {
    console.log("[Onboarding] Skip button pressed");
    handleComplete();
  }, [handleComplete]);

  const handleComplete = useCallback(async () => {
    console.log("[Onboarding] Onboarding complete — saving to AsyncStorage");
    try {
      await AsyncStorage.setItem("onboarding_complete", "true");
      console.log("[Onboarding] AsyncStorage write success");
    } catch (e) {
      console.log("[Onboarding] AsyncStorage write error:", e);
    }
    router.replace("/(tabs)/(home)");
  }, []);

  const isLastSlide = currentIndex === SLIDES.length - 1;
  const buttonLabel = isLastSlide ? "Get Started" : "Next";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor={BRAND.background} />

      {/* Skip button */}
      <View style={styles.skipRow}>
        {!isLastSlide ? (
          <AnimatedPressable onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </AnimatedPressable>
        ) : (
          <View style={styles.skipButton} />
        )}
      </View>

      {/* Slides */}
      <View style={styles.slidesWrapper}>
        <Animated.View
          style={[
            styles.slidesTrack,
            { transform: [{ translateX }] },
          ]}
        >
          {SLIDES.map((slide) => {
            const IconComponent = slide.Icon;
            return (
              <View key={slide.id} style={styles.slide}>
                <View style={styles.iconCircle}>
                  <IconComponent
                    size={40}
                    color={BRAND.primary}
                    strokeWidth={1.8}
                  />
                </View>
                <Text style={styles.slideTitle}>{slide.title}</Text>
                <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
              </View>
            );
          })}
        </Animated.View>
      </View>

      {/* Bottom area */}
      <View style={styles.bottomArea}>
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => {
            const isActive = i === currentIndex;
            return (
              <View
                key={i}
                style={[
                  styles.dot,
                  isActive ? styles.dotActive : styles.dotInactive,
                ]}
              />
            );
          })}
        </View>

        {/* CTA button */}
        <AnimatedPressable onPress={handleNext} style={styles.ctaButton}>
          <Text style={styles.ctaText}>{buttonLabel}</Text>
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND.background,
  },
  skipRow: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 8,
    height: 44,
  },
  skipButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
    minWidth: 44,
    alignItems: "center",
  },
  skipText: {
    fontSize: 16,
    color: BRAND.textSecondary,
    fontWeight: "500",
  },
  slidesWrapper: {
    flex: 1,
    overflow: "hidden",
  },
  slidesTrack: {
    flexDirection: "row",
    width: SCREEN_WIDTH * SLIDES.length,
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BRAND.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 36,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: BRAND.text,
    textAlign: "center",
    letterSpacing: -0.4,
    marginBottom: 16,
    lineHeight: 36,
  },
  slideSubtitle: {
    fontSize: 16,
    color: BRAND.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    gap: 24,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: BRAND.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: "rgba(233,30,140,0.25)",
  },
  ctaButton: {
    backgroundColor: BRAND.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: BRAND.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
