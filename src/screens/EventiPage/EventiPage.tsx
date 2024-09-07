import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { List, Chip, ActivityIndicator, Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { EventoControllerService } from '../../api/services.gen';
import { EventoViewModel } from '../../api';

const EventiPage = () => {
    const [filter, setFilter] = useState<'all' | 'GIOVANI' | 'ADULTI' | 'FORMAZIONE' | 'SERVIZI'>('all');

    const { data = [], isLoading, error } = useQuery({
        queryKey: ['eventi'],
        queryFn: () =>
            EventoControllerService.getAll2({ query: { includePast: false } }).then(res => res.data),
    });

    const filteredEvents = data?.filter((event: EventoViewModel) =>
        filter === 'all' || event.tipo === filter
    );

    if (isLoading) return <ActivityIndicator />;
    if (error) return <Text>Error loading events</Text>;

    return (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
                <Chip selected={filter === 'ADULTI'} onPress={() => setFilter('ADULTI')}>Adulti</Chip>
                <Chip selected={filter === 'GIOVANI'} onPress={() => setFilter('GIOVANI')}>Giovani</Chip>
                <Chip selected={filter === 'FORMAZIONE'} onPress={() => setFilter('FORMAZIONE')}>Formazione</Chip>
                <Chip selected={filter === 'SERVIZI'} onPress={() => setFilter('SERVIZI')}>Servizi</Chip>
            </View>
            {filteredEvents.length > 0 ? (
                <FlatList
                    data={filteredEvents}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.nome}
                            description={item.descrizione}
                            left={props => <List.Icon {...props} icon="calendar" />}
                        />
                    )}
                />
            ) : (
                <View style={{ padding: 20, alignItems: 'center' }}>
                    <Text>Nessun evento corrisponde al filtro selezionato.</Text>
                </View>
            )}
        </View>
    );
};

export default EventiPage;
