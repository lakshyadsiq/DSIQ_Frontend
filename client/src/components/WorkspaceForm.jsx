import React, { useState } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Input } from "@progress/kendo-react-inputs";

const WorkspaceForm = () => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const categories = [
    { name: "Footwear", brands: ["Nike", "Adidas", "Puma"] },
    { name: "Clothing", brands: ["Zara", "H&M", "Uniqlo"] },
    { name: "Accessories", brands: ["Fossil", "Ray-Ban", "Timex"] },
  ];

  const categoryNames = categories.map(c => c.name);
  const currentBrands = selectedCategory
    ? categories.find(c => c.name === selectedCategory)?.brands || []
    : [];

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <DropDownList
            data={categoryNames}
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.value);
              setSelectedBrand(null);
            }}
            defaultItem="Select Category"
            className="w-full"
          />
        </div>

        {selectedCategory && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <DropDownList
              data={currentBrands}
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.value)}
              defaultItem="Select Brand"
              className="w-full"
            />
          </div>
        )}

        <button
          onClick={() =>
            alert(`Workspace: ${workspaceName}, Category: ${selectedCategory}, Brand: ${selectedBrand}`)
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
