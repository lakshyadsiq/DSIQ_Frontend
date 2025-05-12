"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Save,
  Briefcase,
  Megaphone,
  Package,
  DollarSign,
  LineChart,
  Globe,
  Tag,
  Calendar,
  X,
  PlusCircle,
} from "lucide-react"

import { 
  Button, 
  Input, 
  TextArea, 
  DropDownList, 
  Notification, 
  NotificationGroup 
} from "@progress/kendo-react-all"
import "@progress/kendo-theme-default/dist/all.css"
import { useNavigate, useParams } from "react-router-dom"

export default function WorkspaceModifyPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // Category options
  const categories = [
    { text: "Research", value: "Research", icon: <Briefcase className="h-5 w-5 text-white" /> },
    { text: "Marketing", value: "Marketing", icon: <Megaphone className="h-5 w-5 text-white" /> },
    { text: "Product", value: "Product", icon: <Package className="h-5 w-5 text-white" /> },
    { text: "Finance", value: "Finance", icon: <DollarSign className="h-5 w-5 text-white" /> },
    { text: "Sales", value: "Sales", icon: <LineChart className="h-5 w-5 text-white" /> },
    { text: "Design", value: "Design", icon: <Globe className="h-5 w-5 text-white" /> },
  ]

  // Sample data for the workspace being edited
  const [workspace, setWorkspace] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    brands: [],
    retailer: "",
    modified: new Date().toISOString().split('T')[0],
  })

  const [newBrand, setNewBrand] = useState("")
  const [notification, setNotification] = useState({ visible: false, type: "", message: "" })

  // Fetch workspace data based on ID
  useEffect(() => {
    // Simulating API fetch
    const fetchWorkspace = () => {
      // This would be replaced with an actual API call
      const workspaces = [
        {
          id: "1",
          title: "Customer Satisfaction Survey",
          description: "Analyzing customer feedback from recent electronic product purchases.",
          category: "Research",
          brands: ["Samsung", "LG"],
          retailer: "Electronics Hub",
          modified: "2025-05-02",
        },
        {
          id: "2",
          title: "Marketing Campaign Q2",
          description: "Planning for second quarter sports apparel marketing initiatives.",
          category: "Marketing",
          brands: ["Nike", "Adidas"],
          retailer: "SportsDirect",
          modified: "2025-05-05",
        },
        {
          id: "3",
          title: "Product Launch 2025",
          description: "Strategy and timeline for upcoming flagship product release.",
          category: "Product",
          brands: ["Apple"],
          retailer: "BestBuy",
          modified: "2025-05-01",
        },
      ]

      const foundWorkspace = workspaces.find(w => w.id === id)
      if (foundWorkspace) {
        setWorkspace(foundWorkspace)
      } else {
        // If creating new workspace
        setWorkspace({
          id: Math.random().toString(36).substr(2, 9),
          title: "",
          description: "",
          category: "Research",
          brands: [],
          retailer: "",
          modified: new Date().toISOString().split('T')[0],
        })
      }
    }

    fetchWorkspace()
  }, [id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setWorkspace({ ...workspace, [name]: value })
  }

  const handleCategoryChange = (e) => {
    setWorkspace({ ...workspace, category: e.value.value })
  }

  const handleAddBrand = () => {
    if (newBrand && !workspace.brands.includes(newBrand)) {
      setWorkspace({ ...workspace, brands: [...workspace.brands, newBrand] })
      setNewBrand("")
    }
  }

  const handleRemoveBrand = (brand) => {
    setWorkspace({ 
      ...workspace, 
      brands: workspace.brands.filter(b => b !== brand) 
    })
  }

  const handleSave = () => {
    // This would be replaced with an actual API call
    console.log("Saving workspace:", workspace)
    
    // Update modified date
    const updatedWorkspace = {
      ...workspace,
      modified: new Date().toISOString().split('T')[0]
    }
    
    // Show success notification
    setNotification({
      visible: true,
      type: "success",
      message: "Workspace successfully saved!"
    })
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ visible: false, type: "", message: "" })
      // Navigate back to workspaces page
      navigate('/workspaces')
    }, 3000)
  }

  const handleBack = () => {
    navigate(-1)
  }

  const getIconBackground = (category) => {
    const colors = {
      Research: "bg-indigo-600",
      Marketing: "bg-green-600",
      Product: "bg-blue-600",
      Finance: "bg-amber-600",
      Sales: "bg-rose-600",
      Design: "bg-violet-600",
    }

    return colors[category] || "bg-gray-600"
  }

  const selectedCategory = categories.find(c => c.value === workspace.category)

  return (
    <div className="min-h-[80vh] bg-gray-50 flex-1 overflow-auto border">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 py-2 px-8 shadow-md">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center gap-2 text-white hover:text-purple-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Workspaces</span>
        </button>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white">
                {id ? "Modify Workspace" : "Create Workspace"}
              </h1>
              <p className="text-purple-100">
                {id ? "Update workspace details" : "Create a new workspace"}
              </p>
            </div>
            <button
              onClick={handleSave}
              className="!flex !items-center !justify-center !gap-2 !bg-white !text-purple-700 !font-medium !px-4 !py-2.5 !rounded-lg !shadow-sm !hover:bg-purple-50 !transition-colors !duration-200 !border !border-purple-200 !text-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Workspace</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          {/* Workspace details form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Title</label>
              <Input
                name="title"
                value={workspace.title}
                onChange={handleInputChange}
                placeholder="Enter workspace title"
                className="!w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <TextArea
                name="description"
                value={workspace.description}
                onChange={handleInputChange}
                placeholder="Enter workspace description"
                rows={3}
                className="!w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <DropDownList
                data={categories}
                textField="text"
                dataItemKey="value"
                value={selectedCategory}
                onChange={handleCategoryChange}
                itemRender={(li, itemProps) => {
                  const category = itemProps.dataItem;
                  return (
                    <div className="flex items-center gap-3 p-1">
                      <div className={`${getIconBackground(category.value)} rounded-lg p-2 flex items-center justify-center`}>
                        {category.icon}
                      </div>
                      <span>{category.text}</span>
                    </div>
                  );
                }}
                className="!w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Retailer</label>
              <Input
                name="retailer"
                value={workspace.retailer}
                onChange={handleInputChange}
                placeholder="Enter retailer name"
                className="!w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Brands</label>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {workspace.brands.map((brand, index) => (
                  <div 
                    key={index} 
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{brand}</span>
                    <button 
                      onClick={() => handleRemoveBrand(brand)}
                      className="ml-1 text-purple-500 hover:text-purple-700"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Add a brand"
                  className="!flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
                />
                <Button
                  onClick={handleAddBrand}
                  disabled={!newBrand}
                  className="!bg-purple-600 !text-white !hover:bg-purple-700"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          <Button
            look="outline"
            onClick={handleBack}
            className="!border-gray-300 !text-gray-700 !hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            themeColor="primary"
            onClick={handleSave}
            className="!bg-purple-600 !hover:bg-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Workspace
          </Button>
        </div>
      </main>

      {/* Notifications */}
      <NotificationGroup
        style={{
          position: 'fixed',
          right: 16,
          bottom: 16,
        }}
      >
        {notification.visible && (
          <Notification
            type={notification.type}
            closable={true}
            onClose={() => setNotification({ visible: false, type: "", message: "" })}
          >
            <span>{notification.message}</span>
          </Notification>
        )}
      </NotificationGroup>
    </div>
  )
}