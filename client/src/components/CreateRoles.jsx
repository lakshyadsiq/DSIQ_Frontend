import { useState, useEffect, useMemo } from "react";
import { Check, X, Copy, Loader2 } from "lucide-react";
import { Card, CardHeader, CardBody, CardTitle, CardSubtitle, CardActions } from '@progress/kendo-react-layout';
import { useDebounce } from 'use-debounce';

const CreateRoles = ({ onCancel, roles, setRoles }) => {
  // State for wizard flow
  const [activeTab, setActiveTab] = useState("details");
  const [showToast, setShowToast] = useState(false);
  const [creationComplete, setCreationComplete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    details: {
      name: "",
      description: "",
    },
    permissions: {
      copiedFrom: null
    },
  });

  // Validation state
  const [validation, setValidation] = useState({
    details: {
      isValid: false,
      message: ""
    },
    permissions: {
      isValid: true,
      message: "Please select at least one permission"
    }
  });

  // API states
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [nameAvailability, setNameAvailability] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Debounce the role name for API checking
  const [debouncedName] = useDebounce(formData.details.name, 500);
  
  // Predefined existing roles (would normally come from API)
  const [existingRoles, setExistingRoles] = useState([
    {
      id: 1,
      name: "Admin",
      description: "Full system access with all permissions",
      permissions: {
        Dashboard: { create: true, read: true, update: true, archived: true },
        Reports: { create: true, read: true, update: true, archived: true },
        "Data Export": { create: true, read: true, update: true, archived: true },
        Settings: { create: true, read: true, update: true, archived: true },
        "API Access": { create: true, read: true, update: true, archived: true },
        Notifications: { create: true, read: true, update: true, archived: true },
        Analytics: { create: true, read: true, update: true, archived: true }
      }
    },
    // ... other roles ...
  ]);

  const modules = [
    "Dashboard",
    "Reports",
    "Data Export",
    "Settings",
    "API Access",
    "Notifications",
    "Analytics"
  ];

  // Permission matrix state
  const [permissionMatrix, setPermissionMatrix] = useState(
    modules.map(module => ({
      name: module,
      create: false,
      read: true, // Default to read permission
      update: false,
      archived: false
    }))
  );

  // Steps for the progress path
  const steps = [
    { id: "details", label: "Role Details" },
    { id: "permissions", label: "Permissions" },
    { id: "review", label: "Review & Create" }
  ];

  // UI state
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Calculate total permissions (memoized for performance)
  const totalPermissions = useMemo(() => {
    return permissionMatrix.reduce((total, module) => {
      return total + 
        (module.create ? 1 : 0) +
        (module.read ? 1 : 0) +
        (module.update ? 1 : 0) +
        (module.archived ? 1 : 0);
    }, 0);
  }, [permissionMatrix]);

  // Check role name availability when debounced name changes
  useEffect(() => {
    const checkNameAvailability = async () => {
      if (debouncedName.trim() === "") {
        setNameAvailability(null);
        setValidation(prev => ({
          ...prev,
          details: {
            isValid: false,
            message: ""
          }
        }));
        return;
      }

      setIsCheckingName(true);
      try {
        // Simulate API call - replace with actual API call
        const isAvailable = !existingRoles.some(role => 
          role.name.toLowerCase() === debouncedName.toLowerCase()
        );
        
        setNameAvailability(isAvailable);
        setValidation(prev => ({
          ...prev,
          details: {
            isValid: isAvailable && debouncedName.trim() !== "",
            message: isAvailable ? "" : "Role name already exists"
          }
        }));
      } catch (err) {
        setError({ message: "Failed to check role name availability" });
      } finally {
        setIsCheckingName(false);
      }
    };

    checkNameAvailability();
  }, [debouncedName, existingRoles]);

  // Handle role name and description change
  const handleDetailsChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id === "role-name" ? "name" : "description";
    
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [fieldName]: value
      }
    }));

    // Immediate validation for empty name
    if (fieldName === "name") {
      if (value.trim() === "") {
        setValidation(prev => ({
          ...prev,
          details: {
            isValid: false,
            message: "Role name is required"
          }
        }));
      }
    }
  };

  // Handle permission selection
  const handlePermissionChange = (moduleIndex, permType) => {
    const updatedMatrix = permissionMatrix.map((module, idx) => 
      idx === moduleIndex ? { ...module, [permType]: !module[permType] } : module
    );
    
    setPermissionMatrix(updatedMatrix);
    
    // Update form data and validation
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        copiedFrom: null // Clear template source if manually modified
      }
    }));
    
    // Calculate new total after update
    const newTotal = updatedMatrix.reduce((total, module) => {
      return total + 
        (module.create ? 1 : 0) +
        (module.read ? 1 : 0) +
        (module.update ? 1 : 0) +
        (module.archived ? 1 : 0);
    }, 0);
    
    setValidation(prev => ({
      ...prev,
      permissions: {
        isValid: newTotal > 0,
        message: newTotal > 0 ? "" : "Please select at least one permission"
      }
    }));
  };

  // Handle create role submission
  const handleCreateRole = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Convert permission matrix to permissions object
      const permissions = permissionMatrix.reduce((acc, module) => {
        acc[module.name] = {
          create: module.create,
          read: module.read,
          update: module.update,
          archived: module.archived
        };
        return acc;
      }, {});

      // Simulate API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newRole = {
        id: Math.max(...existingRoles.map(r => r.id), 0) + 1,
        name: formData.details.name,
        description: formData.details.description,
        permissions
      };

      // Update state with new role
      setExistingRoles(prev => [...prev, newRole]);
      setRoles(prev => [...prev, newRole]);
      
      // Show success
      setShowToast(true);
      setCreationComplete(true);
      setTimeout(() => setShowToast(false), 5000);
    } catch (err) {
      setError({ 
        message: "Failed to create role. Please try again later." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle copying permissions from template
  const handleCopyFromTemplate = (roleId) => {
    const selectedRole = existingRoles.find(role => role.id === roleId);
    
    if (selectedRole) {
      const newMatrix = modules.map(moduleName => {
        const modulePermissions = selectedRole.permissions[moduleName] || { 
          create: false, read: true, update: false, archived: false 
        };
        
        return {
          name: moduleName,
          ...modulePermissions
        };
      });
      
      setPermissionMatrix(newMatrix);
      setFormData(prev => ({
        ...prev,
        permissions: {
          copiedFrom: selectedRole.name
        }
      }));
      setShowTemplateSelector(false);
    }
  };

  // Handle tab navigation with validation
  const handleTabChange = (tabId) => {
    if (tabId === "permissions" && !validation.details.isValid) return;
    if (tabId === "review" && (!validation.details.isValid || !validation.permissions.isValid)) return;
    
    setActiveTab(tabId);
    setError(null);
  };

  // Determine current step index
  const currentStepIndex = steps.findIndex(step => step.id === activeTab);

  // Success view after creation
  if (creationComplete) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Success Toast */}
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
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
        )}
        
        <Card className="shadow-sm">
          <CardBody className="text-center p-12">
            <div className="bg-green-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800 mb-2">
              Role Created Successfully
            </CardTitle>
            <CardSubtitle className="text-gray-600 mb-6">
              Role "{formData.details.name}" has been created.
            </CardSubtitle>
            <CardActions className="!justify-between gap-4">
              <button 
                onClick={() => {
                  // Reset form
                  setFormData({
                    details: { name: "", description: "" },
                    permissions: { copiedFrom: null }
                  });
                  setPermissionMatrix(modules.map(module => ({
                    name: module,
                    create: false,
                    read: true,
                    update: false,
                    archived: false
                  })));
                  setValidation({
                    details: { isValid: false, message: "" },
                    permissions: { isValid: true, message: "" }
                  });
                  setActiveTab("details");
                  setCreationComplete(false);
                  setError(null);
                }}
                className="px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Another Role
              </button>
              <button 
                onClick={onCancel}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Return to Roles
              </button>
            </CardActions>
          </CardBody>
        </Card>
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
          aria-label="Cancel role creation"
        >
          Cancel
        </button>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress Path */}
      <nav aria-label="Progress">
        <div className="flex items-center justify-between mb-9">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative w-full">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div 
                  className={`absolute top-4 left-1/2 w-full h-0.5 ${
                    index < currentStepIndex ? "bg-blue-500" : "bg-gray-200"
                  }`}
                  aria-hidden="true"
                ></div>
              )}
              
              {/* Step circle */}
              <button
                onClick={() => handleTabChange(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                  index < currentStepIndex
                    ? "bg-blue-500 text-white"
                    : index === currentStepIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                } ${
                  (index === 1 && !validation.details.isValid) || 
                  (index === 2 && (!validation.details.isValid || !validation.permissions.isValid))
                    ? "cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={
                  (index === 1 && !validation.details.isValid) || 
                  (index === 2 && (!validation.details.isValid || !validation.permissions.isValid))
                }
                aria-current={index === currentStepIndex ? "step" : undefined}
                aria-label={step.label}
              >
                {index < currentStepIndex ? (
                  <Check size={16} aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{index + 1}</span>
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
      </nav>
      
      {/* Tab Content */}
      {activeTab === "details" && (
        <Card className="shadow-sm">
          <CardBody>
            <div className="space-y-6">
              <div>
                <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="role-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Marketing Analyst"
                    value={formData.details.name}
                    onChange={handleDetailsChange}
                    aria-describedby="name-validation"
                  />
                  {isCheckingName && (
                    <div className="absolute right-3 top-2.5">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    </div>
                  )}
                </div>
                {/* FIXED: Combined validation messages into a single view */}
                <div id="name-validation" className="mt-1">
                  {validation.details.message && (
                    <p className="text-sm text-red-500">{validation.details.message}</p>
                  )}
                  {formData.details.name.trim() !== "" && nameAvailability === true && !validation.details.message && (
                    <p className="text-sm text-green-600">Name is available</p>
                  )}
                </div>
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
                  aria-describedby="description-help"
                ></textarea>
                <p id="description-help" className="mt-1 text-xs text-gray-500">
                  Optional description to explain this role's purpose
                </p>
              </div>
              
              <div className="flex items-center justify-end pt-4">
                <button 
                  onClick={() => handleTabChange("permissions")}
                  className={`px-4 py-2 ${
                    validation.details.isValid 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "bg-blue-300 cursor-not-allowed"
                  } text-white rounded-md transition-colors`}
                  disabled={!validation.details.isValid}
                  aria-disabled={!validation.details.isValid}
                >
                  Next: Set Permissions
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
      
      {activeTab === "permissions" && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-lg font-medium text-gray-800">Permission Matrix</CardTitle>
            <CardSubtitle className="text-sm text-gray-500">
              Configure access levels for each system module <span className="text-red-500">*</span>
            </CardSubtitle>
          </CardHeader>
          <CardBody className="p-6">
            {/* Template selector */}
            <div className="mb-6">
              <button
                onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                aria-expanded={showTemplateSelector}
                aria-controls="template-selector"
              >
                <Copy size={16} className="mr-2" aria-hidden="true" />
                Copy from existing role
              </button>
              
              {showTemplateSelector && (
                <Card id="template-selector" className="mt-2 shadow-sm">
                  <CardBody className="p-2">
                    <p className="text-xs text-gray-500 mb-2 px-2">Select a role to copy permissions from:</p>
                    <ul className="divide-y divide-gray-100">
                      {existingRoles.map(role => (
                        <li key={role.id}>
                          <button
                            onClick={() => handleCopyFromTemplate(role.id)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors"
                          >
                            <p className="text-sm font-medium text-gray-800">{role.name}</p>
                            <p className="text-xs text-gray-500">{role.description}</p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              )}
              
              {formData.permissions.copiedFrom && (
                <div className="mt-2 text-xs text-gray-600 flex items-center">
                  <Check size={14} className="text-green-500 mr-1" aria-hidden="true" />
                  <span>
                    Permissions copied from <strong>{formData.permissions.copiedFrom}</strong>. You can modify them below.
                  </span>
                </div>
              )}
            </div>
            
            {/* Permissions Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Create
                    </th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Read
                    </th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Update
                    </th>
                    <th scope="col" className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Archived
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permissionMatrix.map((module, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                        {module.name}
                      </td>
                      {['create', 'read', 'update', 'archived'].map((perm) => (
                        <td key={perm} className="px-6 py-4 whitespace-nowrap text-center">
                          <input 
                            type="checkbox" 
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            checked={module[perm]}
                            onChange={() => handlePermissionChange(idx, perm)}
                            aria-label={`${perm} permission for ${module.name}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {!validation.permissions.isValid && (
              <div className="mt-3">
                <p className="text-sm text-red-500">{validation.permissions.message}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-6">
              <button 
                onClick={() => handleTabChange("details")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={() => handleTabChange("review")}
                className={`px-4 py-2 ${
                  validation.permissions.isValid 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-blue-300 cursor-not-allowed"
                } text-white rounded-md transition-colors`}
                disabled={!validation.permissions.isValid}
                aria-disabled={!validation.permissions.isValid}
              >
                Next: Review
              </button>
            </div>
          </CardBody>
        </Card>
      )}

      {activeTab === "review" && (
        <Card className="overflow-hidden">
          <CardHeader className="border-b border-gray-200 bg-gray-50">
            <CardTitle className="text-lg font-medium text-gray-800">Review and Create Role</CardTitle>
            <CardSubtitle className="text-sm text-gray-500">Review role details before creation</CardSubtitle>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Role Details</h4>
                <Card className="bg-gray-50">
                  <CardBody className="p-4">
                    <div className="mb-3">
                      <span className="block text-xs text-gray-500">Name</span>
                      <span className="block text-sm text-gray-800">{formData.details.name}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Description</span>
                      <span className="block text-sm text-gray-800">
                        {formData.details.description || "No description provided"}
                      </span>
                    </div>
                  </CardBody>
                </Card>
              </div>
              
              {formData.permissions.copiedFrom && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Template Source</h4>
                  <Card className="bg-gray-50">
                    <CardBody className="p-4">
                      <div className="flex items-center">
                        <Copy size={16} className="text-blue-500 mr-2" aria-hidden="true" />
                        <span className="text-sm text-gray-800">
                          Based on <strong>{formData.permissions.copiedFrom}</strong> role with modifications
                        </span>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permission Summary</h4>
              <Card className="bg-gray-50">
                <CardBody className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {permissionMatrix.map((module, idx) => (
                      <div key={idx}>
                        <h5 className="text-xs font-medium text-gray-700 mb-1">{module.name}</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {['create', 'read', 'update', 'archived'].map((perm) => (
                            <li key={perm} className="flex items-center">
                              <span 
                                className={`h-2 w-2 ${
                                  module[perm] ? "bg-green-500" : "bg-red-500"
                                } rounded-full mr-1`}
                                aria-hidden="true"
                              ></span>
                              {perm.charAt(0).toUpperCase() + perm.slice(1)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <button 
                onClick={() => handleTabChange("permissions")}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleCreateRole}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                )}
                {isSubmitting ? "Creating..." : "Create Role"}
              </button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};


export default CreateRoles;     