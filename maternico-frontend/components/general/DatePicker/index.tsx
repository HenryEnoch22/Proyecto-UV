import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

interface DatePickerProps {
	label?: string;
	value: Date;
	onChange: (date: Date) => void;
}

export const DatePicker = ({ label, value, onChange }: DatePickerProps) => {
	const [isCalendarVisible, setCalendarVisible] = useState(false);

	const handleDayPress = (day: { dateString: string }) => {
		const [year, month, date] = day.dateString.split("-");

		const selectedDate = new Date(
			Number(year),
			Number(month) - 1,
			Number(date)
		);

		onChange(selectedDate);
		setCalendarVisible(false);
	};

	return (
		<View>
			{label && <Text style={{ color: "#4A5568", fontSize: 16 }}>{label}</Text>}
			<Pressable
				style={styles.dateInput}
				onPress={() => setCalendarVisible(!isCalendarVisible)}
			>
				<Text style={styles.dateText}>
					{value.toLocaleDateString("es-ES", {
						day: "2-digit",
						month: "long",
						year: "numeric",
						timeZone: "UTC",
					})}
				</Text>
			</Pressable>

			{isCalendarVisible && (
				<View style={styles.calendarContainer}>
					<Calendar
						current={value.toISOString().split("T")[0]}
						onDayPress={handleDayPress}
						markedDates={{
							[value.toISOString().split("T")[0]]: {
								selected: true,
								selectedColor: "#9061F9",
							},
						}}
						theme={{
							todayTextColor: "#9061F9",
							arrowColor: "#9061F9",
							"stylesheet.calendar.main": {
								weekContainer: {
									paddingHorizontal: 4,
								},
							},
						}}
						style={styles.calendar}
					/>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	dateInput: {
		height: 48,
		borderColor: "#E2E8F0",
		borderWidth: 1,
		borderRadius: 8,
		padding: 12,
		marginBottom: 16,
		justifyContent: "center",
		backgroundColor: "#F8FAFC",
	},
	dateText: {
		color: "#4A5568",
		fontSize: 16,
	},
	calendarContainer: {
		marginBottom: 16,
	},
	calendar: {
		borderRadius: 12,
		overflow: "hidden",
	},
});
