
import { useState, useEffect, use } from "react"
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle, CardActions } from "@progress/kendo-react-layout"
import { Checkbox } from "@progress/kendo-react-inputs"
import { Input } from "@progress/kendo-react-inputs"
import { useNavigate } from "react-router-dom"
import { 
  FiSearch, 
  FiChevronDown, 
  FiChevronUp,
  FiShoppingCart,
  FiGrid,
  FiTag,
  FiChevronLeft, 
  FiChevronRight,
  FiCheck
} from "react-icons/fi"

export default function WorkspaceCreation() {
  const [step, setStep] = useState(1)
  const [selectedRetailers, setSelectedRetailers] = useState([])
  const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedBrands, setSelectedBrands] = useState({})
  const [activeRetailer, setActiveRetailer] = useState(null)
  const [activeCategory, setActiveCategory] = useState(null)
  const [expandedRetailers, setExpandedRetailers] = useState({})
  const [retailerSearch, setRetailerSearch] = useState("")
  const [categorySearches, setCategorySearches] = useState({})
  const [brandSearches, setBrandSearches] = useState({})
  const [workspaceName, setWorkspaceName] = useState("")
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

  const handleRetailerChange = (retailerId, checked) => {
    if (checked) {
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

  const handleCategoryChange = (retailerId, categoryId, checked) => {
    const currentCategories = selectedCategories[retailerId] || []

    if (checked) {
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

  const handleBrandChange = (categoryId, brand, checked) => {
    const currentBrands = selectedBrands[categoryId] || []

    if (checked) {
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

  const toggleRetailerDropdown = (retailerId) => {
    setExpandedRetailers({
      ...expandedRetailers,
      [retailerId]: !expandedRetailers[retailerId],
    })
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log("Workspace created with:", {
      name: workspaceName,
      retailers: selectedRetailers,
      categories: selectedCategories,
      brands: selectedBrands,
    })
    // alert(`Workspace "${workspaceName}" created successfully!`)
    navigate('/')
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

  const renderRetailerStep = () => {
    const filteredRetailers = retailers.filter((retailer) =>
      retailer.name.toLowerCase().includes(retailerSearch.toLowerCase()),
    )

    return (
      <div className="space-y-6">
        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workspace Name
          </label>
          <Input
            placeholder="Enter workspace name..."
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}

            className="w-full py-3 px-4 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
          />
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
            {filteredRetailers.map((retailer) => (
              <div
                key={retailer.id}
                className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100"
              >
                <Checkbox
                  id={retailer.id}
                  checked={selectedRetailers.includes(retailer.id)}
                  onChange={(e) => handleRetailerChange(retailer.id, e.value)}
                  className="k-checkbox-md"
                />
                <label
                  htmlFor={retailer.id}
                  className="text-base font-medium text-gray-800 cursor-pointer select-none flex-grow"
                >
                  {retailer.name}
                </label>
              </div>
            ))}
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
                .map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100"

                  >
                    <Checkbox
                      id={`${activeRetailer}-${category.id}`}
                      checked={(selectedCategories[activeRetailer] || []).includes(category.id)}
                      onChange={(e) => handleCategoryChange(activeRetailer, category.id, e.value)}
                      className="k-checkbox-md"
                    />
                    <label
                      htmlFor={`${activeRetailer}-${category.id}`}
                      className="text-base font-medium text-gray-800 cursor-pointer select-none flex-grow"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
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

    return (
      <div className="flex space-x-8">
        {/* Left Panel: Retailers and Categories in Dropdown Structure */}
        <div className="w-1/3 p-6 rounded-xl bg-white shadow-sm border border-gray-200">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">Categories</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
            {selectedRetailers.map((retailerId) => {
              const retailer = retailers.find((r) => r.id === retailerId)
              const retailerCategories = (selectedCategories[retailerId] || []).map((categoryId) =>
                categories[retailerId].find((c) => c.id === categoryId),
              )
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
                  {expandedRetailers[retailerId] && retailerCategories.length > 0 && (
                    <div className="pl-5 mt-2 space-y-2 animate-slide-down">
                      {retailerCategories.map((category) => (
                        <div
                          key={category.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${

                            activeCategory === category.id ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50 border border-transparent"

                          }`}
                          onClick={() => setActiveCategory(category.id)}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Panel: Brands for Active Category */}
        {activeCategory && (
          <div className="w-2/3">
            <div className="relative mb-6">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={`Search ${
                  Object.values(categories).flat().find((c) => c.id === activeCategory)?.name
                } brands...`}
                value={brandSearches[activeCategory] || ""}
                onChange={(e) =>
                  setBrandSearches({
                    ...brandSearches,
                    [activeCategory]: e.target.value,
                  })
                }
                className="w-full pl-12 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto scrollbar-thin">
              {(brands[activeCategory] || [])
                .filter((brand) =>
                  brand.toLowerCase().includes((brandSearches[activeCategory] || "").toLowerCase()),
                )
                .map((brand) => (
                  <div
                    key={`${activeCategory}-${brand}`}
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer border border-gray-100"
                  >
                    <Checkbox
                      id={`${activeCategory}-${brand}`}
                      checked={(selectedBrands[activeCategory] || []).includes(brand)}
                      onChange={(e) => handleBrandChange(activeCategory, brand, e.value)}
                      className="k-checkbox-md"
                    />
                    <label
                      htmlFor={`${activeCategory}-${brand}`}
                      className="text-base font-medium text-gray-800 cursor-pointer select-none flex-grow"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const isNextDisabled = () => {
    if (step === 1) return selectedRetailers.length === 0 || !workspaceName
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
          .k-checkbox-md:checked {
            background-color: #3b82f6 !important;
            border-color: #3b82f6 !important;
          }
          .k-checkbox-md:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3) !important;
          }
        `}
      </style>
      <Card className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <CardHeader className="p-8 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-4xl text-gray-900">Create Your Workspace</CardTitle>
          <CardSubtitle className="text-gray-600 mt-2">
            Enter a workspace name and select retailers, categories, and brands
          </CardSubtitle>
          <div className="mt-8">
            {renderProgressBar()}

          </div>
        </CardHeader>
        <CardBody className="p-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Online Retailers</h2>
              {renderRetailerStep()}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Categories</h2>
              {renderCategoryStep()}
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Select Brands</h2>

              {renderBrandStep()}
            </>
          )}
        </CardBody>
        <CardActions className="flex justify-center gap-4 p-8 border-gray-200 bg-gray-50">
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