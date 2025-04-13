import { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import PrimaryButton from "../../components/PrimaryButton";
import {
	ArrowLongLeftIcon,
	CalendarIcon,
} from "react-native-heroicons/outline";
import { useNavigation } from "@react-navigation/native";
import CustomCalendarHeader from "../../components/CustomCalendarHeader";
import Agenda from "../../components/Agenda";
import AddEventModal from "../../components/AddEventModal";
import { createEvent, getEvents, getProfile } from "@/services/api";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import EventModal from "../../components/EventModal";

const CalendarScreen = () => {
	interface Event {
		id: number;
		title: string;
		date: string;
		time?: string;
		isNotifiable: boolean;
	}

	const currentDate = new Date().toISOString().split("T")[0];
	const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth() + 1);
	const [calendarYear, setCalendarYear] = useState(new Date().getMonth() + 1);
	const [showModal, setShowModal] = useState(false);
	const { user, setUser } = useAuth();
	const [events, setEvents] = useState<Event[]>([]);
	const [selectedDate, setSelectedDate] = useState("");
	const [showEvent, setShowEvent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const loadEvents = async (year: number, month: number) => {
		try {
			setLoading(true);
			setError("");

			if (!user) return;

			const eventos = await getEvents(Number(user.id), year, month);
			setEvents(eventos.data || []);
		} catch (error) {
			console.error("Error obteniendo eventos:", error);
			setError("Error cargando eventos");
			setEvents([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const initializeData = async () => {
			try {
				if (!user) {
					const userData = await getProfile();
					setUser(userData?.user);
				}

				const currentDate = new Date();
				const initialYear = currentDate.getFullYear();
				const initialMonth = currentDate.getMonth() + 1;

				setCalendarYear(initialYear);
				setCalendarMonth(initialMonth);

				await loadEvents(initialYear, initialMonth);
			} catch (error) {
				console.error("Error inicializando datos:", error);
			}
		};

		initializeData();
	}, []);

	useEffect(() => {
		if (calendarYear && calendarMonth) {
			loadEvents(calendarYear, calendarMonth);
		}
	}, [calendarMonth, calendarYear]);

	LocaleConfig.locales["es"] = {
		monthNames: [
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre",
		],
		monthNamesShort: [
			"Ene",
			"Feb",
			"Mar",
			"Abril",
			"Mayo",
			"Jun",
			"Jul",
			"Ago",
			"Sep",
			"Oct",
			"Nov",
			"Dic",
		],
		dayNames: [
			"Domingo",
			"Lunes",
			"Martes",
			"Miercoles",
			"Jueves",
			"Viernes",
			"Sabado",
		],
		dayNamesShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
		today: "Hoy",
	};

	LocaleConfig.defaultLocale = "es";

	const getMarkedDates = () => {
		const markedDates: { [key: string]: any } = {
			[currentDate]: {
				selected: true,
				marked: true,
				selectedColor: "#F9A8D4",
				description: "Hoy",
			},
		};

		const uniqueDates = new Set(
			events.map((event) => event.date.split("T")[0])
		);

		uniqueDates.forEach((date) => {
			markedDates[date] = {
				marked: true,
				dotColor: "#60A5FA",
				description: "Eventos programados",
			};
		});

		return markedDates;
	};

	const handleDayPress = (day: { dateString: string }) => {
		setSelectedDate(day.dateString);

		const hasEvents = events.some(
			(event) => event.date.split("T")[0] === day.dateString
		);

		if (hasEvents) {
			setShowEvent(true);
		}
	};

	const navigation = useNavigation();

	const handleSubmit = async (eventData: {
		name: string;
		date: Date;
		time: string;
		notify: boolean;
		type: number;
	}) => {
		try {
			if (!user) return;

			const formattedDate = eventData.date.toISOString().split("T")[0];
			await createEvent(
				Number(user.id),
				eventData.name,
				formattedDate,
				eventData.time || "",
				eventData.notify,
				eventData.type
			);

			await loadEvents(calendarYear, calendarMonth);

			setShowModal(false);
		} catch (error) {
			console.error("Error al crear evento:", error);
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.header}>
				<Pressable onPress={() => navigation.goBack()}>
					<ArrowLongLeftIcon size={28} color="#fefefe" />
				</Pressable>
				<Text style={styles.title}>Mi Calendario</Text>
			</View>

			<View style={{ paddingHorizontal: 16 }}>
				<View style={styles.instructionBox}>
					<CalendarIcon size={20} color="#9061F9" />
					<Text style={styles.instructionText}>
						Toca en cualquier día para ver tus citas o agregar un recordatorio
					</Text>
				</View>

				<View style={styles.legendContainer}>
					<View style={styles.legendItem}>
						<View style={[styles.dot, { backgroundColor: "#60A5FA" }]} />
						<Text style={styles.legendText}>Vacunas</Text>
					</View>
					<View style={styles.legendItem}>
						<View style={[styles.dot, { backgroundColor: "#34D399" }]} />
						<Text style={styles.legendText}>Citas medicas</Text>
					</View>
					<View style={styles.legendItem}>
						<View style={[styles.dot, { backgroundColor: "#F87171" }]} />
						<Text style={styles.legendText}>Revisiones</Text>
					</View>
				</View>

				<Calendar
					style={styles.calendar}
					current={currentDate}
					onDayPress={handleDayPress}
					markedDates={getMarkedDates()}
					theme={{
						calendarBackground: "#FEFEFE",
						textSectionTitleColor: "#343434",
						selectedDayBackgroundColor: "transparent",
						selectedDayTextColor: "#FEFEFE",
						todayTextColor: "#F392BE",
						dayTextColor: "#343434",
						textDisabledColor: "#CBD5E0",
						dotColor: "#F9A8D4",
						selectedDotColor: "#FEFEFE",
						textMonthFontWeight: "600",
					}}
					onMonthChange={(month: { month: number }) => {
						setCalendarYear(month.dateString.split("-")[0]);
						setCalendarMonth(month.month);
					}}
					customHeader={(props: any) => {
						const date = new Date(props.month);
						const month = date.toLocaleString("es-MX", { month: "long" });
						const year = date.getFullYear();

						return (
							<CustomCalendarHeader
								month={month}
								year={year.toString()}
								onPressLeft={() => props.addMonth(-1)}
								onPressRight={() => props.addMonth(1)}
							/>
						);
					}}
					dayComponent={({
						date,
						state,
					}: {
						date: { dateString: string; day: number };
						state: string;
					}) => {
						const hasEvents = events.some(
							(event) => event.date.split("T")[0] === date.dateString
						);

						return (
							<View
								style={{
									width: 30,
									height: 30,
									justifyContent: "center",
									alignItems: "center",
									backgroundColor: hasEvents ? "#F392BE" : "transparent",
									borderRadius: 5,
								}}
							>
								<Text
									style={{
										color: hasEvents
											? "#FEFEFE"
											: state === "disabled"
											? "#CBD5E0"
											: "#343434",
									}}
								>
									{date.day}
								</Text>
							</View>
						);
					}}
				/>

				<PrimaryButton
					style={styles.mainButton}
					onPress={() => setShowModal(true)}
					text="Agregar recordatorio"
				/>
			</View>

			<AddEventModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				onSubmit={handleSubmit}
			/>

			<ScrollView style={{ marginTop: 24 }}>
				{loading ? (
					<Text style={{ paddingHorizontal: 16 }}>Cargando eventos...</Text>
				) : error ? (
					<Text style={{ color: "red" }}>{error}</Text>
				) : (
					<Agenda
						events={events.filter((item) => {
							const date = new Date(item.date);
							return date.getMonth() + 1 === calendarMonth;
						})}
					/>
				)}
			</ScrollView>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FEFEFE",
	},
	header: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 16,
		backgroundColor: "#F392BE",
		marginBottom: 16,
		paddingHorizontal: 20,
		paddingTop: "10%",
		paddingBottom: "5%",
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fefefe",
	},
	instructionBox: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#F3E8FF",
		padding: 12,
		borderRadius: 8,
		marginBottom: 16,
	},
	instructionText: {
		marginLeft: 8,
		fontSize: 16,
		color: "#4A5568",
	},
	legendContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 16,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	dot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		marginRight: 6,
	},
	legendText: {
		fontSize: 14,
		color: "#4A5568",
	},
	mainButton: {
		backgroundColor: "#F392BE",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginVertical: 16,
	},
	mainButtonText: {
		color: "#FEFEFE",
		fontWeight: "bold",
		fontSize: 16,
	},
	calendar: {
		marginBottom: 24,
	},
});

export default CalendarScreen;
