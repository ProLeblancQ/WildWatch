import { useState, useCallback, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Observation, CreateObservationData, ObservationFormData } from "../types/observation";

const OBSERVATIONS_STORAGE_KEY = '@wildwatch:observations';

export function useObservations() {
  const [observations, setObservations] = useState<Observation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les observations depuis AsyncStorage au démarrage
  useEffect(() => {
    loadObservations();
  }, []);

  const loadObservations = async () => {
    try {
      const storedObservations = await AsyncStorage.getItem(OBSERVATIONS_STORAGE_KEY);
      if (storedObservations) {
        const parsedObservations = JSON.parse(storedObservations).map((obs: any) => ({
          ...obs,
          createdAt: new Date(obs.createdAt),
          updatedAt: new Date(obs.updatedAt),
        }));
        setObservations(parsedObservations);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des observations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveObservations = async (newObservations: Observation[]) => {
    try {
      await AsyncStorage.setItem(OBSERVATIONS_STORAGE_KEY, JSON.stringify(newObservations));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des observations:', error);
    }
  };

  const createObservation = useCallback((data: CreateObservationData) => {
    const newObservation: Observation = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedObservations = [...observations, newObservation];
    setObservations(updatedObservations);
    saveObservations(updatedObservations);
    return newObservation;
  }, [observations]);

  const updateObservation = useCallback((id: string, data: ObservationFormData) => {
    const updatedObservations = observations.map(obs =>
      obs.id === id
        ? { ...obs, ...data, updatedAt: new Date() }
        : obs
    );
    setObservations(updatedObservations);
    saveObservations(updatedObservations);
  }, [observations]);

  const deleteObservation = useCallback((id: string) => {
    const updatedObservations = observations.filter(obs => obs.id !== id);
    setObservations(updatedObservations);
    saveObservations(updatedObservations);
  }, [observations]);

  const getObservationById = useCallback((id: string) => {
    return observations.find(obs => obs.id === id);
  }, [observations]);

  return {
    observations,
    isLoading,
    createObservation,
    updateObservation,
    deleteObservation,
    getObservationById,
  };
}