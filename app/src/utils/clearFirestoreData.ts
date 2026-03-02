import { db } from '@/config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

/**
 * Clear all data from Firestore collections
 * WARNING: This will delete ALL data permanently!
 * Use this only if you need to start fresh with the new schema
 */

export const clearAllCollections = async () => {
  const collections = [
    'categories',
    'subcategories',
    'products',
    'product_images',
    'projects',
    'project_images',
    'services',
    'catalogs',
    'enquiries',
    'contacts' // Old collection name
  ];

  console.log('🗑️  Starting to clear Firestore collections...');

  for (const collectionName of collections) {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`✅ ${collectionName}: Already empty`);
        continue;
      }

      console.log(`🔄 ${collectionName}: Deleting ${snapshot.size} documents...`);
      
      const deletePromises = snapshot.docs.map(document => 
        deleteDoc(doc(db, collectionName, document.id))
      );
      
      await Promise.all(deletePromises);
      console.log(`✅ ${collectionName}: Deleted ${snapshot.size} documents`);
    } catch (error) {
      console.error(`❌ ${collectionName}: Error -`, error);
    }
  }

  console.log('🎉 All collections cleared!');
};

export const clearCollection = async (collectionName: string) => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`✅ ${collectionName}: Already empty`);
      return;
    }

    console.log(`🔄 ${collectionName}: Deleting ${snapshot.size} documents...`);
    
    const deletePromises = snapshot.docs.map(document => 
      deleteDoc(doc(db, collectionName, document.id))
    );
    
    await Promise.all(deletePromises);
    console.log(`✅ ${collectionName}: Deleted ${snapshot.size} documents`);
  } catch (error) {
    console.error(`❌ ${collectionName}: Error -`, error);
    throw error;
  }
};

export const getCollectionStats = async () => {
  const collections = [
    'categories',
    'subcategories',
    'products',
    'product_images',
    'projects',
    'project_images',
    'services',
    'catalogs',
    'enquiries'
  ];

  console.log('📊 Firestore Collection Stats:');
  console.log('================================');

  for (const collectionName of collections) {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      console.log(`${collectionName}: ${snapshot.size} documents`);
    } catch (error) {
      console.log(`${collectionName}: Error reading collection`);
    }
  }
  
  console.log('================================');
};
