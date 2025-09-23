import { useState, useCallback } from "react";
import { Observation, CreateObservationData, ObservationFormData } from "../types/observation";

export function useObservations() {
  const [observations, setObservations] = useState<Observation[]>([]);

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

    setObservations(prev => [...prev, newObservation]);
    return newObservation;
  }, []);

  const updateObservation = useCallback((id: string, data: ObservationFormData) => {
    setObservations(prev => 
      prev.map(obs => 
        obs.id === id 
          ? { ...obs, ...data, updatedAt: new Date() }
          : obs
      )
    );
  }, []);

  const deleteObservation = useCallback((id: string) => {
    setObservations(prev => prev.filter(obs => obs.id !== id));
  }, []);

  const getObservationById = useCallback((id: string) => {
    return observations.find(obs => obs.id === id);
  }, [observations]);

  return {
    observations,
    createObservation,
    updateObservation,
    deleteObservation,
    getObservationById,
  };
}