import json,re,requests,concurrent.futures
from pathlib import Path
from io import BytesIO
from PIL import Image
from bs4 import BeautifulSoup

root=Path('/home/user/tiretech'); research=json.loads((root/'catalogue-research.json').read_text())
out=root/'packages/web/public/images/products'; out.mkdir(parents=True,exist_ok=True)
items=[]
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower().replace('+','-plus')).strip('-')
def add(id,name,ar,brand,category,desc,desc_ar,url,image='',extra='',extra_ar=''):
 items.append(dict(id=id,name=name,nameAr=ar,brandId=brand,categoryId=category,description=desc,descriptionAr=desc_ar,details=extra,detailsAr=extra_ar,image='',illustrative=False,source=url,sourceImage=image))

groups={
 'hand-tools':('tools','Tyre repair hand tool','أداة يدوية لإصلاح الإطارات'),
 'cutting-tools':('tools','Tyre repair cutting tool','أداة قطع لإصلاح الإطارات'),
 'buffing-tools':('tools','Tyre repair buffing tool or accessory','أداة أو ملحق لتجهيز الإطارات'),
 'weights-tools':('tools','Wheel-weight service tool','أداة خدمة أوزان العجلات'),
 'cement':('vulcanizing','Vulcanizing cement or application accessory','أسمنت فلكنة أو ملحق تطبيق'),
 'cleaners':('consumables','Pre-buff cleaning liquid','منظف قبل الكشط'),
 'sealants':('consumables','Repair sealant','مادة إحكام الإصلاح'),
 'bead-sealers':('consumables','Rim and bead sealer','مادة إحكام الحافة والجنط'),
 'mounting':('consumables','Tyre mounting lubricant or application accessory','مادة أو ملحق لتركيب الإطارات'),
 'radial':('patches','Radial tyre repair unit','وحدة إصلاح إطار شعاعي'),
 'bias':('patches','Bias tyre repair unit','وحدة إصلاح إطار قطري'),
 'universal':('patches','Universal tyre repair unit','وحدة إصلاح متعددة الاستخدام'),
 'tube-patches':('patches','Inner-tube repair patch','رقعة إصلاح أنبوب داخلي'),
 'plug-stem':('patches','Combination repair unit or tyre repair stem','وحدة إصلاح مركبة أو ساق إصلاح'),
}
for group,(category,label,label_ar) in groups.items():
 for p in research[group]['products']:
  sku=p['sku']; name=p['name'].strip()
  # PREMA/KEX are separate brands in the official store, not TireTech's listed REMA brand.
  if sku.startswith(('KX-','102','103','20','22','PFC','PPC')) or any(x in name for x in ['PREMA','KEX']): continue
  if group=='radial' and not sku.startswith('RAD'): continue
  if group=='bias' and not sku.startswith('PN-'): continue
  if group=='universal' and not sku.startswith('UP'): continue
  if group=='buffing-tools' and sku.startswith(('RH','100-GEG')): continue
  if group=='tube-patches' and ('BOX' in sku or 'BULK' in sku): continue
  if sku=='BL-5F': continue
  if 'Tube Patches' in name: name += ' — '+sku
  add('rema-'+slug(sku),name,label_ar+' — '+sku,'tip-top',category,label+' from REMA TIP TOP’s official catalogue. Model: '+sku+'.',label_ar+' من كتالوج ريما تيب توب الرسمي. الطراز: '+sku+'.',p['url'],p['image'])

elgi_ar=['شفرات الكشط','أدوات الحفر الدوارة','شفرات الكشط الدائرية','عجلة بوجه مائل','قاطع برأس كروي','قاطع مخروطي','قاطع كروي','كأس تشطيب منحني','قاطع أسطواني','عجلة حلقية','قاطع حفر','كأس بوجه مسطح','عجلة بوجه مسطح','قاطع رفيع','كأس منحني غائر','سكين دوار','منشار دوار','عجلة بوجه مستدير','عجلة قطع المطاط','قرص صنفرة','أسطوانة صنفرة','قاطع مدبب']
for i,im in enumerate(research['elgi-tools']['images'][8:30]):
 name=im['alt'].strip().replace('Countour','Contour').replace('countour','contour')
 add('elgi-'+slug(name),name,elgi_ar[i],'elgi','tools','Tool from ELGI Rubber’s retreading and repair tools range. Select the tool profile for the repair or buffing application.','أداة من مجموعة إلجي رابر لأدوات التجديد والإصلاح. اختر شكل الأداة المناسب للإصلاح أو الكشط.',research['elgi-tools']['url'],im['src'])

reps=research['elgi-repairs']['images']
for id,name,ar,im,desc,da in [
 ('elgi-all-purpose-units','All-purpose repair units — round & square','وحدات إصلاح عامة دائرية ومربعة',reps[10] if False else next(i for i in reps if 'All purpose' in i['alt']),'Round and square repair units for bias or radial tyres, also suitable for tube repairs.','وحدات دائرية ومربعة للإطارات القطرية أو الشعاعية ويمكن استخدامها لإصلاح الأنابيب.'),
 ('elgi-cb-bias-units','CB Series bias repair units','وحدات إصلاح قطرية سلسلة CB',next(i for i in reps if 'CB Series Bias' in i['alt']),'Cloth-backed, fabric-reinforced bias repair units recommended by ELGI for heat-cure vulcanizing.','وحدات قطرية مدعمة بالنسيج وخلفية قماشية توصي إلجي باستخدامها للفلكنة الحرارية.'),
 ('elgi-cb-radial-units','CB Series radial repair units','وحدات إصلاح شعاعية سلسلة CB',next(i for i in reps if 'CB Series Radial' in i['alt']),'Cloth-backed, fabric-reinforced radial repair units recommended by ELGI for heat-cure vulcanizing.','وحدات شعاعية مدعمة بالنسيج وخلفية قماشية توصي إلجي باستخدامها للفلكنة الحرارية.'),
 ('elgi-insert-repair-strings','Insert tyre repair strings','خيوط إصلاح الإطارات',next(i for i in reps if 'Insert' in i['alt']),'Butyl-rubber inserts for temporary on-the-wheel tyre repairs. A temporary repair is not a substitute for proper tyre inspection.','خيوط من مطاط البوتيل للإصلاح المؤقت دون فك الإطار. لا يغني الإصلاح المؤقت عن الفحص الصحيح للإطار.'),
 ]: add(id,name,ar,'elgi','patches',desc,da,research['elgi-repairs']['url'],im['src'])
add('elgi-liner-sealant','Liner sealant','مادة إحكام بطانة الإطار','elgi','consumables','Coats the edges of a repair unit to maintain a tight seal in tubeless tyres.','تستخدم لتغطية حواف وحدة الإصلاح والحفاظ على إحكام الإطارات دون أنابيب.','https://www.elgirubber.com/repair-system/tyre-repair-liquid/','', 'Manufacturer lists black and grey liner sealant in 500 ml and 5 L packs.','تذكر الشركة المصنعة عبوات 500 مل و5 لتر باللونين الأسود والرمادي.')

braza=[
 ('braza-butyl-tubes','Butyl inner tubes','أنابيب بوتيل داخلية','tubes','braza-tubes','Butyl tubes for truck, SCV, e-rickshaw, scooter, motorcycle, auto, car, SUV, tractor, ADV and OTR applications. Confirm size and valve compatibility before ordering.','أنابيب بوتيل للشاحنات والمركبات الصغيرة والدراجات والسيارات والجرارات ومعدات الطرق الوعرة. يرجى تأكيد المقاس ونوع الصمام قبل الطلب.'),
 ('braza-rim-flaps','Tube protection flaps','شرائط حماية الأنابيب','tubes','braza-flaps','Rubber flaps that protect the tube from friction and heat between the rim and tube.','شرائط مطاطية لحماية الأنبوب من الاحتكاك والحرارة بين الجنط والأنبوب.'),
 ('braza-vulcanising-solution','Black vulcanising solution','محلول الفلكنة الأسود','vulcanizing','braza-solution','Liquid adhesive for tyre retreading, compatible with precured and hot-process rubber. Manufacturer pack: 25 L tin.','لاصق سائل لتجديد الإطارات متوافق مع المطاط المعالج مسبقاً وعملية التجديد الساخن. عبوة الشركة المصنعة: 25 لتر.'),
 ('braza-bonding-gum','Bonding gum','مطاط الربط','repair-materials','braza-gum','Natural-rubber compound used as a bonding layer in retreading and for filling nail holes and repairs. Manufacturer packs: 1 kg and 5 kg.','مركب مطاط طبيعي يستخدم كطبقة ربط في التجديد ولملء ثقوب المسامير والإصلاح. عبوات الشركة المصنعة: 1 كغ و5 كغ.'),
]
for id,name,ar,cat,key,desc,da in braza:
 im=research[key]['images'][3]['src']; im='' if 'AdobeStock' in im else im
 add(id,name,ar,'braza',cat,desc,da,research[key]['url'],im, 'Manufacturer flap sizes: 7.00-15, 7.50-16, 8.25-16, 9.00-20, 10.00-20.' if key=='braza-flaps' else '', 'مقاسات الشركة المصنعة: 7.00-15، 7.50-16، 8.25-16، 9.00-20، 10.00-20.' if key=='braza-flaps' else '')

geo=research['geestone-tubes'];text=geo['text']; starts=list(re.finditer(r'(?m)^([^\n]+(?:TUBE SIZES|TRACTOR SIZES))',text))
geo_labels=[('motorcycle','Scooter & motorcycle','السكوتر والدراجات النارية'),('car','Passenger car','سيارات الركوب'),('light-truck','Light truck','الشاحنات الخفيفة'),('truck-bus','Truck & bus','الشاحنات والحافلات'),('industrial','Forklift & industrial','الرافعات الشوكية والاستخدام الصناعي'),('implement','Agricultural implement','المعدات الزراعية'),('otr','OTR','معدات الطرق الوعرة'),('adv','ADV','مركبات ADV'),('tractor','Agricultural tractor','الجرارات الزراعية')]
for i,(suffix,label,ar) in enumerate(geo_labels):
 section=text[starts[i].end():starts[i+1].start() if i+1<len(starts) else text.index('QUICK LINKS',starts[i].end())].strip()
 add('geestone-'+suffix+'-tubes',label+' butyl tubes','أنابيب بوتيل '+ar,'gee-stone','tubes','Geestone butyl inner tubes for '+label.lower()+' applications. Manufacturer size and valve options are listed below; confirm the required combination with TireTech.','أنابيب بوتيل من جي ستون لتطبيقات '+ar+'. ترد خيارات المقاسات والصمامات لدى الشركة المصنعة أدناه؛ يرجى تأكيد الخيار المطلوب مع تايرتك.',geo['url'],'','Manufacturer size / valve options:\n'+section,'خيارات المقاسات / الصمامات لدى الشركة المصنعة:\n'+section)

weights=next(i['src'] for i in research['weights']['images'] if 'gewichte-1024' in i['src'])
add('rema-wheel-balancing-weights','Wheel balancing weights','أوزان ترصيص العجلات','tip-top','wheel-weights','REMA TIP TOP balancing weights for car, truck and bus wheels, including adhesive and motorcycle spoke-weight ranges. Contact TireTech for the required profile, weight and rim fitment.','أوزان ترصيص من ريما تيب توب لعجلات السيارات والشاحنات والحافلات، بما فيها الأوزان اللاصقة وأوزان أسلاك عجلات الدراجات. تواصل مع تايرتك لتحديد الشكل والوزن والتوافق مع الجنط.','https://www.rema-tiptop.co.uk/products/automotive/consumables/weights/',weights,'Product range: car balance weights, adhesive weights, motorcycle spoke weights and truck balance weights. Image shows a manufacturer range, not a specific size or package.','المجموعة: أوزان ترصيص السيارات والأوزان اللاصقة وأوزان أسلاك عجلات الدراجات وأوزان الشاحنات. الصورة لمجموعة الشركة المصنعة وليست لمقاس أو عبوة محددة.')

def process(p):
 try:
  if p['source'].startswith('https://shop.rematiptop.com/'):
   r=requests.get(p['source'],timeout=30); r.raise_for_status(); s=BeautifulSoup(r.text,'html.parser'); d=s.select_one('.ProductDescription')
   if d:
    actual=d.get_text(' ',strip=True)
    if actual: p['details']=actual[:6500]
  if p['sourceImage']:
   r=requests.get(p['sourceImage'],timeout=35);r.raise_for_status();im=Image.open(BytesIO(r.content)).convert('RGBA')
   im.thumbnail((800,800)); bg=Image.new('RGBA',im.size,'white');bg.alpha_composite(im);bg.convert('RGB').save(out/(p['id']+'.webp'),'WEBP',quality=85)
   p['image']='/images/products/'+p['id']+'.webp'
 except Exception as e: print('SOURCE/IMAGE WARNING',p['id'],str(e),flush=True)
 p['details']+='\n\nConfirm current availability and the correct size, quantity and application with TireTech. Use repair products according to the manufacturer’s instructions.\nOfficial reference: '+p['source']
 p['detailsAr']+='\n\nيرجى تأكيد التوفر الحالي والمقاس والكمية والتطبيق الصحيح مع تايرتك. استخدم منتجات الإصلاح وفق تعليمات الشركة المصنعة.\nالمرجع الرسمي: '+p['source']
 return p
assert len({p['id'] for p in items})==len(items)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool: items=list(pool.map(process,items))
(root/'catalogue-additions.json').write_text(json.dumps(items,ensure_ascii=False,indent=2))
print('Prepared',len(items),'products;',sum(bool(p['image']) for p in items),'with official photos')
print('By category', {c:sum(p['categoryId']==c for p in items) for c in {p['categoryId'] for p in items}})