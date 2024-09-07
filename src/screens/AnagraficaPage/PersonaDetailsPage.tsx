import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { usePersonaDetails } from '../../queries/personaQueries';

const PersonaDetailsPage = () => {
  const route = useRoute();
  const { personaId } = route.params as { personaId: string };
  const { data: persona, isLoading, error } = usePersonaDetails(personaId);

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (error) {
    return <Text>Error loading persona details</Text>;
  }

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {persona.nome} {persona.cognome}
      </Text>
      <Text>Tessera: {persona.tessera || 'N/A'}</Text>
      <Text>Email: {persona.email || 'N/A'}</Text>
      <Text>Telefono: {persona.telefono || 'N/A'}</Text>
      {/* Add more details as needed */}
    </ScrollView>
  );
};

export default PersonaDetailsPage;
