import urllib.request
import json

url = "https://leaclothingco.com/products.json"
output_file = "lea_products.json"

try:
    print(f"Fetching data from {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
    
    products = data.get('products', [])
    extracted_products = []
    
    for product in products[:8]:
        title = product.get('title', 'Unknown Product')
        
        # Get the first variant's price
        variants = product.get('variants', [])
        price = variants[0].get('price', '0.00') if variants else '0.00'
        
        # Get the first image
        images = product.get('images', [])
        image_url = images[0].get('src', '') if images else ''
        
        extracted_products.append({
            "title": title,
            "price": price,
            "image": image_url
        })
        
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(extracted_products, f, indent=4)
        
    print(f"Successfully extracted {len(extracted_products)} products to {output_file}")

except Exception as e:
    print(f"Error fetching products: {e}")
