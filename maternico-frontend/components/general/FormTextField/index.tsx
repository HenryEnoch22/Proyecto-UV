import { View, Text, TextInput, StyleSheet } from "react-native";

interface FormTextFieldProps {
    label?: string;
    errors?: string[];
    [key: string]: any;
}

export const FormTextField = ({ label, errors = [], ...props}: FormTextFieldProps) => {
    return (
        <View>
            {label && (
                <Text style={styles.label}>
                        {label}
                </Text>
            )}
            <TextInput
                style={styles.textInput}
                autoCapitalize="none"
                {...props}
            />
            {errors.map((error, index) => (
                <Text key={index} style={styles.errors}>
                    {error}
                </Text>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({  
    label: {
        color: "#334155",
        fontWeight: 500,
    },
    textInput: {
        padding: 10,
        backgroundColor: "#f1f5f9",
        borderColor: "#cbd5e1",
        borderWidth: 1,
        borderRadius: 4,
        marginTop: 4,
    },
    errors: {
        color: "red",
        marginTop: 2,
    },
    inputContainer: {
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#E1E1E1",
        borderRadius: 8,
        backgroundColor: "#F9F9F9",
    },
    input: {
        padding: 16,
        fontSize: 16,
    },
});