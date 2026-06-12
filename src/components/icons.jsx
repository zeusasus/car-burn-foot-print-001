import React from "react";

// Spinning Golden Core Drill SVG
export const DrillIcon = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`svg-icon icon-drill ${className}`}
    style={{ transition: "transform 0.3s ease" }}
  >
    <path 
      d="M12 2L6 8H18L12 2Z" 
      fill="#F59E0B" 
      stroke="#D97706" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    <path 
      d="M8 8L5 13H19L16 8H8Z" 
      fill="#FBBF24" 
      stroke="#D97706" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    <path 
      d="M10 13L7 17H17L14 13H10Z" 
      fill="#FDE68A" 
      stroke="#D97706" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    <path 
      d="M11 17L9 20C9 21.1 9.9 22 11 22H13C14.1 22 15 21.1 15 20L13 17H11Z" 
      fill="#FFFBEB" 
      stroke="#D97706" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    {/* Inner details to represent spirals on the drill */}
    <path d="M12 4V20" stroke="#B45309" strokeWidth="1" strokeDasharray="2 3" />
  </svg>
);

// Kamina's Signature Red Triangle Sunglasses SVG
export const GlassesIcon = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`svg-icon icon-glasses ${className}`}
  >
    {/* Left Lens (Sharp Triangle pointing down-left) */}
    <polygon 
      points="2,9 11,9 5,14" 
      fill="#BE123C" 
      stroke="#991B1B" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    {/* Right Lens (Sharp Triangle pointing down-right) */}
    <polygon 
      points="13,9 22,9 19,14" 
      fill="#BE123C" 
      stroke="#991B1B" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    {/* Connecting Bridge */}
    <path 
      d="M11 9.5H13" 
      stroke="#991B1B" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </svg>
);

// Spinning Green Spiral Vortex SVG (representing Spiral Power and offset)
export const SpiralIcon = ({ className = "", size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={`svg-icon icon-spiral ${className}`}
  >
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 7.5 18.5 4 14.5 4C11 4 8 6.5 8 10C8 12.5 10 14.5 12.5 14.5C14.5 14.5 16 13 16 11.5C16 10.5 15 9.5 13.8 9.5C13 9.5 12.5 10 12.5 10.5C12.5 11 13 11.5 13.5 11.5C13.5 11.5 14 11 14 10.8C14 10.8 13.8 10.5 13 10.5C12 10.5 11 11.5 11 12.5C11 13.8 12.2 15 13.8 15C15.8 15 17.5 13.2 17.5 11C17.5 8.2 15 6 12 6C8.5 6 5.5 8.8 5.5 12.5C5.5 16.8 9 20 13.2 20C17.8 20 21 16.5 21 12.5" 
      stroke="#10B981" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </svg>
);

// Sleek Car Icon SVG
export const CarIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.85 7H17.14L18.2 10H5.8L6.85 7ZM19 17H5V13H19V17Z" 
      fill="currentColor" 
    />
    <circle cx="7.5" cy="15" r="1.5" fill="currentColor" />
    <circle cx="16.5" cy="15" r="1.5" fill="currentColor" />
  </svg>
);

// Sleek Plate Icon SVG (Food)
export const PlateIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M2 19C2 19.55 2.45 20 3 20H21C21.55 20 22 19.55 22 19V18H2V19ZM12 3C7.58 3 4 6.58 4 11H20C20 6.58 16.42 3 12 3ZM12 4.9C13.5 4.9 14.9 5.8 15.6 7.2C15.8 7.6 15.6 8.1 15.2 8.3C14.8 8.5 14.3 8.3 14.1 7.9C13.7 7.1 12.9 6.6 12 6.6C11.1 6.6 10.3 7.1 9.9 7.9C9.7 8.3 9.2 8.5 8.8 8.3C8.4 8.1 8.2 7.6 8.4 7.2C9.1 5.8 10.5 4.9 12 4.9Z" 
      fill="currentColor" 
    />
  </svg>
);

// Sleek Lightbulb Icon SVG (Energy/Reactor)
export const LightbulbIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M9 21C9 21.55 9.45 22 10 22H14C14.55 22 15 21.55 15 21V20H9V21ZM12 2C7.58 2 4 5.58 4 10C4 12.78 5.42 15.22 7.58 16.69V19C7.58 19.55 8.03 20 8.58 20H15.42C15.97 20 16.42 19.55 16.42 19V16.69C18.58 15.22 20 12.78 20 10C20 5.58 16.42 2 12 2ZM14.5 14.8V18H9.5V14.8L9 14.45C7.45 13.38 6.5 11.75 6.5 10C6.5 6.97 8.97 4.5 12 4.5C15.03 4.5 17.5 6.97 17.5 10C17.5 11.75 16.55 13.38 15 14.45L14.5 14.8Z" 
      fill="currentColor" 
    />
  </svg>
);

// Sleek Water Drop Icon SVG (Shower & Water)
export const WaterIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M12 2.69C11.77 2.69 11.55 2.78 11.38 2.95L5.4 8.93C3.21 11.12 2 14.03 2 17.13C2 20.37 4.63 23 7.87 23C9.9 23 11.73 21.96 12.79 20.27C12.91 20.08 12.91 19.83 12.79 19.64C12.67 19.45 12.44 19.34 12.21 19.34C9.82 19.34 7.87 17.4 7.87 15C7.87 14.59 7.53 14.25 7.12 14.25C6.71 14.25 6.37 14.59 6.37 15C6.37 18.22 8.99 20.84 12.21 20.84C14.73 20.84 16.92 19.23 17.65 16.82C17.84 16.2 18.5 15.86 19.12 16.05C19.74 16.24 20.08 16.9 19.89 17.52C19.31 19.46 17.92 21.09 16.1 22.01C14.85 22.64 13.44 22.99 12 23C15.31 23 18 20.31 18 17C18 13.97 16.79 11.03 14.6 8.85L12.62 2.95C12.45 2.78 12.23 2.69 12 2.69Z" 
      fill="currentColor" 
    />
  </svg>
);

// Sleek Book Icon SVG (Paper & Books)
export const BookIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H7V12L9.5 9.5L12 12V4H18V20Z" 
      fill="currentColor" 
    />
  </svg>
);

// Sleek Clothing Icon SVG
export const ClothingIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M18 2H15C14.45 2 14 2.45 14 3C14 4.1 13.1 5 12 5C10.9 5 10 4.1 10 3C10 2.45 9.55 2 9 2H6C4.9 2 4 2.9 4 4V7C4 7.55 4.45 8 5 8H7V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V8H19C19.55 8 20 7.55 20 7V4C20 2.9 19.1 2 18 2ZM15 20H9V8H15V20ZM18 6H16V4H18V6ZM6 6V4H8V6H6Z" 
      fill="currentColor" 
    />
  </svg>
);

// Sleek Screen Icon SVG (Streaming)
export const ScreenIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M21 2H3C1.9 2 1 2.9 1 4V16C1 17.1 1.9 18 3 18H10V20H8C7.45 20 7 20.45 7 21C7 21.55 7.45 22 8 22H16C16.55 22 17 21.55 17 21C17 20.45 16.55 20 16 20H14V18H21C22.1 18 23 17.1 23 16V4C23 2.9 22.1 2 21 2ZM21 16H3V4H21V16Z" 
      fill="currentColor" 
    />
  </svg>
);

// Sleek Shopping Cart Icon SVG (Online Delivery)
export const CartIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" 
      fill="currentColor" 
    />
  </svg>
);

// Sleek Sun/Weather Icon SVG
export const SunIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="5" fill="currentColor" />
    <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Sleek Cloud/AQI Icon SVG
export const CloudIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path 
      d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04ZM19 18H6C3.79 18 2 16.21 2 14C2 11.95 3.53 10.24 5.56 10.03L6.63 9.92L7.13 8.97C8.08 7.14 9.94 6 12 6C14.62 6 16.88 7.86 17.39 10.43L17.69 11.93L19.22 12.04C20.78 12.14 22 13.45 22 15C22 16.65 20.65 18 19 18Z" 
      fill="currentColor" 
    />
  </svg>
);

// Sleek Wind Icon SVG
export const WindIcon = ({ className = "", size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M2 12H20C21.1 12 22 11.1 22 10C22 8.9 21.1 8 20 8C18.9 8 18 8.9 18 10M2 8H16C17.1 8 18 7.1 18 6C18 4.9 17.1 4 16 4C14.9 4 14 4.9 14 6M2 16H18C19.1 16 20 16.9 20 18C20 19.1 19.1 20 18 20C16.9 20 16 19.1 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
