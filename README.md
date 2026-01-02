# Gen Z Streetwear - Shopify Theme

Ein modernes Shopify Theme mit Gen Z Ästhetik, erstellt für Streetwear-Marken.

## Features

- 🎨 **Gen Z Farbpalette**: Electric Lime, Hot Coral, Cyber Cyan
- ✨ **Glow Effects**: Neon-artige Hover-Effekte und Animationen
- 📱 **Responsive Design**: Mobile-first Ansatz
- 🛒 **Cart Drawer**: Slide-out Warenkorb
- 🎯 **Quick Add**: Schnelles Hinzufügen zum Warenkorb

## Installation

### Methode 1: ZIP Upload

1. Komprimiere den `shopify-theme` Ordner zu einer ZIP-Datei
2. Gehe zu deinem Shopify Admin → Online Store → Themes
3. Klicke auf "Add theme" → "Upload zip file"
4. Wähle die ZIP-Datei aus und lade sie hoch

### Methode 2: Shopify CLI

```bash
# Installiere die Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Verbinde mit deinem Store
shopify login --store dein-store.myshopify.com

# Push das Theme
cd shopify-theme
shopify theme push
```

## Ordnerstruktur

```
shopify-theme/
├── assets/
│   ├── base.css              # Haupt-Stylesheet
│   ├── component-variables.css
│   └── main.js               # JavaScript
├── config/
│   ├── settings_schema.json  # Theme-Einstellungen
│   └── settings_data.json    # Standard-Werte
├── layout/
│   └── theme.liquid          # Haupt-Layout
├── locales/
│   └── en.default.json       # Übersetzungen
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero.liquid
│   ├── featured-collection.liquid
│   ├── product-main.liquid
│   ├── collection-header.liquid
│   ├── collection-products.liquid
│   ├── cart-main.liquid
│   └── page-main.liquid
├── snippets/
│   ├── product-card.liquid
│   ├── cart-drawer.liquid
│   └── meta-tags.liquid
└── templates/
    ├── index.json
    ├── product.liquid
    ├── collection.liquid
    ├── cart.liquid
    ├── page.liquid
    └── 404.liquid
```

## Anpassung

### Farben ändern

Im Shopify Admin unter Theme Settings → Colors:
- **Primary**: Electric Lime (#AAFF00)
- **Secondary**: Hot Coral (#FF6B47)
- **Accent**: Cyber Cyan (#00FFFF)

### Schriften

Das Theme nutzt:
- **Bebas Neue**: Überschriften
- **Inter**: Fließtext
- **Permanent Marker**: Akzente

### Social Media

Unter Theme Settings → Social Media die URLs eintragen.

## Support

Bei Fragen oder Problemen: https://lovable.dev/support
