import urllib.request
import json
import time

# Dictionary of brands and their Shopify URLs
# You can add the rest of the 30 URLs here later!
brands = {
    "Leaclothingco": "https://leaclothingco.com",
    "Label society": "https://www.labelsocietyco.com",
    "shopmauve.in": "https://shopmauve.in",
    "Summersoul": "https://www.summersoul.in",
    "Neelmii": "https://neelmii.com",
    "Qalaclothing": "https://qalaclothing.com",
    "Summeraway": "https://summeraway.com",
    "sunday loveshop": "https://sundayloveshop.com",
    "Live in Pause": "https://liveinpause.com",
    "Moontara": "https://moontara.in",
    "Fancypastelsindia": "https://www.fancypastels.com",
    "Lazzo store": "https://www.lazzostore.com"
}

for brand_name, base_url in brands.items():
    print(f"Fetching data for {brand_name}...")
    all_products = []
    page = 1
    
    while True:
        # Request up to 250 products per page
        url = f"{base_url}/products.json?limit=250&page={page}"
        print(f"  Fetching page {page}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode('utf-8'))
            
            products = data.get('products', [])
            if not products:
                break # Break the loop if the page has no products
                
            for product in products:
                title = product.get('title', 'Unknown Product')
                
                # Get the first variant's price
                variants = product.get('variants', [])
                price = variants[0].get('price', '0.00') if variants else '0.00'
                
                # Get the first image
                images = product.get('images', [])
                image_url = images[0].get('src', '') if images else ''
                
                # Only add products that actually have images
                if image_url:
                    all_products.append({
                        "title": title,
                        "price": price,
                        "image": image_url
                    })
            
            page += 1
            time.sleep(1) # Wait 1 second between pages to be polite to Shopify servers
            
        except Exception as e:
            print(f"  Error fetching page {page}: {e}")
            break
            
    output_file = f"{brand_name}_products.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=4)
        
    print(f"Successfully extracted {len(all_products)} products to {output_file}")
