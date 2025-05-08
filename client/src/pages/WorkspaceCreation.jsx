
import { useState, useEffect } from "react"
import { Button } from "@progress/kendo-react-buttons"
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle, CardActions } from "@progress/kendo-react-layout"
import { Checkbox } from "@progress/kendo-react-inputs"
import { ProgressBar } from "@progress/kendo-react-progressbars"
import { Input } from "@progress/kendo-react-inputs"
import { FiSearch, FiChevronRight, FiChevronLeft, FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi"

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

  useEffect(() => {
    const newCategorySearches = { ...categorySearches }
    let hasChanges = false

    selectedRetailers.forEach((retailerId) => {
      if (!categorySearches[retailerId]) {
        newCategorySearches[retailerId] = ""
        hasChanges = true
      }
    })

    if (hasChanges) {
      setCategorySearches(newCategorySearches)
    }

    if (selectedRetailers.length > 0 && !activeRetailer) {
      setActiveRetailer(selectedRetailers[0])
    }
  }, [selectedRetailers, categorySearches, activeRetailer])

  useEffect(() => {
    const selectedCategoriesFlat = []
    let hasChanges = false

    Object.values(selectedCategories).forEach((categoryIds) => {
      categoryIds.forEach((id) => {
        if (!selectedCategoriesFlat.includes(id)) {
          selectedCategoriesFlat.push(id)
        }
      })
    })

    const newBrandSearches = { ...brandSearches }

    selectedCategoriesFlat.forEach((categoryId) => {
      if (!brandSearches[categoryId]) {
        newBrandSearches[categoryId] = ""
        hasChanges = true
      }
    })

    if (hasChanges) {
      setBrandSearches(newBrandSearches)
    }

    if (selectedCategoriesFlat.length > 0 && !activeCategory) {
      setActiveCategory(selectedCategoriesFlat[0])
    }
  }, [selectedCategories, brandSearches, activeCategory])

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
    alert(`Workspace "${workspaceName}" created successfully!`)
  }

  const getProgressValue = () => {
    if (step === 1) return 33
    if (step === 2) return 66
    return 100
  }

  const renderRetailerStep = () => {
    const filteredRetailers = retailers.filter((retailer) =>
      retailer.name.toLowerCase().includes(retailerSearch.toLowerCase()),
    )

    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Workspace Name
          </label>
          <Input
            placeholder="Enter workspace name..."
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full py-3 px-4 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary transition-all duration-300"
          />
        </div>
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" />
          <Input
            placeholder="Search retailers..."
            value={retailerSearch}
            onChange={(e) => setRetailerSearch(e.target.value)}
            className="w-full pl-12 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary transition-all duration-300"
          />
        </div>

        {filteredRetailers.length === 0 ? (
          <p className="text-sm text-muted py-2">No retailers found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRetailers.map((retailer) => (
              <div
                key={retailer.id}
                className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <Checkbox
                  id={retailer.id}
                  checked={selectedRetailers.includes(retailer.id)}
                  onChange={(e) => handleRetailerChange(retailer.id, e.value)}
                  className="text-primary"
                />
                <label
                  htmlFor={retailer.id}
                  className="text-base font-medium text-foreground cursor-pointer select-none"
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
      return <p className="text-sm text-muted py-2">Please select at least one retailer to proceed.</p>
    }

    return (
      <div className="flex space-x-8">
        {/* Left Panel: Selected Retailers List with Dropdown */}
        <div className="w-1/3 p-6 rounded-xl bg-white shadow-sm border">
          <h3 className="font-semibold text-lg text-foreground mb-4">Retailers</h3>
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
                      activeRetailer === retailerId ? "bg-muted" : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      setActiveRetailer(retailerId)
                      toggleRetailerDropdown(retailerId)
                    }}
                  >
                    <span className="text-foreground font-medium">{retailer?.name}</span>
                    {expandedRetailers[retailerId] ? (
                      <FiChevronUp className="h-5 w-5 text-muted" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-muted" />
                    )}
                  </div>
                  {expandedRetailers[retailerId] && retailerCategories.length > 0 && (
                    <div className="pl-5 mt-2 space-y-2 animate-slide-down">
                      {retailerCategories.map((categoryName, index) => (
                        <div
                          key={index}
                          className="text-sm text-muted p-2 rounded-lg hover:bg-muted transition-all duration-200"
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
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" />
              <Input
                placeholder={`Search ${retailers.find((r) => r.id === activeRetailer)?.name} categories...`}
                value={categorySearches[activeRetailer] || ""}
                onChange={(e) =>
                  setCategorySearches({
                    ...categorySearches,
                    [activeRetailer]: e.target.value,
                  })
                }
                className="w-full pl-12 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary transition-all duration-300"
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
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  >
                    <Checkbox
                      id={`${activeRetailer}-${category.id}`}
                      checked={(selectedCategories[activeRetailer] || []).includes(category.id)}
                      onChange={(e) => handleCategoryChange(activeRetailer, category.id, e.value)}
                      className="text-primary"
                    />
                    <label
                      htmlFor={`${activeRetailer}-${category.id}`}
                      className="text-base font-medium text-foreground cursor-pointer select-none"
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
      return <p className="text-sm text-muted py-2">Please select at least one category to proceed.</p>
    }

    return (
      <div className="flex space-x-8">
        {/* Left Panel: Retailers and Categories in Dropdown Structure */}
        <div className="w-1/3 p-6 rounded-xl bg-white shadow-sm border">
          <h3 className="font-semibold text-lg text-foreground mb-4">Categories</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin">
            {selectedRetailers.map((retailerId) => {
              const retailer = retailers.find((r) => r.id === retailerId)
              const retailerCategories = (selectedCategories[retailerId] || []).map((categoryId) =>
                categories[retailerId].find((c) => c.id === categoryId),
              )
              return (
                <div key={retailerId}>
                  <div
                    className="flex justify-between items-center p-3 rounded-lg cursor-pointer hover:bg-muted transition-all duration-300"
                    onClick={() => toggleRetailerDropdown(retailerId)}
                  >
                    <span className="text-foreground font-medium">{retailer?.name}</span>
                    {expandedRetailers[retailerId] ? (
                      <FiChevronUp className="h-5 w-5 text-muted" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-muted" />
                    )}
                  </div>
                  {expandedRetailers[retailerId] && retailerCategories.length > 0 && (
                    <div className="pl-5 mt-2 space-y-2 animate-slide-down">
                      {retailerCategories.map((category) => (
                        <div
                          key={category.id}
                          className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                            activeCategory === category.id ? "bg-muted" : "hover:bg-muted"
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
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted" />
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
                className="w-full pl-12 py-3 rounded-xl border shadow-sm focus:ring-2 focus:ring-primary transition-all duration-300"
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
                    className="flex items-center space-x-3 p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                  >
                    <Checkbox
                      id={`${activeCategory}-${brand}`}
                      checked={(selectedBrands[activeCategory] || []).includes(brand)}
                      onChange={(e) => handleBrandChange(activeCategory, brand, e.value)}
                      className="text-primary"
                    />
                    <label
                      htmlFor={`${activeCategory}-${brand}`}
                      className="text-base font-medium text-foreground cursor-pointer select-none"
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
    <div className="container max-w-4xl py-12 px-6 min-h-screen font-sans">
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
          .progress-bar {
            transition: width 0.5s ease-in-out;
          }
          .custom-button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            transition: transform 0.2s ease, box-shadow 0.3s ease;
          }
          .custom-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .custom-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
          .custom-outline-button {
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            transition: transform 0.2s ease, box-shadow 0.3s ease;
          }
          .custom-outline-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
      <Card className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <CardHeader className="p-8 border-b">
          <CardTitle className="text-3xl font-bold text-foreground">Create Your Workspace</CardTitle>
          <CardSubtitle className="text-muted mt-2">
            Enter a workspace name and select retailers, categories, and brands
          </CardSubtitle>
          <div className="mt-6 space-y-3">
            <ProgressBar
              value={getProgressValue()}
              style={{ height: "6px" }}
              className="progress-bar bg-muted rounded-full"
            />
            <div className="flex justify-between text-sm font-medium">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-foreground" : "text-muted"}`}>
                {step >= 1 && <FiCheck className="h-5 w-5" />} Retailers
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-foreground" : "text-muted"}`}>
                {step >= 2 && <FiCheck className="h-5 w-5" />} Categories
              </div>
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-foreground" : "text-muted"}`}>
                {step >= 3 && <FiCheck className="h-5 w-5" />} Brands
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-8">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Select Online Retailers</h2>
              {renderRetailerStep()}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Select Categories</h2>
              {renderCategoryStep()}
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-2xl font-semibold text-foreground mb-6">Select Brands</h2>
              {renderBrandStep()}
            </>
          )}
        </CardBody>
        <CardActions className="flex justify-between p-8 border-t">
          {step > 1 ? (
            <Button look="outline" onClick={prevStep} className="custom-outline-button border-2 border-primary text-primary">
              <FiChevronLeft className="mr-2" /> Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <Button onClick={nextStep} disabled={isNextDisabled()} className="custom-button bg-primary text-white">
              Next <FiChevronRight className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitDisabled()} className="custom-button bg-primary text-white">
              Create Workspace
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  )
}