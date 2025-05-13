import { useState, useEffect } from "react"
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle, CardActions } from "@progress/kendo-react-layout"
import { Input } from "@progress/kendo-react-inputs"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
} from "react-icons/fi"
import clsx from "clsx"

export default function WorkspaceCreation() {
  const [step, setStep] = useState(1) 
  const [selectedRetailers, setSelectedRetailers] = useState([])
  const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedBrands, setSelectedBrands] = useState({})
  const [activeRetailer, setActiveRetailer] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeBrandCategory, setActiveBrandCategory] = useState(null)
  const [expandedRetailers, setExpandedRetailers] = useState({})
  const [expandedCategories, setExpandedCategories] = useState({})
  const [retailerSearch, setRetailerSearch] = useState("")
  const [categorySearches, setCategorySearches] = useState({})
  const [brandSearches, setBrandSearches] = useState({})
  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaceNameError, setWorkspaceNameError] = useState("")

  const existingWorkspaces = [
    "Marketing Research",
    "E-commerce Analysis",
    "Retail Insights"
  ]
  
  const navigate = useNavigate()

  useEffect(() => {
    // Only update if we have retailers but no category searches for them
    const needsUpdate = selectedRetailers.some(
      retailerId => !categorySearches[retailerId]
    )
    
    if (needsUpdate) {
      const newCategorySearches = { ...categorySearches }
      selectedRetailers.forEach(retailerId => {
        if (!newCategorySearches[retailerId]) {
          newCategorySearches[retailerId] = ""
        }
      })
      setCategorySearches(newCategorySearches)
    }
  
    // Only set active retailer if we don't have one but have retailers
    if (selectedRetailers.length > 0 && !activeRetailer) {
      setActiveRetailer(selectedRetailers[0])
    }
  }, [selectedRetailers]) // Only depend on selectedRetailers

  useEffect(() => {
    const selectedCategoriesFlat = Object.values(selectedCategories)
      .flat()
      .filter((id, index, self) => self.indexOf(id) === index)
  
    // Only update if we have categories but no brand searches for them
    const needsUpdate = selectedCategoriesFlat.some(
      categoryId => !brandSearches[categoryId]
    )
  
    if (needsUpdate) {
      const newBrandSearches = { ...brandSearches }
      selectedCategoriesFlat.forEach(categoryId => {
        if (!newBrandSearches[categoryId]) {
          newBrandSearches[categoryId] = ""
        }
      })
      setBrandSearches(newBrandSearches)
    }
  
    // Only set active category if we don't have one but have categories
    if (selectedCategoriesFlat.length > 0 && !activeCategory) {
      setActiveCategory(selectedCategoriesFlat[0])
    }

    // Set the active brand category if we don't have one but have categories
    if (selectedCategoriesFlat.length > 0 && !activeBrandCategory) {
      setActiveBrandCategory(selectedCategoriesFlat[0])
    }
  }, [selectedCategories]) // Only depend on selectedCategories

  const retailers = [
    { id: "amazon", name: "Amazon" },
    { id: "walmart", name: "Walmart" },
    { id: "ebay", name: "eBay" },
    { id: "etsy", name: "Etsy" },
    { id: "shopify", name: "Shopify" },
  ]

  const categories = {
    amazon: [
      { id: "electronics", name: "Electronics" },
      { id: "clothing", name: "Clothing" },
      { id: "home", name: "Home & Kitchen" },
      { id: "books", name: "Books" },
    ],
    walmart: [
      { id: "grocery", name: "Grocery" },
      { id: "clothing", name: "Clothing" },
      { id: "electronics", name: "Electronics" },
      { id: "furniture", name: "Furniture" },
    ],
    ebay: [
      { id: "collectibles", name: "Collectibles" },
      { id: "electronics", name: "Electronics" },
      { id: "fashion", name: "Fashion" },
      { id: "auto", name: "Auto Parts" },
    ],
    etsy: [
      { id: "handmade", name: "Handmade" },
      { id: "vintage", name: "Vintage" },
      { id: "craft", name: "Craft Supplies" },
      { id: "jewelry", name: "Jewelry" },
    ],
    shopify: [
      { id: "fashion", name: "Fashion" },
      { id: "beauty", name: "Beauty" },
      { id: "home", name: "Home Decor" },
      { id: "food", name: "Food & Drink" },
    ],
  }

  const brands = {
    electronics: ["Apple", "Samsung", "Sony", "LG", "Dell"],
    clothing: ["Nike", "Adidas", "H&M", "Zara", "Levi's"],
    home: ["IKEA", "Crate & Barrel", "Wayfair", "West Elm", "Pottery Barn"],
    books: ["Penguin", "HarperCollins", "Simon & Schuster", "Macmillan", "Random House"],
    grocery: ["Kraft", "Nestle", "General Mills", "Kellogg's", "P&G"],
    furniture: ["Ashley", "La-Z-Boy", "Restoration Hardware", "Ethan Allen", "Steelcase"],
    collectibles: ["Funko", "Hasbro", "Mattel", "LEGO", "Hot Wheels"],
    fashion: ["Gucci", "Louis Vuitton", "Prada", "Chanel", "Versace"],
    auto: ["Toyota", "Ford", "BMW", "Honda", "Mercedes-Benz"],
    handmade: ["Local Artisans", "Independent Crafters", "Small Batch Makers"],
    vintage: ["Antique Collections", "Retro Finds", "Heritage Pieces"],
    craft: ["Michaels", "Joann", "Hobby Lobby", "Cricut", "Fiskars"],
    jewelry: ["Tiffany & Co.", "Pandora", "Swarovski", "Cartier", "David Yurman"],
    beauty: ["Sephora", "MAC", "Fenty Beauty", "L'Oreal", "Estée Lauder"],
    food: ["Whole Foods", "Trader Joe's", "Godiva", "Ghirardelli", "Lindt"],
  }

  // Modified to toggle selection on click
  const handleRetailerChange = (retailerId) => {
    const isSelected = selectedRetailers.includes(retailerId);
    
    if (!isSelected) {
      setSelectedRetailers([...selectedRetailers, retailerId])
    } else {
      setSelectedRetailers(selectedRetailers.filter((id) => id !== retailerId))
      const newSelectedCategories = { ...selectedCategories }
      delete newSelectedCategories[retailerId]
      setSelectedCategories(newSelectedCategories)

      const newSelectedBrands = { ...selectedBrands }
      categories[retailerId]?.forEach((category) => {
        delete newSelectedBrands[category.id]
      })
      setSelectedBrands(newSelectedBrands)

      if (activeRetailer === retailerId) {
        setActiveRetailer(selectedRetailers.length > 1 ? selectedRetailers[0] : null)
      }
    }
  }

  // Remove a retailer tag from the search bar
  const removeRetailerTag = (retailerId) => {
    handleRetailerChange(retailerId);
  }

  // Modified to toggle selection on click
  const handleCategoryChange = (retailerId, categoryId) => {
    const currentCategories = selectedCategories[retailerId] || []
    const isSelected = currentCategories.includes(categoryId);

    if (!isSelected) {
      setSelectedCategories({
        ...selectedCategories,
        [retailerId]: [...currentCategories, categoryId],
      })
    } else {
      setSelectedCategories({
        ...selectedCategories,
        [retailerId]: currentCategories.filter((id) => id !== categoryId),
      })

      const newSelectedBrands = { ...selectedBrands }
      delete newSelectedBrands[categoryId]
      setSelectedBrands(newSelectedBrands)

      const selectedCategoriesFlat = []
      Object.values(selectedCategories).forEach((categoryIds) => {
        categoryIds.forEach((id) => {
          if (!selectedCategoriesFlat.includes(id)) {
            selectedCategoriesFlat.push(id)
          }
        })
      })
      if (!selectedCategoriesFlat.includes(activeCategory)) {
        setActiveCategory(selectedCategoriesFlat.length > 0 ? selectedCategoriesFlat[0] : null)
      }
    }
  }

  // Remove a category tag from the search bar
  const removeCategoryTag = (retailerId, categoryId) => {
    handleCategoryChange(retailerId, categoryId);
  }

  // Modified to toggle selection on click
  const handleBrandChange = (categoryId, brand) => {
    const currentBrands = selectedBrands[categoryId] || []
    const isSelected = currentBrands.includes(brand);

    if (!isSelected) {
      setSelectedBrands({
        ...selectedBrands,
        [categoryId]: [...currentBrands, brand],
      })
    } else {
      setSelectedBrands({
        ...selectedBrands,
        [categoryId]: currentBrands.filter((b) => b !== brand),
      })
    }
  }

  // Remove a brand tag from the search bar
  const removeBrandTag = (categoryId, brand) => {
    handleBrandChange(categoryId, brand);
  }

  const toggleRetailerDropdown = (retailerId) => {
    setExpandedRetailers({
      ...expandedRetailers,
      [retailerId]: !expandedRetailers[retailerId],
    })
  }

  const toggleCategoryDropdown = (categoryId) => {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId],
    })
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    const workspaceDetails = {
      name: workspaceName,
      retailers: selectedRetailers,
      categories: selectedCategories,
      brands: selectedBrands,
    }
    
    console.log("Workspace created with:", workspaceDetails)
    
    // Show success toast
    toast.success(`Workspace "${workspaceName}" created successfully!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })

    // Navigate after a short delay to allow toast to be seen
    setTimeout(() => {
      navigate('/')
    }, 1500)
  }

  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: "Retailers", icon: <FiShoppingCart /> },
      { number: 2, label: "Categories", icon: <FiGrid /> },
      { number: 3, label: "Brands", icon: <FiTag /> },
    ]

    return (
      <div className="relative pb-8">
        {/* Progress line */}
        <div className="absolute top-6 w-full ml-1 h-1 bg-gray-200 rounded">
          <div 
            className="h-full bg-blue-500 rounded transition-all duration-500 ease-in-out" 
            style={{ width: `${(step - 1) * 49}%` }}
          ></div>
        </div>
        
        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((s) => (
            <div key={s.number} className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  step >= s.number 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}
              >
                {step > s.number ? <FiCheck className="w-6 h-6" /> : s.icon}
              </div>
              <span 
                className={`mt-2 text-sm font-medium ${
                  step >= s.number ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Tag component for selected items
  const SelectionTag = ({ label, onRemove }) => (
    <div className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2 text-sm">
      <span className="mr-1">{label}</span>
      <button 
        className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none" 
        onClick={onRemove}
        aria-label={`Remove ${label}`}
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );


  const renderRetailerStep = () => {
    const filteredRetailers = retailers.filter((retailer) =>
      retailer.name.toLowerCase().includes(retailerSearch.toLowerCase()),
    )

    return (
      <div className="space-y-6">
        {/* Selected retailers tags */}
        <div className="flex flex-wrap mb-2">
          {selectedRetailers.map(retailerId => {
            const retailer = retailers.find(r => r.id === retailerId);
            return (
              <SelectionTag 
                key={retailerId}
                label={retailer.name}
                onRemove={() => removeRetailerTag(retailerId)}
              />
            );
          })}
        </div>
        
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search retailers..."
            value={retailerSearch}
            onChange={(e) => setRetailerSearch(e.target.value)}
            className="w-full pl-12 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
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
                  className={`flex items-center space-x-3 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'bg-white border border-gray-100 hover:bg-gray-50'
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

    return (
      <div className="flex space-x-8">
        {/* Left Panel: Selected Retailers List with Dropdown */}
        <div className="w-1/3 p-6 rounded-xl bg-white shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Retailers</h3>

          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
            {selectedRetailers.map((retailerId) => {
              const retailer = retailers.find((r) => r.id === retailerId)
              const retailerCategories = (selectedCategories[retailerId] || []).map((categoryId) =>
                categories[retailerId].find((c) => c.id === categoryId)?.name,
              )
              return (
                <div key={retailerId}>
                  <div
                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                      activeRetailer === retailerId ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50 border border-transparent"
                    }`}
                    onClick={() => {
                      setActiveRetailer(retailerId)
                      toggleRetailerDropdown(retailerId)
                    }}
                  >
                    <span className="text-gray-800 font-medium">{retailer?.name}</span>
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
          <div className="w-2/3">
            {/* Selected categories tags */}
            <div className="flex flex-wrap mb-4">
              {(selectedCategories[activeRetailer] || []).map(categoryId => {
                const category = categories[activeRetailer].find(c => c.id === categoryId);
                return (
                  <SelectionTag 
                    key={categoryId}
                    label={category.name}
                    onRemove={() => removeCategoryTag(activeRetailer, categoryId)}
                  />
                );
              })}
            </div>
            
            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={`Search ${retailers.find((r) => r.id === activeRetailer)?.name} categories...`}
                value={categorySearches[activeRetailer] || ""}
                onChange={(e) =>
                  setCategorySearches({
                    ...categorySearches,
                    [activeRetailer]: e.target.value,
                  })
                }
                className="w-full pl-12 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              {(categories[activeRetailer] || [])
                .filter((category) =>
                  category.name.toLowerCase().includes((categorySearches[activeRetailer] || "").toLowerCase()),
                )
                .map((category) => {
                  const isSelected = (selectedCategories[activeRetailer] || []).includes(category.id);
                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryChange(activeRetailer, category.id)}
                      className={`flex items-center space-x-3 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'bg-white border border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base font-medium text-gray-800 select-none flex-grow">
                        {category.name}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderBrandStep = () => {
    const selectedCategoriesFlat = []

    Object.values(selectedCategories).forEach((categoryIds) => {
      categoryIds.forEach((id) => {
        if (!selectedCategoriesFlat.includes(id)) {
          selectedCategoriesFlat.push(id)
        }
      })
    })

    if (selectedCategoriesFlat.length === 0) {
      return <p className="text-sm text-gray-500 py-2">Please select at least one category to proceed.</p>
    }
    // Get all categories that have brands
    const categoriesWithBrands = selectedCategoriesFlat.filter(id => brands[id] && brands[id].length > 0);
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
        <div className="w-1/3 p-6 rounded-xl bg-white shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Selection Summary</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
            {Object.entries(categoriesByRetailer).map(([retailerId, categoryIds]) => {
              const retailer = retailers.find((r) => r.id === retailerId);
              return (
                <div key={retailerId}>
                  <div
                    className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-300 border border-transparent"
                    onClick={() => toggleRetailerDropdown(retailerId)}
                  >
                    <span className="text-gray-800 font-medium">{retailer?.name}</span>
                    {expandedRetailers[retailerId] ? (
                      <FiChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  {expandedRetailers[retailerId] && categoryIds.length > 0 && (
                    <div className="pl-5 mt-2 space-y-2 animate-slide-down">
                      {categoryIds.map((categoryId) => {
                        const category = categories[retailerId].find(c => c.id === categoryId);
                        const selectedBrandsList = selectedBrands[categoryId] || [];
                        
                        return (
                          <div key={categoryId}>
                            <div
                              className={`flex justify-between items-center p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                activeBrandCategory === categoryId ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50 border border-transparent"
                              }`}
                              onClick={() => {
                                setActiveBrandCategory(categoryId);
                                toggleCategoryDropdown(categoryId);
                              }}
                            >
                              <span className="text-gray-700">{category?.name}</span>
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
          <div className="w-2/3">
            {/* Header for the current category */}
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-700">
                Select brands for {Object.values(categories).flat().find((c) => c.id === activeBrandCategory)?.name}
              </h4>
            </div>
            
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
              <Input
                placeholder={`Search ${
                  Object.values(categories).flat().find((c) => c.id === activeBrandCategory)?.name
                } brands...`}
                value={brandSearches[activeBrandCategory] || ""}
                onChange={(e) =>
                  setBrandSearches({
                    ...brandSearches,
                    [activeBrandCategory]: e.target.value,
                  })
                }
                className="w-full pl-12 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              {(brands[activeBrandCategory] || [])
                .filter((brand) =>
                  brand.toLowerCase().includes((brandSearches[activeBrandCategory] || "").toLowerCase()),
                )
                .map((brand) => {
                  const isSelected = (selectedBrands[activeBrandCategory] || []).includes(brand);
                  return (
                    <div
                      key={`${activeBrandCategory}-${brand}`}
                      onClick={() => handleBrandChange(activeBrandCategory, brand)}
                      className={`flex items-center space-x-3 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'bg-white border border-gray-100 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base font-medium text-gray-800 select-none flex-grow">
                        {brand}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    )
  }


  const validateWorkspaceName = (name) => {
    // Trim the name and check for emptiness
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setWorkspaceNameError("Workspace name cannot be empty.");
      return false;
    }

    // Check if name already exists (case-insensitive)
    if (existingWorkspaces.some(ws => ws.toLowerCase() === trimmedName.toLowerCase())) {
      setWorkspaceNameError("A workspace with this name already exists. Please choose a different name.");
      return false;
    }

    // Clear any previous errors
    setWorkspaceNameError("");
    return true;
  }

  const handleWorkspaceNameChange = (e) => {
    const newName = e.target.value;
    setWorkspaceName(newName);
    
    // Validate name as user types
    validateWorkspaceName(newName);
  }


  const isNextDisabled = () => {
    if (step === 1) {
      return (
        selectedRetailers.length === 0 || 
        !workspaceName || 
        workspaceNameError !== ""
      );
    }
    if (step === 2) {
      return (
        Object.keys(selectedCategories).length === 0 ||
        selectedRetailers.some(
          (retailerId) => !selectedCategories[retailerId] || selectedCategories[retailerId].length === 0,
        )
      )
    }
    return false
  }

  const isSubmitDisabled = () => {
    const selectedCategoriesFlat = []

    Object.values(selectedCategories).forEach((categoryIds) => {
      categoryIds.forEach((id) => {
        if (!selectedCategoriesFlat.includes(id)) {
          selectedCategoriesFlat.push(id)
        }
      })
    })

    return (
      !workspaceName ||
      workspaceNameError !== "" ||
      selectedCategoriesFlat.some(
        (categoryId) => !selectedBrands[categoryId] || selectedBrands[categoryId].length === 0,
      )
    )
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
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
      <Card className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <CardHeader className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="!text-3xl !font-bold text-blue-700">Create Your Workspace</CardTitle>
          <CardSubtitle className="!text-gray-600 !text-sm mt-2">
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
                <p className="text-xs text-red-600 mt-1 animate-pulse">
                  {workspaceNameError}
                </p>
              )}
            </div>
          </div>
          <CardBody className="p-8">
          {step === 1 && (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Online Retailers</h2>
                {(selectedRetailers.length === 0 || !workspaceName) && (
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
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Brands</h2>
                {(() => {
                  const selectedCategoriesFlat = []
                  Object.values(selectedCategories).forEach((categoryIds) => {
                    categoryIds.forEach((id) => {
                      if (!selectedCategoriesFlat.includes(id)) {
                        selectedCategoriesFlat.push(id)
                      }
                    })
                  })
  
                  const missingBrands = selectedCategoriesFlat.some(
                    (categoryId) => !selectedBrands[categoryId] || selectedBrands[categoryId].length === 0
                  )
  
                  return missingBrands && (
                    <p className="text-sm text-red-500">**You must select at least one brand from each category for each retailer.**</p>
                  )
                })()}
                {renderBrandStep()}
              </>
            )}
          </CardBody>
          <CardActions className="flex !justify-between gap-4 p-8 border-gray-200 bg-gray-50">
            {step > 1 ? (
              <button 
                look="outline" 
                onClick={prevStep} 
                className="px-4 py-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300 font-medium flex items-center"
              >
                <FiChevronLeft className="mr-2" /> Back
              </button>
            ) : (
              <div></div>
            )}
  
            {step < 3 ? (
              <button 
                onClick={nextStep}
                disabled={isNextDisabled()}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300 font-medium flex items-center disabled:opacity-50   disabled:cursor-not-allowed"
              >
                Next <FiChevronRight className="ml-2 h-5 w-5" />
              </button>
              ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSubmitDisabled()}
                className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-600 transition-all duration-300 font-medium flex items-center disabled:opacity-50   disabled:cursor-not-allowed"
              >
                Create Workspace 
                <FiCheck className="ml-2 h-5 w-5" />
              </button>
            )}
          </CardActions>
        </Card>
      </div>
    )
  }