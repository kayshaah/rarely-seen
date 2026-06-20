import urllib.request
import json
import time

brands = {
    "10.30pm": "https://1030pm.in",
    "shop&yours": "https://www.shopandyours.com",
    "Imsoo": "https://studioimsoo.com",
    "&thensome": "https://andthensome.in",
    "Shopdiris": "https://shopdiris.com",
    "The pink elephant": "https://lovethepinkelephant.com",
    "Kind inside": "https://kindinside.in",
    "Summeraway": "https://summeraway.in",
    "Twelvthedit": "https://twelvthedit.com",
    "The missy co": "https://themissyco.in",
    "Lovechoje": "https://lovechoje.com",
    "Sunday molly": "https://sundaymolly.com",
    "Poppiclothing": "https://poppi.in",
    "Nef’s finds": "https://nefsfinds.com",
    "House of mae": "https://www.houseofmae.shop",
    "Blomas": "https://blomas.in",
    "Weaving cult": "https://weavingcult.com",
    "Truffle": "https://www.truffleindia.com",
    "Amoshi": "https://amoshi.in",
    "Muvazo": "https://www.muvazo.com",
    "Ribble": "https://ribelle.in",
    "autumn summer": "https://www.autumnsummer.in",
    "Evie rose": "https://evierose.in",
    "True west fashion": "https://www.truewest.in",
    "Ever pret": "https://everpret.com",
    "Disobedience chennai": "https://thedisobedience.com",
    "Mnsh.design": "https://mnsh.co",
    "Pariparilife": "https://pariparilife.com",
    "Lovetobag": "https://lovetobag.com",
    "Dhora india": "https://dhoraindia.in",
    "Mayabazaar jewellery": "https://shopmaya.in",
    "No Na Me": "https://www.nonamejewelry.in",
    "Upkarna jewellery store": "https://upakarna.com",
    "A little extra": "https://alittleextra.co.in",
    "Jewels mars": "https://jewelsmars.com",
    "I blame beads": "https://www.iblamebeads.com",
    "Beeglee": "https://www.beeglee.in",
    "Palay": "https://palay.in",
    "Rerunn": "https://rerunn.com",
    "Outcast": "https://outcasts.in",
    "Leaclothingco": "https://leaclothingco.com",
    "Label society": "https://www.labelsocietyco.com",
    "shopmauve.in": "https://shopmauve.in",
    "Summersoul": "https://www.summersoul.in",
    "Neelmii": "https://neelmii.com",
    "Qalaclothing": "https://qalaclothing.com",
    "sunday loveshop": "https://sundayloveshop.com",
    "Live in Pause": "https://liveinpause.com",
    "Moontara": "https://moontara.in",
    "Fancypastelsindia": "https://www.fancypastels.com",
    "Lazzo store": "https://www.lazzostore.com",
    "Orange at eight": "https://orangeateight.com",
    "Essgee": "https://essgee.co",
    "Ruiaan": "https://ruiaan.com",
    "Ms.maven": "https://msmaven.in"
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
                handle = product.get('handle', '')
                
                if image_url:
                    all_products.append({
                        "title": title,
                        "price": price,
                        "image": image_url,
                        "url": f"{base_url}/products/{handle}" if handle else base_url
                    })
            
            page += 1
            # Very small sleep, Shopify might get mad but we want this fast
            time.sleep(0.1)
            
        except Exception as e:
            print(f"  Error fetching page {page}: {e}")
            break
            
    output_file = f"{brand_name}_products.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=4)
        
    print(f"Successfully extracted {len(all_products)} products to {output_file}")
