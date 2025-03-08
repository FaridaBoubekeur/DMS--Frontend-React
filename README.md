# Document Management System - React Frontend

## 📌 Project Overview
This is a **responsive React frontend** for a Document Management System (DMS) that interfaces with a **Flask-dummy API**. It follows best practices for **React component design** and **state management** using Redux.

## 🎯 Key Features
### 🔐 Authentication System
- Implements **user login functionality** using **Redux** for state management.
- Uses **hardcoded passwords** (no backend authentication required).
- Manages **user sessions** appropriately.

### 👥 User Management Interface
- Displays **user data** from the API in a table.
- Includes **search functionality, column sorting, and pagination**.
- Allows **filtering** to refine the user list.
- Provides **form views** to create and edit users.

### 📄 Document Management Interface
- Displays a **list of documents** with relevant controls.
- Supports **search, sorting, and pagination**.
- Includes **form interfaces** for document creation and editing.

## 📦 Install Dependencies
npm install

## ⚡ Start the Development Server
npm start

The app will be available at http://localhost:3000/.

## 🚀 Getting Started

## 🔗 Running the Dummy API (JSON Server)
This project uses JSON Server to simulate API responses. To start the dummy API:
json-server --watch Path/to/data.json --port 5000
