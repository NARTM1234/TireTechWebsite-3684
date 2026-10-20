import { useState } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Layers, PackageSearch } from "lucide-react";
import { useCatalogue } from "../queries/catalogue";
import { useLang, CTA } from "./site";
export function BrandExplorer() {
  const { data, isLoading, error } = useCatalogue();
  const { t, c } = useLang();
  const [selected, setSelected] = useState("elgi");
  const brand = data?.brands.find((b) => b.id === selected) || data?.brands[0];
  const products = data?.products.filter((p) => p.brandId === brand?.id).slice(0, 3) || [];
  return <main className="brands-page">
    <section className="brand-intro section">
      <div className="brand-intro-copy"><span className="eyebrow blue">{c("copy-90")}</span><h1>{c("brand-explorer-title")}</h1><p>{c("brand-explorer-intro")}</p><a href="#brand-explorer" className="button outline">{c("brand-explorer-action")}<ArrowUpRight size={17} /></a></div>
      <div className="brand-intro-art"><img src="/images/workshop.webp" alt={c("brand-explorer-image-alt")} fetchPriority="high" /><div className="brand-orbit" aria-hidden="true" /><span className="brand-art-caption"><Layers size={17} />{c("brand-explorer-caption")}</span></div>
    </section>
    <section className="brand-explorer section" id="brand-explorer">
      <div className="section-top"><div><span className="eyebrow blue">{c("brand-explorer-label")}</span><h2>{c("brand-explorer-heading")}</h2></div><p>{c("brand-explorer-help")}</p></div>
      {isLoading ? <div className="loading">{c("copy-93")}</div> : error ? <p>{c("copy-24")}</p> : <>
        <fieldset className="brand-selectors" aria-label={c("brand-explorer-label")}>
          {data?.brands.map((b) => <button key={b.id} className={brand?.id === b.id ? "selected" : ""} aria-pressed={brand?.id === b.id} onClick={() => setSelected(b.id)}>{b.image ? <img src={b.image} alt={b.name} width={150} height={60} loading="lazy" /> : <span className="brand-word">{b.name}</span>}<span className="brand-select-name">{t(b.name, b.nameAr)}</span></button>)}
        </fieldset>
        {brand && <div className="brand-focus" key={brand.id}>
          <div className="brand-focus-copy"><span className="eyebrow blue">{c("brand-explorer-range")}</span><h2>{t(brand.name, brand.nameAr)}</h2><p>{t(brand.description, brand.descriptionAr)}</p><Link href={"/brands/" + brand.id} className="button orange">{c("brand-explorer-view")}<ArrowUpRight size={17} /></Link></div>
          <div className="brand-product-peek">{products.length ? products.map((p) => <Link href={"/products/" + p.id} key={p.id}><div>{p.image ? <img src={p.image} alt={t(p.name,p.nameAr)} loading="lazy" /> : <div className="product-family-art"><Layers size={45} strokeWidth={1} /><span>{brand.name}</span></div>}</div><h3>{t(p.name,p.nameAr)}</h3><ArrowUpRight size={18} /></Link>) : <div className="brand-range-enquiry"><PackageSearch size={38} /><h3>{c("brand-explorer-enquire")}</h3><Link href={"/contact?brand="+brand.name} className="text-link">{c("brand-explorer-contact")}</Link></div>}</div>
        </div>}
      </>}
    </section>
    <section className="brand-service-strip section"><div><span className="eyebrow blue">{c("brand-explorer-support-label")}</span><h2>{c("brand-explorer-support-title")}</h2></div><p>{c("brand-explorer-support-body")}</p><Link href="/contact" className="text-link">{c("brand-explorer-contact")}<ArrowUpRight size={18} /></Link></section>
    <CTA />
  </main>;
}