import React from "react";

interface BrandLogoProps {
  brand: string;
  size?: number;
}

export default function BrandLogo({ brand, size = 32 }: BrandLogoProps) {
  const norm = brand.toLowerCase().replace(/[^a-z0-9]/g, "");

  switch (norm) {
    case "maruti":
    case "marutisuzuki":
      return (
        <svg width={size * 1.4} height={size * 0.55} viewBox="0 0 190 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left Wing Graphic (Blue) */}
          <g transform="translate(5, 5)">
            <path d="M0 0 L18 0 L12 20 L0 0 Z" fill="#24519E" />
            <path d="M22 0 L40 0 L28 20 L22 0 Z" fill="#24519E" />
            <path d="M4 23 L22 23 L16 43 L4 23 Z" fill="#24519E" />
            <path d="M26 23 L44 23 L34 43 L26 23 Z" fill="#24519E" />
          </g>
          {/* Middle Suzuki 'S' Graphic (Red) */}
          <g transform="translate(52, 5)">
            <path d="M12 0 H36 L12 20 H36 L8 44 H32 L16 24 H32 Z" fill="#E21B23" />
          </g>
          {/* Right Typography (MARUTI SUZUKI) */}
          <text x="96" y="22" fontFamily="Impact, Arial Black, sans-serif" fontSize="20" fontWeight="900" fill="#1A1A1A" letterSpacing="0.5">MARUTI</text>
          <text x="96" y="43" fontFamily="Impact, Arial Black, sans-serif" fontSize="20" fontWeight="900" fill="#1A1A1A" letterSpacing="0.5">SUZUKI</text>
        </svg>
      );
    case "hyundai":
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 140 105" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Metallic / Silver Oval H Emblem */}
          <ellipse cx="70" cy="40" rx="55" ry="32" stroke="#8E99A4" strokeWidth="7" fill="none" />
          <path d="M42 22 V58 M98 22 V58 M42 40 C 58 35, 82 45, 98 40" stroke="#8E99A4" strokeWidth="10" strokeLinecap="round" />
          {/* HYUNDAI Text */}
          <text x="70" y="92" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" fontWeight="900" fill="#113977" textAnchor="middle" letterSpacing="1.5">HYUNDAI</text>
        </svg>
      );
    case "honda":
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 120 95" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Red Square H Emblem */}
          <rect x="25" y="5" width="70" height="55" rx="10" fill="#E2001A" />
          <path d="M40 18 H48 V34 C48 46, 72 46, 72 34 V18 H80 V34 C80 50, 40 50, 40 34 Z" fill="#FFFFFF" />
          {/* HONDA Text */}
          <text x="60" y="84" fontFamily="Arial, Helvetica, sans-serif" fontSize="20" fontWeight="900" fill="#E2001A" textAnchor="middle" letterSpacing="1">HONDA</text>
        </svg>
      );
    case "tata":
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 120 95" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Blue Oval Emblem */}
          <ellipse cx="60" cy="35" rx="50" ry="28" fill="#0F387A" />
          <path d="M60 14 C74 24, 82 38, 82 54 M60 14 C46 24, 38 38, 38 54 M60 14 V58" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
          {/* TATA Text */}
          <text x="60" y="85" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fontWeight="900" fill="#0F387A" textAnchor="middle" letterSpacing="2">TATA</text>
        </svg>
      );
    case "ford":
      return (
        <svg width={size} height={size * 0.5} viewBox="0 0 140 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="70" cy="35" rx="65" ry="30" fill="url(#fordGrad)" stroke="#FFFFFF" strokeWidth="4" />
          <ellipse cx="70" cy="35" rx="63" ry="28" stroke="#103F7B" strokeWidth="2" fill="none" />
          <defs>
            <linearGradient id="fordGrad" x1="0" y1="0" x2="0" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1B59B3" />
              <stop offset="1" stopColor="#0B2754" />
            </linearGradient>
          </defs>
          <text x="70" y="44" fontFamily="'Brush Script MT', Georgia, serif" fontSize="32" fontWeight="bold" fontStyle="italic" fill="#FFFFFF" textAnchor="middle">Ford</text>
        </svg>
      );
    case "volkswagen":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#185A9D" />
          <circle cx="50" cy="50" r="41" stroke="#ffffff" strokeWidth="4" fill="none" />
          <path d="M28 32 L44 72 H56 L72 32 H62 L50 60 L38 32 Z" fill="#ffffff" />
          <path d="M22 25 L41 62 H59 L78 25 H67 L50 50 L33 25 Z" fill="#ffffff" />
        </svg>
      );
    case "mahindra":
      return (
        <svg width={size} height={size * 0.9} viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 15 L50 75 L85 15" stroke="#DD1B1B" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M35 15 L50 45 L65 15" stroke="#DD1B1B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 45 V80" stroke="#DD1B1B" strokeWidth="8" strokeLinecap="round" />
        </svg>
      );
    case "renault":
      return (
        <svg width={size * 0.8} height={size} viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="renaultGrad1" x1="0" y1="0" x2="100" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F0F2F4" />
              <stop offset="35%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#7E8790" />
              <stop offset="100%" stopColor="#2C3238" />
            </linearGradient>
            <linearGradient id="renaultGrad2" x1="100" y1="0" x2="0" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#A5ACB2" />
              <stop offset="100%" stopColor="#1A1F24" />
            </linearGradient>
          </defs>
          {/* Outer Diamond Bevel Right */}
          <path d="M50 5 L95 48 L80 58 L50 25 L50 5 Z" fill="url(#renaultGrad1)" stroke="#333" strokeWidth="1" />
          {/* Outer Diamond Bevel Left */}
          <path d="M50 5 L50 25 L20 58 L5 48 L50 5 Z" fill="url(#renaultGrad2)" stroke="#333" strokeWidth="1" />
          {/* Lower Diamond Bevel Right */}
          <path d="M95 48 L50 110 L50 90 L80 58 L95 48 Z" fill="url(#renaultGrad2)" stroke="#333" strokeWidth="1" />
          {/* Lower Diamond Bevel Left */}
          <path d="M5 48 L20 58 L50 90 L50 110 L5 48 Z" fill="url(#renaultGrad1)" stroke="#333" strokeWidth="1" />
          {/* Inner Cutout Bevels */}
          <path d="M50 35 L68 58 L50 82 L32 58 Z" fill="#FFFFFF" stroke="#666" strokeWidth="1" />
          <path d="M50 42 L62 58 L50 75 L38 58 Z" fill="#FFFFFF" />
        </svg>
      );
    case "chevrolet":
      return (
        <svg width={size} height={size * 0.4} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M35 5 H65 L60 15 H85 V25 H55 L60 35 H30 L35 25 H15 V15 H40 Z" fill="#F0A800" stroke="#222222" strokeWidth="3" strokeLinejoin="round" />
        </svg>
      );
    case "toyota":
      return (
        <svg width={size} height={size * 0.75} viewBox="0 0 100 75" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="37.5" rx="45" ry="32" stroke="#222222" strokeWidth="5" fill="none" />
          <ellipse cx="50" cy="28" rx="28" ry="18" stroke="#222222" strokeWidth="5" fill="none" />
          <ellipse cx="50" cy="37.5" rx="14" ry="32" stroke="#222222" strokeWidth="5" fill="none" />
        </svg>
      );
    case "kia":
      return (
        <svg width={size} height={size * 0.55} viewBox="0 0 100 55" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="27.5" rx="48" ry="24" stroke="#C3002F" strokeWidth="4" />
          <text x="50" y="36" fontFamily="Arial, Helvetica, sans-serif" fontSize="26" fontWeight="900" fill="#C3002F" textAnchor="middle" letterSpacing="2">KIA</text>
        </svg>
      );
    case "nissan":
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="40" r="35" stroke="#1A1A1A" strokeWidth="6" fill="none" />
          <rect x="5" y="28" width="90" height="24" fill="#1A1A1A" rx="3" />
          <text x="50" y="45" fontFamily="Arial, sans-serif" fontSize="15" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="2">NISSAN</text>
        </svg>
      );
    case "skoda":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" stroke="#4BA829" strokeWidth="6" fill="none" />
          <path d="M45 25 L65 35 L40 50 L70 50 L45 75" stroke="#4BA829" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    case "fiat":
      return (
        <svg width={size} height={size * 0.8} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="80" height="60" rx="15" fill="#990022" stroke="#CCCCCC" strokeWidth="3" />
          <text x="50" y="50" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="3">FIAT</text>
        </svg>
      );
    case "datsun":
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="30" rx="46" ry="26" fill="#0F387A" stroke="#CCCCCC" strokeWidth="3" />
          <rect x="15" y="20" width="70" height="20" fill="#0F387A" />
          <text x="50" y="36" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="1">DATSUN</text>
        </svg>
      );
    case "mg":
    case "mgmotor":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 10 L70 10 L90 30 L90 70 L70 90 L30 90 L10 70 L10 30 Z" fill="#880015" stroke="#1A1A1A" strokeWidth="5" />
          <text x="50" y="60" fontFamily="Arial, sans-serif" fontSize="36" fontWeight="900" fill="#FFFFFF" textAnchor="middle">MG</text>
        </svg>
      );
    case "bmw":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="46" fill="#000000" />
          <circle cx="50" cy="50" r="30" fill="#FFFFFF" />
          <path d="M50 20 A30 30 0 0 1 80 50 H50 Z" fill="#0066B1" />
          <path d="M50 50 V80 A30 30 0 0 1 20 50 Z" fill="#0066B1" />
          <circle cx="50" cy="50" r="46" stroke="#CCCCCC" strokeWidth="3" fill="none" />
        </svg>
      );
    case "mercedes":
    case "mercedesbenz":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#8A929A" strokeWidth="5" fill="none" />
          <path d="M50 50 L50 8 M50 50 L84 70 M50 50 L16 70" stroke="#8A929A" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    case "audi":
      return (
        <svg width={size * 1.5} height={size * 0.5} viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="25" r="20" stroke="#1A1A1A" strokeWidth="5" fill="none" />
          <circle cx="56" cy="25" r="20" stroke="#1A1A1A" strokeWidth="5" fill="none" />
          <circle cx="82" cy="25" r="20" stroke="#1A1A1A" strokeWidth="5" fill="none" />
          <circle cx="108" cy="25" r="20" stroke="#1A1A1A" strokeWidth="5" fill="none" />
        </svg>
      );
    case "jeep":
      return (
        <svg width={size * 1.3} height={size * 0.5} viewBox="0 0 130 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="65" y="38" fontFamily="Impact, Arial, sans-serif" fontSize="40" fontWeight="900" fill="#2E5235" textAnchor="middle" letterSpacing="3">Jeep</text>
        </svg>
      );
    case "volvo":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="45" cy="55" r="35" stroke="#102A45" strokeWidth="6" fill="none" />
          <path d="M68 32 L88 12 M88 12 H72 M88 12 V28" stroke="#102A45" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="18" y="46" width="54" height="18" fill="#102A45" />
          <text x="45" y="60" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="900" fill="#FFFFFF" textAnchor="middle" letterSpacing="1">VOLVO</text>
        </svg>
      );
    case "porsche":
      return (
        <svg width={size * 0.8} height={size} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10 L90 20 L80 110 L50 115 L20 110 L10 20 Z" fill="#D4AF37" stroke="#1A1A1A" strokeWidth="4" />
          <text x="50" y="32" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="900" fill="#1A1A1A" textAnchor="middle" letterSpacing="1">PORSCHE</text>
        </svg>
      );
    case "hindustanmotors":
    case "hindustan":
      return (
        <svg width={size * 1.2} height={size * 0.7} viewBox="0 0 120 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="100" height="50" rx="6" fill="#00529C" />
          <text x="60" y="35" fontFamily="Arial, sans-serif" fontSize="22" fontWeight="900" fill="#FFCC00" textAnchor="middle">HM</text>
          <text x="60" y="52" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">Hindustan Motors</text>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="100" height="100" rx="20" fill="var(--border)" />
          <text x="50" y="58" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="var(--text-muted)" textAnchor="middle">{brand.substring(0, 2).toUpperCase()}</text>
        </svg>
      );
  }
}
