import { useState, useEffect } from "react"
import {
    Search,
    Plus,
    Grid,
    List,
    Edit,
    Trash,
    Share2,
    DollarSign,
    LineChart,
    Megaphone,
    Package,
    Globe,
    Briefcase,
    Filter,
    ChevronDown,
    Clock,
    Tag
} from "lucide-react"

import {
    Button,
    DropDownButton,
    DropDownButtonItem,
    Input,
    DropDownList,
    Pager,
    Tooltip
} from "@progress/kendo-react-all"
import "@progress/kendo-theme-default/dist/all.css"
import Navbar from "../components/Navbar"
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
        },
        {
            id: "2",
            title: "Marketing Campaign Q2",
            category: "Marketing",
            icon: <Megaphone className="h-5 w-5 text-white" />,
            brands: ["Nike", "Adidas"],
            retailer: "SportsDirect",
            modified: "2025-05-05",
        },
        {
            id: "3",
            title: "Product Launch 2025",
            category: "Product",
            icon: <Package className="h-5 w-5 text-white" />,
            brands: ["Apple"],
            retailer: "BestBuy",
            modified: "2025-05-01",
        },
        {
            id: "4",
            title: "Q3 Financial Planning",
            category: "Finance",
            icon: <DollarSign className="h-5 w-5 text-white" />,
            brands: ["Chase", "Wells Fargo"],
            retailer: "Banking Services",
            modified: "2025-04-30",
        },
        {
            id: "5",
            title: "Summer Sales Strategy",
            category: "Sales",
            icon: <LineChart className="h-5 w-5 text-white" />,
            brands: ["Zara", "H&M"],
            retailer: "Mall of America",
            modified: "2025-04-28",
        },
        {
            id: "6",
            title: "Website Redesign",
            category: "Design",
            icon: <Globe className="h-5 w-5 text-white" />,
            brands: ["Microsoft"],
            retailer: "Microsoft Store",
            modified: "2025-05-06",
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
    const itemsPerPage = 6
    const navigate = useNavigate()

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
    }, [workspaces, searchQuery, sortBy, category])

    // Pagination
    const totalPages = Math.ceil(filteredWorkspaces.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedWorkspaces = filteredWorkspaces.slice(startIndex, startIndex + itemsPerPage)

    // Handle workspace actions
    const handleEdit = (id) => {
        console.log(`Editing workspace ${id}`)
    }

    const handleDelete = (id) => {
        setWorkspaces(workspaces.filter((workspace) => workspace.id !== id))
    }

    const handleShare = (id) => {
        console.log(`Sharing workspace ${id}`)
    }

    const handleCreateWorkspace = () => {
        console.log("Creating new workspace")
        navigate("/workspaceCreate")
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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

    const handlePageChange = (event) => {
        setCurrentPage(event.page)
    }

    const toggleFilters = () => {
        setIsFiltersOpen(!isFiltersOpen)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Navbar isLoggedIn={isLoggedIn} />
            <header className="bg-gradient-to-r from-purple-700 to-indigo-800 py-8 px-8 shadow-md">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <h1 className="text-3xl font-bold text-white">Workspaces</h1>
                            <p className="text-purple-100">Manage and organize your workspace collections</p>
                        </div>
                        <Button
                            onClick={handleCreateWorkspace}
                            themeColor="light"
                            className="!flex !flex-col !items-center !justify-center !gap-2 bg-white !text-purple-700 !font-medium !px-4 !py-2.5 !rounded-lg !shadow-sm !hover:bg-purple-50 !transition-colors !duration-200 !border !border-purple-200"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Create New Workspace</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-8 px-4">
                {/* Search and filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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


                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                look="outline"
                                className="!flex !flex-col !items-center !gap-2 !border-gray-300 !text-gray-700 !px-4 !py-2.5 !rounded-lg !hover:bg-gray-50 !transition-colors !duration-200"
                                onClick={toggleFilters}
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filters</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                            </Button>

                            <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                <Tooltip content="Grid view" position="top">
                                    <button
                                        className={`!p-2.5 ${viewMode === "grid" ? "!bg-purple-100 !text-purple-700" : "!bg-white !text-gray-500 !hover:bg-gray-50"}`}
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid className="h-4 w-4" />
                                    </button>
                                </Tooltip>
                                <Tooltip content="List view" position="top">
                                    <button
                                        className={`!p-2.5 ${viewMode === "list" ? "!bg-purple-100 !text-purple-700" : "!bg-white !text-gray-500 !hover:bg-gray-50"}`}
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
                </div>

                {/* Summary stats */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {filteredWorkspaces.length} {filteredWorkspaces.length === 1 ? 'Workspace' : 'Workspaces'}
                        {category !== 'all' && ` in ${category.charAt(0).toUpperCase() + category.slice(1)}`}
                    </h2>

                    {sortBy && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                            <span>Sorted by:</span>
                            <span className="font-medium text-gray-700">
                                {sortOptions.find(opt => opt.value === sortBy)?.text}
                            </span>
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
                                }`}
                        >
                            <div className={`${viewMode === "list" ? "flex items-center gap-4 flex-1 p-4" : "p-5"}`}>
                                <div className={`flex items-center gap-4 ${viewMode === "grid" ? "mb-4" : ""}`}>
                                    <div
                                        className={`${getIconBackground(workspace.category)} rounded-lg p-3 flex items-center justify-center`}
                                    >
                                        {workspace.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-semibold text-lg text-gray-900 truncate">{workspace.title}</h3>

                                            {/* we can add country flag */}
                                            
                                            {/* <DropDownButton
                                                icon="more-vertical"
                                                iconClass="k-icon k-i-more-vertical"
                                                className="!k-button-md !k-button-flat !k-button-flat-base !-mr-2 !-mt-1"
                                            >
                                                <DropDownButtonItem text="Edit" icon="edit" onClick={() => handleEdit(workspace.id)} />
                                                <DropDownButtonItem text="Share" icon="share" onClick={() => handleShare(workspace.id)} />
                                                <DropDownButtonItem text="Delete" icon="trash" onClick={() => handleDelete(workspace.id)} />
                                            </DropDownButton> */}
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
                                            <span>Modified:</span>
                                            <span className="font-medium">{formatDate(workspace.modified)}</span>
                                        </div>
                                    </div>
                                )}

                                {viewMode === "list" && (
                                    <div className="flex gap-6 ml-12 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Tag className="h-3 w-3 text-gray-400" />
                                            <span className="text-gray-600">{workspace.brands.join(", ")}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="h-3 w-3 text-gray-400" />
                                            <span className="text-gray-600">{workspace.retailer}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-gray-400" />
                                            <span className="text-gray-600">{formatDate(workspace.modified)}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className={`flex ${viewMode === "grid" ? "justify-end px-5 pb-4" : "pr-4"}`}>
                                <Tooltip content="Edit" position="top">
                                    <Button
                                        look="flat"
                                        onClick={() => handleEdit(workspace.id)}
                                        className="!k-button-md !text-gray-600 !hover:text-purple-700 !hover:bg-purple-50"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Share" position="top">
                                    <Button
                                        look="flat"
                                        onClick={() => handleShare(workspace.id)}
                                        className="!k-button-md !text-gray-600 !hover:text-purple-700 !hover:bg-purple-50"
                                    >
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Delete" position="top">
                                    <Button
                                        look="flat"
                                        onClick={() => handleDelete(workspace.id)}
                                        className="!k-button-md !text-gray-600 !hover:text-red-600 !hover:bg-red-50"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {filteredWorkspaces.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No workspaces found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            We couldn't find any workspaces matching your search criteria. Try adjusting your filters or create a new workspace.
                        </p>
                        <Button
                            themeColor="primary"
                            className="!mt-6 !bg-purple-600 !hover:bg-purple-700"
                            onClick={handleCreateWorkspace}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Workspace
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {filteredWorkspaces.length > 0 && (
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-8 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                            Showing {startIndex + 1} of {filteredWorkspaces.length} workspaces
                        </p>
                        <Pager
                            total={filteredWorkspaces.length}
                            skip={(currentPage - 1) * itemsPerPage}
                            take={itemsPerPage}
                            onPageChange={handlePageChange}
                            buttonCount={5}
                            info={false}
                            className="!k-pager-md"
                        />
                    </div>
                )}
            </main>
        </div>
    )
}