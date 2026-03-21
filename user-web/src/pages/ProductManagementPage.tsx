import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/layout/Layout";
import Dialog from "../components/common/Dialog";
import { Package, Plus, Edit, Trash2, Search, LayoutGrid } from "lucide-react";
import { Product } from "../types";
import { useShopStore } from "../stores/shop.store";
import { toast } from "react-toastify";
import Skeleton from "../components/common/Skeleton";
import { getRenderableImageUrl } from "../utils/image";

const ProductManagementPage: React.FC = () => {
  const { profile } = useAuth();
  const products = useShopStore((state) => state.myProducts);
  const loading = useShopStore((state) => state.myProductsLoading);
  const fetchMyProducts = useShopStore((state) => state.fetchMyProducts);
  const createMyProduct = useShopStore((state) => state.createMyProduct);
  const updateMyProduct = useShopStore((state) => state.updateMyProduct);
  const deleteMyProduct = useShopStore((state) => state.deleteMyProduct);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savingProduct, setSavingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const inStockCount = useMemo(
    () => products.filter((p) => p.stock > 0).length,
    [products],
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);

      if (imageFile) {
        formDataToSend.append("file", imageFile);
      } else if (formData.image_url) {
        formDataToSend.append("image_url", formData.image_url);
      }

      if (editingProduct) {
        await updateMyProduct(editingProduct.id, formDataToSend);
        toast.success("Product updated successfully.");
      } else {
        await createMyProduct(formDataToSend);
        toast.success("Product created successfully.");
      }

      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Failed to save product. Please try again.");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      stock: product.stock.toString(),
      image_url: product.image_url || "",
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setDeletingProductId(id);
        await deleteMyProduct(id);
        toast.success("Product deleted successfully.");
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast.error("Failed to delete product. Please try again.");
      } finally {
        setDeletingProductId(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      image_url: "",
    });
    setImageFile(null);
    setEditingProduct(null);
  };

  const openNewProductDialog = () => {
    resetForm();
    setShowDialog(true);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/25 dark:border-slate-600 dark:bg-slate-950/50 dark:text-white";

  if (profile?.role !== "pharmacy") {
    return (
      <Layout>
        <div className="mx-auto max-w-lg py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
            <Package className="h-7 w-7 text-slate-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Access denied
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            You need pharmacy privileges to manage products.
          </p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl space-y-8 py-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Skeleton className="h-12 w-72 rounded-2xl" />
            <Skeleton className="h-11 w-40 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="hidden h-24 rounded-2xl sm:block" />
          </div>
          <Skeleton className="h-14 w-full rounded-2xl" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-0 dark:border-slate-700 dark:bg-slate-900/60"
              >
                <Skeleton className="h-44 w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl space-y-8 py-2">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-primary-600 via-primary-700 to-slate-900 p-6 text-white shadow-lg shadow-primary-900/15 sm:p-8 dark:border-slate-700/50">
          <div
            className="pointer-events-none absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_100%_0%,rgba(56,189,248,0.35),transparent_45%)]"
            aria-hidden
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
                <LayoutGrid className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-100/90">
                  Pharmacy catalog
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Product management
                </h1>
                <p className="mt-2 max-w-xl text-sm text-white/85">
                  Create, search, and maintain inventory—pricing and stock stay
                  in sync with your storefront.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openNewProductDialog}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-primary-800 shadow-md transition hover:bg-primary-50"
            >
              <Plus className="h-5 w-5" aria-hidden />
              Add product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SKUs listed
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
              {products.length}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 p-4 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/25">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              In stock
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-900 dark:text-emerald-100">
              {inStockCount}
            </p>
          </div>
          <div className="hidden rounded-2xl border border-sky-200/80 bg-sky-50/90 p-4 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/20 sm:block">
            <p className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
              Matching search
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-sky-900 dark:text-sky-100">
              {filteredProducts.length}
            </p>
          </div>
        </div>

        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="text"
            placeholder="Search by title or category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-200/90 bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-sm outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-600 dark:bg-slate-900/70 dark:text-white"
          />
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/90 px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-900/50">
            <Package
              className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600"
              aria-hidden
            />
            <h2 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              {products.length === 0
                ? "No products yet"
                : "No matches for that search"}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {products.length === 0
                ? "Add your first product to appear in the shop."
                : "Try a different keyword or clear the search."}
            </p>
            {products.length === 0 && (
              <button
                type="button"
                onClick={openNewProductDialog}
                className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-600/25 transition hover:bg-primary-700"
              >
                <Plus className="h-4 w-4" />
                Add product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200/80 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-primary-800/60"
              >
                <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800/80">
                  {product.image_url ? (
                    <img
                      src={getRenderableImageUrl(product.image_url)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-14 w-14 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {product.title}
                  </h3>
                  {product.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {product.description}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                      ${product.price.toFixed(2)}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.stock > 0
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                      }`}
                    >
                      Stock: {product.stock}
                    </span>
                  </div>
                  {product.category && (
                    <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {product.category}
                    </p>
                  )}
                  <div className="mt-auto flex gap-2 pt-5">
                    <button
                      type="button"
                      onClick={() => handleEdit(product)}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingProductId === product.id}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingProductId === product.id
                        ? "Deleting…"
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <Dialog
          isOpen={showDialog}
          onClose={() => {
            setShowDialog(false);
            resetForm();
          }}
          title={editingProduct ? "Edit product" : "Add new product"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Product title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Price * ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Product image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={inputClass}
              />
              {formData.image_url && !imageFile && (
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Current image: {formData.image_url.substring(0, 50)}...
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
                className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProduct}
                className="flex-1 cursor-pointer rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-700 disabled:opacity-60"
              >
                {savingProduct
                  ? editingProduct
                    ? "Updating…"
                    : "Creating…"
                  : editingProduct
                    ? "Update product"
                    : "Create product"}
              </button>
            </div>
          </form>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ProductManagementPage;
