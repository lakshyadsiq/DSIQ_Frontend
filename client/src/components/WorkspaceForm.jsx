import React, { useState /*, useEffect */ } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Input } from "@progress/kendo-react-inputs";
// import axios from "axios"; // Uncomment when using API

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

  /*
  // 🔄 Load categories from API (future use)
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/categories")
      .then(response => setCategories(response.data))
      .catch(error => console.error("Error fetching categories", error));
  }, []);
  */

  /*
  // 🚀 Submit workspace to API (future use)
  const handleSubmit = async () => {
    try {
      const payload = {
        workspaceName,
        category: selectedCategory,
        brand: selectedBrand,
      };
      const response = await axios.post("/api/workspaces", payload);
      console.log("Workspace created:", response.data);
      alert("Workspace created successfully!");
    } catch (error) {
      console.error("Failed to create workspace", error);
      alert("Error creating workspace");
    }
  };
  */

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Create Workspace</h2>

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
            setSelectedBrand(null); // Reset brand on category change
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
        // onClick={handleSubmit} // Use this when enabling API
        onClick={() =>
          alert(`Workspace: ${workspaceName}, Category: ${selectedCategory}, Brand: ${selectedBrand}`)
        }
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create Workspace
      </button>
    </div>
  );
};

export default WorkspaceForm;
