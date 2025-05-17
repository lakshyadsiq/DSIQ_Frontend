"use client"

import React, { useState, useRef, useCallback, memo } from "react"
import { Users, Edit2, RotateCcw, UserPlus, KeyRound, Download, Upload } from "lucide-react"
import { Archive } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid"
import { Slider, NumericTextBox } from "@progress/kendo-react-inputs"
import AddUser from "../components/AddUser"
import { process } from "@progress/kendo-data-query"
import UpdatePasswordModal from "../components/UpdatePasswordModal"

// Create memoized components for the editable cells
const EditableNameCell = memo(({ isEditing, value, onChange, onSave }) => {
  const inputRef = useRef(null)

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  if (!isEditing) return value

  return (
    <input
      ref={inputRef}
      type="text"
      className="w-full p-2 border rounded"
      value={value}
      onChange={(e) => onChange("name", e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSave()}
    />
  )
})

const EditableRoleCell = memo(({ isEditing, value, onChange, availableRoles, onSave }) => {
  if (!isEditing) return value

  return (
    <select
      className="w-full p-2 border rounded"
      value={value}
      onChange={(e) => onChange("Role", e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onSave()}
    >
      {availableRoles.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </select>
  )
})

const UsersList = () => {
  const availableRoles = [
    "Web Developer",
    "UX Designer",
    "Project Manager",
    "Software Engineer",
    "QA Engineer",
    "DevOps Engineer",
    "Product Owner",
    "Scrum Master",
  ]

  const [users, setUsers] = useState([
    { id: 1, name: "Gita Sharma", email: "lakshya@example.com", Role: "Web Developer", archived: false },
    { id: 2, name: "Ram Verma", email: "ram@example.com", Role: "UX Designer", archived: false },
    { id: 3, name: "Sita Sha", email: "sita@example.com", Role: "Project Manager", archived: false },
    { id: 4, name: "Shyam Sharma", email: "shyam@example.com", Role: "Software Engineer", archived: false },
  ])

  const [filter, setFilter] = useState({ logic: "and", filters: [] })
  const [sort, setSort] = useState([])
  const [group, setGroup] = useState([])
  const [page, setPage] = useState({ skip: 0, take: 10 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editUserId, setEditUserId] = useState(null)
  const [editForm, setEditForm] = useState({ name: "", Role: "" })
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [selectedUserForPassword, setSelectedUserForPassword] = useState(null)

  const handleEditChange = useCallback((field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleEditSave = useCallback(
    (id) => {
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, name: editForm.name, Role: editForm.Role } : user)),
      )
      setEditUserId(null)
      toast.success("User details updated successfully!")
    },
    [editForm],
  )

  // Custom pager component
  const MyPager = (props) => {
    const element = useRef(null)
    const currentPage = Math.floor(props.skip / props.take) + 1
    const totalPages = Math.ceil((props.total || 0) / props.take)

    const handleChange = (event) => {
      props.onPageChange?.({
        target: { element: element.current, props },
        skip: ((event.value ?? 1) - 1) * props.take,
        take: props.take,
        syntheticEvent: event.syntheticEvent,
        nativeEvent: event.nativeEvent,
        targetEvent: { value: event.value },
      })
    }

    return (
      <div
        ref={element}
        className="k-pager k-pager-md k-grid-pager"
        style={{ borderTop: "1px solid", borderTopColor: "inherit" }}
      >
        <div className="flex items-center justify-between p-2">
          <div className="flex-1">
            <Slider buttons={true} step={1} value={currentPage} min={1} max={totalPages} onChange={handleChange} />
          </div>
          <div className="flex-1 flex justify-center">
            <NumericTextBox value={currentPage} onChange={handleChange} min={1} max={totalPages} width={60} />
          </div>
          <div className="flex-1 text-right">{`Page ${currentPage} of ${totalPages}`}</div>
        </div>
      </div>
    )
  }

  // Handle user actions
  const handleAddUser = (newUser) => {
    const newId = users.length ? Math.max(...users.map((emp) => emp.id)) + 1 : 1
    const userToAdd = {
      id: newId,
      ...newUser,
      archived: false,
    }
    setUsers((prev) => [...prev, userToAdd])
    setIsModalOpen(false)
    toast.success(`${newUser.name} has been added successfully!`)
  }

  const handleArchive = (id) => {
    const userToArchive = users.find((user) => user.id === id)
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, archived: true } : user)))
    toast.info(`${userToArchive.name} has been archived`)
  }

  const handleRestore = (id) => {
    const userToRestore = users.find((user) => user.id === id)
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, archived: false } : user)))
    toast.success(`${userToRestore.name} has been restored`)
  }

  const handleEdit = useCallback((user) => {
    setEditUserId(user.id)
    setEditForm({ name: user.name, Role: user.Role })
  }, [])

  const handleUpdatePassword = (userId, newPassword) => {
    console.log(`Password for user ${userId} updated to: ${newPassword}`)
    toast.success("Password updated successfully!")
  }

  const handleExportClick = () => {
    toast.info("Export functionality will be implemented soon")
  }

  // Grid filter logic
  const activeUsers = users.filter((u) => !u.archived)
  const archivedUsers = users.filter((u) => u.archived)
  const currentUsers = filter.filters.some((f) => f.field === "archived" && f.value === true)
    ? archivedUsers
    : activeUsers
  const processedData = process(currentUsers, {
    filter,
    sort,
    group,
    skip: page.skip,
    take: page.take,
  })

  const toggleArchiveFilter = (showArchived) => {
    setFilter({
      logic: "and",
      filters: showArchived ? [{ field: "archived", operator: "eq", value: true }] : [],
    })
  }

  const nameCell = useCallback(
    (props) => {
      if (props.rowType === "groupHeader") {
        return null;
      }

      if (!props.dataItem.name) return <td></td>;

      const isEditing = editUserId === props.dataItem.id;
      return (
        <td>
          <EditableNameCell
            isEditing={isEditing}
            value={isEditing ? editForm.name : props.dataItem.name}
            onChange={handleEditChange}
            onSave={() => handleEditSave(props.dataItem.id)}
            onCancel={() => {
              setEditUserId(null);
              setEditForm({ name: "", Role: "" });
            }}
          />
        </td>
      );
    },
    [editUserId, editForm.name, handleEditChange, handleEditSave]
  );

  const roleCell = useCallback(
    (props) => {
      if (props.rowType === "groupHeader") {
        return null;
      }

      if (!props.dataItem.Role) return <td></td>;

      const isEditing = editUserId === props.dataItem.id;
      return (
        <td>
          <EditableRoleCell
            isEditing={isEditing}
            value={isEditing ? editForm.Role : props.dataItem.Role}
            onChange={handleEditChange}
            availableRoles={availableRoles}
            onSave={() => handleEditSave(props.dataItem.id)}
            onCancel={() => {
              setEditUserId(null);
              setEditForm({ name: "", Role: "" });
            }}
          />
        </td>
      );
    },
    [editUserId, editForm.Role, handleEditChange, handleEditSave, availableRoles]
  );

  const EditableNameCell = memo(({ isEditing, value, onChange, onSave, onCancel }) => {
    const inputRef = useRef(null)

    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus()
      }
    }, [isEditing])

    if (!isEditing) return value

    return (
      <input
        ref={inputRef}
        type="text"
        className="w-full p-2 border rounded"
        value={value}
        onChange={(e) => onChange("name", e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave()
          if (e.key === "Escape") onCancel()
        }}
      />
    )
  })

  const EditableRoleCell = memo(({ isEditing, value, onChange, availableRoles, onSave, onCancel }) => {
    if (!isEditing) return value

    return (
      <select
        className="w-full p-2 border rounded"
        value={value}
        onChange={(e) => onChange("Role", e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave()
          if (e.key === "Escape") onCancel()
        }}
      >
        {availableRoles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
    )
  })
  const actionsCell = useCallback(
    (props) => {
      // Don't show actions for group rows
      if (props.rowType === "groupHeader") {
        return null;
      }

      return (
        <td>
          {!props.dataItem.archived ? (
            editUserId === props.dataItem.id ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditSave(props.dataItem.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-200"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditUserId(null); // Cancel editing
                    setEditForm({ name: "", Role: "" }); // Reset edit form
                  }}
                  className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => handleEdit(props.dataItem)}
                  className="p-2 text-yellow-500 hover:text-yellow-600 hover:bg-gray-100 rounded-full transition duration-200"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleArchive(props.dataItem.id)}
                  className="p-2 text-red-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition duration-200"
                >
                  <Archive size={18} />
                </button>
                <button
                  onClick={() => {
                    setSelectedUserForPassword(props.dataItem);
                    setIsPasswordModalOpen(true);
                  }}
                  className="p-2 text-blue-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition duration-200"
                >
                  <KeyRound size={18} />
                </button>
              </div>
            )
          ) : (
            <button
              onClick={() => handleRestore(props.dataItem.id)}
              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-200 flex items-center justify-center"
            >
              <RotateCcw size={14} className="mr-1" />
              Restore
            </button>
          )}
        </td>
      );
    },
    [editUserId, handleEditSave, handleEdit, handleArchive, handleRestore]
  );

  // Update your groupHeaderCell to be more specific
  const groupHeaderCell = useCallback((props) => {
    // Only show the group header if it's the first row in the group
    if (props.rowIndex === 0 || props.rowType !== "groupHeader") {
      return (
        <td colSpan={props.colSpan} className="bg-gray-100">
          <div className="flex items-center p-2">
            <span className="font-semibold text-gray-800">
              {props.field}: {props.value}
            </span>
          </div>
        </td>
      );
    }
    return null; // Don't render duplicate group headers
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <style jsx>{`
  .k-grid-content tr.k-grouping-row td {
    padding: 0.75rem 1rem;
    background-color: #f3f4f6;
    font-weight: 600;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .k-grid-content tr.k-grouping-row + tr td {
    border-top: none;
  }
  
  .k-grid-header th.k-header {
    font-weight: 600;
    padding: 0.75rem 1rem;
  }
  
  .k-grid td {
    padding: 0.75rem 1rem;
    vertical-align: middle;
  }
  
  .k-grouping-header {
    padding: 0.5rem;
    background-color: #f3f4f6;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .k-grid-grouping-row {
    background-color: #f3f4f6;
  }
`}</style>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex-grow p-4 md:p-6 lg:p-8 max-w-8xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-4 md:mb-0">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Users
          </h1>

          <div className="flex space-x-3">
            <button
              onClick={handleExportClick}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition duration-200 flex items-center shadow-lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </button>

            <button
              onClick={() => toast.info("Import functionality will be implemented soon")}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-500 transition duration-200 flex items-center shadow-lg"
            >
              <Upload className="w-5 h-5 mr-2" />
              Import CSV
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-200 flex items-center shadow-lg"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add New User
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-5 border min-h-2/3 border-gray-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-4 md:mb-0 w-full md:w-auto">
              <h2 className="text-xl font-semibold text-gray-800 min-w-[140px]">
                {filter.filters.some((f) => f.field === "archived" && f.value === true)
                  ? "Archived Users"
                  : "All Users"}
              </h2>

              <div className="flex mt-2 md:mt-0">
                <button
                  onClick={() => toggleArchiveFilter(false)}
                  className={`px-4 py-2 rounded-l-md ${!filter.filters.some((f) => f.field === "archived") ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"} transition duration-200`}
                >
                  Active ({activeUsers.length})
                </button>
                <button
                  onClick={() => toggleArchiveFilter(true)}
                  className={`px-4 py-2 rounded-r-md ${filter.filters.some((f) => f.field === "archived" && f.value === true) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"} transition duration-200`}
                >
                  Archived ({archivedUsers.length})
                </button>
              </div>
            </div>
          </div>

          {processedData.data.length === 0 ? (
            <div className="bg-gray-100 rounded-lg p-8 text-center border border-gray-300">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-200">
                <Users className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-700 text-xl font-semibold">
                {filter.filters.some((f) => f.field === "archived" && f.value === true)
                  ? "No archived users found"
                  : "No active users found"}
              </p>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                {filter.filters.some((f) => f.field === "archived" && f.value === true)
                  ? "Archive users from the active list to see them here"
                  : filter.filters.length > 0
                    ? "Try adjusting your search or filters to find what you're looking for"
                    : "Add new users to get started with user management"}
              </p>
            </div>
          ) : (
            <Grid
              style={{ height: '100%', border: 'none' }}
              data={processedData}
              filterable={true}
              sortable={true}
              groupable={true}
              filter={filter}
              sort={sort}
              group={group}
              onFilterChange={(e) => setFilter(e.filter)}
              onSortChange={(e) => setSort(e.sort)}
              onGroupChange={(e) => setGroup(e.group)}
              pageable={true}
              skip={page.skip}
              take={page.take}
              total={currentUsers.length}
              onPageChange={(e) => setPage(e.page)}
              pager={MyPager}
              groupHeaderCell={groupHeaderCell}
              groupPanel={{
                className: 'bg-white p-3 mb-2 border border-gray-200 rounded',
                placeholder: 'Drag a column header and drop it here to group by that column',
              }}
              className="border-none"
            >
              <Column
                field="name"
                title="Name"
                cell={nameCell}
                filterable={{
                  ui: (props) => (
                    <div className="p-2">
                      <label className="block mb-1 font-medium">Filter by Name</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={props.value || ""}
                        onChange={(e) => props.onChange(e.target.value)}
                        placeholder="Search names..."
                      />
                    </div>
                  ),
                }}
              />

              <Column
                field="email"
                title="Email"
                filterable={{
                  ui: (props) => (
                    <div className="p-2">
                      <label className="block mb-1 font-medium">Filter by Email</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={props.value || ""}
                        onChange={(e) => props.onChange(e.target.value)}
                        placeholder="Search emails..."
                      />
                    </div>
                  ),
                }}
              />

              <Column
                field="Role"
                title="Role"
                cell={roleCell}
                filterable={{
                  ui: (props) => (
                    <div className="p-2">
                      <label className="block mb-1 font-medium">Filter by Role</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={props.value || ""}
                        onChange={(e) => props.onChange(e.target.value === "" ? null : e.target.value)}
                      >
                        <option value="">All Roles</option>
                        {availableRoles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>
                  ),
                }}
              />

              <Column
                title="Actions"
                width="180px"
                cell={actionsCell}
                headerCell={() => (
                  <th className="k-header">
                    <span className="k-link">Actions</span>
                  </th>
                )}
              />
            </Grid>
          )}
        </div>
      </div>

      <AddUser
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddUser={handleAddUser}
        availableRoles={availableRoles}
        editingUser={editUserId ? users.find((u) => u.id === editUserId) : null}
      />

      <UpdatePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onUpdatePassword={handleUpdatePassword}
        user={selectedUserForPassword}
      />
    </div>
  )
}

export default UsersList
