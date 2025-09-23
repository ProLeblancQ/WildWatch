import { View, Text, ActivityIndicator, Button, Linking } from "react-native";
import { PositionState } from "../hooks/userCurrentLocation";


type Props = {
  position: PositionState;
};

export default function CurrentPositionResponse({ position }: Props) {
  const { coords, status } = position;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {status === "loading" && (
        <>
          <ActivityIndicator size="large" />
          <Text>Chargement de la position...</Text>
        </>
      )}

      {status === "unauthorized" && (
        <>
          <Text>Permission de localisation refusée</Text>
          <Button title="Ouvrir les paramètres" onPress={() => Linking.openSettings()} />
        </>
      )}

      {status === "error" && <Text>Impossible de récupérer la position</Text>}

      {status === "success" && coords && (
        <>
          <Text>Latitude : {coords.latitude}</Text>
          <Text>Longitude : {coords.longitude}</Text>
        </>
      )}
    </View>
  );
}
