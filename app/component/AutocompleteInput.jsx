import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { handleAutocomplete } from '../../scripts/api/geoApi';

export default function AutocompleteInput({ placeholder, onSelect }) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Debounce typing
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (input.length >= 2) {
        const response = await handleAutocomplete({ input: encodeURIComponent(input), sessionToken: '123'});
        setSuggestions(response.data);
        setShowDropdown(true);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [input]);

  const handleSelect = (item) => {
    setInput(item.description);
    setShowDropdown(false);
    onSelect(item);
  };

  return (
    <View style={{ marginVertical: 10, position: 'relative' }}>
      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder={placeholder}
        style={styles.input}
      />
      {showDropdown && (
        <FlatList 
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          style={styles.dropdown}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  dropdown: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 45, // below TextInput
    width: '100%',
    zIndex: 1000,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
