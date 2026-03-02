import { 
    fetchCategories,
    fetchProducts,
    fetchProjects,
    fetchCatalogs
} from './products';
import { createAdminUser } from './auth';

// Check if collections are empty
export const checkDataExists = async () => {
    const [existingCategories, existingProducts, existingProjects, existingCatalogs] = await Promise.all([
        fetchCategories(),
        fetchProducts(),
        fetchProjects(),
        fetchCatalogs()
    ]);
    
    return {
        hasCategories: existingCategories.length > 0,
        hasProducts: existingProducts.length > 0,
        hasProjects: existingProjects.length > 0,
        hasCatalogs: existingCatalogs.length > 0
    };
};

// Seed all data
export const seedAllData = async () => {
    console.log('Starting data check...');
    
    try {
        const existingData = await checkDataExists();
        
        console.log('Data status:', {
            categories: existingData.hasCategories ? '✅ Exists' : '❌ Empty',
            products: existingData.hasProducts ? '✅ Exists' : '❌ Empty',
            projects: existingData.hasProjects ? '✅ Exists' : '❌ Empty',
            catalogs: existingData.hasCatalogs ? '✅ Exists' : '❌ Empty'
        });
        
        console.log('💡 Use the admin panel to add your data manually');
        return true;
        
    } catch (error) {
        console.error('❌ Error checking data:', error);
        throw error;
    }
};

// Create initial admin user
export const createInitialAdmin = async (email: string, password: string) => {
    try {
        const admin = await createAdminUser(email, password, 'Super Admin');
        console.log('✅ Initial admin user created:', admin.email);
        return admin;
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        throw error;
    }
};

// Complete setup (seed data + create admin)
export const completeSetup = async (adminEmail: string, adminPassword: string) => {
    console.log('🚀 Starting complete setup...');
    
    try {
        await createInitialAdmin(adminEmail, adminPassword);
        await seedAllData();
        
        console.log('🎉 Complete setup finished successfully!');
        return true;
    } catch (error) {
        console.error('❌ Setup failed:', error);
        throw error;
    }
};
