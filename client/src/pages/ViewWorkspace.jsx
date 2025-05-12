import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  Grid,
  List,
  Edit,
  DollarSign,
  LineChart,
  Megaphone,
  Package,
  Globe,
  Briefcase,
  Filter,
  ChevronDown,
  Clock,
  Tag,
  ArrowLeft,
} from "lucide-react"
import { MdArchive } from "react-icons/md"
import toast from 'react-hot-toast';
import {
  DropDownList,
  Tooltip
} from "@progress/kendo-react-all"
import "@progress/kendo-theme-default/dist/all.css"
import { useNavigate } from "react-router-dom"

export default function WorkspacesPage(isLoggedIn) {
  // Sample data
  const initialWorkspaces = [
    {
      id: "1",
      title: "Customer Satisfaction Survey",
      category: "Research",
      icon: <Briefcase className="h-5 w-5 text-white" />,
      brands: ["Samsung", "LG"],
      retailer: "Electronics Hub",
      modified: "2025-05-02",
      archived: false,
    },
    {
      id: "2",
      title: "Marketing Campaign Q2",
      category: "Marketing",
      icon: <Megaphone className="h-5 w-5 text-white" />,
      brands: ["Nike", "Adidas"],
      retailer: "SportsDirect",
      modified: "2025-05-05",
      archived: false,
    },
    {
      id: "3",
      title: "Product Launch 2025",
      category: "Product",
      icon: <Package className="h-5 w-5 text-white" />,
      brands: ["Apple"],
      retailer: "BestBuy",
      modified: "2025-05-01",
      archived: false,
    },
    {
      id: "4",
      title: "Q3 Financial Planning",
      category: "Finance",
      icon: <DollarSign className="h-5 w-5 text-white" />,
      brands: ["Chase", "Wells Fargo"],
      retailer: "Banking Services",
      modified: "2025-04-30",
      archived: false,
    },
    {
      id: "5",
      title: "Summer Sales Strategy",
      category: "Sales",
      icon: <LineChart className="h-5 w-5 text-white" />,
      brands: ["Zara", "H&M"],
      retailer: "Mall of America",
      modified: "2025-04-28",
      archived: false,
    },
    {
      id: "6",
      title: "Website Redesign",
      category: "Design",
      icon: <Globe className="h-5 w-5 text-white" />,
      brands: ["Microsoft"],
      retailer: "Microsoft Store",
      modified: "2025-05-06",
      archived: false,
    },
  ]

  // State variables
  const [workspaces, setWorkspaces] = useState(initialWorkspaces)
  const [filteredWorkspaces, setFilteredWorkspaces] = useState(initialWorkspaces)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [category, setCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const itemsPerPage = 6
  const navigate = useNavigate()
  
  // fetchWorkspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await axios.get('/api/workspaces'); // Replace with your real endpoint
        setWorkspaces(response.data);
        console.log("Fetched workspaces:", response.data);
      } catch (error) {
        toast.error("Failed to load workspaces.");
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, []);

  // Get all unique categories
  const categories = ["all", ...Array.from(new Set(workspaces.map((w) => w.category.toLowerCase())))]
  const categoryData = categories.map((cat) => ({
    text: cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1),
    value: cat,
  }))

  const sortOptions = [
    { text: "Name", value: "name" },
    { text: "Date Modified", value: "date" },
    { text: "Category", value: "category" },
  ]

  // Filter and sort workspaces
  useEffect(() => {
    let result = [...workspaces]

    // Apply archive filter
    if (!showArchived) {
      result = result.filter(workspace => !workspace.archived)
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (workspace) =>
          workspace.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          workspace.brands.some((brand) => brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
          workspace.retailer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (category !== "all") {
      result = result.filter((workspace) => workspace.category.toLowerCase() === category.toLowerCase())
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.title.localeCompare(b.title)
      } else if (sortBy === "date") {
        return new Date(b.modified).getTime() - new Date(a.modified).getTime()
      } else if (sortBy === "category") {
        return a.category.localeCompare(b.category)
      }
      return 0
    })

    setFilteredWorkspaces(result)
    setCurrentPage(1) // Reset to first page on filter change
  }, [workspaces, searchQuery, sortBy, category, showArchived])

  // PAGINATION LOGIC: define paginatedWorkspaces here!
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const paginatedWorkspaces = filteredWorkspaces.slice(startIdx, endIdx)
  const totalPages = Math.ceil(filteredWorkspaces.length / itemsPerPage)

  // Handle workspace actions
  const handleEdit = (id) => {
    console.log(`Editing workspace ${id}`)
  }

  const handleArchive = (id) => {
    setWorkspaces(workspaces.map(workspace =>
      workspace.id === id ? { ...workspace, archived: true } : workspace
    ));

    toast.success('Workspace archived successfully!', {
      icon: <MdArchive className="text-blue-500" />,
      position: 'top-center',
      duration: 3000,
    });
  };

  const handleRestore = (id) => {
    setWorkspaces(workspaces.map(workspace =>
      workspace.id === id ? { ...workspace, archived: false } : workspace
    ))
    toast.success('Workspace restored successfully!', {
      position: 'top-center',
      duration: 3000,
      icon: <Package className="text-green-500" />,
    })
  }

  const handleShare = (id) => {
    console.log(`Sharing workspace ${id}`)
  }

  const handleCreateWorkspace = () => {
    console.log("Creating new workspace")
    navigate("/workspaceCreate")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen)
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="min-h-[80vh] bg-gray-50 flex-1 overflow-auto border ">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 py-2 px-8 shadow-md">
        <button
          onClick={handleBack}
          className="mb-4 flex items-center gap-2 text-white hover:text-purple-200 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-white">Workspaces</h1>
              <p className="text-purple-100">Manage and organize your workspace collections</p>
            </div>
            <button
              onClick={handleCreateWorkspace}
              className="!flex  !items-center !justify-center !gap-2 !bg-white !text-purple-700 !font-medium !px-4 !py-2.5 !rounded-lg !shadow-sm !hover:bg-purple-50 !transition-colors !duration-200 !border !border-purple-200 !text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Workspace</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Search and filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            {/* Search Input */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, brand or retailer..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters + View Modes */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                className="flex flex-row items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleFilters}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`} />
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <Tooltip content="Grid view" position="top">
                  <button
                    className={`p-2.5 ${viewMode === "grid" ? "bg-purple-100 text-purple-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </Tooltip>
                <Tooltip content="List view" position="top">
                  <button
                    className={`p-2.5 ${viewMode === "list" ? "bg-purple-100 text-purple-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Expanded filters */}
          {isFiltersOpen && (
            <div className="pt-4 border-t mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by</label>
                <DropDownList
                  data={sortOptions}
                  textField="text"
                  dataItemKey="value"
                  value={sortOptions.find((item) => item.value === sortBy)}
                  onChange={(e) => setSortBy(e.value.value)}
                  style={{ width: "100%" }}
                  className="!w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <DropDownList
                  data={categoryData}
                  textField="text"
                  dataItemKey="value"
                  value={categoryData.find((item) => item.value === category)}
                  onChange={(e) => setCategory(e.value.value)}
                  style={{ width: "100%" }}
                  className="!w-full"
                />
              </div>
            </div>
          )}

          {/* Archived Workspaces Toggle */}
          <div className="pt-4 mt-4 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="text-sm font-semibold text-gray-700">Archived Workspaces</label>
                <p className="text-xs text-gray-500 italic mt-1">
                  {showArchived
                    ? 'Showing archived workspaces in the list.'
                    : 'Archived workspaces are currently hidden.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowArchived(!showArchived)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition
          ${showArchived
                    ? 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1`}
              >
                <MdArchive className={`h-5 w-5 ${showArchived ? 'text-purple-600' : 'text-gray-400'}`} />
                {showArchived ? 'Hide Archived' : 'Show Archived'}
              </button>
            </div>
          </div>
        </div>
        {/* Summary stats */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {filteredWorkspaces.length} {filteredWorkspaces.length === 1 ? "Workspace" : "Workspaces"}
            {category !== "all" && ` in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
            {showArchived && " (Including Archived)"}
          </h2>

          {sortBy && (
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <span>Sorted by:</span>
              <span className="font-medium text-gray-700">{sortOptions.find((opt) => opt.value === sortBy)?.text}</span>
            </div>
          )}
        </div>

        {/* Workspaces grid/list */}
        <div
          className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {paginatedWorkspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${viewMode === "list" ? "flex justify-between items-center" : ""
                } ${workspace.archived ? "opacity-75 border-dashed" : ""}`}
            >
              <div className={`${viewMode === "list" ? "flex items-center gap-4 flex-1 p-4" : "p-5"}`}>
                <div className={`flex items-center gap-4 ${viewMode === "grid" ? "mb-4" : ""}`}>
                  <div
                    className={`${getIconBackground(workspace.category)} rounded-lg p-3 flex items-center justify-center ${workspace.archived ? "opacity-80" : ""
                      }`}
                  >
                    {workspace.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold text-lg text-gray-900 truncate ${workspace.archived ? "line-through" : ""
                        }`}>
                        {workspace.title}
                        {workspace.archived && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                            Archived
                          </span>
                        )}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                      {workspace.category}
                    </span>
                  </div>
                </div>

                {viewMode === "grid" && (
                  <div className="space-y-3 mt-5 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Tag className="h-4 w-4 text-gray-400" />
                      <span>Brands:</span>
                      <span className="font-medium">{workspace.brands.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>Retailer:</span>
                      <span className="font-medium">{workspace.retailer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Last Modified:</span>
                      <span className="font-medium">{formatDate(workspace.modified)}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Actions */}
              <div className="flex flex-row items-center align-middle justify-center gap-2 p-2">
                <Tooltip
                  content={workspace.archived ? "Cannot Edit Archived Workspace" : "Modify Workspace Details"}
                  position="top"
                >
                  <div>
                    <button
                      className="p-2 rounded hover:bg-purple-50 flex items-center justify-center"
                      onClick={() => handleEdit(workspace.id)}
                      disabled={workspace.archived}
                    >
                      <Edit className={`h-4 w-4 ${workspace.archived ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                  </div>
                </Tooltip>

                <Tooltip
                  content={workspace.archived ? "Restore Workspace from Archive" : "Move Workspace to Archive"}
                  position="top"
                >
                  <div>
                    <button
                      className="p-2 rounded hover:bg-purple-50 flex items-center justify-center"
                      onClick={() =>
                        workspace.archived ? handleRestore(workspace.id) : handleArchive(workspace.id)
                      }
                    >
                      {workspace.archived ? (
                        <Package className="h-4 w-4 text-green-500" />
                      ) : (
                        <MdArchive className="h-4 w-4 text-blue-500" />
                      )}
                    </button>
                  </div>
                </Tooltip>

              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* First */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md text-sm ${currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
            >
              First
            </button>

            {/* Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md text-sm ${currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-3 py-1 border rounded-md text-sm font-medium ${currentPage === num
                  ? "bg-purple-600 text-white border-purple-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {num}
              </button>
            ))}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
            >
              Next
            </button>

            {/* Last */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
            >
              Last
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
