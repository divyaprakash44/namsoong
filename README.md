# 🪶 Namsoong — Lightweight Document Annotation Platform

**Namsoong** is a lightweight, high-performance document annotation system designed to move away from bulky, all-in-one PDF frameworks. It enables users to highlight, annotate, and compile excerpts into structured documents — all while remaining offline-first, responsive, and modular.

---

## 🧩 Core Philosophy

Unlike traditional PDF editors, **Namsoong** doesn’t try to do everything at once. It focuses on **speed, minimalism, and local-first data handling**. Every action — from highlighting text to adding notes — happens instantly and offline. Heavy operations like document compilation are offloaded to backend services, keeping the app lean and responsive.

---

## ⚙️ System Overview

Inscribe consists of three major components:

1. **React Native Client (Core App)**  
   Handles authentication, PDF rendering, highlighting, and local data storage.

2. **Node.js API Gateway**  
   Manages user authentication (JWT-based), handles API requests, and routes export calls.

3. **Python Compiler Service**  
   Builds `.docx` and `.pdf` output files from user highlights using `python-docx` and `docx2pdf`.

---

## 🏗️ Technical Architecture

### Frontend — React Native
- **Framework:** React Native  
- **PDF Rendering:** [`react-native-pdf`](https://github.com/wonday/react-native-pdf)  
- **Local Storage:** `react-native-sqlite-storage` / `react-native-fs`  
- **Secure Token Storage:** `react-native-keychain`  
- **Offline Encryption (optional):** `react-native-encrypted-storage`

#### Highlight Workflow:
1. User selects text within the PDF.  
2. On tap of **“Add to Doc”**, app stores a record in local storage:
   ```json
   {
     "id": "uuid",
     "page": 14,
     "text": "Selected passage text...",
     "timestamp": "2025-10-29T12:33:00Z"
   }
