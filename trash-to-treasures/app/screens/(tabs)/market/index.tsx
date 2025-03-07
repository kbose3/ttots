import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import { db, auth } from '../../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

type Product = {
  id: string;
  productName: string;
  price: number;
  description: string;
  imageUrl: string;
  school: string;
};

type Driver = {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  imageUrl: string;
};

// Sample drivers (the same sample from your Drivers tab)
const sampleDrivers: Driver[] = [
  { id: '1', name: 'Karan Jana', vehicle: 'Chevrolet Traverse', rating: 4.5, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGmt7mgLLJbU_An415Sur0-Iq8kRKQzzAwCw&s' },
  { id: '2', name: 'Robert Glenn', vehicle: 'Honda Civic', rating: 4.7, imageUrl: 'https://media.istockphoto.com/id/1286810719/photo/smiling-cheerful-young-adult-african-american-ethnicity-man-looking-at-camera-standing-at.jpg?s=612x612&w=0&k=20&c=b9sWYITIZ_yjXB3m-Xftj-latPXQDhb5Roa0pA0JaNY=' },
  { id: '3', name: 'Carol Davis', vehicle: 'Ford F-150', rating: 4.6, imageUrl: 'https://st3.depositphotos.com/1011434/13157/i/450/depositphotos_131572502-stock-photo-happy-woman-smiling.jpg' },
  { id: '4', name: 'David Wilson', vehicle: 'Honda Odyssey', rating: 4.4, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp0tML1B408lzjK930FekwqGoTC15FeCUpMA&s' },
  { id: '5', name: 'Eve Brown', vehicle: 'Nissan Altima', rating: 4.8, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhWAL59Q57_XMIiD1vyU0gzfU2qJOkpxH5Ww&s' },
];

const MarketScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity 0
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        const parsedSchool = extractSchoolFromEmail(currentUser.email);
        setSchool(parsedSchool);
      }
    });
    return unsubscribe;
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (school) {
        fetchProducts(school);
      }
    }, [school])
  );

  const extractSchoolFromEmail = (email: string): string => {
    const domain = email.split('@')[1];
    if (!domain) return 'Unknown School';
    const schoolName = domain.split('.')[0];
    return schoolName.toLowerCase();
  };

  const fetchProducts = async (userSchool: string) => {
    setLoading(true);
    try {
      const productsRef = collection(db, 'uploads');
      const q = query(productsRef, where('school', '==', userSchool));
      const querySnapshot = await getDocs(q);
      const productsData: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const openModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedDriverId(null); // Clear any previous driver selection
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedProduct(null);
    });
  };

  // Toggle driver selection (only single driver selection allowed)
  const selectDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
  };

  // Navigate to complete purchase screen, passing the selected product and driver
  const completePurchase = () => {
    if (!selectedProduct || !selectedDriverId) {
      Alert.alert('Error', 'Please select both a product and a driver.');
      return;
    }
    const selectedDriver = sampleDrivers.find(driver => driver.id === selectedDriverId);
    router.push({
      pathname: '/screens/complete_purchase',
      params: {
        product: JSON.stringify(selectedProduct),
        driver: JSON.stringify(selectedDriver),
      },
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productContainer} onPress={() => openModal(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {school && (
          <View style={styles.schoolHeader}>
            <Text style={styles.schoolText}>/{school}/market</Text>
          </View>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#5C6BC0" style={styles.loader} />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            numColumns={2}
            contentContainerStyle={styles.grid}
          />
        )}

        <Modal visible={modalVisible} transparent onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              {selectedProduct && (
                <>
                  <Image source={{ uri: selectedProduct.imageUrl }} style={styles.modalImage} />
                  <Text style={styles.modalName}>{selectedProduct.productName}</Text>
                  <Text style={styles.modalPrice}>${selectedProduct.price}</Text>
                  <Text style={styles.modalDescription}>{selectedProduct.description}</Text>

                  <Text style={styles.sectionTitle}>Select a Driver</Text>
                  <FlatList
                    data={sampleDrivers}
                    horizontal
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.driverOption,
                          selectedDriverId === item.id && styles.driverOptionSelected,
                        ]}
                        onPress={() => selectDriver(item.id)}
                      >
                        <Image source={{ uri: item.imageUrl }} style={styles.driverOptionImage} />
                        <Text style={styles.driverOptionName}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />

                  {selectedDriverId && (
                    <TouchableOpacity style={styles.completePurchaseButton} onPress={completePurchase}>
                      <Text style={styles.completePurchaseText}>Complete Purchase</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    <Text style={styles.closeText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8DC',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF8DC',
  },
  schoolHeader: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
  },
  schoolText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  loader: {
    marginTop: 50,
  },
  grid: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: 'hidden',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  productPrice: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPrice: {
    fontSize: 20,
    color: '#555',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  driverOption: {
    marginHorizontal: 5,
    padding: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  driverOptionSelected: {
    borderColor: '#5C6BC0',
    backgroundColor: '#E0EAFB',
  },
  driverOptionImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  driverOptionName: {
    fontSize: 12,
    textAlign: 'center',
  },
  completePurchaseButton: {
    marginTop: 15,
    backgroundColor: '#5C6BC0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  completePurchaseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MarketScreen;