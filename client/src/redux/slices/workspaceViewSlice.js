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

// Async thunk for archiving a workspace
export const archiveWorkspace = createAsyncThunk(
  'workspaceView/archiveWorkspace',
  async (workspaceId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/workspaces/${workspaceId}/archive`, { archived: true });
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
      const response = await axios.patch(`/api/workspaces/${workspaceId}/archive`, { archived: false });
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
  category: 'all',
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
    setCategory: (state, action) => {
      state.category = action.payload;
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
        result = result.filter(workspace => 
          workspace.title.toLowerCase().includes(query) ||
          workspace.brands.some(brand => brand.toLowerCase().includes(query)) ||
          workspace.retailer.toLowerCase().includes(query)
        );
      }

      // Apply category filter
      if (state.category !== 'all') {
        result = result.filter(workspace => 
          workspace.category.toLowerCase() === state.category.toLowerCase()
        );
      }

      // Apply sorting
      result.sort((a, b) => {
        if (state.sortBy === 'name') {
          return a.title.localeCompare(b.title);
        } else if (state.sortBy === 'date') {
          return new Date(b.modified).getTime() - new Date(a.modified).getTime();
        } else if (state.sortBy === 'category') {
          return a.category.localeCompare(b.category);
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
  setCategory,
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
export const selectCategory = state => state.workspaceView.category;
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

// Create a selector for unique categories from workspaces
export const selectCategories = state => {
  const categories = ["all", ...Array.from(new Set(
    state.workspaceView.workspaces.map(w => w.category.toLowerCase())
  ))];
  
  return categories.map(cat => ({
    text: cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1),
    value: cat,
  }));
};

export default workspaceViewSlice.reducer;