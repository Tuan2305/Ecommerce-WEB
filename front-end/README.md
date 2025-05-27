# Shop Web Frontend

A modern e-commerce website frontend built with React, Tailwind CSS, and React Router.
## Preview:
### Home:
![image](https://github.com/user-attachments/assets/cd1be82e-a333-4087-813e-8d75e2e7ac27)
![image](https://github.com/user-attachments/assets/912b702b-2663-4b7e-8575-b1ebbea57b9d)
### Admin Pane:
![image](https://github.com/user-attachments/assets/22dbe31a-f1d5-4804-9192-e78b4ed7f5e2)

## Features

- 🛒 Complete e-commerce functionality
- 🔐 User authentication with OTP
- 🏠 Product browsing with filters and sorting
- 🛍️ Shopping cart management
- 📦 Order tracking
- 👤 User profile management
- 📱 Responsive design for all devices
- 🔄 Admin dashboard with product, order, and user management

## Tech Stack

- React 18
- React Router 6
- Tailwind CSS
- Axios
- React Icons
- Context API for state management

## Prerequisites

- Node.js 14.x or higher
- npm 7.x or higher

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/frontend_shop-web.git
cd frontend_shop-web
```
2. Install dependencies:
```bash
npm install
```
3. Start the development server:
```bash
npm start
```
4. Watch Tailwind CSS changes:
```bash
npx tailwindcss -i ./src/index.css -o ./src/output.css --watch
```
## Project Structure
```bash
frontend_shop-web/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React Context providers
│   ├── pages/          # Page components
│   │   └── admin/      # Admin dashboard pages
│   ├── App.js          # Main app component
│   ├── index.js        # Entry point
│   └── ...
└── package.json
```
