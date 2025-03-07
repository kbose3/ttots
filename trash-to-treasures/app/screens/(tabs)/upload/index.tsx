import { StyleSheet, Image, Alert, TouchableOpacity, SafeAreaView, Text, View, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { storage, db, auth } from '../../../services/firebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { User, onAuthStateChanged } from 'firebase/auth';

export default function UploadScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const extractSchoolFromEmail = (email: string): string => {
    const domain = email.split('@')[1];
    if (!domain) return 'Unknown School';
    const schoolName = domain.split('.')[0];
    return schoolName.charAt(0) + schoolName.slice(1);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setImage(imageUri);
    }
  };

  const uploadImage = async () => {
    if (!user || !image || !productName || !price || !description) {
      Alert.alert('Error', 'Please fill in all fields and pick an image.');
      return;
    }

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const imageUrl = await getDownloadURL(storageRef);

      // Extract school from email
      const school = extractSchoolFromEmail(user.email || 'unknown@example.com');

      // Save metadata to Firestore
      await addDoc(collection(db, 'uploads'), {
        userId: user.uid,
        email: user.email,
        school,
        productName,
        price: parseFloat(price),
        description,
        imageUrl,
        createdAt: new Date(),
      });

      // Reset fields and image placeholder
      setImage(null); // Clear image preview
      setProductName('');
      setPrice('');
      setDescription('');
      Alert.alert('Success!', 'Product uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image: ', error);
      Alert.alert('Upload failed!', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Upload Product</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Description"
          value={description}
          onChangeText={setDescription}
        />
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an image from camera roll</Text>
        </TouchableOpacity>
        {image && (
          <>
            <Image source={{ uri: image }} style={styles.image} />

            <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
              <Text style={styles.buttonText}>Upload Product</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#FFF8DC"},
  container: { 
    flex: 1,
    padding: 10,
    backgroundColor: "#FFF8DC", // Light yellow background
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: "#333333", // Dark button
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
  },
  buttonText: { color: "#F4A300", // Yellowish orange text
    fontWeight: "bold",
    fontSize: 16, },
  image: { padding: 10, width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  uploadButton: {
    backgroundColor: "#333333", // Dark button
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  }
});
