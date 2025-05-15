"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux" // Import Redux hooks
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
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import Footer from "../components/Footer"

// Import Redux actions and selectors
import {
  fetchWorkspaces,
  archiveWorkspace,
  restoreWorkspace,
  setSearchQuery,
  setSortBy,
  setCategoryFilter,
  setViewMode,
  toggleFilters,
  toggleShowArchived,
  setCurrentPage,
  applyFiltersAndSort,
  selectPaginatedWorkspaces,
  selectTotalPages,
  selectWorkspaceViewStatus,
  selectWorkspaceViewError,
  selectSearchQuery,
  selectSortBy,
  selectCategoryFilter,
  selectViewMode,
  selectIsFiltersOpen,
  selectShowArchived,
  selectCurrentPage,
  selectCategories,
} from "../redux/slices/workspaceViewSlice"

// Custom Tooltip component
const Tooltip = ({ content, position = "top", children }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-10 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded shadow-sm whitespace-nowrap
          ${position === "top" ? "bottom-full mb-1 left-1/2 transform -translate-x-1/2" : ""}
          ${position === "bottom" ? "top-full mt-1 left-1/2 transform -translate-x-1/2" : ""}
          ${position === "left" ? "right-full mr-1 top-1/2 transform -translate-y-1/2" : ""}
          ${position === "right" ? "left-full ml-1 top-1/2 transform -translate-y-1/2" : ""}
        `}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-800 transform rotate-45
            ${position === "top" ? "top-full -mt-1 left-1/2 -ml-1" : ""}
            ${position === "bottom" ? "bottom-full -mb-1 left-1/2 -ml-1" : ""}
            ${position === "left" ? "left-full -ml-1 top-1/2 -mt-1" : ""}
            ${position === "right" ? "right-full -mr-1 top-1/2 -mt-1" : ""}
          `}
          ></div>
        </div>
      )}
    </div>
  )
}

// Custom Dropdown component with animations
const CustomDropdown = ({ data, value, onChange, textField = "text", dataItemKey = "value" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const selectedItem = data.find((item) => item[dataItemKey] === value)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2.5 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedItem ? selectedItem[textField] : "Select..."}</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <div
        className={`absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden transition-all duration-300 origin-top ${
          isOpen ? "opacity-100 transform scale-y-100 max-h-60" : "opacity-0 transform scale-y-0 max-h-0"
        }`}
      >
        <div className="max-h-60 overflow-y-auto">
          {data.map((item, index) => (
            <div
              key={index}
              className={`px-4 py-2.5 cursor-pointer hover:bg-purple-50 transition-colors ${
                item[dataItemKey] === value ? "bg-purple-100 text-purple-700" : "text-gray-700"
              }`}
              onClick={() => {
                onChange({ value: item })
                setIsOpen(false)
              }}
            >
              {item[textField]}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WorkspacesPage({ isLoggedIn }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Get data from Redux store
  const paginatedWorkspaces = useSelector(selectPaginatedWorkspaces)
  const totalPages = useSelector(selectTotalPages)
  const status = useSelector(selectWorkspaceViewStatus)
  const error = useSelector(selectWorkspaceViewError)
  const searchQuery = useSelector(selectSearchQuery)
  const sortBy = useSelector(selectSortBy)
  const category = useSelector(selectCategoryFilter)
  const viewMode = useSelector(selectViewMode)
  const isFiltersOpen = useSelector(selectIsFiltersOpen)
  const showArchived = useSelector(selectShowArchived)
  const currentPage = useSelector(selectCurrentPage)
  const categories = useSelector(selectCategories)

  // Fetch workspaces when component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchWorkspaces())
    }
  }, [dispatch, status])

  // Apply filters and sorting whenever relevant parameters change
  useEffect(() => {
    dispatch(applyFiltersAndSort())
  }, [dispatch, searchQuery, sortBy, category, showArchived])

  // Get category items for dropdown
  const categoryData = [{ text: "All Categories", value: "all" }, ...categories.filter((cat) => cat.value !== "all")]

  const sortOptions = [
    { text: "Name", value: "name" },
    { text: "Date Modified", value: "date" },
    { text: "Retailer", value: "retailer" },
  ]

  // Handle workspace actions
  const handleEdit = (id) => {
    console.log(`Editing workspace ${id}`)
    navigate(`/ModifyWorkspace/${id}`)
  }

  const handleArchive = (id) => {
    dispatch(archiveWorkspace(id))
      .unwrap()
      .then(() => {
        toast.success("Workspace archived successfully!", {
          icon: <MdArchive className="text-blue-500" />,
          position: "top-center",
          duration: 3000,
        })
      })
      .catch((err) => {
        toast.error("Failed to archive workspace")
        console.error("Error archiving workspace:", err)
      })
  }

  const handleRestore = (id) => {
    dispatch(restoreWorkspace(id))
      .unwrap()
      .then(() => {
        toast.success("Workspace restored successfully!", {
          position: "top-center",
          duration: 3000,
          icon: <Package className="text-green-500" />,
        })
      })
      .catch((err) => {
        toast.error("Failed to restore workspace")
        console.error("Error restoring workspace:", err)
      })
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

  const getWorkspaceIcon = (category) => {
    const icons = {
      Research: <Briefcase className="h-5 w-5 text-white" />,
      Marketing: <Megaphone className="h-5 w-5 text-white" />,
      Product: <Package className="h-5 w-5 text-white" />,
      Finance: <DollarSign className="h-5 w-5 text-white" />,
      Sales: <LineChart className="h-5 w-5 text-white" />,
      Design: <Globe className="h-5 w-5 text-white" />,
    }
    return icons[category] || <Briefcase className="h-5 w-5 text-white" />
  }

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page))
  }

  const handleBack = () => {
    navigate(-1)
  }

  // Show loading state
  if (status === "loading" && paginatedWorkspaces.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading workspaces...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (status === "failed") {
    return (
      <div className="min-h-[80vh] bg-gray-50 flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to load workspaces</h3>
          <p className="text-gray-600 mb-4">{error || "An unexpected error occurred."}</p>
          <button
            onClick={() => dispatch(fetchWorkspaces())}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[100vh] bg-gray-50 flex flex-col overflow-auto border ">
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
      <main className="flex-grow w-[calc(90vw-256px)] mx-auto py-8 px-4">
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
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
            </div>

            {/* Filters + View Modes */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                className="flex flex-row items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={() => dispatch(toggleFilters())}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? "rotate-180" : ""}`} />
              </button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <Tooltip content="Grid view" position="top">
                  <button
                    className={`p-2.5 ${viewMode === "grid" ? "bg-purple-100 text-purple-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    onClick={() => dispatch(setViewMode("grid"))}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </Tooltip>
                <Tooltip content="List view" position="top">
                  <button
                    className={`p-2.5 ${viewMode === "list" ? "bg-purple-100 text-purple-700" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                    onClick={() => dispatch(setViewMode("list"))}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Expanded filters */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isFiltersOpen ? "max-h-96 opacity-100 pt-4 border-t mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transform transition-transform duration-300 ${
                isFiltersOpen ? "translate-y-0" : "-translate-y-4"
              }`}
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Sort by</label>
                <CustomDropdown
                  data={sortOptions}
                  value={sortBy}
                  onChange={(e) => dispatch(setSortBy(e.value.value))}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <CustomDropdown
                  data={categoryData}
                  value={category}
                  onChange={(e) => dispatch(setCategoryFilter(e.value.value))}
                />
              </div>
            </div>
          </div>

          {/* Archived Workspaces Toggle */}
          <div className="pt-4 mt-4 border-t">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="text-sm font-semibold text-gray-700">Archived Workspaces</label>
                <p className="text-xs text-gray-500 italic mt-1">
                  {showArchived
                    ? "Showing archived workspaces in the list."
                    : "Archived workspaces are currently hidden."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => dispatch(toggleShowArchived())}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition
                ${
                  showArchived
                    ? "bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                }
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1`}
              >
                <MdArchive className={`h-5 w-5 ${showArchived ? "text-purple-600" : "text-gray-400"}`} />
                {showArchived ? "Hide Archived" : "Show Archived"}
              </button>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {paginatedWorkspaces.length} {paginatedWorkspaces.length === 1 ? "Workspace" : "Workspaces"}
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
          {paginatedWorkspaces.map((index, workspace) => (
            <div
              key={index}
              className={`bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${
                viewMode === "list" ? "flex justify-between items-center" : ""
              } ${workspace.archived ? "opacity-75 border-dashed" : ""}`}
            >
              <div className={`${viewMode === "list" ? "flex items-center gap-4 flex-1 p-4" : "p-5"}`}>
                <div className={`flex items-center gap-4 ${viewMode === "grid" ? "mb-4" : ""}`}>
                  <div
                    className={`${getIconBackground(workspace.category)} rounded-lg p-3 flex items-center justify-center ${
                      workspace.archived ? "opacity-80" : ""
                    }`}
                  >
                    {getWorkspaceIcon(workspace.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-semibold text-lg text-gray-900 truncate ${
                          workspace.archived ? "line-through" : ""
                        }`}
                      >
                        {workspace.name}
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
                      <span className="font-medium">
                        {Object.values(workspace.brands || {})
                          .flat()
                          .slice(0, 3)
                          .join(", ")}
                        {Object.values(workspace.brands || {}).flat().length > 3 && "..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span>Retailers:</span>
                      <span className="font-medium">
                        {workspace.retailers?.slice(0, 2).join(", ")}
                        {workspace.retailers?.length > 2 && "..."}
                      </span>
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
                      <Edit className={`h-4 w-4 ${workspace.archived ? "text-gray-400" : "text-gray-500"}`} />
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
                      onClick={() => (workspace.archived ? handleRestore(workspace.id) : handleArchive(workspace.id))}
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

        {/* No workspaces message */}
        {paginatedWorkspaces.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No workspaces found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || category !== "all"
                ? "Try adjusting your filters or search query"
                : "Create your first workspace to get started"}
            </p>
            {(searchQuery || category !== "all") && (
              <button
                onClick={() => {
                  dispatch(setSearchQuery(""))
                  dispatch(setCategoryFilter("all"))
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            {/* First */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1
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
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
            >
              Prev
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
              // Logic for showing pages around current page
              let pageNum
              if (totalPages <= 5) {
                pageNum = idx + 1
              } else if (currentPage <= 3) {
                pageNum = idx + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx
              } else {
                pageNum = currentPage - 2 + idx
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    currentPage === pageNum
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages
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
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
            >
              Last
            </button>
          </div>
        )}
      </main>
      <Footer isLoggedIn={isLoggedIn} />
    </div>
  )
}
