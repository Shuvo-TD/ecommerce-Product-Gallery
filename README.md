# E-commerce Product Gallery

A modern e-commerce product gallery application built with Next.js, TypeScript, and Redux.

## Features

- **Product Listing**: Display products in a responsive grid layout
- **Filtering**: Filter products by category, price range, and availability
- **Sorting**: Sort products by price, name, or category (ascending/descending)
- **Search**: Find products by name or description
- **Pagination**: Browse through products with infinite scrolling
- **Shopping Cart**: Add/remove items, update quantities, and calculate totals
- **Responsive Design**: Mobile-first approach with a clean, modern UI
- **Data Persistence**: Cart data is saved to Redux store
- **Performance Optimizations**: Debounced price inputs and optimized rendering

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Testing**: Jest and React Testing Library
- **Data Storage**: JSON file for product data
- **UI Components**: Custom components with responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ecommerce-product-gallery.git
   cd ecommerce-product-gallery
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Running Tests

```bash
# Run all tests
npm test
# or
yarn test
```

## Project Structure

```
ecommerce-product-gallery/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js app router
│   │   ├── api/         # API routes
│   │   └── page.tsx     # Home page
│   ├── components/      # React components
│   │   ├── __tests__/   # Component tests
│   │   ├── CartModal.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductList.tsx
│   ├── lib/             # Utility functions and Redux store
│   │   └── store/       # Redux store configuration
└── package.json         # Project dependencies
```

## Technical Decisions

- **Next.js**: Chosen for its server-side rendering capabilities, API routes, and excellent developer experience
- **TypeScript**: Used for type safety and better code maintainability
- **Redux Toolkit**: Selected for state management due to its simplicity and powerful features
- **Tailwind CSS**: Used for rapid UI development and responsive design
- **Jest & React Testing Library**: Used for comprehensive testing of components and functionality
- **Debouncing**: Implemented for price range inputs to prevent excessive API calls
- **Server-Side Filtering**: Implemented filtering and pagination on the server for better performance
- **Infinite Scrolling**: Used react-intersection-observer for a seamless browsing experience

## Implementation Details

- **Product Data**: The application includes 20 diverse products across multiple categories
- **Cart Functionality**:
  - Add/remove items
  - Update quantities
  - Automatic 10% discount on orders over $100
  - Persistent cart state with Redux
- **Filter Panel**:
  - Category filtering
  - Price range with debounced inputs
  - In-stock filter
  - Sort by price, name, or category
  - Clear filters functionality
- **Responsive Design**:
  - Mobile-first approach
  - Responsive grid layout
  - Adaptive filter panel
  - Touch-friendly controls
- **Performance Optimizations**:
  - Debounced price inputs (800ms)
  - Optimized rendering with proper React hooks
  - Efficient state management
  - Proper cleanup of event listeners and timers

## Testing

- **Focused Testing Strategy**: Tests are focused on critical user interactions and core functionality

  - Cart operations (add, remove, update quantities)
  - Filter and sort functionality
  - Product listing and pagination
  - Key user flows and error states

- **Testing Tools**:
  - Jest for test runner
  - React Testing Library for component testing
  - Mock functions for testing callbacks and Redux actions
- **Test Coverage**: While not all code paths are tested, ensured coverage of:
  - Critical user interactions
  - Core business logic
  - Error handling
  - State management
  - Component rendering
