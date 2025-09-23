import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { Observation } from "../types/observation";

type Props = {
  observation: Observation;
  onPress: (observation: Observation) => void;
};

export default function AnimatedMarker({ observation, onPress }: Props) {
  const translateY = useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  }, [translateY]);

  return (
    <MapboxGL.PointAnnotation
      id={observation.id}
      coordinate={[observation.longitude, observation.latitude]}
      onSelected={() => onPress(observation)}
    >
      <Animated.View
        style={[
          styles.marker,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.pin}>
          <View style={styles.pinInner} />
        </View>
        <View style={styles.label}>
          <Text style={styles.labelText} numberOfLines={1}>
            {observation.name}
          </Text>
        </View>
      </Animated.View>
    </MapboxGL.PointAnnotation>
  );
}

const styles = StyleSheet.create({
  marker: {
    alignItems: "center",
  },
  pin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pinInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  label: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  labelText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
    maxWidth: 100,
  },
});