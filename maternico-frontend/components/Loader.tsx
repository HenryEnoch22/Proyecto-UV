import { ActivityIndicator, Text, View } from "react-native";

const Loader = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
    </View>
);

export default Loader;