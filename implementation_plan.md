# Hero Page UI Overhaul

We will dramatically enhance the aesthetic appeal of the landing page by introducing a 3-column layout, a dynamic top ticker, and an elegant footer.

## User Review Required
Please review the layout changes below. Since the honeycomb physics engine currently takes up a large 1000px wide box in the center of the screen, adding side panels might make the layout tight on smaller laptop screens. I will implement a responsive flexbox layout to ensure the side panels scale elegantly or float securely on the sides.

## Proposed Changes

### 1. Global Ticker Tape (`index.html`, `styles.css`)
- **[NEW]** `<div class="promo-ticker">` at the absolute top of the page.
- Using CSS `@keyframes`, it will continuously scroll text horizontally like a stock ticker (e.g., "Welcome to Rarely Seen • 5% Off New User Sale • Discover Emerging Brands").

### 2. 3-Column Hero Layout (`index.html`, `styles.css`)
- **[MODIFY]** Wrap the `honeycomb-container` inside a new `hero-layout` flex container.
- **[NEW]** `sidebar-left`: A glassmorphism rounded card titled "Spotlight Brand".
- **[NEW]** `sidebar-right`: A vertical stack titled "Curated Collections".

### 3. Dynamic Sidebar Content (`app.js`)
- On page load, `app.js` will randomly select one of our fully-scraped brands (e.g., Qala Clothing), fetch its JSON database, and inject a random beautiful product image and price into the **Spotlight Brand** box.
- It will also pick 3 random products from our scraped databases to populate the **Curated Collections** right sidebar.

### 4. Global Footer (`index.html`, `styles.css`)
- **[NEW]** Add an elegant `<hr>` divider at the bottom of the page.
- **[NEW]** Add a `<footer>` containing a brief, aesthetic mission statement about "Rarely Seen" and placeholder contact info. This will be placed at the root level so it remains visible when transitioning between the Hero Page and Product Pages.

## Verification Plan
- Refresh the page to ensure the ticker scrolls smoothly across the top.
- Verify the 3-column layout safely bounds the honeycomb physics without overlapping.
- Verify random products successfully load into the sidebars on page load.
- Click a bubble to transition to the Product Page and ensure the bottom footer remains visible.
