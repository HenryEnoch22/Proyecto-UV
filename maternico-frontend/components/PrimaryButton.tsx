import { Pressable, Text, StyleSheet, Platform } from "react-native";
import { useState } from "react";

interface PrimaryButtonProps {
    onPress: () => void;
    text: string;
    [key: string]: any;
}

export default function PrimaryButton({ onPress, text, ...props }: PrimaryButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                // Apply pressed style when pressed
                pressed && styles.buttonPressed
            ]}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#F283B5",
        borderRadius: 50,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },
    buttonHovered: {
        backgroundColor: "#F06BA2",
        transform: [{ scale: 1.02 }],
    },
    buttonPressed: {
        backgroundColor: "#E05A91",
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "600",
    },
});