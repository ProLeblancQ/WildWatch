import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Observation, ObservationFormData } from "../types/observation";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ObservationFormData) => void;
  onDelete?: () => void;
  observation?: Observation;
  title: string;
};

export default function ObservationModal({
  visible,
  onClose,
  onSubmit,
  onDelete,
  observation,
  title,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (observation) {
      setName(observation.name);
      setDescription(observation.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [observation, visible]);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom de l'observation est requis");
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
    });

    setName("");
    setDescription("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      "Supprimer l'observation",
      "Êtes-vous sûr de vouloir supprimer cette observation ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            onDelete?.();
            handleClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Nom de l observation *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex: Cerf élaphe"
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Ajouter une description..."
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>
              {observation ? "Modifier" : "Créer"}
            </Text>
          </TouchableOpacity>

          {observation && onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>Supprimer l observation</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  deleteText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});