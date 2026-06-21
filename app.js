document.addEventListener('DOMContentLoaded', () => {
    console.log('Rarely Seen D3 Physics Engine Loaded.');

    const brandNames = [
        "Leaclothingco", "Label society", "&thensome", "Imsoo", "shopmauve.in", 
        "10.30pm", "shop&yours", "Shopdiris", "Ms.maven", "Orange at eight", 
        "Kind inside", "Summersoul", "Twelvthedit", "Neelmii", "Essgee", 
        "Qalaclothing", "Summeraway", "sunday loveshop", "Sunday molly", "Live in Pause", 
        "The pink elephant", "Ruiaan", "Lovechoje", "Poppiclothing", "Moontara", 
        "Fancypastelsindia", "The missy co", "Girls dont dress for boys", "Lazzo store", "Nef’s finds",
        "ikaari", "House of mae", "Blomas", "Urban suburban", "Weaving cult", 
        "Truffle", "Amoshi", "Muvazo", "Ribble", "autumn summer", 
        "Evie rose", "True west fashion", "Ever pret", "Disobedience chennai", "Mnsh.design", 
        "Pariparilife", "Lovetobag", "Dhora india", "Mayabazaar jewellery", "No Na Me", 
        "Upkarna jewellery store", "A little extra", "Jewels mars", "I blame beads",
        "Beeglee", "Palay", "Rerunn", "Outcast", "Rok forces"
    ];

    // Splash Screen Logic
    const splashOverlay = document.getElementById('splash-overlay');
    const splashBrandsContainer = document.getElementById('splash-brands');

    if (!sessionStorage.getItem('splashShown')) {
        // Pick 3 random brands
        const shuffled = [...brandNames].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);
        
        splashBrandsContainer.innerHTML = selected.map(b => `<div>${b}</div>`).join('');
        
        splashOverlay.addEventListener('click', () => {
            splashOverlay.style.opacity = '0';
            setTimeout(() => {
                splashOverlay.style.display = 'none';
                // Small bump to the physics engine when entering
                if (window.simulation) window.simulation.alpha(0.8).restart();
            }, 500);
            sessionStorage.setItem('splashShown', 'true');
        });
    } else {
        splashOverlay.style.display = 'none';
    }

    const container = document.getElementById('honeycomb-container');
    const isMobile = window.innerWidth <= 768;
    const width = isMobile ? window.innerWidth : 1000;
    const height = isMobile ? 600 : 850;
    const TOTAL_BRANDS = brandNames.length;
    const BASE_RADIUS = isMobile ? 40 : 75;  // Mobile: 80px diameter, Desktop: 150px
    const HOVER_RADIUS = isMobile ? 70 : 130; // Mobile: 140px diameter, Desktop: 260px
    const SHRINK_RADIUS = isMobile ? 25 : 40; // Mobile: 50px diameter, Desktop: 80px
    const GAP = isMobile ? 1 : 2;

    // --- Hero Sidebars Logic ---
    const scrapedBrandsList = [
        "Leaclothingco", "Label society", "shopmauve.in", "Neelmii", "Qalaclothing", 
        "Summeraway", "sunday loveshop", "Moontara", "Fancypastelsindia", "Ms.maven", 
        "Orange at eight", "Essgee", "Ruiaan", "10.30pm", "shop&yours", "Imsoo", 
        "&thensome", "Shopdiris", "The pink elephant", "Kind inside", "Twelvthedit", 
        "The missy co", "Lovechoje", "Sunday molly", "Poppiclothing", "Nef’s finds",
        "House of mae", "Blomas", "Weaving cult", "Truffle", "Amoshi", 
        "Muvazo", "Ribble", "autumn summer", "Evie rose", "True west fashion", 
        "Ever pret", "Disobedience chennai", "Mnsh.design", "Pariparilife", 
        "Lovetobag", "Dhora india", "Mayabazaar jewellery", "No Na Me", 
        "Upkarna jewellery store", "A little extra", "Jewels mars", "I blame beads",
        "Beeglee", "Palay", "Rerunn", "Outcast", "Rok forces"
    ];
    
    function initSidebars() {
        const shuffledBrands = [...scrapedBrandsList].sort(() => 0.5 - Math.random());
        const newArrivalBrand = shuffledBrands[0];
        const limitedEditionBrand = shuffledBrands[1];
        const spotlightBrand = shuffledBrands[2];
        const curatedBrands = shuffledBrands.slice(3, 6);

        function injectSingleCard(brand, elementId) {
            fetch(`${brand}_products.json?v=2`)
                .then(res => res.json())
                .then(products => {
                    if(products.length > 0) {
                        const randomProd = products[Math.floor(Math.random() * Math.min(20, products.length))];
                        const urlAttr = randomProd.url ? `onclick="window.open('${randomProd.url}', '_blank')" style="cursor: pointer;"` : '';
                        document.getElementById(elementId).innerHTML = `
                            <div ${urlAttr} style="height:100%; width:100%; display:flex; flex-direction:column; align-items:center;">
                                <img class="spotlight-img" src="${randomProd.image}" alt="${brand}">
                                <div class="spotlight-brand-name">${brand}</div>
                                <div class="spotlight-price">₹${randomProd.price}</div>
                            </div>
                        `;
                    }
                })
                .catch(e => console.log('Error loading', elementId, e));
        }

        // Load Top & Bottom Cards
        injectSingleCard(newArrivalBrand, 'new-arrival-card');
        injectSingleCard(limitedEditionBrand, 'limited-edition-card');
        injectSingleCard(spotlightBrand, 'spotlight-card');

        // Load Curated
        const curatedStack = document.getElementById('curated-stack');
        curatedStack.innerHTML = '';
        curatedBrands.forEach((brand, index) => {
            fetch(`${brand}_products.json?v=2`)
                .then(res => res.json())
                .then(products => {
                    if(products.length > 0) {
                        const randomProd = products[Math.floor(Math.random() * Math.min(20, products.length))];
                        const urlAttr = randomProd.url ? `onclick="window.open('${randomProd.url}', '_blank')"` : '';
                        
                        // Zig-zag stacking logic
                        const angle = index === 0 ? -12 : index === 1 ? 8 : -6;
                        const tx = index === 0 ? -40 : index === 1 ? 30 : -20;
                        const ty = (index * 45) - 30; // Separates them vertically!
                        
                        const html = `
                            <div class="curated-polaroid-wrapper" style="transform: translate(${tx}px, ${ty}px) rotate(${angle}deg); z-index: ${index}; cursor: pointer;" ${urlAttr}>
                                <div class="curated-polaroid">
                                    <img class="curated-polaroid-img" src="${randomProd.image}" alt="Curated">
                                    <div class="curated-polaroid-brand">${brand}</div>
                                </div>
                            </div>
                        `;
                        curatedStack.insertAdjacentHTML('beforeend', html);
                    }
                })
                .catch(e => console.log('Error loading curated', e));
        });
    }

    initSidebars();

    // State for lazy loading products
    window.allBrandProducts = [];
    window.currentProducts = [];
    window.productsLoaded = 0;

    function loadMoreProducts() {
        if (!window.currentProducts || window.currentProducts.length === 0) return;
        
        const prodGrid = document.getElementById('product-grid');
        const loadBtn = document.getElementById('load-more-btn');
        const toLoad = window.currentProducts.slice(window.productsLoaded, window.productsLoaded + 12);
        
        if (toLoad.length === 0) {
            if (loadBtn) loadBtn.style.display = 'none';
            return;
        }
        
        const html = toLoad.map(product => {
            if (product.isDummy) {
                return `
                <div class="product-item">
                    <div class="product-image-ph" style="background: linear-gradient(135deg, hsl(${product.hue1}, 20%, 85%), hsl(${product.hue2}, 30%, 75%));"></div>
                    <div class="product-details">
                        <div class="product-name">${product.title}</div>
                        <div class="product-price">₹${product.price}</div>
                    </div>
                </div>
                `;
            }

            const urlAttr = product.url ? `onclick="window.open('${product.url}', '_blank')" style="cursor: pointer; opacity: 0; animation: fadeInContent 0.6s ease forwards;"` : `style="opacity: 0; animation: fadeInContent 0.6s ease forwards;"`;
            return `
            <div class="product-item" ${urlAttr}>
                <img class="product-image" src="${product.image}" alt="${product.title}">
                <div class="product-details">
                    <div class="product-name">${product.title}</div>
                    <div class="product-price">₹${product.price}</div>
                </div>
            </div>
            `;
        }).join('');
        
        prodGrid.insertAdjacentHTML('beforeend', html);
        window.productsLoaded += 12;

        if (window.productsLoaded >= window.currentProducts.length) {
            if (loadBtn) loadBtn.style.display = 'none';
        } else {
            if (loadBtn) loadBtn.style.display = 'inline-block';
        }
    }

    // Attach click listener to load more button
    document.getElementById('load-more-btn').addEventListener('click', loadMoreProducts);

    // Filter logic
    document.getElementById('apply-filter-btn').addEventListener('click', () => {
        if (!window.allBrandProducts) return;
        const minVal = parseFloat(document.getElementById('min-price').value);
        const maxVal = parseFloat(document.getElementById('max-price').value);
        const category = document.getElementById('category-filter').value;
        
        const topsKeywords = ['top', 'shirt', 'blouse', 'tunic', 'tee', 't-shirt', 'corset', 'jacket', 'coat', 'shacket', 'kurta', 'crop'];
        const bottomsKeywords = ['bottom', 'pant', 'trouser', 'skirt', 'jean', 'short', 'legging', 'track', 'jogger', 'denim'];
        const dressesKeywords = ['dress', 'gown', 'maxi', 'midi', 'mini'];
        const coordsKeywords = ['co-ord', 'coord', 'set', 'suit', 'pair'];

        window.currentProducts = window.allBrandProducts.filter(p => {
            const priceStr = String(p.price).replace(/,/g, '');
            const price = parseFloat(priceStr);
            
            if (!isNaN(price)) {
                if (!isNaN(minVal) && price < minVal) return false;
                if (!isNaN(maxVal) && price > maxVal) return false;
            }
            
            if (category !== 'all') {
                const titleLower = (p.title || '').toLowerCase();
                let isTop = topsKeywords.some(kw => titleLower.includes(kw));
                let isBottom = bottomsKeywords.some(kw => titleLower.includes(kw));
                let isDress = dressesKeywords.some(kw => titleLower.includes(kw));
                let isCoord = coordsKeywords.some(kw => titleLower.includes(kw));
                
                if (p.isDummy) {
                   // Assign them pseudo-randomly to categories for the demo
                   isTop = p.hue1 % 4 === 0;
                   isBottom = p.hue1 % 4 === 1;
                   isDress = p.hue1 % 4 === 2;
                   isCoord = p.hue1 % 4 === 3;
                }

                if (category === 'tops' && !isTop) return false;
                if (category === 'bottoms' && !isBottom) return false;
                if (category === 'dresses' && !isDress) return false;
                if (category === 'coords' && !isCoord) return false;
            }

            return true;
        });
        
        window.productsLoaded = 0;
        document.getElementById('product-grid').innerHTML = '';
        loadMoreProducts();
    });

    // Create node data
    const nodes = d3.range(TOTAL_BRANDS).map(i => {
        const brandName = brandNames[i];
        const logos = {
            "Leaclothingco": "https://cdn.shopify.com/s/files/1/0518/6768/0952/files/LEA_LOGO_1.png",
            "shopmauve.in": "https://www.shopmauve.in/cdn/shop/files/LOGO_16.png",
            "Neelmii": "https://www.neelmii.com/cdn/shop/files/LOGO_744e7ea4-7361-4675-9554-7c909b295be1.png",
            "Live in Pause": "https://liveinpause.com/wp-content/uploads/2026/01/cropped-pause-logo-150x150.png",
            "Fancypastelsindia": "https://fancypastels.com/cdn/shop/files/newlogoround_2048x2048.png",
            "Ms.maven": "https://www.msmaven.in/cdn/shop/files/final_logo_text-01.png?v=1749458046&width=600",
            "Orange at eight": "https://orangeateight.com/cdn/shop/files/Copy_of_Orange_at_Eight_logo_file-03.png?v=1773228678&width=1200",
            "Essgee": "https://essgee.co/cdn/shop/files/logo-01_140x.png?v=1651489454",
            "Ruiaan": "https://www.ruiaan.com/cdn/shop/files/No_BG_-_Ruiaan_Logo.png?v=1769758432&width=612",
            "Imsoo": "https://studioimsoo.com/cdn/shop/files/Logo.png?height=33&v=1756924662",
            "&thensome": "https://andthensome.in/cdn/shop/files/Secondary_Logo_Black_200x.png?v=1733998955",
            "Shopdiris": "https://shopdiris.com/cdn/shop/files/logo_4.webp?v=1716622489",
            "Kind inside": "https://kindinside.in/cdn/shop/files/LogoFIN.png?v=1740981168&width=600",
            "Summeraway": "https://summeraway.in/cdn/shop/files/logo.png?v=1736140549&width=320",
            "The missy co": "https://themissyco.in/cdn/shop/files/black_missy_logo.png?v=1745332586&width=600",
            "Sunday molly": "https://sundaymolly.com/cdn/shop/files/SM_Logo_White.png?v=1771171260&width=400",
            "Poppiclothing": "https://poppi.in/cdn/shop/files/Logo-New-01_150x.png?v=1727727623",
            "Nef’s finds": "https://nefsfinds.com/cdn/shop/files/logo2.png?v=1738240189",
            "House of mae": "https://www.houseofmae.shop/cdn/shop/files/Website_Logo_1_180x.png?v=1703572037",
            "Amoshi": "https://amoshi.in/cdn/shop/files/Amoshi_Logo_R_Black_3fea0cb8-f3c2-44f4-8310-487794e1f6d3.png?v=1733312611&width=2603",
            "Muvazo": "https://cdn.shopify.com/s/files/1/0651/9006/8440/files/Muvazo_Logo_1_1cce44bb-3bc8-4674-b04c-307f282a3d7e.png?v=1763035308",
            "Ribble": "https://ribelle.in/cdn/shop/files/white-logo.png?v=1669205485&width=600",
            "autumn summer": "https://www.autumnsummer.in/cdn/shop/files/Logo.png?v=1758892459&width=3840",
            "Evie rose": "https://evierose.in/cdn/shop/files/Logo_White.png?v=1721029614&width=320",
            "True west fashion": "https://www.truewest.in/cdn/shop/files/Transparent-logo2.png?v=1710062536&width=600",
            "Ever pret": "https://everpret.com/cdn/shop/files/Logo_Symbol_Cropped_Black.png?v=1713618697&width=721",
            "Mnsh.design": "https://mnsh.co/cdn/shop/files/logo-01_2_e4a528ab-501d-4d60-a78d-16cfeffc0445.png?crop=center&height=78&v=1775561847&width=280",
            "Pariparilife": "https://pariparilife.com/cdn/shop/files/logo_02cda6f1-e609-4b8c-8373-d24f6f8396aa_300x300.png?v=1619286524",
            "Mayabazaar jewellery": "https://shopmaya.in/cdn/shop/files/logo_2_1445x.png?v=1644254002",
            "No Na Me": "https://www.nonamejewelry.in/cdn/shop/files/LOGOTYPE-thicker-2-01_7051b831-719d-48f6-8e45-992bf5efdb6c.png?v=1685001334",
            "Upkarna jewellery store": "https://upakarna.com/cdn/shop/files/golden_logo_1.jpg?v=1753339450&width=300",
            "Jewels mars": "https://jewelsmars.com/cdn/shop/files/Jewelsmars_Logo.svg?v=1745510170&width=330",
            "Outcast": "https://outcasts.in/cdn/shop/files/logo_outcast_1.png?v=1735300677&width=380"
        };
        const logo = logos[brandName] || null;

        // Initial rough grid placement to help D3 settle into honeycomb faster
        const cols = 7;
        const row = Math.floor(i / cols);
        const col = i % cols;
        return {
            id: i,
            brand: brandName,
            logo: logo,
            radius: BASE_RADIUS,
            targetRadius: BASE_RADIUS,
            x: width / 2 + (col - cols/2) * (BASE_RADIUS * 2),
            y: height / 2 + (row - 2) * (BASE_RADIUS * 2)
        };
    });

    // Create D3 physics simulation
    window.simulation = d3.forceSimulation(nodes)
        .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05))
        .force('x', d3.forceX(width / 2).strength(0.05)) // Pull towards center
        .force('y', d3.forceY(height / 2).strength(0.05)) // Pull towards center
        .force('collide', d3.forceCollide().radius(d => d.radius + GAP).iterations(4))
        .alphaDecay(0.02); // Slower decay for smoother settling

    // Create DOM elements
    const bubbles = d3.select('#honeycomb-container').selectAll('.bubble')
        .data(nodes)
        .enter()
        .append('div')
        .attr('class', 'bubble')
        .html(d => {
            if (d.brand === "Leaclothingco" && d.logo) {
                // Leaclothingco explicitly allows CORS, so mask works and we color it pink
                return `<div class="bubble-logo-mask" style="background-color: #ff477e; -webkit-mask-image: url('${d.logo}'); mask-image: url('${d.logo}');"></div>`;
            } else if (d.logo) {
                // Use standard img tag because cross-origin CDNs block CSS masks
                const whiteLogos = ["Evie rose", "Ribble", "Outcast", "Sunday molly", "Jewels mars"];
                const filterStyle = whiteLogos.includes(d.brand) ? 'style="filter: invert(1) brightness(0);"' : '';
                return `<img src="${d.logo}" alt="${d.brand}" class="bubble-logo" ${filterStyle}>`;
            } else {
                return `<div class="brand-name">${d.brand}</div>`;
            }
        })
        .on('mouseenter', function(event, d) {
            // Find distances from hovered node to all other nodes
            const distances = nodes.map(n => ({
                node: n,
                dist: Math.hypot(n.x - d.x, n.y - d.y)
            }));
            
            // Sort by distance to find the closest neighbors
            distances.sort((a, b) => a.dist - b.dist);
            
            distances.forEach((item, index) => {
                if (index === 0) {
                    item.node.targetRadius = HOVER_RADIUS; // The hovered node
                } else if (index <= 6) {
                    item.node.targetRadius = SHRINK_RADIUS; // The ~6 immediate surrounding nodes
                } else {
                    item.node.targetRadius = BASE_RADIUS; // The rest of the honeycomb
                }
            });
            
            // Wake up the physics engine to resolve the new collisions
            simulation.alpha(0.6).restart();
        })
        .on('mouseleave', function(event, d) {
            // Only handle hover physics if not on product page
            if (d3.select(this).classed('selected') || document.querySelector('.top-header').classList.contains('hidden')) return;
            
            // Reset all nodes to base radius
            nodes.forEach(n => {
                n.targetRadius = BASE_RADIUS;
            });
            
            // Wake up physics engine
            window.simulation.alpha(0.6).restart();
        })
        .on('click', function(event, d) {
            const clickedBubble = d3.select(this);
            if (clickedBubble.classed('selected')) return; // Already on product page

            // --- FORWARD ANIMATION (To Product Page) ---
            // 1. Pause physics engine immediately
            window.simulation.stop();
            
            // 2. We keep top-header VISIBLE. 
            
            // 3. Drop all OTHER bubbles
            bubbles.filter(n => n.id !== d.id).classed('falling', true);
            
            // 4. Morph selected bubble to top-left via CSS transform relative to its current position
            clickedBubble.classed('selected', true);
            
            // Hide sidebars during product view
            const sbLeft = document.getElementById('sidebar-left');
            const sbRight = document.getElementById('sidebar-right');
            if(sbLeft) sbLeft.style.display = 'none';
            if(sbRight) sbRight.style.display = 'none';

            // 4. Create a Fixed Clone of the bubble for scroll-proof animation
            const rect = this.getBoundingClientRect();
            const clone = this.cloneNode(true);
            clone.id = 'fixed-bubble';
            clone.style.position = 'fixed';
            clone.style.left = rect.left + 'px';
            clone.style.top = rect.top + 'px';
            clone.style.margin = '0'; // Strip D3 margins
            clone.style.zIndex = '2000';
            clone.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            document.body.appendChild(clone);
            
            // Hide original bubble instantly
            clickedBubble.style('transition', 'none');
            clickedBubble.style('opacity', '0');
            
            // Fly clone to top left
            setTimeout(() => {
                clone.style.left = isMobile ? '10px' : '40px';
                clone.style.top = isMobile ? '50px' : '40px';
                clone.style.transform = isMobile ? 'scale(0.6)' : 'scale(0.8)';
            }, 50);
            
            // 5. Populate and show Product Page
            const prodPage = document.getElementById('product-page');
            const prodGrid = document.getElementById('product-grid');
            
            const scrapedBrands = [
                "Leaclothingco", "Label society", "shopmauve.in", "Neelmii", "Qalaclothing", 
                "Summeraway", "sunday loveshop", "Moontara", "Fancypastelsindia", "Ms.maven", 
                "Orange at eight", "Essgee", "Ruiaan", "10.30pm", "shop&yours", "Imsoo", 
                "&thensome", "Shopdiris", "The pink elephant", "Kind inside", "Twelvthedit", 
                "The missy co", "Lovechoje", "Sunday molly", "Poppiclothing", "Nef’s finds",
                "House of mae", "Blomas", "Weaving cult", "Truffle", "Amoshi", 
                "Muvazo", "Ribble", "autumn summer", "Evie rose", "True west fashion", 
                "Ever pret", "Disobedience chennai", "Mnsh.design", "Pariparilife", 
                "Lovetobag", "Dhora india", "Mayabazaar jewellery", "No Na Me", 
                "Upkarna jewellery store", "A little extra", "Jewels mars", "I blame beads",
                "Beeglee", "Palay", "Rerunn", "Outcast", "Rok forces"
            ];

            if (scrapedBrands.includes(d.brand)) {
                // Fetch real data (which could be hundreds of products)
                fetch(`${d.brand}_products.json?v=2`)
                    .then(response => response.json())
                    .then(products => {
                        window.allBrandProducts = products;
                        window.currentProducts = products;
                        window.productsLoaded = 0;
                        prodGrid.innerHTML = ''; // Clear grid
                        
                        document.getElementById('category-filter').value = 'all';
                        document.getElementById('min-price').value = '';
                        document.getElementById('max-price').value = '';

                        loadMoreProducts(); // Load first 12
                        showProductPage();
                    });
            } else {
                // Generate beautiful dummy products for the brand
                const dummies = Array.from({length: 12}).map((_, i) => {
                    const hue1 = Math.floor(Math.random() * 360);
                    const hue2 = (hue1 + 40) % 360;
                    return {
                        isDummy: true,
                        title: `${d.brand} Edition 0${i + 1}`,
                        price: Math.floor(Math.random() * 1500) + 4500,
                        hue1: hue1,
                        hue2: hue2
                    };
                });

                window.allBrandProducts = dummies;
                window.currentProducts = dummies;
                window.productsLoaded = 0;
                prodGrid.innerHTML = '';
                
                document.getElementById('category-filter').value = 'all';
                document.getElementById('min-price').value = '';
                document.getElementById('max-price').value = '';

                loadMoreProducts();
                showProductPage();
            }

            function showProductPage() {
                prodPage.style.display = 'block';
                setTimeout(() => {
                    prodPage.classList.add('visible');
                }, 50);
            }

            // Store reference to selected node for back button
            window.selectedNode = clickedBubble;
        });

    // Back Button Handler
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'back-btn') {
            if (!window.selectedNode) return;
            
            const clickedBubble = window.selectedNode;
            
            // Hide product page immediately
            const prodPage = document.getElementById('product-page');
            prodPage.classList.remove('visible');
            
            // Clean up lazy load state
            window.allBrandProducts = [];
            window.currentProducts = [];
            window.productsLoaded = 0;
            const loadBtn = document.getElementById('load-more-btn');
            if (loadBtn) loadBtn.style.display = 'none';

            // --- REVERSE ANIMATION (Back to Honeycomb) ---
            clickedBubble.classed('selected', false);
            
            // Bring back sidebars
            const sbLeft = document.getElementById('sidebar-left');
            const sbRight = document.getElementById('sidebar-right');
            if(sbLeft) {
                sbLeft.style.display = 'flex';
                sbLeft.style.opacity = '1';
            }
            if(sbRight) {
                sbRight.style.display = 'flex';
                sbRight.style.opacity = '1';
            }

            // Scroll safely to top so the honeycomb is visible
            window.scrollTo({top: 0, behavior: 'smooth'});

            // Fly the fixed clone back to its original position
            const clone = document.getElementById('fixed-bubble');
            const rect = clickedBubble.node().getBoundingClientRect();
            if (clone) {
                clone.style.left = rect.left + 'px';
                clone.style.top = rect.top + 'px';
                clone.style.transform = 'scale(1)';
            }
            
            // Bring back falling bubbles
            bubbles.classed('falling', false);
            
            // Wait for bubbles to physically fly back up via CSS transition, then hand control back to D3
            setTimeout(() => {
                if (clone) clone.remove();
                clickedBubble.style('transition', '');
                clickedBubble.style('opacity', '1');
                prodPage.style.display = 'none';
                window.selectedNode = null;
                // Wake up physics engine
                window.simulation.alpha(0.6).restart();
            }, 600);
        }
    });

    // Animation Tick
    simulation.on('tick', () => {
        // Smoothly interpolate the radius of each node towards its target
        nodes.forEach(n => {
            n.radius += (n.targetRadius - n.radius) * 0.15; // 0.15 is the easing speed
        });
        
        // Update collision forces with the newly calculated radii
        simulation.force('collide').radius(d => d.radius + GAP);
        
        // Update the physical DOM elements to match the physics engine calculations
        bubbles
            .style('width', d => `${d.radius * 2}px`)
            .style('height', d => `${d.radius * 2}px`)
            .style('left', d => `${d.x - d.radius}px`)
            .style('top', d => `${d.y - d.radius}px`);
            
            // Scale text size dynamically based on radius
        bubbles.select('.brand-name')
            .style('font-size', d => {
                if (d.radius > BASE_RADIUS + 10) return isMobile ? '1.2rem' : '1.5rem';
                if (d.radius < BASE_RADIUS - 10) return isMobile ? '0.5rem' : '0.7rem';
                return isMobile ? '0.7rem' : '1rem';
            });
    });

    // Touch Support for Mobile Drag-to-Hover
    const hc = document.getElementById('honeycomb-container');
    
    function handleTouch(e) {
        if (e.type === 'touchmove') e.preventDefault(); // Stop scrolling while dragging the honeycomb
        
        const touch = e.touches[0];
        if (!touch) return;
        
        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        if (elem && (elem.classList.contains('bubble') || elem.closest('.bubble'))) {
            const bubbleNode = elem.classList.contains('bubble') ? elem : elem.closest('.bubble');
            const d = d3.select(bubbleNode).datum();
            
            if (d && !d3.select(bubbleNode).classed('selected') && !document.querySelector('.top-header').classList.contains('hidden')) {
                const distances = nodes.map(n => ({
                    node: n,
                    dist: Math.hypot(n.x - d.x, n.y - d.y)
                }));
                
                distances.sort((a, b) => a.dist - b.dist);
                
                distances.forEach((item, index) => {
                    if (index === 0) item.node.targetRadius = HOVER_RADIUS;
                    else if (index <= 6) item.node.targetRadius = SHRINK_RADIUS;
                    else item.node.targetRadius = BASE_RADIUS;
                });
                
                simulation.alpha(0.6).restart();
            }
        }
    }
    
    function handleTouchEnd() {
        if (document.querySelector('.top-header').classList.contains('hidden')) return;
        nodes.forEach(n => {
            n.targetRadius = BASE_RADIUS;
        });
        if (window.simulation) window.simulation.alpha(0.6).restart();
    }
    
    hc.addEventListener('touchstart', handleTouch, {passive: false});
    hc.addEventListener('touchmove', handleTouch, {passive: false});
    hc.addEventListener('touchend', handleTouchEnd);
    hc.addEventListener('touchcancel', handleTouchEnd);

    // Parallax background effect
    const watermark = document.querySelector('.watermark-bg');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if(watermark) {
            watermark.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
    });
});
