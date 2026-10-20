import json, subprocess
from pathlib import Path

root=Path('/home/user/tiretech')
pages=[
 ('hand-tools','https://shop.rematiptop.com/tire-repair-hand-tools/'),
 ('cutting-tools','https://shop.rematiptop.com/cutting-tools/'),
 ('buffing-tools','https://shop.rematiptop.com/buffing-tools/'),
 ('weights-tools','https://shop.rematiptop.com/wheel-weights-tools/'),
 ('cement','https://shop.rematiptop.com/vulcanizing-cements/'),
 ('cleaners','https://shop.rematiptop.com/pre-buff-cleaners/'),
 ('sealants','https://shop.rematiptop.com/repair-sealants/'),
 ('bead-sealers','https://shop.rematiptop.com/bead-sealers/'),
 ('mounting','https://shop.rematiptop.com/mounting-lubricants-and-accessories/'),
 ('radial','https://shop.rematiptop.com/radial-tire-repair-units1/'),
 ('bias','https://shop.rematiptop.com/bias-repair-units1/'),
 ('universal','https://shop.rematiptop.com/universal-repair-units/'),
 ('tube-patches','https://shop.rematiptop.com/tube-repair-vulcanizing-patches/'),
 ('plug-stem','https://shop.rematiptop.com/plug-stem-repair1/'),
 ('minicombi','https://shop.rematiptop.com/minicombi-repair-units/'),
 ('changing-tools','https://shop.rematiptop.com/tire-mount-and-demount-systems/'),
 ('bead-tools','https://shop.rematiptop.com/bead-breaking-tools/'),
 ('weights','https://rema-tiptop.de/en/products-services/rema-motion/products/consumables/weights/'),
 ('braza-tubes','https://brazatyres.com/product/butyl-tubes/'),
 ('braza-flaps','https://brazatyres.com/product/flaps/'),
 ('braza-solution','https://brazatyres.com/product/vulcanising-solution/'),
 ('braza-gum','https://brazatyres.com/product/bonding-gum/'),
 ('geestone-tubes','https://www.geestonetyres.com/butyl-tubes.php'),
 ('geestone-photo','https://www.geestonetyresindia.com/tuk-tuk-tyres.html'),
 ('elgi-tools','https://www.elgirubber.com/blades-and-carbides/'),
 ('elgi-repairs','https://www.elgirubber.com/repairs/'),
]
result={}
js='''JSON.stringify({title:document.title,text:document.body.innerText,products:Array.from(document.querySelectorAll(".ProductItem")).map(p=>({name:p.dataset.name,sku:p.dataset.sku,url:new URL(p.dataset.href,location.href).href,image:new URL(p.querySelector("img")?.getAttribute("data-src")||p.querySelector("img")?.src||"",location.href).href})),images:Array.from(document.images).map(i=>({src:i.src,data:i.getAttribute("data-src"),alt:i.alt})),links:Array.from(document.querySelectorAll("main a[href],.entry-content a[href]")).map(a=>({name:a.textContent.trim(),url:a.href})),tables:Array.from(document.querySelectorAll("table")).map(t=>t.innerText)})'''
for label,url in pages:
 try:
  subprocess.run(['mb','go',url],check=True,capture_output=True,text=True,timeout=55)
  raw=subprocess.run(['mb','js',js],check=True,capture_output=True,text=True,timeout=25).stdout
  result[label]=dict(url=url,**json.loads(raw))
  print(label,len(result[label]['products']),len(result[label]['images']),flush=True)
 except Exception as e: print(label,'ERROR',str(e),flush=True)
 (root/'catalogue-research.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))