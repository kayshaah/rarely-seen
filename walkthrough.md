# Premium UI Overhaul

The interface has been completely transformed from an experimental physics sandbox into a fully fleshed-out, premium eCommerce homepage.

## 1. Dynamic Top Ticker
- Created a sleek, full-width `promo-ticker` fixed to the very top of the window.
- Powered by a pure CSS `@keyframes` animation, it seamlessly scrolls your sales and promotional text (currently set to "5% Off New User Sale").

## 2. 3-Column Hero Architecture
- The central D3 physics honeycomb is now flanked by two aesthetic glassmorphism sidebars.
- **Spotlight Brand (Left)**: On every page load, the system randomly selects one of the 9 fully scraped brands, fetches its JSON, and injects a featured product.
- **Curated Collections (Right)**: Similarly, the system randomly picks 3 other brands and injects a stack of random items to create an organic, ever-changing "Curated" feel.
- When you click a bubble, these sidebars gracefully fade out to shift focus entirely to the Product Page, and fade back in when you return.
- *Note*: On smaller laptop screens (under 1550px wide), the sidebars will cleanly auto-hide to ensure the honeycomb never feels cramped.

## Aesthetic & Theme Overhaul
- **Background**: Seamless, high-resolution clean blue denim fabric texture.
- **Main Title**: CSS-rendered realistic brown leather jeans patch with embossed "Rarely Seen" typography and thick dashed yellow stitching.
- **Components (Cards & Bubbles)**: All cards, sidebars, and physics bubbles are styled as "woven canvas tags" physically sewn into the denim. They feature off-white backgrounds, dashed thread outlines, and drop shadows to cast onto the jeans.
- **Typography**: Switched to the highly elegant `Montserrat` font for a minimalist, editorial fashion feel.
- **Promo Ticker**: A continuously looping, single-line scrolling banner running at a very slow, elegant 60-second speed.
- **Curated Stack**: Products in the Curated Collections stack zig-zag downwards so they are fully visible. On hover, a wrapper protects against physics jitter while the card smoothly scales up.

## How to Run the Prototype Locally
Because this project uses Javascript `fetch()` to dynamically load JSON data into the interface, opening the `index.html` directly in your browser via `file://` will trigger CORS security errors and the products won't load.

To run this site properly, you must host it on a lightweight local web server. The easiest way to do this is by having the agent run this terminal command inside the project directory:

```bash
python3 -m http.server 8000
```
Then, you can view the site by navigating to [http://localhost:8000](http://localhost:8000) in your web browser!

## 3. Global Mission Footer
- Added a delicate gradient divider (`<hr>`) at the bottom of the content structure.
- Appended a structured `<footer>` containing the "Rarely Seen" mission statement and contact information. 
- Because it is placed at the root layout level, this elegant footer remains visible whether the user is playing with the honeycomb or scrolling through a brand's products!
