import { db } from '@/config/firebase';
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    addDoc,
    deleteDoc,
    updateDoc,
    orderBy,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';

// Import types from the main types file
import type {
    Category,
    Subcategory,
    Product,
    ProductImage,
    Project,
    ProjectImage,
    Service,
    Catalog,
    CatalogCategory,
    Enquiry,
    Testimonial,
    SiteSettings
} from '@/types';

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
};

// Helper function to convert Firestore timestamp to ISO string
const timestampToString = (timestamp: any): string | undefined => {
    if (!timestamp) return undefined;
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toISOString();
    }
    if (timestamp.toDate) {
        return timestamp.toDate().toISOString();
    }
    return undefined;
};

// Collection references
const categoriesCollection = collection(db, 'categories');
const subcategoriesCollection = collection(db, 'subcategories');
const productsCollection = collection(db, 'products');
const productImagesCollection = collection(db, 'product_images');
const projectsCollection = collection(db, 'projects');
// const projectImagesCollection = collection(db, 'project_images');
const servicesCollection = collection(db, 'services');
const catalogsCollection = collection(db, 'catalogs');
const catalogCategoriesCollection = collection(db, 'catalogCategories');
const enquiriesCollection = collection(db, 'enquiries');

// ============ CATEGORIES ============
export const fetchCategories = async (): Promise<Category[]> => {
    const snapshot = await getDocs(query(categoriesCollection, orderBy('sort_order')));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            description: data.description,
            cover_image_url: data.cover_image_url,
            sort_order: data.sort_order || 0,
            status: data.status || 'active',
            created_at: timestampToString(data.created_at)
        } as Category;
    });
};

export const fetchCategoryById = async (id: string): Promise<Category | undefined> => {
    const docRef = doc(db, 'categories', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            description: data.description,
            cover_image_url: data.cover_image_url,
            sort_order: data.sort_order || 0,
            status: data.status || 'active',
            created_at: timestampToString(data.created_at)
        } as Category;
    }
    return undefined;
};

export const createCategory = async (category: Partial<Category>): Promise<string> => {
    const categoryData = {
        name: category.name,
        slug: category.slug || generateSlug(category.name || ''),
        description: category.description || '',
        cover_image_url: category.cover_image_url || '',
        sort_order: category.sort_order || 0,
        status: category.status || 'active',
        created_at: serverTimestamp()
    };
    const docRef = await addDoc(categoriesCollection, categoryData);
    return docRef.id;
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
    const categoryData: any = {};
    if (category.name) categoryData.name = category.name;
    if (category.slug) categoryData.slug = category.slug;
    if (category.description !== undefined) categoryData.description = category.description;
    if (category.cover_image_url !== undefined) categoryData.cover_image_url = category.cover_image_url;
    if (category.sort_order !== undefined) categoryData.sort_order = category.sort_order;
    if (category.status) categoryData.status = category.status;
    
    await updateDoc(doc(db, 'categories', id), categoryData);
};

export const deleteCategory = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'categories', id));
};

// ============ SUBCATEGORIES ============
export const fetchSubcategories = async (): Promise<Subcategory[]> => {
    const snapshot = await getDocs(query(subcategoriesCollection, orderBy('sort_order')));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            category_id: data.category_id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            description: data.description,
            cover_image_url: data.cover_image_url,
            sort_order: data.sort_order || 0,
            status: data.status || 'active',
            created_at: timestampToString(data.created_at)
        } as Subcategory;
    });
};

export const fetchSubcategoriesByCategory = async (categoryId: string): Promise<Subcategory[]> => {
    try {
        const q = query(subcategoriesCollection, where("category_id", "==", categoryId));
        const snapshot = await getDocs(q);
        const subcategories = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                category_id: data.category_id,
                name: data.name,
                slug: data.slug || generateSlug(data.name),
                description: data.description,
                cover_image_url: data.cover_image_url,
                sort_order: data.sort_order || 0,
                status: data.status || 'active',
                created_at: timestampToString(data.created_at)
            } as Subcategory;
        });
        return subcategories.sort((a, b) => a.sort_order - b.sort_order);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return [];
    }
};

export const fetchSubcategoryById = async (id: string): Promise<Subcategory | undefined> => {
    const docRef = doc(db, 'subcategories', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            category_id: data.category_id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            description: data.description,
            cover_image_url: data.cover_image_url,
            sort_order: data.sort_order || 0,
            status: data.status || 'active',
            created_at: timestampToString(data.created_at)
        } as Subcategory;
    }
    return undefined;
};

export const createSubcategory = async (subcategory: Partial<Subcategory>): Promise<string> => {
    const subcategoryData = {
        category_id: subcategory.category_id,
        name: subcategory.name,
        slug: subcategory.slug || generateSlug(subcategory.name || ''),
        description: subcategory.description || '',
        cover_image_url: subcategory.cover_image_url || '',
        sort_order: subcategory.sort_order || 0,
        status: subcategory.status || 'active',
        created_at: serverTimestamp()
    };
    const docRef = await addDoc(subcategoriesCollection, subcategoryData);
    return docRef.id;
};

export const updateSubcategory = async (id: string, subcategory: Partial<Subcategory>): Promise<void> => {
    const subcategoryData: any = {};
    if (subcategory.category_id) subcategoryData.category_id = subcategory.category_id;
    if (subcategory.name) subcategoryData.name = subcategory.name;
    if (subcategory.slug) subcategoryData.slug = subcategory.slug;
    if (subcategory.description !== undefined) subcategoryData.description = subcategory.description;
    if (subcategory.cover_image_url !== undefined) subcategoryData.cover_image_url = subcategory.cover_image_url;
    if (subcategory.sort_order !== undefined) subcategoryData.sort_order = subcategory.sort_order;
    if (subcategory.status) subcategoryData.status = subcategory.status;
    
    await updateDoc(doc(db, 'subcategories', id), subcategoryData);
};

export const deleteSubcategory = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'subcategories', id));
};

// ============ PRODUCTS ============
export const fetchProducts = async (): Promise<Product[]> => {
    const snapshot = await getDocs(query(productsCollection, orderBy('sort_order')));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            sku: data.sku,
            category_id: data.category_id,
            subcategory_id: data.subcategory_id,
            short_description: data.short_description || '',
            long_description: data.long_description,
            images: data.images || [],
            is_featured: data.is_featured || false,
            is_new: data.is_new || false,
            is_customizable: data.is_customizable || false,
            customization_notes: data.customization_notes,
            status: data.status || 'active',
            sort_order: data.sort_order || 0,
            seo_title: data.seo_title,
            seo_description: data.seo_description,
            created_at: timestampToString(data.created_at),
            updated_at: timestampToString(data.updated_at)
        } as Product;
    });
};

export const fetchProductById = async (id: string): Promise<Product | undefined> => {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Fetch category if category_id exists
        let category = undefined;
        if (data.category_id) {
            category = await fetchCategoryById(data.category_id);
        }
        
        // Fetch subcategory if subcategory_id exists
        let subcategory = undefined;
        if (data.subcategory_id) {
            subcategory = await fetchSubcategoryById(data.subcategory_id);
        }
        
        return {
            id: docSnap.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            sku: data.sku,
            category_id: data.category_id,
            category: category,
            subcategory_id: data.subcategory_id,
            subcategory: subcategory,
            short_description: data.short_description || '',
            long_description: data.long_description,
            images: data.images || [],
            specifications: data.specifications || [],
            features: data.features || [],
            is_featured: data.is_featured || false,
            is_new: data.is_new || false,
            is_customizable: data.is_customizable || false,
            customization_notes: data.customization_notes,
            status: data.status || 'active',
            sort_order: data.sort_order || 0,
            seo_title: data.seo_title,
            seo_description: data.seo_description,
            created_at: timestampToString(data.created_at),
            updated_at: timestampToString(data.updated_at)
        } as Product;
    }
    return undefined;
};

export const createProduct = async (product: Partial<Product>): Promise<string> => {
    const productData = {
        name: product.name,
        slug: product.slug || generateSlug(product.name || ''),
        sku: product.sku || '',
        category_id: product.category_id,
        subcategory_id: product.subcategory_id || '',
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        images: product.images || [],
        is_featured: product.is_featured || false,
        is_new: product.is_new || false,
        is_customizable: product.is_customizable || false,
        customization_notes: product.customization_notes || '',
        status: product.status || 'active',
        sort_order: product.sort_order || 0,
        seo_title: product.seo_title || '',
        seo_description: product.seo_description || '',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
    };
    const docRef = await addDoc(productsCollection, productData);
    return docRef.id;
};

export const updateProduct = async (id: string, product: Partial<Product>): Promise<void> => {
    const productData: any = { updated_at: serverTimestamp() };
    if (product.name) productData.name = product.name;
    if (product.slug) productData.slug = product.slug;
    if (product.sku !== undefined) productData.sku = product.sku;
    if (product.category_id) productData.category_id = product.category_id;
    if (product.subcategory_id !== undefined) productData.subcategory_id = product.subcategory_id;
    if (product.short_description !== undefined) productData.short_description = product.short_description;
    if (product.long_description !== undefined) productData.long_description = product.long_description;
    if (product.images !== undefined) productData.images = product.images;
    if (product.is_featured !== undefined) productData.is_featured = product.is_featured;
    if (product.is_new !== undefined) productData.is_new = product.is_new;
    if (product.is_customizable !== undefined) productData.is_customizable = product.is_customizable;
    if (product.customization_notes !== undefined) productData.customization_notes = product.customization_notes;
    if (product.status) productData.status = product.status;
    if (product.sort_order !== undefined) productData.sort_order = product.sort_order;
    if (product.seo_title !== undefined) productData.seo_title = product.seo_title;
    if (product.seo_description !== undefined) productData.seo_description = product.seo_description;
    
    await updateDoc(doc(db, 'products', id), productData);
};

export const deleteProduct = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'products', id));
};

// ============ PRODUCT IMAGES ============
export const fetchProductImages = async (productId: string): Promise<ProductImage[]> => {
    const q = query(productImagesCollection, where("product_id", "==", productId), orderBy('sort_order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            product_id: data.product_id,
            image_url: data.image_url,
            alt_text: data.alt_text,
            sort_order: data.sort_order || 0,
            is_primary: data.is_primary || false
        } as ProductImage;
    });
};

export const createProductImage = async (image: Partial<ProductImage>): Promise<string> => {
    const imageData = {
        product_id: image.product_id,
        image_url: image.image_url,
        alt_text: image.alt_text || '',
        sort_order: image.sort_order || 0,
        is_primary: image.is_primary || false
    };
    const docRef = await addDoc(productImagesCollection, imageData);
    return docRef.id;
};

export const deleteProductImage = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'product_images', id));
};

// ============ PROJECTS ============
export const fetchProjects = async (): Promise<Project[]> => {
    const snapshot = await getDocs(query(projectsCollection, orderBy('year', 'desc')));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            client_name: data.client_name,
            location: data.location || '',
            city: data.city,
            year: data.year || new Date().getFullYear(),
            project_type: data.project_type || '',
            scope: data.scope,
            short_description: data.short_description,
            long_description: data.long_description,
            hero_image_url: data.hero_image_url,
            images: data.images || [],
            is_featured: data.is_featured || false,
            status: data.status || 'active',
            created_at: timestampToString(data.created_at)
        } as Project;
    });
};

export const fetchProjectById = async (id: string): Promise<Project | undefined> => {
    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            client_name: data.client_name,
            location: data.location || '',
            city: data.city,
            year: data.year || new Date().getFullYear(),
            project_type: data.project_type || '',
            scope: data.scope,
            short_description: data.short_description,
            long_description: data.long_description,
            hero_image_url: data.hero_image_url,
            images: data.images || [],
            is_featured: data.is_featured || false,
            status: data.status || 'active',
            created_at: timestampToString(data.created_at)
        } as Project;
    }
    return undefined;
};

export const createProject = async (project: Partial<Project>): Promise<string> => {
    const projectData = {
        name: project.name,
        slug: project.slug || generateSlug(project.name || ''),
        client_name: project.client_name || '',
        location: project.location || '',
        city: project.city || '',
        year: project.year || new Date().getFullYear(),
        project_type: project.project_type || '',
        scope: project.scope || '',
        short_description: project.short_description || '',
        long_description: project.long_description || '',
        hero_image_url: project.hero_image_url || '',
        images: project.images || [],
        is_featured: project.is_featured || false,
        status: project.status || 'active',
        created_at: serverTimestamp()
    };
    const docRef = await addDoc(projectsCollection, projectData);
    return docRef.id;
};

export const updateProject = async (id: string, project: Partial<Project>): Promise<void> => {
    const projectData: any = {};
    if (project.name) projectData.name = project.name;
    if (project.slug) projectData.slug = project.slug;
    if (project.client_name !== undefined) projectData.client_name = project.client_name;
    if (project.location !== undefined) projectData.location = project.location;
    if (project.city !== undefined) projectData.city = project.city;
    if (project.year !== undefined) projectData.year = project.year;
    if (project.project_type !== undefined) projectData.project_type = project.project_type;
    if (project.scope !== undefined) projectData.scope = project.scope;
    if (project.short_description !== undefined) projectData.short_description = project.short_description;
    if (project.long_description !== undefined) projectData.long_description = project.long_description;
    if (project.hero_image_url !== undefined) projectData.hero_image_url = project.hero_image_url;
    if (project.images !== undefined) projectData.images = project.images;
    if (project.is_featured !== undefined) projectData.is_featured = project.is_featured;
    if (project.status) projectData.status = project.status;
    
    await updateDoc(doc(db, 'projects', id), projectData);
};

export const deleteProject = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'projects', id));
};

// ============ SERVICES ============
export const fetchServices = async (): Promise<Service[]> => {
    const snapshot = await getDocs(query(servicesCollection, orderBy('sort_order')));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            icon_url: data.icon_url,
            short_description: data.short_description || '',
            long_description: data.long_description,
            hero_image_url: data.hero_image_url,
            is_featured: data.is_featured || false,
            status: data.status || 'active',
            sort_order: data.sort_order || 0,
            created_at: timestampToString(data.created_at)
        } as Service;
    });
};

export const fetchServiceById = async (id: string): Promise<Service | undefined> => {
    const docRef = doc(db, 'services', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            icon_url: data.icon_url,
            short_description: data.short_description || '',
            long_description: data.long_description,
            hero_image_url: data.hero_image_url,
            is_featured: data.is_featured || false,
            status: data.status || 'active',
            sort_order: data.sort_order || 0,
            created_at: timestampToString(data.created_at)
        } as Service;
    }
    return undefined;
};

export const createService = async (service: Partial<Service>): Promise<string> => {
    const serviceData = {
        name: service.name,
        slug: service.slug || generateSlug(service.name || ''),
        icon_url: service.icon_url || '',
        short_description: service.short_description || '',
        long_description: service.long_description || '',
        hero_image_url: service.hero_image_url || '',
        is_featured: service.is_featured || false,
        status: service.status || 'active',
        sort_order: service.sort_order || 0,
        created_at: serverTimestamp()
    };
    const docRef = await addDoc(servicesCollection, serviceData);
    return docRef.id;
};

export const updateService = async (id: string, service: Partial<Service>): Promise<void> => {
    const serviceData: any = {};
    if (service.name) serviceData.name = service.name;
    if (service.slug) serviceData.slug = service.slug;
    if (service.icon_url !== undefined) serviceData.icon_url = service.icon_url;
    if (service.short_description !== undefined) serviceData.short_description = service.short_description;
    if (service.long_description !== undefined) serviceData.long_description = service.long_description;
    if (service.hero_image_url !== undefined) serviceData.hero_image_url = service.hero_image_url;
    if (service.is_featured !== undefined) serviceData.is_featured = service.is_featured;
    if (service.status) serviceData.status = service.status;
    if (service.sort_order !== undefined) serviceData.sort_order = service.sort_order;
    
    await updateDoc(doc(db, 'services', id), serviceData);
};

export const deleteService = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'services', id));
};

// ============ CATALOGS ============
export const fetchCatalogs = async (): Promise<Catalog[]> => {
    const snapshot = await getDocs(query(catalogsCollection, orderBy('year', 'desc')));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            title: data.title,
            year: data.year || new Date().getFullYear(),
            cover_image_url: data.cover_image_url,
            pdf_url: data.pdf_url,
            description: data.description,
            download_count: data.download_count || 0,
            is_latest: data.is_latest || false,
            status: data.status || 'active',
            categoryId: data.categoryId || undefined,
            categoryName: data.categoryName || undefined,
            created_at: timestampToString(data.created_at)
        } as Catalog;
    });
};

export const fetchCatalogById = async (id: string): Promise<Catalog | undefined> => {
    const docRef = doc(db, 'catalogs', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            id: docSnap.id,
            title: data.title,
            year: data.year || new Date().getFullYear(),
            cover_image_url: data.cover_image_url,
            pdf_url: data.pdf_url,
            description: data.description,
            download_count: data.download_count || 0,
            is_latest: data.is_latest || false,
            status: data.status || 'active',
            categoryId: data.categoryId || undefined,
            categoryName: data.categoryName || undefined,
            created_at: timestampToString(data.created_at)
        } as Catalog;
    }
    return undefined;
};

export const createCatalog = async (catalog: Partial<Catalog>): Promise<string> => {
    const catalogData = {
        title: catalog.title,
        year: catalog.year || new Date().getFullYear(),
        cover_image_url: catalog.cover_image_url || '',
        pdf_url: catalog.pdf_url,
        description: catalog.description || '',
        download_count: 0,
        is_latest: catalog.is_latest || false,
        status: catalog.status || 'active',
        categoryId: catalog.categoryId || null,
        categoryName: catalog.categoryName || null,
        created_at: serverTimestamp()
    };
    const docRef = await addDoc(catalogsCollection, catalogData);
    return docRef.id;
};

export const updateCatalog = async (id: string, catalog: Partial<Catalog>): Promise<void> => {
    const catalogData: any = {};
    if (catalog.title) catalogData.title = catalog.title;
    if (catalog.year !== undefined) catalogData.year = catalog.year;
    if (catalog.cover_image_url !== undefined) catalogData.cover_image_url = catalog.cover_image_url;
    if (catalog.pdf_url) catalogData.pdf_url = catalog.pdf_url;
    if (catalog.description !== undefined) catalogData.description = catalog.description;
    if (catalog.download_count !== undefined) catalogData.download_count = catalog.download_count;
    if (catalog.is_latest !== undefined) catalogData.is_latest = catalog.is_latest;
    if (catalog.status) catalogData.status = catalog.status;
    if (catalog.categoryId !== undefined) catalogData.categoryId = catalog.categoryId;
    if (catalog.categoryName !== undefined) catalogData.categoryName = catalog.categoryName;

    await updateDoc(doc(db, 'catalogs', id), catalogData);
};

// ============ CATALOG CATEGORIES ============
// Independent from Product Categories - used only on the Catalog page/admin.
export const fetchCatalogCategories = async (): Promise<CatalogCategory[]> => {
    const snapshot = await getDocs(query(catalogCategoriesCollection, orderBy('name')));
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            slug: data.slug || generateSlug(data.name),
            createdAt: timestampToString(data.createdAt),
            updatedAt: timestampToString(data.updatedAt)
        } as CatalogCategory;
    });
};

export const createCatalogCategory = async (name: string): Promise<CatalogCategory> => {
    const trimmedName = name.trim();
    if (!trimmedName) {
        throw new Error('Category name is required');
    }

    const existing = await getDocs(catalogCategoriesCollection);
    const isDuplicate = existing.docs.some(
        d => (d.data().name || '').toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
        throw new Error('A category with this name already exists');
    }

    const slug = generateSlug(trimmedName);
    const docRef = await addDoc(catalogCategoriesCollection, {
        name: trimmedName,
        slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });

    return { id: docRef.id, name: trimmedName, slug };
};

export const updateCatalogCategory = async (id: string, name: string): Promise<void> => {
    const trimmedName = name.trim();
    if (!trimmedName) {
        throw new Error('Category name is required');
    }

    const existing = await getDocs(catalogCategoriesCollection);
    const isDuplicate = existing.docs.some(
        d => d.id !== id && (d.data().name || '').toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
        throw new Error('A category with this name already exists');
    }

    await updateDoc(doc(db, 'catalogCategories', id), {
        name: trimmedName,
        slug: generateSlug(trimmedName),
        updatedAt: serverTimestamp()
    });
};

export const isCatalogCategoryInUse = async (categoryId: string): Promise<boolean> => {
    const q = query(catalogsCollection, where('categoryId', '==', categoryId));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
};

export const deleteCatalogCategory = async (id: string): Promise<void> => {
    const inUse = await isCatalogCategoryInUse(id);
    if (inUse) {
        throw new Error('This category is assigned to existing catalogs. Please move those catalogs before deleting it.');
    }
    await deleteDoc(doc(db, 'catalogCategories', id));
};

export const deleteCatalog = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'catalogs', id));
};

// ============ ENQUIRIES ============
export const fetchEnquiries = async (): Promise<Enquiry[]> => {
    try {
        // Try to fetch with ordering first
        const snapshot = await getDocs(query(enquiriesCollection, orderBy('created_at', 'desc')));
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                type: data.type || 'general',
                product_id: data.product_id,
                product_name: data.product_name,
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company,
                city: data.city,
                message: data.message,
                quantity: data.quantity,
                application: data.application,
                special_requirements: data.special_requirements,
                catalog_requested: data.catalog_requested || false,
                how_heard: data.how_heard,
                status: data.status || 'new',
                admin_notes: data.admin_notes,
                created_at: timestampToString(data.created_at)
            } as Enquiry;
        });
    } catch (error: any) {
        // If ordering fails (no index or no data), fetch without ordering
        console.warn('Fetching enquiries without ordering:', error.message);
        try {
            const snapshot = await getDocs(enquiriesCollection);
            const enquiries = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    type: data.type || 'general',
                    product_id: data.product_id,
                    product_name: data.product_name,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    company: data.company,
                    city: data.city,
                    message: data.message,
                    quantity: data.quantity,
                    application: data.application,
                    special_requirements: data.special_requirements,
                    catalog_requested: data.catalog_requested || false,
                    how_heard: data.how_heard,
                    status: data.status || 'new',
                    admin_notes: data.admin_notes,
                    created_at: timestampToString(data.created_at)
                } as Enquiry;
            });
            // Sort client-side by created_at if available
            return enquiries.sort((a, b) => {
                if (!a.created_at) return 1;
                if (!b.created_at) return -1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
        } catch (innerError: any) {
            console.error('Failed to fetch enquiries:', innerError);
            // Return empty array instead of throwing
            return [];
        }
    }
};

export const updateEnquiryStatus = async (id: string, status: Enquiry['status']): Promise<void> => {
    await updateDoc(doc(db, 'enquiries', id), { status });
};

export const submitEnquiry = async (enquiryData: Omit<Enquiry, 'id' | 'created_at' | 'status'>): Promise<string> => {
    const enquiry: Omit<Enquiry, 'id'> = {
        ...enquiryData,
        status: 'new',
        created_at: new Date().toISOString(),
    };
    
    const docRef = await addDoc(collection(db, 'enquiries'), enquiry);
    return docRef.id;
};

// ============================================
// TESTIMONIALS
// ============================================

export const fetchTestimonials = async (): Promise<Testimonial[]> => {
    const q = query(collection(db, 'testimonials'), orderBy('sort_order', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        created_at: timestampToString(doc.data().created_at)
    } as unknown as Testimonial));
};

export const fetchTestimonialById = async (id: string): Promise<Testimonial | undefined> => {
    const docRef = doc(db, 'testimonials', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return {
            id: docSnap.id,
            ...docSnap.data(),
            created_at: timestampToString(docSnap.data().created_at)
        } as unknown as Testimonial;
    }
    return undefined;
};

export const createTestimonial = async (testimonial: Partial<Testimonial>): Promise<string> => {
    const docRef = await addDoc(collection(db, 'testimonials'), {
        ...testimonial,
        created_at: serverTimestamp()
    });
    return docRef.id;
};

export const updateTestimonial = async (id: string, testimonial: Partial<Testimonial>): Promise<void> => {
    await updateDoc(doc(db, 'testimonials', id), testimonial);
};

export const deleteTestimonial = async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'testimonials', id));
};

// Export types for backward compatibility
export type {
    Category,
    Subcategory,
    Product,
    ProductImage,
    Project,
    ProjectImage,
    Service,
    Catalog,
    CatalogCategory,
    Enquiry,
    Testimonial
};

// Legacy exports for backward compatibility
export type ContactSubmission = Enquiry;
export const fetchContactSubmissions = fetchEnquiries;
export const updateContactStatus = updateEnquiryStatus;


// ============ SETTINGS ============
export const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
    try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'site'));
        if (settingsDoc.exists()) {
            const data = settingsDoc.data();
            return {
                site_name: data.site_name || 'Tej Lite',
                site_logo: data.site_logo || '',
                footer_logo: data.footer_logo || '',
                contact_email: data.contact_email || '',
                phone_numbers: data.phone_numbers || [],
                address: data.address || '',
                whatsapp_number: data.whatsapp_number || '',
                social_media: {
                    instagram: data.social_media?.instagram || '',
                    facebook: data.social_media?.facebook || '',
                    pinterest: data.social_media?.pinterest || '',
                    linkedin: data.social_media?.linkedin || '',
                    youtube: data.social_media?.youtube || ''
                }
            } as SiteSettings;
        }
        return null;
    } catch (error) {
        console.error('Error fetching site settings:', error);
        return null;
    }
};
