import urllib.request
import re
import json

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

logos = {}
for name, url in brands.items():
    print(f"Finding logo for {name}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8')
        
        matches = re.findall(r'https://[^\"\'\s>]*logo[^\"\'\s>]*\.(?:png|svg|webp)', html, re.IGNORECASE)
        if matches:
            logos[name] = matches[0]
        else:
            matches = re.findall(r'//cdn.shopify.com/s/files/[^\"\'\s>]*logo[^\"\'\s>]*\.(?:png|svg|webp)', html, re.IGNORECASE)
            if matches:
                logos[name] = "https:" + matches[0]
    except Exception as e:
        print(f"Error for {name}: {e}")
        
with open('logos.json', 'w') as f:
    json.dump(logos, f, indent=4)
print("Logos saved to logos.json")
