# CRM System

This is a CRM system with both admin and client interfaces.

## Recent Changes

### Customer Management - Backend Integration

The customer management system has been updated to use backend API calls instead of localStorage:

#### Backend Changes
- **New Route File**: `backend/contents/Routes/customerRoutes.js`
  - `GET /admin/customers/all` - Fetch all customers
  - `POST /admin/customers/new` - Create or update customer
  - `DELETE /admin/customers/delete/:id` - Delete customer

- **Updated Routes**: `backend/contents/Routes/index.js`
  - Added customer routes to the main router

#### Frontend Changes
- **Updated Component**: `admin_login/src/components/customers/Customers.tsx`
  - Replaced localStorage operations with axios API calls
  - Added loading and error states
  - Improved error handling
  - Added alphabetical sorting by name

- **Updated Modal**: `admin_login/src/components/customers/CustomerModal.tsx`
  - Improved TypeScript types
  - Better validation

### Product Management - Backend Integration

The product management system has been updated to use backend API calls instead of localStorage:

#### Backend Changes
- **New Model**: `backend/contents/models/Product.js`
  - Product schema with all required fields
  - Validation for price, stock, and GST

- **New Route File**: `backend/contents/Routes/productRoutes.js`
  - `GET /admin/products/all` - Fetch all products
  - `POST /admin/products/new` - Create or update product
  - `DELETE /admin/products/delete/:id` - Delete product
  - `POST /admin/products/seed` - Seed sample data

- **Updated Routes**: `backend/contents/Routes/index.js`
  - Added product routes to the main router

#### Frontend Changes
- **Updated Component**: `admin_login/src/components/products/Products.tsx`
  - Replaced localStorage operations with axios API calls
  - Added loading and error states
  - Added alphabetical sorting by name
  - Added "Seed Sample Data" button

- **Updated Modal**: `admin_login/src/components/products/AddProductModal.tsx`
  - Improved TypeScript types
  - Better validation

### Admin Orders Management - Backend Integration

The admin orders management system has been updated to use backend API calls instead of localStorage:

#### Backend Changes
- **New Model**: `backend/contents/models/AdminOrder.js`
  - AdminOrder schema with comprehensive order details
  - Support for order status management (Pending, Acknowledged, Cancelled)
  - Customer and product information tracking

- **New Route File**: `backend/contents/Routes/adminOrderRoutes.js`
  - `GET /admin/orders/all` - Fetch all orders
  - `GET /admin/orders/:id` - Get order details
  - `PUT /admin/orders/:id/acknowledge` - Acknowledge order
  - `PUT /admin/orders/:id/cancel` - Cancel order
  - `POST /admin/orders/new` - Create new order
  - `POST /admin/orders/seed` - Seed sample data

- **Updated Routes**: `backend/contents/Routes/index.js`
  - Added admin order routes to the main router

#### Frontend Changes
- **Updated Component**: `admin_login/src/components/orders/AdminOrders.tsx`
  - Replaced localStorage operations with axios API calls
  - Added loading and error states
  - Added "Seed Sample Data" button
  - Real-time order status updates

- **Updated Modal**: `admin_login/src/components/orders/OrderDetailsModal.tsx`
  - Enhanced to fetch detailed order information from backend
  - Improved UI with organized sections
  - Better error handling and loading states

The customer management system has been updated to use backend API calls instead of localStorage:

#### Backend Changes
- **New Route File**: `backend/contents/Routes/customerRoutes.js`
  - `GET /admin/customers/all` - Fetch all customers
  - `POST /admin/customers/new` - Create or update customer
  - `DELETE /admin/customers/delete/:id` - Delete customer

- **Updated Routes**: `backend/contents/Routes/index.js`
  - Added customer routes to the main router

#### Frontend Changes
- **Updated Component**: `admin_login/src/components/customers/Customers.tsx`
  - Replaced localStorage operations with axios API calls
  - Added loading and error states
  - Improved error handling

- **Updated Modal**: `admin_login/src/components/customers/CustomerModal.tsx`
  - Improved TypeScript types
  - Better validation

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the admin login directory:
   ```bash
   cd admin_login
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will run on `http://localhost:3000`

## API Endpoints

### Customer Management
- `GET /admin/customers/all` - Get all customers
- `POST /admin/customers/new` - Create or update customer
- `DELETE /admin/customers/delete/:id` - Delete customer

### Product Management
- `GET /admin/products/all` - Get all products
- `POST /admin/products/new` - Create or update product
- `DELETE /admin/products/delete/:id` - Delete product
- `POST /admin/products/seed` - Seed sample data

### Admin Orders Management
- `GET /admin/orders/all` - Get all orders
- `GET /admin/orders/:id` - Get order details
- `PUT /admin/orders/:id/acknowledge` - Acknowledge order
- `PUT /admin/orders/:id/cancel` - Cancel order
- `POST /admin/orders/new` - Create new order
- `POST /admin/orders/seed` - Seed sample data

### Request/Response Format

#### Get Customers
**Request**: `GET /admin/customers/all`
**Response**:
```json
[
  {
    "id": "customer_uid",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc",
    "joinedAt": "1/1/2024"
  }
]
```

#### Create/Update Customer
**Request**: `POST /admin/customers/new`
```json
{
  "customer": {
    "id": "customer_uid", // empty string for new customer
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "company": "Acme Inc"
  }
}
```

#### Delete Customer
**Request**: `DELETE /admin/customers/delete/:id`

#### Get Products
**Request**: `GET /admin/products/all`
**Response**:
```json
[
  {
    "id": "product_uid",
    "name": "Laptop Pro X1",
    "status": "Active",
    "category": "Electronics",
    "price": 89999,
    "stock": 25,
    "gst": 18,
    "image": "https://example.com/image.jpg",
    "createdAt": "1/1/2024"
  }
]
```

#### Create/Update Product
**Request**: `POST /admin/products/new`
```json
{
  "product": {
    "id": "product_uid", // empty string for new product
    "name": "Product Name",
    "status": "Active",
    "category": "Electronics",
    "price": 1000,
    "stock": 50,
    "gst": 18,
    "image": "https://example.com/image.jpg"
  }
}
```

#### Delete Product
**Request**: `DELETE /admin/products/delete/:id`

#### Seed Sample Data
**Request**: `POST /admin/products/seed`

#### Get Admin Orders
**Request**: `GET /admin/orders/all`
**Response**:
```json
[
  {
    "id": "order_uid",
    "customerName": "John Doe",
    "productName": "Laptop Pro X1",
    "itemCount": 1,
    "total": 89999,
    "status": "Pending",
    "orderDate": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Order Details
**Request**: `GET /admin/orders/:id`
**Response**:
```json
{
  "id": "order_uid",
  "customerName": "John Doe",
  "productName": "Laptop Pro X1",
  "itemCount": 1,
  "total": 89999,
  "status": "Pending",
  "orderDate": "2024-01-01T00:00:00.000Z",
  "adminResponse": "",
  "customerEmail": "john.doe@example.com",
  "customerPhone": "+91-9876543210",
  "productDetails": "High-performance laptop",
  "shippingAddress": "123 Main St, Bangalore",
  "paymentMethod": "UPI"
}
```

#### Acknowledge Order
**Request**: `PUT /admin/orders/:id/acknowledge`
```json
{
  "adminResponse": "Order confirmed and will be shipped within 24 hours"
}
```

#### Cancel Order
**Request**: `PUT /admin/orders/:id/cancel`
```json
{
  "adminResponse": "Order cancelled due to out of stock"
}
```

#### Seed Sample Orders
**Request**: `POST /admin/orders/seed`

## Database Schema

### Customers
Customers are stored in the `User` collection with `userType: "customer"`:

```javascript
{
  uid: String,           // Unique identifier
  name: String,          // Customer name
  email: String,         // Email address
  phone: String,         // Phone number
  company: String,       // Company name
  userType: "customer",  // User type
  joinedAt: Date         // Join date
}
```

### Products
Products are stored in the `Product` collection:

```javascript
{
  pid: String,           // Unique product identifier
  name: String,          // Product name
  status: String,        // "Active" or "Inactive"
  category: String,      // Product category
  price: Number,         // Product price
  stock: Number,         // Available stock
  gst: Number,           // GST percentage (0-100)
  image: String,         // Product image URL
  createdAt: Date        // Creation date
}
```

### Admin Orders
Admin orders are stored in the `AdminOrder` collection:

```javascript
{
  orderId: String,       // Unique order identifier
  customerName: String,  // Customer name
  productName: String,   // Product name
  itemCount: Number,     // Quantity ordered
  total: Number,         // Total amount
  status: String,        // "Pending", "Acknowledged", or "Cancelled"
  orderDate: Date,       // Order date
  adminResponse: String, // Admin's response/notes
  customerEmail: String, // Customer email
  customerPhone: String, // Customer phone
  productDetails: String, // Product description
  shippingAddress: String, // Shipping address
  paymentMethod: String  // Payment method used
}
```

## Features

- ✅ CRUD operations for customers, products, and admin orders
- ✅ Real-time data persistence
- ✅ Error handling and loading states
- ✅ CSV export functionality
- ✅ Alphabetical sorting by name
- ✅ Sample data seeding for products and orders
- ✅ Order status management (Pending, Acknowledged, Cancelled)
- ✅ Detailed order information with customer and shipping details
- ✅ TypeScript support
- ✅ CORS enabled for frontend-backend communication
