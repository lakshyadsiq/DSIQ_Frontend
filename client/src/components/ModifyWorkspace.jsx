import React, { useState, useEffect } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Input } from "@progress/kendo-react-inputs";
// import axios from "axios"; // Uncomment for API

const ModifyWorkspace = ({ workspace }) => {
  const [workspaceName, setWorkspaceName] = useState(workspace?.name || "");
  const [selectedCategory, setSelectedCategory] = useState(workspace?.category || null);
  const [selectedBrand, setSelectedBrand] = useState(workspace?.brand || null);

  const categories = [
    { name: "Footwear", brands: ["Nike", "Adidas", "Puma"] },
    { name: "Clothing", brands: ["Zara", "H&M", "Uniqlo"] },
    { name: "Accessories", brands: ["Fossil", "Ray-Ban", "Timex"] },
  ];

  const categoryNames = categories.map(c => c.name);
  const currentBrands = selectedCategory
    ? categories.find(c => c.name === selectedCategory)?.brands || []
    : [];

  /*
  // 🔄 Submit changes to API (future use)
  const handleUpdate = async () => {
    try {
      const payload = {
        name: workspaceName,
        category: selectedCategory,
        brand: selectedBrand,
      };
      const response = await axios.put(`/api/workspaces/${workspace.id}`, payload);
      console.log("Workspace updated:", response.data);
      alert("Workspace updated successfully!");
    } catch (error) {
      console.error("Failed to update workspace", error);
      alert("Error updating workspace");
    }
  };
  */

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Modify Workspace</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Workspace Name</label>
        <Input
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.value)}
          placeholder="Enter workspace name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Category</label>
        <DropDownList
          data={categoryNames}
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.value);
            setSelectedBrand(null); // Reset brand when category changes
          }}
          defaultItem="Select Category"
        />
      </div>

      {selectedCategory && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Brand</label>
          <DropDownList
            data={currentBrands}
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.value)}
            defaultItem="Select Brand"
          />
        </div>
      )}

      <button
        // onClick={handleUpdate} // Enable when API is ready
        onClick={() =>
          alert(`Updated Workspace: ${workspaceName}, Category: ${selectedCategory}, Brand: ${selectedBrand}`)
        }
        className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Update Workspace
      </button>
    </div>
  );
};

export default ModifyWorkspace;
