import React, { useState, useMemo } from "react";
import { MultiSelect, DropDownList } from "@progress/kendo-react-dropdowns";
import { Input } from "@progress/kendo-react-inputs";

const ModifyWorkspace = ({ workspace }) => {
  const categories = [
    { name: "Footwear", brands: ["Nike", "Adidas", "Puma"] },
    { name: "Clothing", brands: ["Zara", "H&M", "Uniqlo"] },
    { name: "Accessories", brands: ["Fossil", "Ray-Ban", "Timex"] },
  ];

  const categoryNames = categories.map(c => c.name);

  const [workspaceName, setWorkspaceName] = useState(workspace?.name || "");
  const [selectedCategories, setSelectedCategories] = useState(
    workspace?.category ? [workspace.category] : []
  );
  const [selectedBrand, setSelectedBrand] = useState(workspace?.brand || null);

  const commonBrands = useMemo(() => {
    if (selectedCategories.length === 0) return [];

    const selectedCategoryObjects = categories.filter(c =>
      selectedCategories.includes(c.name)
    );

    const intersectBrands = selectedCategoryObjects.reduce((acc, curr) => {
      return acc.filter(brand => curr.brands.includes(brand));
    }, selectedCategoryObjects[0]?.brands || []);

    return intersectBrands;
  }, [selectedCategories, categories]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md transition-transform duration-300 hover:scale-[1.01]">
        {/* DSIQ Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600">DSIQ</h1>
          <p className="text-gray-500 text-sm mt-1">Update your workspace settings</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Modify Workspace</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Name</label>
          <Input
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.value)}
            placeholder="Enter workspace name"
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
          <MultiSelect
            data={categoryNames}
            value={selectedCategories}
            onChange={(e) => {
              setSelectedCategories(e.value);
              setSelectedBrand(null); // Reset brand on category change
            }}
            placeholder="Select Categories"
            className="w-full"
          />
        </div>

        {selectedCategories.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <DropDownList
              data={commonBrands}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.value)}
              defaultItem="Select Brand"
              className="w-full"
            />
          </div>
        )}

        <button
          onClick={() =>
            alert(
              `Updated Workspace: ${workspaceName}, Categories: ${selectedCategories.join(
                ", "
              )}, Brand: ${selectedBrand}`
            )
          }
          className="mt-6 w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
        >
          Update Workspace
        </button>
      </div>
    </div>
  );
};

export default ModifyWorkspace;
