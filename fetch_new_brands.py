import urllib.request
import json
import time

brands = {
    "Orange at eight": "https://orangeateight.com",
    "Essgee": "https://essgee.co",
    "Ruiaan": "https://ruiaan.com"
}

for brand_name, base_url in brands.items():
    print(f"Fetching data for {brand_name}...")
    all_products = []
    page = 1
    
    while True:
        url = f"{base_url}/products.json?limit=250&page={page}"
        print(f"  Fetching page {page}...")
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode('utf-8'))
            
            products = data.get('products', [])
            if not products:
                break
                
            for product in products:
                title = product.get('title', 'Unknown Product')
                variants = product.get('variants', [])
                price = variants[0].get('price', '0.00') if variants else '0.00'
                images = product.get('images', [])
                image_url = images[0].get('src', '') if images else ''
                
                if image_url:
                    all_products.append({
                        "title": title,
                        "price": price,
                        "image": image_url
                    })
            
            page += 1
            time.sleep(1)
            
        except Exception as e:
            print(f"  Error fetching page {page}: {e}")
            break
            
    output_file = f"{brand_name}_products.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=4)
        
    print(f"Successfully extracted {len(all_products)} products to {output_file}")
