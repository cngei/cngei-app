import React from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { useMe } from '../../queries/personaQueries';
import { ActivityIndicator, Text, Avatar } from 'react-native-paper';
import { formatDate } from '../../utils/dateFormatter';

const ProfiloPage: React.FC = () => {
    const { data: profile, isLoading, error } = useMe();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Errore nel caricamento del profilo: {(error as Error).message}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {profile?.avatar ? (
                    <Avatar.Image size={80} source={{ uri: profile.avatar }} style={styles.avatar} />
                ) : (
                    <Avatar.Text size={80} label={`${profile?.nome?.[0] || ''}${profile?.cognome?.[0] || ''}`} style={styles.avatar} />
                )}
                <Text style={styles.name}>{profile?.nome} {profile?.cognome}</Text>
                <Text style={styles.memberStatus}>⚡ Tessera: {profile?.tessera}</Text>
            </View>

            <View style={styles.infoSection}>
                <InfoItem label="Phone" value={profile?.telefono || ''} />
                <InfoItem label="Mail" value={profile?.email || ''} />
            </View>

            <View style={styles.optionsSection}>
                <OptionItem label="Indirizzo" value={profile?.indirizzo} />
                <OptionItem label="Comune" value={profile?.comune} />
                <OptionItem label="Provincia" value={profile?.provincia} />
                <OptionItem label="CAP" value={profile?.cap} />
                <OptionItem label="Data di nascita" value={profile?.dataNascita} />
                <OptionItem label="Codice Fiscale" value={profile?.codiceFiscale} />
            </View>
        </ScrollView>
    );
};

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

const OptionItem: React.FC<{ label: string; value?: string; isSwitch?: boolean }> = ({ label, value, isSwitch }) => (
    <View style={styles.optionItem}>
        <Text style={styles.optionLabel}>{label}</Text>
        {isSwitch ? (
            <Switch value={false} onValueChange={() => {}} />
        ) : (
            <Text style={styles.optionValue}>{value}</Text>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    avatar: {
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    memberStatus: {
        fontSize: 16,
        color: '#FFA500',
    },
    infoSection: {
        backgroundColor: 'white',
        marginTop: 20,
        padding: 15,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
    },
    optionsSection: {
        backgroundColor: 'white',
        marginTop: 20,
    },
    optionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    optionLabel: {
        fontSize: 16,
    },
    optionValue: {
        fontSize: 16,
        color: '#666',
    },
});

export default ProfiloPage;
