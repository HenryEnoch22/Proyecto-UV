import { ActivityIndicator, Text, View } from "react-native";

export const Loader = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
    </View>
);
