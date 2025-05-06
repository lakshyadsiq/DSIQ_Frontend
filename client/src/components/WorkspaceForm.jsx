import React, { useState } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { Input } from "@progress/kendo-react-inputs";

const WorkspaceForm = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const categories = [
    { name: "Footwear", brands: ["Nike", "Adidas", "Puma"] },
    { name: "Clothing", brands: ["Zara", "H&M", "Nike"] },
    { name: "Accessories", brands: ["Ray-Ban", "Nike", "Timex"] },
  ];

  const categoryNames = categories.map(c => c.name);

  // Get brands that exist in all selected categories
  const getCommonBrands = () => {
    if (selectedCategories.length === 0) return [];

    const brandLists = selectedCategories.map(catName => {
      const category = categories.find(c => c.name === catName);
      return category ? category.brands : [];
    });

    return brandLists.reduce((acc, list) =>
      acc.filter(brand => list.includes(brand))
    );
  };

  const commonBrands = getCommonBrands();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md transition-transform duration-300 hover:scale-[1.01]">
        {/* DSIQ Branding */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600">DSIQ</h1>
          <p className="text-gray-500 text-sm mt-1">Define your workspace below</p>
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Create Workspace</h2>

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
              setSelectedBrand(null); // reset brand if categories change
            }}
            placeholder="Select Categories"
            className="w-full"
          />
        </div>

        {commonBrands.length > 0 && (
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
              `Workspace: ${workspaceName}, Categories: ${selectedCategories.join(", ")}, Brand: ${selectedBrand}`
            )
          }
          className="mt-6 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
        >
          Create Workspace
        </button>
      </div>
    </div>
  );
};

export default WorkspaceForm;
