import {
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../../store/useStore";
import type { Category, Product } from "../../types";
import { formatCurrency } from "../../utils/helpers";

const categories: Category[] = ["Breakfast", "Lunch", "Dinner", "Side Dishes"];

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: Category;
  image: string;
  available: boolean;
  popular: boolean;
}

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  category: "Breakfast",
  image: "",
  available: true,
  popular: false,
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<Category | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (
      searchQuery &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    if (filterCategory !== "All" && p.category !== filterCategory) return false;
    return true;
  });

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImagePreview("");
    setShowForm(true);
  };

  const handleOpenEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      available: product.available,
      popular: product.popular,
    });
    setEditingId(product.id);
    setImagePreview(product.image);
    setShowForm(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setForm((prev) => ({ ...prev, image: result }));
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) return;
    if (!form.name.trim()) return;

    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category,
      image:
        form.image ||
        "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=300&fit=crop",
      available: form.available,
      popular: form.popular,
    };

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct(productData);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImagePreview("");
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Product Management
          </h1>
          <p className="text-slate-600 mt-1">
            {filteredProducts.length} products shown
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterCategory("All")}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
              filterCategory === "All"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                filterCategory === cat
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Product
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Category
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Price
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-slate-500 line-clamp-1">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-emerald-600">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      updateProduct(product.id, {
                        available: !product.available,
                      })
                    }
                    className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-lg transition-colors ${
                      product.available
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    {product.available ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                    {product.available ? "Available" : "Hidden"}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEdit(product)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {deleteConfirm === product.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="px-3 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <p className="text-sm font-medium">No products found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image */}
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-2">
                  Product Image
                </label>
                {imagePreview ? (
                  <div className="relative h-40 rounded-lg overflow-hidden border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview("");
                        setForm((prev) => ({ ...prev, image: "" }));
                      }}
                      className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all">
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm font-medium text-slate-700">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
                <input
                  type="text"
                  placeholder="Or paste image URL..."
                  value={form.image.startsWith("data:") ? "" : form.image}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, image: e.target.value }));
                    setImagePreview(e.target.value);
                  }}
                  className="mt-2 w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Grilled Salmon"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe this product..."
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              {/* Price & Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                    Price (LKR) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-1.5">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value as Category,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        available: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded accent-emerald-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Available
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        popular: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded accent-emerald-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Popular
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? "Update" : "Add"} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
