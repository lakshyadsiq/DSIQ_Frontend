"use client"

import { useState, useEffect } from "react"
import { Button } from "@progress/kendo-react-buttons"
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle, CardActions } from "@progress/kendo-react-layout"
import { Checkbox } from "@progress/kendo-react-inputs"
import { ProgressBar } from "@progress/kendo-react-progressbars"
import { Input } from "@progress/kendo-react-inputs"
import { FiSearch, FiChevronRight, FiChevronLeft, FiCheck, FiShoppingBag } from "react-icons/fi"

export default function WorkspaceCreation() {
  const [step, setStep] = useState(1)
  const [selectedRetailers, setSelectedRetailers] = useState([])
  const [selectedCategories, setSelectedCategories] = useState({})
  const [selectedBrands, setSelectedBrands] = useState({})
  const [activeRetailer, setActiveRetailer] = useState(null) // For Categories step
  const [activeCategory, setActiveCategory] = useState(null) // For Brands step

  const [retailerSearch, setRetailerSearch] = useState("")
  const [categorySearches, setCategorySearches] = useState({})
  const [brandSearches, setBrandSearches] = useState({})

  // Initialize category searches when selected retailers change
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

    // Set the first selected retailer as active by default
    if (selectedRetailers.length > 0 && !activeRetailer) {
      setActiveRetailer(selectedRetailers[0])
    }
  }, [selectedRetailers, categorySearches, activeRetailer])

  // Initialize brand searches when selected categories change
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

    // Set the first selected category as active by default
    if (selectedCategoriesFlat.length > 0 && !activeCategory) {
      setActiveCategory(selectedCategoriesFlat[0])
    }
  }, [selectedCategories, brandSearches, activeCategory])

  // Sample data
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

      // Reset active retailer if it was deselected
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

      // Reset active category if it was deselected
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

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = () => {
    console.log("Workspace created with:", {
      retailers: selectedRetailers,
      categories: selectedCategories,
      brands: selectedBrands,
    })
    alert("Workspace created successfully!")
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
      <div className="space-y-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search retailers..."
            value={retailerSearch}
            onChange={(e) => setRetailerSearch(e.value)}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>

        {filteredRetailers.length === 0 ? (
          <p className="text-sm text-muted py-2">No retailers found matching your search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRetailers.map((retailer) => (
              <div key={retailer.id} className="flex items-start space-x-3 space-y-0">
                <Checkbox
                  id={retailer.id}
                  checked={selectedRetailers.includes(retailer.id)}
                  onChange={(e) => handleRetailerChange(retailer.id, e.value)}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor={retailer.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {retailer.name}
                  </label>
                </div>
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
      <div className="flex space-x-4">
        {/* Left Panel: Selected Retailers List */}
        <div className="w-1/3 bg-gray-100 p-4 rounded-md">
          <h3 className="font-medium mb-3">Retailers</h3>
          <div className="space-y-2">
            {selectedRetailers.map((retailerId) => {
              const retailer = retailers.find((r) => r.id === retailerId)
              return (
                <div
                  key={retailerId}
                  className={`p-2 cursor-pointer rounded ${
                    activeRetailer === retailerId ? "bg-gray-200" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveRetailer(retailerId)}
                >
                  {retailer?.name}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Panel: Categories for Active Retailer */}
        {activeRetailer && (
          <div className="w-2/3">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={`Search ${retailers.find((r) => r.id === activeRetailer)?.name} categories...`}
                value={categorySearches[activeRetailer] || ""}
                onChange={(e) =>
                  setCategorySearches({
                    ...categorySearches,
                    [activeRetailer]: e.value,
                  })
                }
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(categories[activeRetailer] || [])
                .filter((category) =>
                  category.name.toLowerCase().includes((categorySearches[activeRetailer] || "").toLowerCase()),
                )
                .map((category) => (
                  <div key={category.id} className="flex items-start space-x-3 space-y-0">
                    <Checkbox
                      id={`${activeRetailer}-${category.id}`}
                      checked={(selectedCategories[activeRetailer] || []).includes(category.id)}
                      onChange={(e) => handleCategoryChange(activeRetailer, category.id, e.value)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`${activeRetailer}-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
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
      <div className="flex space-x-4">
        {/* Left Panel: Selected Categories List */}
        <div className="w-1/3 bg-gray-100 p-4 rounded-md">
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-2">
            {selectedCategoriesFlat.map((categoryId) => {
              const categoryName = Object.values(categories)
                .flat()
                .find((c) => c.id === categoryId)?.name
              return (
                <div
                  key={categoryId}
                  className={`p-2 cursor-pointer rounded ${
                    activeCategory === categoryId ? "bg-gray-200" : "hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveCategory(categoryId)}
                >
                  {categoryName}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Panel: Brands for Active Category */}
        {activeCategory && (
          <div className="w-2/3">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={`Search ${
                  Object.values(categories).flat().find((c) => c.id === activeCategory)?.name
                } brands...`}
                value={brandSearches[activeCategory] || ""}
                onChange={(e) =>
                  setBrandSearches({
                    ...brandSearches,
                    [activeCategory]: e.value,
                  })
                }
                style={{ paddingLeft: "2.5rem" }}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(brands[activeCategory] || [])
                .filter((brand) =>
                  brand.toLowerCase().includes((brandSearches[activeCategory] || "").toLowerCase()),
                )
                .map((brand) => (
                  <div key={`${activeCategory}-${brand}`} className="flex items-start space-x-3 space-y-0">
                    <Checkbox
                      id={`${activeCategory}-${brand}`}
                      checked={(selectedBrands[activeCategory] || []).includes(brand)}
                      onChange={(e) => handleBrandChange(activeCategory, brand, e.value)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`${activeCategory}-${brand}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {brand}
                      </label>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const isNextDisabled = () => {
    if (step === 1) return selectedRetailers.length === 0
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

    return selectedCategoriesFlat.some(
      (categoryId) => !selectedBrands[categoryId] || selectedBrands[categoryId].length === 0,
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Your Workspace</CardTitle>
          <CardSubtitle>Set up your workspace by selecting retailers, categories, and brands</CardSubtitle>
          <div className="mt-4 space-y-2">
            <ProgressBar value={getProgressValue()} style={{ height: "2px" }} />
            <div className="flex justify-between text-sm text-muted">
              <div className={`flex items-center gap-1 ${step >= 1 ? "text-primary font-medium" : ""}`}>
                {step >= 1 && <FiCheck className="h-4 w-4" />} Retailers
              </div>
              <div className={`flex items-center gap-1 ${step >= 2 ? "text-primary font-medium" : ""}`}>
                {step >= 2 && <FiCheck className="h-4 w-4" />} Categories
              </div>
              <div className={`flex items-center gap-1 ${step >= 3 ? "text-primary font-medium" : ""}`}>
                {step >= 3 && <FiCheck className="h-4 w-4" />} Brands
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Select Online Retailers</h2>
              {renderRetailerStep()}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Select Categories</h2>
              {renderCategoryStep()}
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-4">Select Brands</h2>
              {renderBrandStep()}
            </>
          )}
        </CardBody>
        <CardActions className="flex justify-between">
          {step > 1 ? (
            <Button onClick={prevStep} look="outline">
              <FiChevronLeft className="mr-2" /> Back
            </Button>
          ) : (
            <div></div>
          )}

          {step < 3 ? (
            <Button onClick={nextStep} disabled={isNextDisabled()}>
              Next <FiChevronRight className="ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitDisabled()}>
              Create Workspace
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  )
}