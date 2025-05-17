import { useState } from "react";
import { Check, X } from "lucide-react";

const CreateRoles = ( {onCancel} ) => {
  const [activeTab, setActiveTab] = useState("details");
  const [showToast, setShowToast] = useState(false);
  const [creationComplete, setCreationComplete] = useState(false);
  
  const modules = [
    "Dashboard",
    "Reports",
    "Data Export",
    "Settings",
    "API Access",
    "Notifications",
    "Analytics"
  ];

  // Define steps for the progress path
  const steps = [
    { id: "details", label: "Role Details" },
    { id: "permissions", label: "Permissions" },
    { id: "review", label: "Review & Create" }
  ];

  // Permission structure to preserve selections
  const [permissionMatrix, setPermissionMatrix] = useState(
    modules.map(module => ({
      name: module,
      create: false,
      read: true, // Default to read permission
      update: false,
      delete: false
    }))
  );

  // Form data state
  const [formData, setFormData] = useState({
    details: {
      name: "",
    },
    permissions: {
      // Initialize with one permission (read) selected for each module
      selectedPermissions: modules.length
    },
  });

  // Validation state
  const [isValid, setIsValid] = useState({
    details: false,
    permissions: true, // Initially true because we set read permissions by default
  });

  // Handle role name and description change
  const handleDetailsChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id === "role-name" ? "name" : "description";
    
    const updatedDetails = {
      ...formData.details,
      [fieldName]: value
    };
    
    setFormData({
      ...formData,
      details: updatedDetails
    });
    
    // Validate details form
    setIsValid({
      ...isValid,
      details: updatedDetails.name.trim() !== "" 
    });
  };

  // Handle permission selection with preserved state
  const handlePermissionChange = (moduleIndex, permType) => {
    const updatedMatrix = [...permissionMatrix];
    const currentValue = updatedMatrix[moduleIndex][permType];
    
    // Toggle the permission
    updatedMatrix[moduleIndex][permType] = !currentValue;
    setPermissionMatrix(updatedMatrix);
    
    // Count total selected permissions to validate
    let totalPermissions = 0;
    updatedMatrix.forEach(module => {
      if (module.create) totalPermissions++;
      if (module.read) totalPermissions++;
      if (module.update) totalPermissions++;
      if (module.delete) totalPermissions++;
    });
    
    // Update form data and validation
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        selectedPermissions: totalPermissions
      }
    });
    
    setIsValid({
      ...isValid,
      permissions: totalPermissions > 0
    });
  };

  // Handle create role button click
  const handleCreateRole = () => {
    setShowToast(true);
    setCreationComplete(true);
    // Hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  // Determine current step index
  const currentStepIndex = steps.findIndex(step => step.id === activeTab);

  // If role creation is complete, show success view
  if (creationComplete) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Toast Message */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-lg flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                <Check size={18} className="text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  Role "{formData.details.name}" created successfully!
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="text-green-500 hover:text-green-700 ml-4"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        <div className="bg-white border border-gray-200 rounded-lg p-12 shadow-sm text-center">
          <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Role Created Successfully</h2>
          <p className="text-gray-600 mb-8">
            Role "{formData.details.name}" has been created.
          </p>
          <button 
            onClick={() => {
              // Reset form and start fresh
              setFormData({
                details: { name: "", description: "" },
                permissions: { selectedPermissions: modules.length }
              });
              setPermissionMatrix(modules.map(module => ({
                name: module,
                create: false,
                read: true,
                update: false,
                delete: false
              })));
              setIsValid({ details: false, permissions: true});
              setActiveTab("details");
              setCreationComplete(false);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create Another Role
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Create New Role</h2>
        <button 
          onClick={onCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
      </div>
      
      {/* Progress Path */}
      <div className="mb-9">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative w-full">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute top-4 left-1 w-full h-0.5 ${
                    index < currentStepIndex ? "bg-blue-500" : "bg-gray-200"
                  }`}
                  style={{ transform: "translateX(50%)" }}
                ></div>
              )}
              
              {/* Step circle */}
              <button
                onClick={() => setActiveTab(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  index < currentStepIndex
                    ? "bg-blue-500 text-white"
                    : index === currentStepIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < currentStepIndex ? (
                  <Check size={16} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </button>
              
              {/* Step label */}
              <span 
                className={`mt-2 text-xs font-medium ${
                  index <= currentStepIndex ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === "details" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 mb-1">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="role-name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Marketing Analyst"
                value={formData.details.name}
                onChange={handleDetailsChange}
              />
              {!isValid.details && formData.details.name.trim() === "" && (
                <p className="mt-1 text-sm text-red-500">Role name is required</p>
              )}
            </div>
            
            <div>
              <label htmlFor="role-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="role-description"
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the purpose and scope of this role..."
                value={formData.details.description}
                onChange={handleDetailsChange}
              ></textarea>
            </div>
            
            <div className="flex items-center justify-end pt-4">
              <button 
                onClick={() => setActiveTab("permissions")}
                className={`px-4 py-2 ${isValid.details ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"} text-white rounded-md`}
                disabled={!isValid.details}
              >
                Next: Set Permissions
              </button>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === "permissions" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">Permission Matrix</h3>
            <p className="text-sm text-gray-500">Configure access levels for each system module <span className="text-red-500">*</span></p>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Create
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Read
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Update
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissionMatrix.map((module, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {module.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={module.create}
                          onChange={() => handlePermissionChange(idx, 'create')}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                          checked={module.read}
                          onChange={() => handlePermissionChange(idx, 'read')}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={module.update}
                          onChange={() => handlePermissionChange(idx, 'update')}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={module.delete}
                          onChange={() => handlePermissionChange(idx, 'delete')}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {!isValid.permissions && (
              <div className="mt-3">
                <p className="text-sm text-red-500">Please select at least one permission</p>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-6">
              <button 
                onClick={() => setActiveTab("details")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={() => setActiveTab("review")}
                className={`px-4 py-2 ${isValid.permissions ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-300 cursor-not-allowed"} text-white rounded-md`}
                disabled={!isValid.permissions}
              >
                Next: Review
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "review" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">Review and Create Role</h3>
            <p className="text-sm text-gray-500">Review role details before creation</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Role Details</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="mb-3">
                    <span className="block text-xs text-gray-500">Name</span>
                    <span className="block text-sm text-gray-800">{formData.details.name || "Marketing Analyst"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500">Description</span>
                    <span className="block text-sm text-gray-800">{formData.details.description || "Role for marketing team members who need to analyze campaign data and create reports."}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permission Summary</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {permissionMatrix.map((module, idx) => (
                    <div key={idx}>
                      <h5 className="text-xs font-medium text-gray-700 mb-1">{module.name}</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li className="flex items-center">
                          <span className={`h-2 w-2 ${module.create ? "bg-green-500" : "bg-red-500"} rounded-full mr-1`}></span>
                          Create
                        </li>
                        <li className="flex items-center">
                          <span className={`h-2 w-2 ${module.read ? "bg-green-500" : "bg-red-500"} rounded-full mr-1`}></span>
                          View
                        </li>
                        <li className="flex items-center">
                          <span className={`h-2 w-2 ${module.update ? "bg-green-500" : "bg-red-500"} rounded-full mr-1`}></span>
                          Update
                        </li>
                        <li className="flex items-center">
                          <span className={`h-2 w-2 ${module.delete ? "bg-green-500" : "bg-red-500"} rounded-full mr-1`}></span>
                          Delete
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button 
                onClick={() => setActiveTab("permissions")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                onClick={handleCreateRole}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateRoles;