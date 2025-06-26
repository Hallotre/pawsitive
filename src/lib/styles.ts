// Common input field styles with enhanced readability
export const inputStyles = {
  // Standard text input
  base: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-600",
  
  // Input with icon (password fields, search)
  withIcon: "block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-600",
  
  // Large input for search
  large: "w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 placeholder:text-gray-400 placeholder:font-normal caret-orange-500",
  
  // Number input
  number: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-600"
}

// Select dropdown styles  
export const selectStyles = {
  // Standard select dropdown
  base: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-600",
  
  // Filter dropdown (larger, rounded)
  filter: "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 hover:border-gray-400 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-600",
  
  // Compact select
  compact: "block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-600 bg-white text-gray-900"
}

// Textarea styles
export const textareaStyles = {
  base: "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-600"
}

// Checkbox styles
export const checkboxStyles = {
  base: "rounded border-gray-300 text-orange-500 focus:ring-orange-500 disabled:opacity-50",
  large: "h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded disabled:opacity-50"
}

// Label styles
export const labelStyles = {
  base: "block text-sm font-medium text-gray-700",
  required: "block text-sm font-medium text-gray-700 after:content-['*'] after:ml-0.5 after:text-red-500"
}

// Common button styles
export const buttonStyles = {
  primary: "flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500",
  large: "w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors text-center block disabled:opacity-50 disabled:cursor-not-allowed"
} 