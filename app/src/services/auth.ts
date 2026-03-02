import { auth, db } from '@/config/firebase';
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AdminUser {
    uid: string;
    email: string;
    displayName?: string;
    isAdmin: boolean;
    createdAt?: any;
}

// Sign in admin user
export const signInAdmin = async (email: string, password: string): Promise<AdminUser> => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if user is admin
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    if (!adminDoc.exists()) {
        await signOut(auth);
        throw new Error('Access denied. Admin privileges required.');
    }
    
    const adminData = adminDoc.data() as AdminUser;
    return {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || adminData.displayName,
        isAdmin: true,
        createdAt: adminData.createdAt
    };
};

// Create admin user (for initial setup)
export const createAdminUser = async (email: string, password: string, displayName?: string): Promise<AdminUser> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const adminData: AdminUser = {
        uid: user.uid,
        email: user.email!,
        displayName: displayName || 'Admin',
        isAdmin: true,
        createdAt: new Date()
    };
    
    // Save admin data to Firestore
    await setDoc(doc(db, 'admins', user.uid), adminData);
    
    return adminData;
};

// Sign out
export const signOutAdmin = async (): Promise<void> => {
    await signOut(auth);
};

// Get current admin user
export const getCurrentAdmin = async (): Promise<AdminUser | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (!user) {
                resolve(null);
                return;
            }
            
            try {
                const adminDoc = await getDoc(doc(db, 'admins', user.uid));
                if (!adminDoc.exists()) {
                    resolve(null);
                    return;
                }
                
                const adminData = adminDoc.data() as AdminUser;
                resolve({
                    uid: user.uid,
                    email: user.email!,
                    displayName: user.displayName || adminData.displayName,
                    isAdmin: true,
                    createdAt: adminData.createdAt
                });
            } catch (error) {
                console.error('Error fetching admin data:', error);
                resolve(null);
            }
        });
    });
};

// Listen to auth state changes
export const onAdminAuthStateChanged = (callback: (admin: AdminUser | null) => void) => {
    return onAuthStateChanged(auth, async (user) => {
        if (!user) {
            callback(null);
            return;
        }
        
        try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (!adminDoc.exists()) {
                callback(null);
                return;
            }
            
            const adminData = adminDoc.data() as AdminUser;
            callback({
                uid: user.uid,
                email: user.email!,
                displayName: user.displayName || adminData.displayName,
                isAdmin: true,
                createdAt: adminData.createdAt
            });
        } catch (error) {
            console.error('Error in auth state change:', error);
            callback(null);
        }
    });
};
