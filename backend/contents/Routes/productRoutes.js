const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { nanoid } = require("nanoid");

// Get all products
router.get("/admin/products/all", async (req, res) => {
  try {
    const products = await Product.find().select(
      "pid name status category price stock gst image createdAt -_id"
    );
    
    // Transform the data to match the frontend interface
    const transformedProducts = products.map(product => ({
      id: product.pid,
      name: product.name,
      status: product.status,
      category: product.category,
      price: product.price,
      stock: product.stock,
      gst: product.gst,
      image: product.image,
      createdAt: new Date(product.createdAt).toLocaleDateString()
    }));
    
    res.json(transformedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new product
router.post("/admin/products/new", async (req, res) => {
  try {
    const { product } = req.body;
    
    if (product.id) {
      // Update existing product
      const existingProduct = await Product.findOne({ pid: product.id });
      if (existingProduct) {
        existingProduct.name = product.name;
        existingProduct.status = product.status;
        existingProduct.category = product.category;
        existingProduct.price = product.price;
        existingProduct.stock = product.stock;
        existingProduct.gst = product.gst;
        existingProduct.image = product.image;
        await existingProduct.save();
        return res.status(200).json({ message: "Product updated successfully" });
      }
    } else {
      // Create new product
      const pid = await nanoid();
      const newProduct = new Product({
        pid: pid,
        name: product.name,
        status: product.status,
        category: product.category,
        price: product.price,
        stock: product.stock,
        gst: product.gst,
        image: product.image,
        createdAt: new Date(),
      });
      
      await newProduct.save();
      return res.status(201).json({ message: "Product created successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete product
router.delete("/admin/products/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Product.deleteOne({ pid: id });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Seed initial data
router.post("/admin/products/seed", async (req, res) => {
  try {
    // Check if products already exist
    const existingProducts = await Product.find();
    if (existingProducts.length > 0) {
      return res.status(400).json({ message: "Products already seeded" });
    }

    const sampleProducts = [
      {
        pid: await nanoid(),
        name: "Laptop Pro X1",
        status: "Active",
        category: "Electronics",
        price: 89999,
        stock: 25,
        gst: 18,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop",
        createdAt: new Date(),
      },
      {
        pid: await nanoid(),
        name: "Wireless Mouse",
        status: "Active",
        category: "Accessories",
        price: 1299,
        stock: 150,
        gst: 12,
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop",
        createdAt: new Date(),
      },
      {
        pid: await nanoid(),
        name: "Office Chair",
        status: "Active",
        category: "Furniture",
        price: 4500,
        stock: 30,
        gst: 18,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
        createdAt: new Date(),
      },
      {
        pid: await nanoid(),
        name: "Coffee Maker",
        status: "Inactive",
        category: "Appliances",
        price: 3500,
        stock: 0,
        gst: 18,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=100&h=100&fit=crop",
        createdAt: new Date(),
      },
      {
        pid: await nanoid(),
        name: "Smartphone Galaxy S23",
        status: "Active",
        category: "Electronics",
        price: 75000,
        stock: 15,
        gst: 18,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop",
        createdAt: new Date(),
      },
      {
        pid: await nanoid(),
        name: "Bluetooth Headphones",
        status: "Active",
        category: "Accessories",
        price: 2500,
        stock: 75,
        gst: 12,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
        createdAt: new Date(),
      }
    ];

    await Product.insertMany(sampleProducts);
    return res.status(201).json({ message: "Sample products seeded successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
