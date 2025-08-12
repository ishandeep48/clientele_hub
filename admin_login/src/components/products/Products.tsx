import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Products.css';
import AddProductModal from './AddProductModal.tsx';

interface Product {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  category: string;
  price: number;
  stock: number;
  gst: number;
  image: string;
  createdAt: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/admin/products/all');
      // Sort products alphabetically by name
      const sortedProducts = response.data.sort((a: Product, b: Product) => 
        a.name.localeCompare(b.name)
      );
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Product) => {
    try {
      await axios.post('http://localhost:5000/admin/products/new', { product });
      fetchProducts(); // Refresh the list
      setIsModalOpen(false);
      setEditProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/admin/products/delete/${id}`);
        fetchProducts(); // Refresh the list
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const seedProducts = async () => {
    try {
      await axios.post('http://localhost:5000/admin/products/seed');
      fetchProducts(); // Refresh the list
    } catch (error) {
      console.error('Error seeding products:', error);
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h2>Products</h2>
          <p>Manage your inventory and catalog.</p>
        </div>
        <div className="products-actions">
          <button className="seed-btn" onClick={seedProducts}>
            Seed Sample Data
          </button>
          <button className="add-product-btn" onClick={() => setIsModalOpen(true)}>
            Add New Product
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error">{error}</div>}

      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Status</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>GST (%)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td><img src={product.image} alt="Product" className="product-img" /></td>
              <td>{product.name}</td>
              <td>{product.status}</td>
              <td>{product.category}</td>
              <td>₹{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.gst}%</td>
              <td>
                <div className="menu">
                  <button className="dots-btn">⋮</button>
                  <div className="dropdown">
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <AddProductModal
          onClose={() => {
            setIsModalOpen(false);
            setEditProduct(null);
          }}
          onSave={handleSave}
          initialData={editProduct}
        />
      )}
    </div>
  );
};

export default Products;
