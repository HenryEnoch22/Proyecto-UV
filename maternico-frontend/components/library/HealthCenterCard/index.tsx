import { View, Text, StyleSheet } from "react-native";
import { BuildingOfficeIcon } from "react-native-heroicons/outline";
import { BuildingLibraryIcon, BuildingOffice2Icon } from "react-native-heroicons/solid";

interface HealthCenterProps {
    id: number;
    name: string;
    address: string;
    phone_number: string;
    city: string;
    state: string;
}

export const HealthCenterCard = ({ id, name, address, city, state, phone_number } : HealthCenterProps) => {
    return (
        <View style={styles.healthCenterCard}>
            <View style={styles.healthCenterInfo}>
                <View style={styles.header}>
                    <BuildingOfficeIcon color="#F392BE" size={24} /> 
                    <Text style={styles.healthCenterName}>{name}</Text>
                </View>
                <Text>Direccion: </Text><Text style={styles.healthCenterAddress}>{address}</Text>
                <Text>Ubicacion: </Text><Text style={styles.healthCenterAddress}>{city}, {state}</Text>
                <Text>Contacto: </Text><Text style={styles.healthCenterAddress}>{phone_number}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    healthCenterCard: {
        backgroundColor: "#FEFEFE",
        borderRadius: 10,
        borderLeftColor: "#F392BE",
        borderLeftWidth: 4,
        borderRightColor: "#F392BE",
        borderRightWidth: 4,
        elevation: 20,
        shadowColor: "#F392BE",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84, 
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        marginRight: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 8,
        marginBottom: 8,
    },
    healthCenterInfo: {
        flex: 1,
    },
    healthCenterName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2D3748",
    },
    healthCenterAddress: {
        fontSize: 14,
        color: "#718096",
    },
});