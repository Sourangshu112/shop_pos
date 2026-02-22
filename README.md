# SyntaxLab POS & Inventory Management System

A comprehensive, offline-first Desktop ERP designed for high-speed retail operations. This system combines a modern React frontend with a high-performance Python backend to provide enterprise-level features without recurring subscription costs.

## Core Features

### 1. High-Speed Checkout System
* **Unified Search:** Supports instant item lookup via 2D Barcode scanning or Name-based queries through a dedicated search endpoint.
* **Automated Stock Validation:** The system automatically verifies inventory levels during checkout, deducts sold quantities in real-time, and prevents sales when stock is insufficient.
* **Live Cart Management:** A React-powered interface that maintains a dynamic cart, calculates grand totals, and tracks item counts for every transaction.

### 2. Intelligent Inventory Control
* **Flexible Stock Entry:** Supports both manual single-item entry and high-volume bulk uploads via JSON/Excel-ready endpoints.
* **Real-time Monitoring:** Features a sortable and searchable inventory dashboard with built-in "Low Stock Alerts" for items with fewer than 10 units remaining.

### 3. Automated Digital Documentation
* **PDF Archive Engine:** Automatically generates and archives physical PDF invoices for every sale, organized locally by unique Invoice IDs.
* **Printing** After genetrating PDF if detects an printer and prints it automatically.
* **Transaction Persistence:** Maintains a detailed permanent record of every sale, including total amount, item counts, dates, and associated file paths.
* **Integrated Invoice Viewer:** Allows users to open archived PDF receipts directly in the system's default viewer (Windows/Mac) with a single click.

### 4. Business Intelligence & Analytics
* **Visual Performance Tracking:** Displays "Top Selling Items" through interactive BarCharts, helping owners identify their most profitable inventory.
* **Revenue Trend Analysis:** Generates LineCharts to visualize daily and monthly revenue trends.
* **Custom Range** All the data analysis can be filtered for a selected range of date from 1 day to 1 year or more according to user.
* **Data Portability:** Includes a pro-level feature to export filtered sales records and revenue data directly into `.xlsx` files for external accounting.

### 5. Advanced History & Audit Tools
* **Searchable Sales Log:** A dedicated history module to retrieve old transactions by specific Invoice ID or through date-based filtering.
* **Line-Item Deep Dives:** Includes a modal interface to pull specific item data (quantity and price at the time of sale) for any historical bill.

### 6. Personalization & Local Storage
* **Shop Configuration:** Dedicated settings for shop name, phone, GST registration, and address.
* **Persistent Settings:** Uses local storage to ensure shop details and global configurations remain saved across application restarts without requiring a cloud login.

### 7. Modern Technical Architecture
* **Hybrid Stack:** Built using a high-performance Electron/React frontend and a Flask (Python) backend for seamless hardware and OS integration.
* **Privacy-First Data:** Powered by an offline SQLite database, ensuring all business data stays securely on the local machine.

---

## About the Developer

Developed and maintained by **Sourangshu Ghosh**.

As a B.Tech student based in Malda, West Bengal, I built this software to bridge the gap between expensive, cloud-dependent enterprise systems and the practical needs of local retail businesses. This project serves as a flagship product under **SyntaxLab**, a software initiative focused on delivering robust, custom-tailored offline solutions.


## 💡 Interested in using SyntaxLab POS?

Unlike current market leaders that rely on expensive yearly subscriptions, I offer this complete software package at a **highly competitive, one-time cost**. 

**Your one-time investment includes:**
* 🚀 **Full System Setup:** Complete installation and configuration with your local hardware (barcode scanners,Printers, etc.).
* 📚 **Hands-on Training:** A thorough walkthrough of the software to ensure you are comfortable using it for daily operations.
* 🛠️ **Dedicated Technical Support:** Reliable, ongoing support for any bugs or technical assistance you might need after launch.

📩 **Get in touch:** If you are interested in upgrading your shop's billing system, contact me at [sourangshu098@gmail.com](mailto:sourangshu098@gmail.com).