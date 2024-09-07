import React, { useState, useMemo } from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { List, Text, ActivityIndicator, Surface, Searchbar, SegmentedButtons } from 'react-native-paper';
import { usePersonaList } from '../../queries/personaQueries';
import { useNavigation } from '@react-navigation/native';
import { PersonaViewModel } from '../../api';

interface PersonaListItemProps {
    item: PersonaViewModel;
    onPress: () => void;
}

const PersonaListItem: React.FC<PersonaListItemProps> = ({ item, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <List.Item
            title={`${item.nome} ${item.cognome}`}
            description={`Tessera: ${item.tessera || 'N/A'}`}
            left={(props) => <List.Icon {...props} icon="account" />}
        />
    </TouchableOpacity>
);

const PersonaListSkeleton = () => (
    <Surface style={{ padding: 16 }}>
        {[...Array(5)].map((_, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <ActivityIndicator size={24} style={{ marginRight: 16 }} />
                <View>
                    <Text style={{ width: 150, height: 20, backgroundColor: '#e0e0e0', marginBottom: 4 }} ></Text>
                    <Text style={{ width: 100, height: 16, backgroundColor: '#e0e0e0' }}></Text>
                </View>
            </View>
        ))}
    </Surface>
);

const AnagraficaPage = () => {
    const { data, isLoading, error } = usePersonaList(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterValue, setFilterValue] = useState('iscritti');
    const navigation = useNavigation();

    const filteredAndSortedData = useMemo(() => {
        if (!data) return [];
        return data
            .filter(item => {
                const matchesSearch = `${item.nome} ${item.cognome}`.toLowerCase().includes(searchQuery.toLowerCase());
                switch (filterValue) {
                    case 'iscritti':
                        return matchesSearch && item.tessera;
                    case 'inProva':
                        return matchesSearch && !item.tessera && item.tesseramento?.inizioProva;
                    case 'inAttesa':
                        return matchesSearch && !item.tessera && !item.tesseramento?.inizioProva;
                    default:
                        return matchesSearch;
                }
            })
            .sort((a, b) => a.cognome.localeCompare(b.cognome));
    }, [data, searchQuery, filterValue]);

    const handlePersonaPress = (persona: PersonaViewModel) => {
        navigation.navigate('PersonaDetails', { personaId: persona.id, fullName: `${persona.nome} ${persona.cognome}` });
    };

    if (isLoading) {
        return <PersonaListSkeleton />;
    }

    if (error) {
        return <Text>Error loading data</Text>;
    }

    return (
        <View style={{ flex: 1 }}>
            <Searchbar
                placeholder="Cerca persona"
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={{ margin: 16 }}
            />
            <SegmentedButtons
                value={filterValue}
                onValueChange={setFilterValue}
                buttons={[
                    { value: 'iscritti', label: 'Iscritti' },
                    { value: 'inProva', label: 'In prova' },
                    { value: 'inAttesa', label: 'In attesa' },
                ]}
                style={{ marginHorizontal: 16, marginBottom: 16 }}
            />
            {filteredAndSortedData.length === 0 ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    Nessun risultato trovato
                </Text>
            ) : (
                <FlatList
                    data={filteredAndSortedData}
                    renderItem={({ item }) => (
                        <PersonaListItem item={item} onPress={() => handlePersonaPress(item)} />
                    )}
                    keyExtractor={item => item.id}
                />
            )}
        </View>
    );
};

export default AnagraficaPage;
