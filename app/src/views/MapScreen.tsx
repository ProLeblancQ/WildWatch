import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import Constants from 'expo-constants';
import * as Location from "expo-location";
import { useObservations } from "../hooks/useObservations";
import { Observation } from "../types/observation";
import ObservationModal from "../components/ObservationModal";
import AnimatedMarker from "../components/AnimatedMarker";

MapboxGL.setAccessToken(Constants.expoConfig?.extra?.mapboxAccessToken as string);

type Props = {
  coords: Location.LocationObjectCoords;
};

export default function MapScreen({ coords }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<Observation | undefined>();
  const [clickedCoords, setClickedCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const { observations, isLoading, createObservation, updateObservation, deleteObservation } = useObservations();

  const handleMapPress = (feature: any) => {
    const coordinates = feature.geometry.coordinates;
    setClickedCoords({
      latitude: coordinates[1],
      longitude: coordinates[0],
    });
    setSelectedObservation(undefined);
    setModalVisible(true);
  };

  const handleMarkerPress = (observation: Observation) => {
    setSelectedObservation(observation);
    setClickedCoords(null);
    setModalVisible(true);
  };

  const handleModalSubmit = (data: { name: string; description?: string }) => {
    if (selectedObservation) {
      updateObservation(selectedObservation.id, data);
    } else if (clickedCoords) {
      createObservation({
        ...data,
        latitude: clickedCoords.latitude,
        longitude: clickedCoords.longitude,
      });
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedObservation(undefined);
    setClickedCoords(null);
  };

  const handleDelete = () => {
    if (selectedObservation) {
      deleteObservation(selectedObservation.id);
      handleModalClose();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loading]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        onPress={handleMapPress}
      >
        {/* Centre la caméra sur la position de l'utilisateur */}
        <MapboxGL.Camera
          zoomLevel={15}
          centerCoordinate={[coords.longitude, coords.latitude]}
        />

        {/* Marqueur pour la position de l'utilisateur */}
        <MapboxGL.PointAnnotation
          id="user-location"
          coordinate={[coords.longitude, coords.latitude]}
        >
          <View style={styles.userMarker} />
        </MapboxGL.PointAnnotation>

        {/* Marqueurs des observations */}
        {observations.map((observation) => (
          <AnimatedMarker
            key={observation.id}
            observation={observation}
            onPress={handleMarkerPress}
          />
        ))}
      </MapboxGL.MapView>

      <ObservationModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        onDelete={selectedObservation ? handleDelete : undefined}
        observation={selectedObservation}
        title={selectedObservation ? "Modifier l'observation" : "Nouvelle observation"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: { flex: 1 },
  userMarker: {
    width: 20,
    height: 20,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
