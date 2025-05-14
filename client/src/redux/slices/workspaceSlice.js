import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// DUMMY DATA FOR DEVELOPMENT/TESTING
const USE_DUMMY_DATA = true; // flase for testing with API

// Mock data for development/testing
const DUMMY_DATA = {
  retailers: [
    { id: "ret1", name: "Walmart", logo: "https://placeholder.com/150" },
    { id: "ret2", name: "Target", logo: "https://placeholder.com/150" },
    { id: "ret3", name: "Amazon", logo: "https://placeholder.com/150" },
    { id: "ret4", name: "Best Buy", logo: "https://placeholder.com/150" },
    { id: "ret5", name: "Costco", logo: "https://placeholder.com/150" }
  ],
  categories: [
    // Walmart Categories
    { id: "cat1", name: "Electronics", retailerId: "ret1" },
    { id: "cat2", name: "Grocery", retailerId: "ret1" },
    { id: "cat3", name: "Apparel", retailerId: "ret1" },
    { id: "cat4", name: "Home & Garden", retailerId: "ret1" },
    
    // Target Categories
    { id: "cat5", name: "Electronics", retailerId: "ret2" },
    { id: "cat6", name: "Home Decor", retailerId: "ret2" },
    { id: "cat7", name: "Beauty", retailerId: "ret2" },
    { id: "cat8", name: "Kids", retailerId: "ret2" },
    
    // Amazon Categories
    { id: "cat9", name: "Books", retailerId: "ret3" },
    { id: "cat10", name: "Electronics", retailerId: "ret3" },
    { id: "cat11", name: "Home & Kitchen", retailerId: "ret3" },
    { id: "cat12", name: "Fashion", retailerId: "ret3" },
    
    // Best Buy Categories
    { id: "cat13", name: "Computers", retailerId: "ret4" },
    { id: "cat14", name: "TV & Home Theater", retailerId: "ret4" },
    { id: "cat15", name: "Cell Phones", retailerId: "ret4" },
    { id: "cat16", name: "Audio", retailerId: "ret4" },
    
    // Costco Categories
    { id: "cat17", name: "Appliances", retailerId: "ret5" },
    { id: "cat18", name: "Grocery & Food", retailerId: "ret5" },
    { id: "cat19", name: "Electronics", retailerId: "ret5" },
    { id: "cat20", name: "Home Improvement", retailerId: "ret5" }
  ],
  brands: [
    // Walmart Electronics Brands
    { id: "b1", name: "Samsung", categoryId: "cat1" },
    { id: "b2", name: "Apple", categoryId: "cat1" },
    { id: "b3", name: "Sony", categoryId: "cat1" },
    { id: "b4", name: "LG", categoryId: "cat1" },
    
    // Walmart Grocery Brands
    { id: "b5", name: "Great Value", categoryId: "cat2" },
    { id: "b6", name: "Kraft", categoryId: "cat2" },
    { id: "b7", name: "Nestlé", categoryId: "cat2" },
    { id: "b8", name: "General Mills", categoryId: "cat2" },
    
    // Walmart Apparel Brands
    { id: "b9", name: "George", categoryId: "cat3" },
    { id: "b10", name: "Hanes", categoryId: "cat3" },
    { id: "b11", name: "Levi's", categoryId: "cat3" },
    { id: "b12", name: "Nike", categoryId: "cat3" },
    
    // More brands for various categories...
    // Target Electronics Brands
    { id: "b17", name: "Apple", categoryId: "cat5" },
    { id: "b18", name: "Beats", categoryId: "cat5" },
    { id: "b19", name: "JBL", categoryId: "cat5" },
    { id: "b20", name: "Samsung", categoryId: "cat5" },
    
    // Amazon Books Brands
    { id: "b25", name: "Penguin Random House", categoryId: "cat9" },
    { id: "b26", name: "HarperCollins", categoryId: "cat9" },
    { id: "b27", name: "Simon & Schuster", categoryId: "cat9" },
    
    // Best Buy Computers Brands
    { id: "b28", name: "HP", categoryId: "cat13" },
    { id: "b29", name: "Dell", categoryId: "cat13" },
    { id: "b30", name: "Lenovo", categoryId: "cat13" },
    { id: "b31", name: "ASUS", categoryId: "cat13" }
  ],
  existingWorkspaces: ["Marketing Analysis", "Product Research", "Q1 Planning"]
};

// Helper function to simulate API delay
const simulateApiDelay = (data, delay = 500) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

// API endpoints (replace these with your actual API endpoints)
const API_ENDPOINTS = {
  RETAILERS: '/api/retailers',
  CATEGORIES: '/api/categories',
  BRANDS: '/api/brands',
  CREATE_WORKSPACE: '/api/workspaces',
};

// Async thunks for API calls
export const fetchRetailers = createAsyncThunk(
  'workspace/fetchRetailers',
  async (_, { rejectWithValue }) => {
    try {
      // Return dummy data if flag is enabled
      if (USE_DUMMY_DATA) {
        return await simulateApiDelay(DUMMY_DATA.retailers);
      }
      
      // Otherwise make the actual API call
      const response = await axios.get(API_ENDPOINTS.RETAILERS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch retailers');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'workspace/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      // Return dummy data if flag is enabled
      if (USE_DUMMY_DATA) {
        return await simulateApiDelay(DUMMY_DATA.categories, 700);
      }
      
      const response = await axios.get(API_ENDPOINTS.CATEGORIES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const fetchBrands = createAsyncThunk(
  'workspace/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      // Return dummy data if flag is enabled
      if (USE_DUMMY_DATA) {
        return await simulateApiDelay(DUMMY_DATA.brands, 600);
      }
      
      const response = await axios.get(API_ENDPOINTS.BRANDS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch brands');
    }
  }
);

export const createWorkspace = createAsyncThunk(
  'workspace/createWorkspace',
  async (workspaceData, { rejectWithValue }) => {
    try {
      // Simulate workspace creation with dummy data
      if (USE_DUMMY_DATA) {
        // Validate workspace name
        if (DUMMY_DATA.existingWorkspaces.includes(workspaceData.name)) {
          throw new Error('A workspace with this name already exists.');
        }
        
        // Simulate API success response
        return await simulateApiDelay({
          id: 'ws-' + Date.now(),
          name: workspaceData.name,
          createdAt: new Date().toISOString(),
          ...workspaceData
        }, 1000);
      }
      
      const response = await axios.post(API_ENDPOINTS.CREATE_WORKSPACE, workspaceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || 'Failed to create workspace' }
      );
    }
  }
);

// Initial state
const initialState = {
  // Data from API
  retailers: [],
  allCategories: [], // Categories from all retailers
  allBrands: [], // Brands from all categories
  
  // Loading states
  isLoadingRetailers: false,
  isLoadingCategories: false,
  isLoadingBrands: false,
  isCreatingWorkspace: false,
  
  // Error states
  retailersError: null,
  categoriesError: null,
  brandsError: null,
  createWorkspaceError: null,
  
  // Form state
  step: 1,
  workspaceName: '',
  workspaceNameError: '',
  
  // Selections
  selectedRetailers: [],
  selectedCategories: {}, // Object with retailerId as key and array of categoryIds as value
  selectedBrands: {}, // Object with categoryId as key and array of brands as value
  
  // Active selections for UI
  activeRetailer: null,
  activeCategory: null,
  activeBrandCategory: null,
  
  // UI states
  expandedRetailers: {},
  expandedCategories: {},
  retailerSearch: '',
  categorySearches: {},
  brandSearches: {},
};

// Create slice
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    // Step navigation
    nextStep: (state) => {
      state.step += 1;
    },
    prevStep: (state) => {
      state.step -= 1;
    },
    
    // Form field updates
    setWorkspaceName: (state, action) => {
      state.workspaceName = action.payload;
      
      // Validate workspace name
      if (!action.payload.trim()) {
        state.workspaceNameError = "Workspace name cannot be empty.";
      } else if (USE_DUMMY_DATA && DUMMY_DATA.existingWorkspaces.some(
        ws => ws.toLowerCase() === action.payload.trim().toLowerCase()
      )) {
        state.workspaceNameError = "A workspace with this name already exists. Please choose a different name.";
      } else if (state.existingWorkspaces && state.existingWorkspaces.some(
        ws => ws.toLowerCase() === action.payload.trim().toLowerCase()
      )) {
        state.workspaceNameError = "A workspace with this name already exists. Please choose a different name.";
      } else {
        state.workspaceNameError = "";
      }
    },
    
    // Selection handlers
    toggleRetailerSelection: (state, action) => {
      const retailerId = action.payload;
      const isSelected = state.selectedRetailers.includes(retailerId);
      
      if (!isSelected) {
        state.selectedRetailers.push(retailerId);
        if (!state.activeRetailer) {
          state.activeRetailer = retailerId;
        }
      } else {
        state.selectedRetailers = state.selectedRetailers.filter(id => id !== retailerId);
        delete state.selectedCategories[retailerId];
        
        // Clean up any brands that were from categories of this retailer
        const retailerCategories = state.allCategories.filter(c => c.retailerId === retailerId);
        retailerCategories.forEach(category => {
          delete state.selectedBrands[category.id];
        });
        
        // Update active retailer if needed
        if (state.activeRetailer === retailerId) {
          state.activeRetailer = state.selectedRetailers.length > 0 ? state.selectedRetailers[0] : null;
        }
      }
    },
    
    toggleCategorySelection: (state, action) => {
      const { retailerId, categoryId } = action.payload;
      
      if (!state.selectedCategories[retailerId]) {
        state.selectedCategories[retailerId] = [];
      }
      
      const categoryIndex = state.selectedCategories[retailerId].indexOf(categoryId);
      
      if (categoryIndex === -1) {
        state.selectedCategories[retailerId].push(categoryId);
        
        // Set as active category if we don't have one
        if (!state.activeCategory) {
          state.activeCategory = categoryId;
        }
        
        // Set as active brand category if we don't have one
        if (!state.activeBrandCategory) {
          state.activeBrandCategory = categoryId;
        }
      } else {
        state.selectedCategories[retailerId].splice(categoryIndex, 1);
        delete state.selectedBrands[categoryId];
        
        // Update active category if needed
        if (state.activeCategory === categoryId) {
          // Find the first selected category from any retailer
          const allSelectedCategories = Object.values(state.selectedCategories).flat();
          state.activeCategory = allSelectedCategories.length > 0 ? allSelectedCategories[0] : null;
        }
        
        // Update active brand category if needed
        if (state.activeBrandCategory === categoryId) {
          const allSelectedCategories = Object.values(state.selectedCategories).flat();
          state.activeBrandCategory = allSelectedCategories.length > 0 ? allSelectedCategories[0] : null;
        }
      }
    },
    
    toggleBrandSelection: (state, action) => {
      const { categoryId, brand } = action.payload;
      
      if (!state.selectedBrands[categoryId]) {
        state.selectedBrands[categoryId] = [];
      }
      
      const brandIndex = state.selectedBrands[categoryId].indexOf(brand);
      
      if (brandIndex === -1) {
        state.selectedBrands[categoryId].push(brand);
      } else {
        state.selectedBrands[categoryId].splice(brandIndex, 1);
      }
    },
    
    // Active selections
    setActiveRetailer: (state, action) => {
      state.activeRetailer = action.payload;
    },
    
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    
    setActiveBrandCategory: (state, action) => {
      state.activeBrandCategory = action.payload;
    },
    
    // UI state handlers
    toggleRetailerDropdown: (state, action) => {
      const retailerId = action.payload;
      state.expandedRetailers[retailerId] = !state.expandedRetailers[retailerId];
    },
    
    toggleCategoryDropdown: (state, action) => {
      const categoryId = action.payload;
      state.expandedCategories[categoryId] = !state.expandedCategories[categoryId];
    },
    
    setRetailerSearch: (state, action) => {
      state.retailerSearch = action.payload;
    },
    
    setCategorySearch: (state, action) => {
      const { retailerId, searchTerm } = action.payload;
      state.categorySearches[retailerId] = searchTerm;
    },
    
    setBrandSearch: (state, action) => {
      const { categoryId, searchTerm } = action.payload;
      state.brandSearches[categoryId] = searchTerm;
    },
    
    resetWorkspaceForm: (state) => {
      return {
        ...initialState,
        retailers: state.retailers,
        allCategories: state.allCategories,
        allBrands: state.allBrands,
        existingWorkspaces: state.existingWorkspaces,
      };
    },
  },
  extraReducers: (builder) => {
    // Handle retailers fetch
    builder
      .addCase(fetchRetailers.pending, (state) => {
        state.isLoadingRetailers = true;
        state.retailersError = null;
      })
      .addCase(fetchRetailers.fulfilled, (state, action) => {
        state.isLoadingRetailers = false;
        state.retailers = action.payload;
      })
      .addCase(fetchRetailers.rejected, (state, action) => {
        state.isLoadingRetailers = false;
        state.retailersError = action.payload || 'Failed to fetch retailers';
      })
      
      // Handle categories fetch
      .addCase(fetchCategories.pending, (state) => {
        state.isLoadingCategories = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.allCategories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoadingCategories = false;
        state.categoriesError = action.payload || 'Failed to fetch categories';
      })
      
      // Handle brands fetch
      .addCase(fetchBrands.pending, (state) => {
        state.isLoadingBrands = true;
        state.brandsError = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.isLoadingBrands = false;
        state.allBrands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.isLoadingBrands = false;
        state.brandsError = action.payload || 'Failed to fetch brands';
      })
      
      // Handle workspace creation
      .addCase(createWorkspace.pending, (state) => {
        state.isCreatingWorkspace = true;
        state.createWorkspaceError = null;
      })
      .addCase(createWorkspace.fulfilled, (state) => {
        state.isCreatingWorkspace = false;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.isCreatingWorkspace = false;
        state.createWorkspaceError = action.payload || 'Failed to create workspace';
      });
  },
});

// Export actions
export const {
  nextStep,
  prevStep,
  setWorkspaceName,
  toggleRetailerSelection,
  toggleCategorySelection,
  toggleBrandSelection,
  setActiveRetailer,
  setActiveCategory,
  setActiveBrandCategory,
  toggleRetailerDropdown,
  toggleCategoryDropdown,
  setRetailerSearch,
  setCategorySearch,
  setBrandSearch,
  resetWorkspaceForm,
} = workspaceSlice.actions;

// Selectors
export const selectRetailers = (state) => state.workspace.retailers;
export const selectIsLoadingRetailers = (state) => state.workspace.isLoadingRetailers;
export const selectRetailersError = (state) => state.workspace.retailersError;

export const selectAllCategories = (state) => state.workspace.allCategories;
export const selectIsLoadingCategories = (state) => state.workspace.isLoadingCategories;
export const selectCategoriesError = (state) => state.workspace.categoriesError;

export const selectAllBrands = (state) => state.workspace.allBrands;
export const selectIsLoadingBrands = (state) => state.workspace.isLoadingBrands;
export const selectBrandsError = (state) => state.workspace.brandsError;

export const selectStep = (state) => state.workspace.step;
export const selectWorkspaceName = (state) => state.workspace.workspaceName;
export const selectWorkspaceNameError = (state) => state.workspace.workspaceNameError;

export const selectSelectedRetailers = (state) => state.workspace.selectedRetailers;
export const selectSelectedCategories = (state) => state.workspace.selectedCategories;
export const selectSelectedBrands = (state) => state.workspace.selectedBrands;

export const selectActiveRetailer = (state) => state.workspace.activeRetailer;
export const selectActiveCategory = (state) => state.workspace.activeCategory;
export const selectActiveBrandCategory = (state) => state.workspace.activeBrandCategory;

export const selectExpandedRetailers = (state) => state.workspace.expandedRetailers;
export const selectExpandedCategories = (state) => state.workspace.expandedCategories;
export const selectRetailerSearch = (state) => state.workspace.retailerSearch;
export const selectCategorySearches = (state) => state.workspace.categorySearches;
export const selectBrandSearches = (state) => state.workspace.brandSearches;

export const selectIsCreatingWorkspace = (state) => state.workspace.isCreatingWorkspace;
export const selectCreateWorkspaceError = (state) => state.workspace.createWorkspaceError;

// Complex selectors
export const selectCategoriesByRetailer = (state, retailerId) => {
  return state.workspace.allCategories.filter(category => category.retailerId === retailerId);
};

export const selectBrandsByCategory = (state, categoryId) => {
  return state.workspace.allBrands.filter(brand => brand.categoryId === categoryId);
};

export const selectAllSelectedCategoriesFlat = (state) => {
  const { selectedCategories } = state.workspace;
  const flatCategories = [];
  
  Object.values(selectedCategories).forEach(categoryIds => {
    categoryIds.forEach(id => {
      if (!flatCategories.includes(id)) {
        flatCategories.push(id);
      }
    });
  });
  
  return flatCategories;
};

export const selectSelectedCategoryIds = (state) => {
  const allSelected = [];
  Object.values(state.workspace.selectedCategories).forEach(arr => {
    allSelected.push(...arr);
  });
  return allSelected;
};

export const selectIsNextDisabled = (state) => {
  const { step, selectedRetailers, workspaceName, workspaceNameError, selectedCategories } = state.workspace;
  
  if (step === 1) {
    return selectedRetailers.length === 0 || !workspaceName || workspaceNameError !== "";
  }
  
  if (step === 2) {
    return (
      Object.keys(selectedCategories).length === 0 ||
      selectedRetailers.some(
        retailerId => !selectedCategories[retailerId] || selectedCategories[retailerId].length === 0
      )
    );
  }
  
  return false;
};

export const selectIsSubmitDisabled = (state) => {
  const { workspaceName, workspaceNameError, selectedCategories, selectedBrands } = state.workspace;
  
  const selectedCategoriesFlat = [];
  Object.values(selectedCategories).forEach(categoryIds => {
    categoryIds.forEach(id => {
      if (!selectedCategoriesFlat.includes(id)) {
        selectedCategoriesFlat.push(id);
      }
    });
  });
  
  return (
    !workspaceName ||
    workspaceNameError !== "" ||
    selectedCategoriesFlat.some(
      categoryId => !selectedBrands[categoryId] || selectedBrands[categoryId].length === 0
    )
  );
};

export default workspaceSlice.reducer;