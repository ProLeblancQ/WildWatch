// src/hooks/useCurrentPosition.ts
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export type PositionState = {
  coords: Location.LocationObjectCoords | null;
  status: "loading" | "success" | "unauthorized" | "error";
};

export function useCurrentPosition() {
  const [state, setState] = useState<PositionState>({
    coords: null,
    status: "loading",
  });

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setState({ coords: null, status: "unauthorized" });
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        });

        setState({ coords: location.coords, status: "success" });
      } catch (error) {
        console.error(error);
        setState({ coords: null, status: "error" });
      }
    };

    getLocation();
  }, []);

  return state;
}
