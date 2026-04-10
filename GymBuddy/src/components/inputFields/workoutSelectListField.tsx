import react from 'react';
import { StyleSheet } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';

interface WorkoutSelectListFieldProps {
    data: { key: string; value: string }[];
    selected: string[];
    setSelected: (selected: string[]) => void;
}

export default function WorkoutSelectListField({ data, selected, setSelected }: WorkoutSelectListFieldProps) {
    return (
        <MultipleSelectList
            data={data}
            setSelected={setSelected}
            onSelect={() => {
                selected
            }}
            save="value"
        />
    );
}