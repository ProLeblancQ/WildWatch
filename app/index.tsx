import React from "react";

import CurrentPositionResponse from "./src/components/CurrentPositionResponse";
import { useCurrentPosition } from "./src/hooks/userCurrentLocation";
import MapScreen from "./src/views/MapScreen";

export default function Index() {
  const { coords, status } = useCurrentPosition();

  // Si la position n'est pas dispo, on affiche l'écran de réponse
  if (status !== "success" || !coords) {
    return <CurrentPositionResponse position={{ coords, status }} />;
  }

  // Sinon, on affiche la MapScreen centrée sur la position
  return <MapScreen coords={coords} />;
}
