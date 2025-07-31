import React from 'react';
import { Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface SafeDateTimePickerProps {
  value: Date;
  mode?: 'date' | 'time' | 'datetime';
  display?: 'default' | 'spinner' | 'calendar' | 'clock';
  onChange: (event: any, date?: Date) => void;
  style?: any;
}

export default function SafeDateTimePicker({
  value,
  mode = 'datetime',
  display = Platform.OS === 'ios' ? 'spinner' : 'default',
  onChange,
  style,
}: SafeDateTimePickerProps) {
  const handleChange = (event: any, date?: Date) => {
    // Handle the dismiss error by checking event type
    if (event.type === 'dismissed') {
      // Call onChange with the event but no date to indicate cancellation
      onChange(event, undefined);
      return;
    }
    
    // Normal date selection
    onChange(event, date);
  };

  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display={display}
      onChange={handleChange}
      style={style}
    />
  );
} 