import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { db, auth } from '../../../services/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useCallback } from 'react';

type Product = {
  id: string;
  productName: string;
  price: number;
  description: string;
  imageUrl: string;
  school: string;
};

const MarketScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [school, setSchool] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity 0

  // Set up user authentication and initial fetch
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

  // Fetch products when the screen is focused
  useFocusEffect(
    useCallback(() => {
      if (school) {
        fetchProducts(school);
      }
    }, [school]) // Re-fetch products whenever the school changes
  );

  // Extract school from user's email domain
  const extractSchoolFromEmail = (email: string): string => {
    const domain = email.split('@')[1]; // Extract domain (e.g., "gatech.edu")
    if (!domain) return 'Unknown School';
    const schoolName = domain.split('.')[0]; // Extract first part of domain (e.g., "gatech")
    return schoolName.toLowerCase(); // Convert to lowercase for consistency
  };

  // Fetch products from Firestore where `school` matches the user's school
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

  // Open modal with fade-in animation
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1, // Fully visible
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close modal with fade-out animation
  const closeModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0, // Fully invisible
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedProduct(null);
    });
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productContainer} onPress={() => handleProductClick(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* School Header */}
        {school && (
          <View style={styles.schoolHeader}>
            <Text style={styles.schoolText}>/{school}/market</Text>
          </View>
        )}

        {/* Loading Indicator */}
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

        {/* Floating Modal with Fade Animation */}
        <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              {selectedProduct && (
                <>
                  <Image source={{ uri: selectedProduct.imageUrl }} style={styles.modalImage} />
                  <Text style={styles.modalName}>{selectedProduct.productName}</Text>
                  <Text style={styles.modalPrice}>${selectedProduct.price}</Text>
                  <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
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
  safeArea: { flex: 1, backgroundColor: "#FFF8DC" },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFF8DC",
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
    shadowColor: "#000",
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
    overflow: 'hidden',
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
  closeButton: {
    marginTop: 20,
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
