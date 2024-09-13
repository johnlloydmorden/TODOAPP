import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, FlatList, Modal, Image } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { StatusBar } from 'expo-status-bar';
import logo from './assets/LOGO.jpg'; 

const App = () => {
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const addTodo = () => {
    if (taskDescription.trim()) {
      setTodos([...todos, { id: Date.now(), description: taskDescription, deadline: taskDeadline }]);
      resetForm();
    }
  };

  const resetForm = () => {
    setTaskDescription('');
    setTaskDeadline('');
    setModalVisible(false);
  };

  const startEditing = (id, description, deadline) => {
    setEditingId(id);
    setTaskDescription(description);
    setTaskDeadline(deadline);
    setModalVisible(true);
  };

  const editTodo = () => {
    if (editingId && taskDescription.trim()) {
      setTodos(todos.map(todo => (todo.id === editingId ? { ...todo, description: taskDescription, deadline: taskDeadline } : todo)));
      resetForm();
    }
  };

  const deleteTodo = (id) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => setTodos(todos.filter(todo => todo.id !== id)) }
      ]
    );
  };

  const filteredTodos = todos.filter(todo => 
    todo.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = date.toISOString().split('T')[0] + ' ' + date.toLocaleTimeString();
    setTaskDeadline(formattedDate);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
      </View>
      <Text style={styles.title}>Task Tracker</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks"
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* FlatList for displaying todos */}
      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            <TouchableOpacity onPress={() => startEditing(item.id, item.description, item.deadline)}>
              <Text style={styles.descriptionText}>{item.description}</Text>
              <Text style={styles.deadlineText}>Deadline: {item.deadline}</Text>
            </TouchableOpacity>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => deleteTodo(item.id)}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      {/* Modal for adding/editing tasks */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={resetForm}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add/Edit Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Task Description"
            value={taskDescription}
            onChangeText={setTaskDescription}
          />
          <TouchableOpacity style={styles.input} onPress={showDatePicker}>
            <Text style={styles.inputText}>{taskDeadline || "Set a deadline"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.doneButton} onPress={editingId ? editTodo : addTodo}>
            <Text style={styles.doneButtonText}>{editingId ? 'Update' : 'Add'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* DateTimePickerModal for selecting deadlines */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFE0',
    padding: 35,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 350, 
    height: 80,
    marginTop: 10, 
    marginBottom: 10, 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    width: '100%',
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#333',
  },
  deadlineText: {
    fontSize: 14,
    color: '#007AFF', // Set deadline color to blue
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    right: 30,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 30,
    lineHeight: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    width: '80%',
  },
  inputText: {
    color: '#000',
  },
  doneButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
    width: '80%',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '80%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;