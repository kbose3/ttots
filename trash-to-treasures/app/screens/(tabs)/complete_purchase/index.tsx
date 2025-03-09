import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image, 
  Alert 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';

export default function CompletePurchaseScreen() {
  const { product, driver } = useLocalSearchParams();
  const router = useRouter();

  let parsedProduct, parsedDriver;
  try {
    parsedProduct = product ? JSON.parse(product as string) : null;
  } catch (error) {
    parsedProduct = null;
  }
  try {
    parsedDriver = driver ? JSON.parse(driver as string) : null;
  } catch (error) {
    parsedDriver = null;
  }
  
  useEffect(() => {
    console.log('Parsed Product:', parsedProduct);
  }, [parsedProduct]);

  const [address, setAddress] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleConfirmPurchase = async () => {
    if (!parsedProduct) {
      Alert.alert('Error', 'No product found');
      return;
    }

    try {
      await deleteDoc(doc(db, 'uploads', parsedProduct.id));
      Alert.alert('Purchase Confirmed', 'Your purchase has been completed successfully!');
      router.push({ pathname: '/screens/(tabs)/market' });
    } catch (error) {
      console.error('Error removing purchased product:', error);
      Alert.alert('Error', 'Failed to remove purchased product');
    }
  };

  if (!parsedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.header}>Complete Purchase</Text>
          <Text style={styles.detailText}>Please select a product</Text>
          <Button title="Go to Market" onPress={() => router.push({ pathname: '/screens/(tabs)/market' })} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Complete Purchase</Text>

        {parsedProduct && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Product Summary</Text>
            <Text style={styles.detailText}>Name: {parsedProduct.productName}</Text>
            <Text style={styles.detailText}>Price: ${parsedProduct.price}</Text>
            <Text style={styles.detailText}>Description: {parsedProduct.description}</Text>
            {parsedProduct.imageUrl && parsedProduct.imageUrl.startsWith('http') ? (
              <Image 
                source={{ uri: parsedProduct.imageUrl }} 
                style={styles.productImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.detailText}>No valid image available</Text>
            )}
          </View>
        )}

        {parsedDriver && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Driver Details</Text>
            <Text style={styles.detailText}>Name: {parsedDriver.name}</Text>
            <Text style={styles.detailText}>Vehicle: {parsedDriver.vehicle}</Text>
            <Text style={styles.detailText}>Rating: {parsedDriver.rating}</Text>
            {parsedDriver.imageUrl && parsedDriver.imageUrl.startsWith('http') ? (
              <Image 
                source={{ uri: parsedDriver.imageUrl }} 
                style={styles.driverImage}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.detailText}>No valid image available</Text>
            )}
          </View>
        )}

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Delivery Address</Text>
          <TextInput 
            style={styles.input}
            placeholder="Enter delivery address"
            value={address}
            onChangeText={setAddress}
          />

          <Text style={styles.inputLabel}>Special Instructions</Text>
          <TextInput 
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter any special instructions"
            value={instructions}
            onChangeText={setInstructions}
            multiline
          />
        </View>

        <Button title="Confirm Purchase" onPress={handleConfirmPurchase} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  summarySection: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginTop: 10,
  },
  driverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
    alignSelf: 'center',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 80,
  },
});