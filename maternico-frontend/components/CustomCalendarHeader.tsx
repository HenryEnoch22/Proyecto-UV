import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {ArrowLeftCircleIcon, ArrowRightCircleIcon} from 'react-native-heroicons/solid';

interface CustomCalendarHeaderProps {
    month: string;
    year: string;
    onPressLeft: () => void;
    onPressRight: () => void;
}

const CustomCalendarHeader = ({ month, year, onPressLeft, onPressRight }: CustomCalendarHeaderProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressLeft}>
        <ArrowLeftCircleIcon size={24} color="#FEFEFE" />
      </TouchableOpacity>
      
      <Text style={styles.monthText}>{month} {year}</Text>
      
      <TouchableOpacity onPress={onPressRight}>
        <ArrowRightCircleIcon size={24} color="#FEFEFE" />
      </TouchableOpacity>
    </View>
  );
};

// Estilos para mejor alineación
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F392BE',
    paddingVertical: 10,
    width: '100%',
    gap: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FEFEFE',
    textTransform: 'capitalize'
  },
});

export default CustomCalendarHeader;