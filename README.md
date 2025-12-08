# EULER - Euler Path Explorer

A sophisticated graph theory visualization web application for exploring Euler paths and circuits.

## Overview

EULER is a browser-based tool for creating, visualizing, and analyzing graphs to find Euler paths. Built with vanilla JavaScript (ES6 modules), it features an orange-themed interface with Leonhard Euler's portrait, mobile-first design with advanced gesture controls, and Sigma.js-powered graph visualization.

### Key Features

- **Graph Creation**: Text-based edge list input and visual editor mode
- **Algorithms**: Euler path/circuit detection (Hierholzer's), Chinese Postman Problem for weighted graphs
- **Mobile-First**: Canvas-based gesture system for mobile, responsive desktop layout
- **Visualization**: Interactive Sigma.js v3 with force-directed layouts
- **Graph Management**: Save/load graphs locally, 6 built-in examples, import/export JSON

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (port 8888)
npm run dev

# Build for production
npm run build
```

## Architecture

**Tech Stack**: Vanilla JavaScript (ES6 modules), Sigma.js v3, Vite, CSS3
**Code Size**: ~10,128 lines of JavaScript (17 modules), ~5,237 lines of CSS (19 files)
**State Management**: Centralized reactive pub/sub pattern
**No Framework**: Pure vanilla JS with ES6 modules

### Project Structure
```
├── index.html              # Main application entry
├── vite.config.js          # Vite configuration
├── js/                     # JavaScript modules
│   ├── main.js            # Application bootstrap
│   ├── core/              # Business logic (state, algorithms, storage)
│   ├── graph/             # Visualization layer (Sigma.js integration)
│   ├── ui/                # Interface components
│   └── utils/             # Utilities (DOM, events, gestures)
├── css/                    # Modular CSS architecture
│   ├── base.css           # Foundation + variables
│   ├── layout.css         # Responsive layouts (758 lines)
│   └── ...                # Component-specific styles
└── CLAUDE.md files         # AI assistance guides in each folder
```

## Interface Design

### Responsive Breakpoint: 768px

- **Desktop (≥769px)**: Side-by-side layout (35% controls, 65% graph)
- **Mobile (≤768px)**: Layered interface with sliding gesture navigation
  - Three states: normal, split (~50%), retracted (graph visible)

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Detailed technical architecture
- [CLAUDE.md](CLAUDE.md) - AI assistance guidelines
- [supposed-issues.md](supposed-issues.md) - Known issues and technical debt
- Individual `CLAUDE.md` files in each module folder


---

*Built with modern web technologies and inspired by Leonhard Euler's mathematical contributions.*