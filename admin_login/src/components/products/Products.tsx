import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const saved = localStorage.getItem('products');
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleSave = (product: Product) => {
    if (editProduct) {
      setProducts(prev =>
        prev.map(p => (p.id === product.id ? product : p))
      );
    } else {
      setProducts(prev => [...prev, product]);
    }
    setIsModalOpen(false);
    setEditProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <div>
          <h2>Products</h2>
          <p>Manage your inventory and catalog.</p>
        </div>
        <button className="add-product-btn" onClick={() => setIsModalOpen(true)}>
          Add New Product
        </button>
      </div>

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
