import React, { memo, useState } from 'react';
import { TouchableOpacity, Text, View, Modal, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';

const DeleteModal = memo(({ show, onClose, onDelete, message }) => {
  const [checkDeletion, setCheckDeletion] = useState(false);

  const handleDelete = async () => {
    try {
      await onDelete();
      onClose(); // Close the dialog after deletion
    } catch (error) {
      console.error('Error during delete operation:', error);
      alert('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <Modal visible={show} animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Confirm Delete</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checkDeletion ? 'checked' : 'unchecked'}
              onPress={() => setCheckDeletion(!checkDeletion)}
              style={styles.checkbox}
              color={checkDeletion ? 'red' : '#B0B0B0'} // Change checkbox color
              uncheckedColor="#B0B0B0" // Color when unchecked
            />
            <Text style={styles.label}>Are you sure to delete it?</Text>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={onClose}
              accessibilityLabel="Cancel"
              accessibilityHint="Closes the delete confirmation dialog."
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: checkDeletion ? 'red' : '#F8D7DA' }]} 
              onPress={handleDelete}
              accessibilityLabel="Delete"
              accessibilityHint="Deletes the item and closes the dialog."
              disabled={!checkDeletion}
            >
              <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    marginBottom: 20,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10, // Space between checkbox and label
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default DeleteModal;
