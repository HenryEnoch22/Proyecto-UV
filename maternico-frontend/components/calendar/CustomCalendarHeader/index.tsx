import { View, Text, StyleSheet, Pressable } from "react-native";
import {
	ArrowLeftCircleIcon,
	ArrowRightCircleIcon,
} from "react-native-heroicons/solid";

interface CustomCalendarHeaderProps {
	month: string;
	year: string;
	onPressLeft: () => void;
	onPressRight: () => void;
}

export const CustomCalendarHeader = ({
	month,
	year,
	onPressLeft,
	onPressRight,
}: CustomCalendarHeaderProps) => {
	return (
		<View style={styles.container}>
			<Pressable onPress={onPressLeft}>
				<ArrowLeftCircleIcon size={24} color="#FEFEFE" />
			</Pressable>

			<Text style={styles.monthText}>
				{month} {year}
			</Text>

			<Pressable onPress={onPressRight}>
				<ArrowRightCircleIcon size={24} color="#FEFEFE" />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F392BE",
		paddingVertical: 10,
		width: "100%",
		gap: 20,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	monthText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#FEFEFE",
		textTransform: "capitalize",
	},
});
