import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching workspaces
export const fetchWorkspaces = createAsyncThunk(
  'workspaceView/fetchWorkspaces',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/workspaces');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch workspaces');
    }
  }
);

// Async thunk for creating a new workspace
export const createWorkspace = createAsyncThunk(
  'workspaceView/createWorkspace',
  async (workspaceData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/workspaces', workspaceData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create workspace');
    }
  }
);

// Async thunk for archiving a workspace
export const archiveWorkspace = createAsyncThunk(
  'workspaceView/archiveWorkspace',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/workspaces/${workspaceId}/archive`, { archived: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to archive workspace');
    }
  }
);

// Async thunk for restoring a workspace from archive
export const restoreWorkspace = createAsyncThunk(
  'workspaceView/restoreWorkspace',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/workspaces/${workspaceId}/archive`, { archived: false });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to restore workspace');
    }
  }
);

const initialState = {
  workspaces: [],
  filteredWorkspaces: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  
  // Filters
  searchQuery: '',
  sortBy: 'name',
  retailerFilter: 'all',
  categoryFilter: 'all',
  brandFilter: 'all',
  showArchived: false,
  
  // View settings
  viewMode: 'grid', // 'grid' | 'list'
  isFiltersOpen: false,
  
  // Pagination
  currentPage: 1,
  itemsPerPage: 6,
};

const workspaceViewSlice = createSlice({
  name: 'workspaceView',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    setRetailerFilter: (state, action) => {
      state.retailerFilter = action.payload;
      // When retailer changes, reset category and brand filters
      state.categoryFilter = 'all';
      state.brandFilter = 'all';
      state.currentPage = 1; // Reset to first page on filter change
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
      // When category changes, reset brand filter
      state.brandFilter = 'all';
      state.currentPage = 1; // Reset to first page on filter change
    },
    setBrandFilter: (state, action) => {
      state.brandFilter = action.payload;
      state.currentPage = 1; // Reset to first page on filter change
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    toggleFilters: (state) => {
      state.isFiltersOpen = !state.isFiltersOpen;
    },
    toggleShowArchived: (state) => {
      state.showArchived = !state.showArchived;
      state.currentPage = 1; // Reset to first page on filter change
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when items per page changes
    },
    // Local updates for optimistic UI
    updateWorkspace: (state, action) => {
      const { id, ...changes } = action.payload;
      const index = state.workspaces.findIndex(workspace => workspace.id === id);
      if (index !== -1) {
        state.workspaces[index] = { ...state.workspaces[index], ...changes };
      }
    },
    // Apply filters and sorting manually
    applyFiltersAndSort: (state) => {
      let result = [...state.workspaces];

      // Apply archive filter
      if (!state.showArchived) {
        result = result.filter(workspace => !workspace.archived);
      }

      // Apply search filter
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        result = result.filter(workspace => {
          // Check workspace name
          if (workspace.name.toLowerCase().includes(query)) return true;
          
          // Check retailers
          if (workspace.retailers.some(retailer => retailer.toLowerCase().includes(query))) return true;
          
          // Check categories and brands
          for (const [categoryKey, brands] of Object.entries(workspace.brands)) {
            if (categoryKey.toLowerCase().includes(query)) return true;
            if (brands && brands.some(brand => brand.toLowerCase().includes(query))) return true;
          }
          
          return false;
        });
      }

      // Apply retailer filter
      if (state.retailerFilter !== 'all') {
        result = result.filter(workspace => 
          workspace.retailers.includes(state.retailerFilter)
        );
      }

      // Apply category filter
      if (state.categoryFilter !== 'all') {
        result = result.filter(workspace => {
          // Check if the category exists for any retailer
          for (const retailer in workspace.categories) {
            if (workspace.categories[retailer].includes(state.categoryFilter)) {
              return true;
            }
          }
          return false;
        });
      }

      // Apply brand filter
      if (state.brandFilter !== 'all') {
        result = result.filter(workspace => {
          // Check if the brand exists in any category
          for (const category in workspace.brands) {
            if (workspace.brands[category].includes(state.brandFilter)) {
              return true;
            }
          }
          return false;
        });
      }

      // Apply sorting
      result.sort((a, b) => {
        if (state.sortBy === 'name') {
          // Handle case where name might be undefined
          if (!a.name) return 1;  // undefined values go last
          if (!b.name) return -1;
          return a.name.localeCompare(b.name);
        } else if (state.sortBy === 'date') {
          // Handle case where modified date might be undefined
          const dateA = a.modified ? new Date(a.modified).getTime() : 0;
          const dateB = b.modified ? new Date(b.modified).getTime() : 0;
          return dateB - dateA;  // Newest first
        } else if (state.sortBy === 'retailer') {
          // Handle case where retailers array might be empty or undefined
          const retailerA = a.retailers && a.retailers.length > 0 ? a.retailers[0] : '';
          const retailerB = b.retailers && b.retailers.length > 0 ? b.retailers[0] : '';
          return retailerA.localeCompare(retailerB);
        }
        return 0;
      });

      state.filteredWorkspaces = result;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchWorkspaces
      .addCase(fetchWorkspaces.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.workspaces = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch workspaces';
      })
      
      // Handle createWorkspace
      .addCase(createWorkspace.pending, (state) => {
        // Set specific loading state if needed
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.workspaces.push(action.payload);
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.error = action.payload || 'Failed to create workspace';
      })
      
      // Handle archiveWorkspace
      .addCase(archiveWorkspace.pending, (state) => {
        // We can set a specific loading state here if needed
      })
      .addCase(archiveWorkspace.fulfilled, (state, action) => {
        const updatedWorkspace = action.payload;
        const index = state.workspaces.findIndex(w => w.id === updatedWorkspace.id);
        if (index !== -1) {
          state.workspaces[index] = updatedWorkspace;
        }
      })
      .addCase(archiveWorkspace.rejected, (state, action) => {
        state.error = action.payload || 'Failed to archive workspace';
      })
      
      // Handle restoreWorkspace
      .addCase(restoreWorkspace.pending, (state) => {
        // We can set a specific loading state here if needed
      })
      .addCase(restoreWorkspace.fulfilled, (state, action) => {
        const updatedWorkspace = action.payload;
        const index = state.workspaces.findIndex(w => w.id === updatedWorkspace.id);
        if (index !== -1) {
          state.workspaces[index] = updatedWorkspace;
        }
      })
      .addCase(restoreWorkspace.rejected, (state, action) => {
        state.error = action.payload || 'Failed to restore workspace';
      });
  }
});

// Export actions
export const {
  setSearchQuery,
  setSortBy,
  setRetailerFilter,
  setCategoryFilter,
  setBrandFilter,
  setViewMode,
  toggleFilters,
  toggleShowArchived,
  setCurrentPage,
  setItemsPerPage,
  updateWorkspace,
  applyFiltersAndSort
} = workspaceViewSlice.actions;

// Export selectors
export const selectAllWorkspaces = state => state.workspaceView.workspaces;
export const selectFilteredWorkspaces = state => state.workspaceView.filteredWorkspaces;
export const selectWorkspaceViewStatus = state => state.workspaceView.status;
export const selectWorkspaceViewError = state => state.workspaceView.error;
export const selectSearchQuery = state => state.workspaceView.searchQuery;
export const selectSortBy = state => state.workspaceView.sortBy;
export const selectRetailerFilter = state => state.workspaceView.retailerFilter;
export const selectCategoryFilter = state => state.workspaceView.categoryFilter;
export const selectBrandFilter = state => state.workspaceView.brandFilter;
export const selectViewMode = state => state.workspaceView.viewMode;
export const selectIsFiltersOpen = state => state.workspaceView.isFiltersOpen;
export const selectShowArchived = state => state.workspaceView.showArchived;
export const selectCurrentPage = state => state.workspaceView.currentPage;
export const selectItemsPerPage = state => state.workspaceView.itemsPerPage;

// Create a selector for paginated workspaces
export const selectPaginatedWorkspaces = state => {
  const { filteredWorkspaces, currentPage, itemsPerPage } = state.workspaceView;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  return filteredWorkspaces.slice(startIdx, endIdx);
};

// Create a selector for total pages
export const selectTotalPages = state => {
  const { filteredWorkspaces, itemsPerPage } = state.workspaceView;
  return Math.ceil(filteredWorkspaces.length / itemsPerPage);
};

// Create selectors for filter options based on available data

// Get all unique retailers from workspaces
export const selectRetailers = state => {
  const retailers = ["all", ...new Set(
    state.workspaceView.workspaces.flatMap(w => w.retailers)
  )];
  
  return retailers.map(retailer => ({
    text: retailer === "all" ? "All Retailers" : retailer,
    value: retailer,
  }));
};

// Get categories for the selected retailer
export const selectCategories = state => {
  const { workspaces, retailerFilter } = state.workspaceView;
  
  // Initialize with "all" category
  let categories = ["all"];
  
  // Check if workspaces is an array before attempting to iterate
  if (Array.isArray(workspaces) && workspaces.length > 0) {
    if (retailerFilter === 'all') {
      // Collect all categories from all retailers
      workspaces.forEach(workspace => {
        // Make sure workspace.categories exists before accessing it
        if (workspace.categories) {
          for (const retailer in workspace.categories) {
            // Check if this property has an array value
            if (Array.isArray(workspace.categories[retailer])) {
              categories = [...categories, ...workspace.categories[retailer]];
            }
          }
        }
      });
    } else {
      // Only collect categories for the selected retailer
      workspaces.forEach(workspace => {
        // Make sure workspace.categories and the retailer property exist
        if (workspace.categories && 
            workspace.categories[retailerFilter] && 
            Array.isArray(workspace.categories[retailerFilter])) {
          categories = [...categories, ...workspace.categories[retailerFilter]];
        }
      });
    }
  }
  
  // Remove duplicates
  categories = [...new Set(categories)];
  
  return categories.map(category => ({
    text: category === "all" ? "All Categories" : category,
    value: category,
  }));
};

// Get brands for the selected category
export const selectBrands = state => {
  const { workspaces, categoryFilter } = state.workspaceView;
  
  let brands = ["all"];
  
  if (categoryFilter === 'all') {
    // Collect all brands from all categories
    workspaces.forEach(workspace => {
      for (const category in workspace.brands) {
        brands = [...brands, ...workspace.brands[category]];
      }
    });
  } else {
    // Only collect brands for the selected category
    workspaces.forEach(workspace => {
      if (workspace.brands[categoryFilter]) {
        brands = [...brands, ...workspace.brands[categoryFilter]];
      }
    });
  }
  
  // Remove duplicates
  brands = [...new Set(brands)];
  
  return brands.map(brand => ({
    text: brand === "all" ? "All Brands" : brand,
    value: brand,
  }));
};

export default workspaceViewSlice.reducer;