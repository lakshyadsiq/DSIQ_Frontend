import { useEffect } from "react"
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle, CardActions } from "@progress/kendo-react-layout"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiShoppingCart,
  FiGrid,
  FiTag,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiAlertCircle,
} from "react-icons/fi"
import clsx from "clsx"

// Import Redux actions and selectors
import {
  fetchRetailers,
  fetchCategoriesByRetailers,
  fetchBrandsByCategories,
  createWorkspace,
  nextStep as nextStepAction,
  prevStep as prevStepAction,
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
  selectRetailers,
  selectAllCategories,
  selectAllBrands,
  selectStep,
  selectWorkspaceName,
  selectWorkspaceNameError,
  selectSelectedRetailers,
  selectSelectedCategories,
  selectSelectedBrands,
  selectActiveRetailer,
  selectActiveCategory,
  selectActiveBrandCategory,
  selectExpandedRetailers,
  selectExpandedCategories,
  selectRetailerSearch,
  selectCategorySearches,
  selectBrandSearches,
  selectIsNextDisabled,
  selectIsSubmitDisabled,
  selectIsCreatingWorkspace,
  selectCreateWorkspaceError,
  selectCategoriesByRetailer,
  selectAllSelectedCategoriesFlat,
  selectIsFetchingCategories,
  selectIsFetchingBrands,
} from "../redux/slices/workspaceSlice"
import { debounce } from 'lodash';

export default function WorkspaceCreation({ }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Redux state selectors
  const retailers = useSelector(selectRetailers) || []
  const allCategories = useSelector(selectAllCategories) || []
  const allBrands = useSelector(selectAllBrands) || []
  const step = useSelector(selectStep)
  const workspaceName = useSelector(selectWorkspaceName)
  const workspaceNameError = useSelector(selectWorkspaceNameError)
  const selectedRetailers = useSelector(selectSelectedRetailers) || []
  const selectedCategories = useSelector(selectSelectedCategories) || {}
  const selectedBrands = useSelector(selectSelectedBrands) || {}
  const activeRetailer = useSelector(selectActiveRetailer)
  const activeCategory = useSelector(selectActiveCategory)
  const activeBrandCategory = useSelector(selectActiveBrandCategory)
  const expandedRetailers = useSelector(selectExpandedRetailers) || {}
  const expandedCategories = useSelector(selectExpandedCategories) || {}
  const retailerSearch = useSelector(selectRetailerSearch) || ""
  const categorySearches = useSelector(selectCategorySearches) || {}
  const brandSearches = useSelector(selectBrandSearches) || {}
  const isNextDisabled = useSelector(selectIsNextDisabled)
  const isSubmitDisabled = useSelector(selectIsSubmitDisabled)
  const isCreatingWorkspace = useSelector(selectIsCreatingWorkspace)
  const createWorkspaceError = useSelector(selectCreateWorkspaceError)
  const selectedCategoriesFlat = useSelector(selectAllSelectedCategoriesFlat) || []
  const isFetchingCategories = useSelector(selectIsFetchingCategories) || false
  const isFetchingBrands = useSelector(selectIsFetchingBrands) || false

  const debouncedCheckName = debounce(async (name, dispatch) => {
    if (name.trim()) {
      await dispatch(checkWorkspaceName(name));
    }
  }, 500);

  useEffect(() => {
    if (workspaceName) {
      debouncedCheckName(workspaceName, dispatch);
    }
  }, [workspaceName]);

  // Fetch retailers on component mount
  useEffect(() => {
    dispatch(fetchRetailers())
  }, [dispatch])

  // Fetch categories when retailers are selected and moving to step 2
  useEffect(() => {
    if (step === 2 && selectedRetailers.length > 0) {
      dispatch(fetchCategoriesByRetailers(selectedRetailers))
    }
  }, [step, selectedRetailers, dispatch])

  // Fixed: Fetch brands when categories are selected and moving to step 3
  useEffect(() => {
    if (step === 3) {
      // Calculate flat categories array directly
      const flatCategories = []
      Object.values(selectedCategories).forEach(categoryIds => {
        categoryIds.forEach(id => {
          if (!flatCategories.includes(id)) {
            flatCategories.push(id)
          }
        })
      })

      console.log('Step 3 - Selected categories flat:', flatCategories) // Debug log

      if (flatCategories.length > 0) {
        dispatch(fetchBrandsByCategories(flatCategories))

        // Set the first available category as active brand category if none is set
        if (!activeBrandCategory && flatCategories.length > 0) {
          dispatch(setActiveBrandCategory(flatCategories[0]))
        }
      }
    }
  }, [step, selectedCategories, dispatch, activeBrandCategory])

  // Helper function to check if retailer has incomplete categories (for step 2)
  const hasIncompleteCategories = (retailerId) => {
    if (step === 2) {
      return selectedRetailers.includes(retailerId) &&
        (!selectedCategories[retailerId] || selectedCategories[retailerId].length === 0)
    }
    return false
  }

  // Helper function to check if category has incomplete brands (for step 3)
  const hasIncompleteBrands = (categoryId) => {
    if (step === 3) {
      return selectedCategoriesFlat.includes(categoryId) &&
        (!selectedBrands[categoryId] || selectedBrands[categoryId].length === 0)
    }
    return false
  }

  // Next/Prev steps
  const handleNextStep = () => {
    dispatch(nextStepAction())
  }

  const handlePrevStep = () => {
    dispatch(prevStepAction())
  }

  // Handle workspace name change
  const handleWorkspaceNameChange = (e) => {
    dispatch(setWorkspaceName(e.target.value))
  }

  // Handle retailer change
  const handleRetailerChange = (retailerId) => {
    dispatch(toggleRetailerSelection(retailerId))
  }

  // Remove a retailer tag
  const removeRetailerTag = (retailerId) => {
    dispatch(toggleRetailerSelection(retailerId))
  }

  // Handle category change
  const handleCategoryChange = (retailerId, categoryId) => {
    dispatch(toggleCategorySelection({ retailerId, categoryId }))
  }

  // Remove a category tag
  const removeCategoryTag = (retailerId, categoryId) => {
    dispatch(toggleCategorySelection({ retailerId, categoryId }))
  }

  // Handle brand change
  const handleBrandChange = (categoryId, brand) => {
    dispatch(toggleBrandSelection({ categoryId, brand }))
  }

  // Remove a brand tag
  const removeBrandTag = (categoryId, brand) => {
    dispatch(toggleBrandSelection({ categoryId, brand }))
  }

  // Handle retailer dropdown toggle
  const handleToggleRetailerDropdown = (retailerId) => {
    dispatch(toggleRetailerDropdown(retailerId))
  }

  // Handle category dropdown toggle
  const handleToggleCategoryDropdown = (categoryId) => {
    dispatch(toggleCategoryDropdown(categoryId))
  }

  // Handle active retailer, category, and brand selection
  const handleSetActiveRetailer = (retailerId) => {
    dispatch(setActiveRetailer(retailerId))
  }

  const handleSetActiveCategory = (categoryId) => {
    dispatch(setActiveCategory(categoryId))
  }

  const handleSetActiveBrandCategory = (categoryId) => {
    dispatch(setActiveBrandCategory(categoryId))
  }

  // Handle search updates
  const handleRetailerSearch = (e) => {
    dispatch(setRetailerSearch(e.target.value))
  }

  const handleCategorySearch = (retailerId, searchTerm) => {
    dispatch(setCategorySearch({ retailerId, searchTerm }))
  }

  const handleBrandSearch = (categoryId, searchTerm) => {
    dispatch(setBrandSearch({ categoryId, searchTerm }))
  }

  const hasWorkspace = localStorage.getItem('hasWorkspace') === 'true';

  // Handle form submission
  const handleSubmit = () => {
    const workspaceData = {
      name: workspaceName,
      retailers: selectedRetailers,
      categories: selectedCategories,
      brands: selectedBrands,
    }
    dispatch(createWorkspace(workspaceData))
      .unwrap()
      .then(() => {
        // Set the flag in localStorage to indicate that at least one workspace has been created
        if (localStorage.getItem('hasWorkspace') === 'false') {
          localStorage.setItem('hasWorkspace', 'true');
        }
        // Show success toast
        toast.success(`Workspace "${workspaceName}" created successfully!`, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })

        // Navigate after a short delay to allow toast to be seen
        setTimeout(() => {
          navigate('/')
          window.location.reload();
        }, 1500)
      })
      .catch((error) => {
        toast.error(`Failed to create workspace: ${error}`, {
          position: "top-right",
          autoClose: 5000,
        })
      })
  }

  // Replace the blue colors with your primary orange
  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: "Retailers", icon: <FiShoppingCart /> },
      { number: 2, label: "Categories", icon: <FiGrid /> },
      { number: 3, label: "My Brands", icon: <FiTag /> },
    ];

    return (
      <div className="relative pb-8">
        {/* Progress line */}
        <div className="absolute top-6 left-0 right-0 mx-auto h-1 bg-light-gray rounded" style={{ width: 'calc(100% - 3rem)' }}>
          <div
            className="h-full bg-primary-orange rounded transition-all duration-500 ease-in-out"
            style={{ width: `${(step - 1) * (100 / (steps.length - 1))}%` }}
          ></div>
        </div>

        {/* Steps */}
        <div className="flex justify-between relative z-10 px-4">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${step >= s.number
                  ? 'bg-primary-orange border-primary-orange text-white'
                  : 'bg-white border-gray text-gray'
                  }`}
              >
                {step > s.number ? <FiCheck className="w-6 h-6" /> : s.icon}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${step >= s.number ? 'text-primary-orange' : 'text-gray'
                  }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Tag component for selected items
  const SelectionTag = ({ label, onRemove }) => (
    <div className="flex items-center bg-peach text-accent-magenta rounded-full px-3 py-1 mr-2 mb-2 text-sm">
      <span className="mr-1">{label}</span>
      <button
        className="ml-1 text-accent-magenta hover:text-danger-red focus:outline-none"
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );

  const renderRetailerStep = () => {
    // Ensure retailers is an array before applying filter
    const filteredRetailers = Array.isArray(retailers)
      ? retailers.filter((retailer) =>
        retailer.name.toLowerCase().includes(retailerSearch.toLowerCase())
      )
      : [];

    return (
      <div className="space-y-6">
        {/* Selected retailers tags */}
        <div className="flex flex-wrap mb-2">
          {selectedRetailers.map(retailerId => {
            const retailer = Array.isArray(retailers) ? retailers.find(r => r.id === retailerId) : null;
            return (
              <SelectionTag
                key={retailerId}
                label={retailer?.name || retailerId}
                onRemove={() => removeRetailerTag(retailerId)}
              />
            );
          })}
        </div>

        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search retailers..."
            value={retailerSearch}
            onChange={handleRetailerSearch}
            className="w-full pl-12 py-3 rounded-xl border border-light-gray shadow-sm focus:ring-2 focus:ring-primary-orange focus:outline-none transition-all duration-300"
          />
        </div>

        {filteredRetailers.length === 0 ? (
          <p className="text-sm text-gray-500 py-2">No retailers found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRetailers.map((retailer) => {
              const isSelected = selectedRetailers.includes(retailer.id);
              return (
                <div
                  key={retailer.id}
                  onClick={() => handleRetailerChange(retailer.id)}
                  className={`flex items-center space-x-3 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${isSelected
                    ? 'bg-peach border border-primary-orange'
                    : 'bg-white border border-light-gray hover:bg-cream'
                    }`}
                >
                  <span className="text-base font-medium text-gray-800 select-none flex-grow">
                    {retailer.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )
  }

  const renderCategoryStep = () => {
    if (selectedRetailers.length === 0) {
      return <p className="text-sm text-gray-500 py-2">Please select at least one retailer to proceed.</p>
    }

    // Show loading state while fetching categories
    if (isFetchingCategories) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading categories...</span>
        </div>
      )
    }

    return (
      <div className="flex space-x-8">
        {/* Left Panel: Selected Retailers List with Dropdown */}
        <div className="w-1/3 p-6 rounded-xl bg-white shadow-sm border border-light-gray">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Retailers</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
            {selectedRetailers.map((retailerId) => {
              const retailer = Array.isArray(retailers) ? retailers.find((r) => r.id === retailerId) : null;
              const categoryCount = (selectedCategories[retailerId] || []).length;
              const retailerCategories = (selectedCategories[retailerId] || []).map((categoryId) => {
                const category = Array.isArray(allCategories) ?
                  allCategories.find(c => c.id === categoryId && c.retailerId === retailerId) : null;
                return category?.name;
              }).filter(Boolean);

              return (
                <div key={retailerId}>
                  <div
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${activeRetailer === retailerId ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50 border border-transparent"
                      }`}
                    onClick={() => {
                      handleSetActiveRetailer(retailerId)
                      handleToggleRetailerDropdown(retailerId)
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-800 font-medium">{retailer?.name || retailerId}</span>
                      {categoryCount > 0 && (
                        <span className="inline-block bg-warning-yellow text-dark-gray text-xs font-semibold px-2 py-0.5 rounded-full">
                          {categoryCount}
                        </span>
                      )}
                      {hasIncompleteCategories(retailerId) && (
                        <FiAlertCircle className="ml-2 h-4 w-4 text-danger-red" />
                      )}
                    </div>
                    {expandedRetailers[retailerId] ? (
                      <FiChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {expandedRetailers[retailerId] && retailerCategories.length > 0 && (
                    <div className="pl-5 mt-2 space-y-2 animate-slide-down">
                      {retailerCategories.map((categoryName, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                          {categoryName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Panel: Categories for Active Retailer */}
        {activeRetailer && (
          <div className="w-2/3 p-6 rounded-xl bg-white shadow-sm border border-light-gray">
            {/* Selected categories tags */}
            <div className="flex flex-wrap mb-4">
              {(selectedCategories[activeRetailer] || []).map(categoryId => {
                const category = Array.isArray(allCategories) ?
                  allCategories.find(c => c.id === categoryId && c.retailerId === activeRetailer) : null;
                return (
                  <SelectionTag
                    key={categoryId}
                    label={category?.name || categoryId}
                    onRemove={() => removeCategoryTag(activeRetailer, categoryId)}
                  />
                );
              })}
            </div>

            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                placeholder={`Search ${Array.isArray(retailers) ?
                  retailers.find((r) => r.id === activeRetailer)?.name || "retailer" : "retailer"} categories...`}
                value={categorySearches[activeRetailer] || ""}
                onChange={(e) => handleCategorySearch(activeRetailer, e.target.value)}
                className="w-full pl-12 py-3 rounded-xl border border-light-gray shadow-sm focus:ring-2 focus:ring-primary-orange focus:outline-none transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              {Array.isArray(allCategories) ?
                allCategories
                  .filter(category => category.retailerId === activeRetailer)
                  .filter((category) =>
                    category.name.toLowerCase().includes((categorySearches[activeRetailer] || "").toLowerCase()),
                  )
                  .map((category) => {
                    const isSelected = (selectedCategories[activeRetailer] || []).includes(category.id);
                    return (
                      <div
                        key={category.id}
                        onClick={() => handleCategoryChange(activeRetailer, category.id)}
                        className={`flex items-center space-x-3 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${isSelected
                          ? 'bg-peach border border-primary-orange'
                          : 'bg-white border border-light-gray hover:bg-cream'
                          }`}
                      >
                        <span className="text-base font-medium text-gray-800 select-none flex-grow">
                          {category.name}
                        </span>
                      </div>
                    );
                  })
                : <p>Loading categories...</p>
              }
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderBrandStep = () => {
    if (selectedCategoriesFlat.length === 0) {
      return <p className="text-sm text-gray-500 py-2">Please select at least one category to proceed.</p>
    }

    // Show loading state while fetching brands
    if (isFetchingBrands) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Loading brands...</span>
        </div>
      )
    }

    // Debug: Log the brands data
    console.log('All brands:', allBrands)
    console.log('Active brand category:', activeBrandCategory)
    console.log('Selected categories flat:', selectedCategoriesFlat)

    // Get all categories that have brands
    const categoriesWithBrands = Array.isArray(selectedCategoriesFlat) ?
      selectedCategoriesFlat.filter(id => {
        const brands = Array.isArray(allBrands) ?
          allBrands.filter(brand => brand.categoryId === id) : [];
        return brands && brands.length > 0;
      }) : [];

    // Group categories by retailer for the left panel
    const categoriesByRetailer = {};
    selectedRetailers.forEach(retailerId => {
      const retailerCategoryIds = selectedCategories[retailerId] || [];
      if (retailerCategoryIds.length > 0) {
        categoriesByRetailer[retailerId] = retailerCategoryIds;
      }
    });

    return (
      <div className="flex space-x-8">
        {/* Left Panel: Retailers and Categories with Selected Brands */}
        <div className="w-1/3 p-6 rounded-xl bg-white shadow-sm border border-light-gray">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Selection Summary</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
            {Object.entries(categoriesByRetailer).map(([retailerId, categoryIds]) => {
              const retailer = Array.isArray(retailers) ?
                retailers.find((r) => r.id === retailerId) : null;
              return (
                <div key={retailerId}>
                  <div
                    className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 border border-transparent"
                    onClick={() => handleToggleRetailerDropdown(retailerId)}
                  >
                    <span className="text-gray-800 font-medium">{retailer?.name || retailerId}</span>
                    {expandedRetailers[retailerId] ? (
                      <FiChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {expandedRetailers[retailerId] && categoryIds.length > 0 && (
                    <div className="pl-5 mt-2 space-y-2 animate-slide-down">
                      {categoryIds.map((categoryId) => {
                        const category = Array.isArray(allCategories) ?
                          allCategories.find(c => c.id === categoryId && c.retailerId === retailerId) : null;
                        const selectedBrandsList = selectedBrands[categoryId] || [];
                        const brandCount = selectedBrandsList.length;
                        return (
                          <div key={categoryId}>
                            <div
                              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${activeBrandCategory === categoryId ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50 border border-transparent"
                                }`}
                              onClick={() => {
                                handleSetActiveBrandCategory(categoryId);
                                handleToggleCategoryDropdown(categoryId);
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <span className="text-gray-700">{category?.name || categoryId}</span>
                                {brandCount > 0 && (
                                  <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                                    {brandCount}
                                  </span>
                                )}
                                {hasIncompleteBrands(categoryId) && (
                                  <FiAlertCircle className="ml-2 h-3 w-3 text-red-500" />
                                )}
                              </div>
                              {expandedCategories[categoryId] ? (
                                <FiChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <FiChevronDown className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            {expandedCategories[categoryId] && selectedBrandsList.length > 0 && (
                              <div className="pl-4 mt-1 space-y-1 animate-slide-down">
                                {selectedBrandsList.map((brand, idx) => (
                                  <div
                                    key={idx}
                                    className="text-xs text-gray-600 p-1 pl-2 rounded"
                                  >
                                    {brand}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel: Brands for Active Category */}
        {activeBrandCategory && (
          <div className="w-2/3 p-6 rounded-xl bg-white shadow-sm border border-light-gray">
            {/* Header for the current category */}
            {/* <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-700">
                Select brands for {Array.isArray(allCategories) ? 
                  allCategories.find((c) => c.id === activeBrandCategory)?.name || "category" : "category"}
              </h4>
            </div> */}

            {/* Selected brands tags */}
            <div className="flex flex-wrap mb-4">
              {(selectedBrands[activeBrandCategory] || []).map(brand => (
                <SelectionTag
                  key={brand}
                  label={brand}
                  onRemove={() => removeBrandTag(activeBrandCategory, brand)}
                />
              ))}
            </div>

            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                placeholder={`Search ${Array.isArray(allCategories) ?
                  allCategories.find((c) => c.id === activeBrandCategory)?.name || "category" : "category"
                  } brands...`}
                value={brandSearches[activeBrandCategory] || ""}
                onChange={(e) => handleBrandSearch(activeBrandCategory, e.target.value)}
                className="w-full pl-12 py-3 rounded-xl border border-light-gray shadow-sm focus:ring-2 focus:ring-primary-orange focus:outline-none transition-all duration-300"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              {Array.isArray(allBrands) && allBrands.length > 0 ? (
                allBrands
                  .filter(brand => brand.categoryId === activeBrandCategory)
                  .filter((brand) =>
                    brand.name.toLowerCase().includes((brandSearches[activeBrandCategory] || "").toLowerCase()),
                  )
                  .map((brand) => {
                    const isSelected = (selectedBrands[activeBrandCategory] || []).includes(brand.name);
                    return (
                      <div
                        key={`${activeBrandCategory}-${brand.name}`}
                        onClick={() => handleBrandChange(activeBrandCategory, brand.name)}
                        className={`flex items-center space-x-3 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${isSelected
                          ? 'bg-peach border border-primary-orange'
                          : 'bg-white border border-light-gray hover:bg-cream'
                          }`}
                      >
                        <span className="text-base font-medium text-gray-800 select-none flex-grow">
                          {brand.name}
                        </span>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No brands available for this category</p>
                  <p className="text-sm text-gray-400 mt-2">
                    This might be because brands haven't loaded yet or there are no brands for the selected category.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return hasWorkspace ? (<>
    <style>
      {`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}
    </style>
    <ToastContainer />
    <Card className="w-full h-full bg-white rounded-2xl !shadow-xl !overflow-y-scroll border border-light-gray">
      <CardHeader className="p-8 border-b border-gray-200 bg-cream">
        <CardTitle className="!text-3xl !font-bold text-accent-magenta flex !flex-col !items-center">Create Your Workspace</CardTitle>
        <CardSubtitle className="!text-dark-gray !text-sm mt-2 flex !flex-col !items-center">
          Enter a workspace name and select retailers, categories, and brands
        </CardSubtitle>
        <div className="mt-8">
          {renderProgressBar()}
        </div>
      </CardHeader>
      <div className="flex flex-col gap-y-2 mb-4 mt-4 px-6">
        <label
          htmlFor="workspaceName"
          className="text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          <div className="flex gap-x-1">
            Workspace Name<p className="text-red-600 mt-0.5">*</p>
          </div>
        </label>
        <div>
          <input
            id="workspaceName"
            placeholder="Enter workspace name..."
            value={workspaceName}
            onChange={handleWorkspaceNameChange}
            className={clsx(
              "w-full py-1.5 px-3 rounded-lg border shadow-sm outline-none transition-all duration-300",
              {
                "border-danger-red": workspaceNameError !== "",
                "border-success-green": workspaceName !== "" && workspaceNameError === "",
                "border-light-gray": workspaceName === "",
              }
            )}
          />
          {workspaceNameError && (
            <p className="text-xs text-danger-red mt-1 animate-pulse">
              {workspaceNameError}
            </p>
          )}
        </div>
      </div>
      <CardBody className="p-8">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Online Retailers</h2>
            {(selectedRetailers.length === 0) && (
              <p className="text-sm text-red-500">**Please select at least one retailer to proceed.**</p>
            )}
            {renderRetailerStep()}
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Categories</h2>
            {(Object.keys(selectedCategories).length === 0 ||
              selectedRetailers.some(
                (retailerId) => !selectedCategories[retailerId] || selectedCategories[retailerId].length === 0
              )) && (
                <p className="text-sm text-red-500">**You must select at least one category from each selected retailer.**</p>
              )}
            {renderCategoryStep()}
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Your Brands</h2>
            {selectedCategoriesFlat.some(
              (categoryId) => !selectedBrands[categoryId] || selectedBrands[categoryId].length === 0
            ) && (
                <p className="text-sm text-red-500">**You must select at least one brand from each category for each retailer.**</p>
              )}
            {renderBrandStep()}
          </>
        )}
      </CardBody>
      <CardActions className="flex !justify-between gap-4 p-8 border-t border-light-gray bg-cream">
        {step > 1 ? (
          <button
            look="outline"
            onClick={handlePrevStep}
            className="px-4 py-2 rounded-lg border-2 border-primary-orange text-primary-orange hover:bg-peach transition-all duration-300 font-medium flex items-center"
          >
            <FiChevronLeft className="mr-2" /> Back
          </button>
        ) : (
          <div></div>
        )}
        {step < 3 ? (
          <button
            onClick={handleNextStep}
            disabled={isNextDisabled}
            className="px-4 py-2 rounded-lg bg-primary-orange text-white hover:bg-gradient-to-r from-gradient-from to-gradient-to transition-all duration-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <FiChevronRight className="ml-2 h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="px-4 py-2 rounded-lg bg-success-green text-white hover:bg-opacity-90 transition-all duration-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Workspace
            <FiCheck className="ml-2 h-5 w-5" />
          </button>
        )}
      </CardActions>
    </Card></>
  ) : (<div className="flex items-center justify-center h-[95vh] py-12 px-4 sm:px-6 lg:px-8 font-sans">
    <style>
      {`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      `}
    </style>
    <ToastContainer />
    <Card className="w-full h-full bg-white rounded-2xl !shadow-xl !overflow-y-scroll border border-light-gray">
      <CardHeader className="p-8 border-b border-gray-200 bg-cream">
        <CardTitle className="!text-3xl !font-bold text-accent-magenta flex !flex-col !items-center">Create Your Workspace</CardTitle>
        <CardSubtitle className="!text-dark-gray !text-sm mt-2 flex !flex-col !items-center">
          Enter a workspace name and select retailers, categories, and brands
        </CardSubtitle>
        <div className="mt-8">
          {renderProgressBar()}
        </div>
      </CardHeader>
      <div className="flex flex-col gap-y-2 mb-4 mt-4 px-6">
        <label
          htmlFor="workspaceName"
          className="text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          <div className="flex gap-x-1">
            Workspace Name<p className="text-red-600 mt-0.5">*</p>
          </div>
        </label>
        <div>
          <input
            id="workspaceName"
            placeholder="Enter workspace name..."
            value={workspaceName}
            onChange={handleWorkspaceNameChange}
            className={clsx(
              "w-full py-1.5 px-3 rounded-lg border shadow-sm outline-none transition-all duration-300",
              {
                "border-red-600": workspaceNameError !== "",
                "border-green-500": workspaceName !== "" && workspaceNameError === "",
                "border-gray-300": workspaceName === "",
              }
            )}
          />
          {workspaceNameError && (
            <p className="text-xs text-danger-red mt-1 animate-pulse">
              {workspaceNameError}
            </p>
          )}
        </div>
      </div>
      <CardBody className="p-8">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Online Retailers</h2>
            {(selectedRetailers.length === 0) && (
              <p className="text-sm text-red-500">**Please select at least one retailer to proceed.**</p>
            )}
            {renderRetailerStep()}
          </>
        )}
        {step === 2 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Categories</h2>
            {(Object.keys(selectedCategories).length === 0 ||
              selectedRetailers.some(
                (retailerId) => !selectedCategories[retailerId] || selectedCategories[retailerId].length === 0
              )) && (
                <p className="text-sm text-red-500">**You must select at least one category from each selected retailer.**</p>
              )}
            {renderCategoryStep()}
          </>
        )}
        {step === 3 && (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Your Brands</h2>
            {selectedCategoriesFlat.some(
              (categoryId) => !selectedBrands[categoryId] || selectedBrands[categoryId].length === 0
            ) && (
                <p className="text-sm text-red-500">**You must select at least one brand from each category for each retailer.**</p>
              )}
            {renderBrandStep()}
          </>
        )}
      </CardBody>
      <CardActions className="flex !justify-between gap-4 p-8 border-t border-light-gray bg-cream">
        {step > 1 ? (
          <button
            look="outline"
            onClick={handlePrevStep}
            className="px-4 py-2 rounded-lg border-2 border-primary-orange text-primary-orange hover:bg-peach transition-all duration-300 font-medium flex items-center"
          >
            <FiChevronLeft className="mr-2" /> Back
          </button>
        ) : (
          <div></div>
        )}
        {step < 3 ? (
          <button
            onClick={handleNextStep}
            disabled={isNextDisabled}
            className="px-4 py-2 rounded-lg bg-primary-orange text-white hover:bg-gradient-to-r from-gradient-from to-gradient-to transition-all duration-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <FiChevronRight className="ml-2 h-5 w-5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="px-4 py-2 rounded-lg bg-success-green text-white hover:bg-opacity-90 transition-all duration-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Workspace
            <FiCheck className="ml-2 h-5 w-5" />
          </button>
        )}
      </CardActions>
    </Card>
  </div>)
}