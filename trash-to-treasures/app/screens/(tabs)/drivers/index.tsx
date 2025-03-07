import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';

type Driver = {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  imageUrl: string;
};

const sampleDrivers: Driver[] = [
  { id: '1', name: 'Karan Jana', vehicle: 'Chevrolet Traverse', rating: 4.5, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGmt7mgLLJbU_An415Sur0-Iq8kRKQzzAwCw&s' },
  { id: '2', name: 'Robert Glenn', vehicle: 'Honda Civic', rating: 4.7, imageUrl: 'https://media.istockphoto.com/id/1286810719/photo/smiling-cheerful-young-adult-african-american-ethnicity-man-looking-at-camera-standing-at.jpg?s=612x612&w=0&k=20&c=b9sWYITIZ_yjXB3m-Xftj-latPXQDhb5Roa0pA0JaNY=' },
  { id: '3', name: 'Carol Davis', vehicle: 'Ford F-150', rating: 4.6, imageUrl: 'https://st3.depositphotos.com/1011434/13157/i/450/depositphotos_131572502-stock-photo-happy-woman-smiling.jpg' },
  { id: '4', name: 'David Wilson', vehicle: 'Honda Odyssey', rating: 4.4, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp0tML1B408lzjK930FekwqGoTC15FeCUpMA&s' },
  { id: '5', name: 'Eve Brown', vehicle: 'Nissan Altima', rating: 4.8, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhWAL59Q57_XMIiD1vyU0gzfU2qJOkpxH5Ww&s' },
];

export default function PurchaseScreen() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set sample drivers immediately
    setDrivers(sampleDrivers);
    setLoading(false);
  }, []);

  const renderDriver = ({ item }: { item: Driver }) => (
    <View style={styles.driverContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.driverImage} />
      <Text style={styles.driverName}>{item.name}</Text>
      <Text style={styles.driverVehicle}>Vehicle: {item.vehicle}</Text>
      <Text style={styles.driverRating}>Rating: {item.rating}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Available Drivers</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#5C6BC0" />
        ) : (
          <FlatList
            data={drivers}
            keyExtractor={(item) => item.id}
            renderItem={renderDriver}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFF8DC',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  driverContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  driverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  driverVehicle: {
    fontSize: 16,
    marginTop: 5,
  },
  driverRating: {
    fontSize: 14,
    marginTop: 5,
    color: '#555',
  },
});