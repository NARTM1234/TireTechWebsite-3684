import { BrandExplorer } from "../components/brand-explorer";
import { groupProducts, productFamily } from "../lib/product-families";
import { useState } from "react";
import { Link } from "wouter";
import { Search, SlidersHorizontal, X, Layers } from "lucide-react";
import { useCatalogue } from "../queries/catalogue";
import { useLang, PageHeading, ProductCard, CTA } from "../components/site";
export function Products() {
  const { t, c } = useLang();
  const { data, isLoading, error } = useCatalogue();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    new URLSearchParams(location.search).get("category") || "",
  );
  const [brand, setBrand] = useState(new URLSearchParams(location.search).get("brand") || "");
  const [filters, setFilters] = useState(false);
  const products =
    (data?.products || []).filter(
      (p) =>
        (!category || p.categoryId === category) &&
        (!brand || p.brandId === brand) &&
        [p.id, p.name, p.nameAr, p.description, p.brandId]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
    ) || [];
  return (
    <main className="catalogue-page">
      <PageHeading label={c("copy-58")} title={c("copy-59")} copy={c("copy-60")} />
      <div className="catalogue-best-sellers"><span className="eyebrow blue">{t("Our best sellers", "الأكثر مبيعاً لدينا")}</span>
        <button className={category === "tubes" ? "selected" : ""} onClick={() => { setCategory("tubes"); setBrand(""); setQuery(""); }}>{t("Inner tubes & flaps", "الأنابيب وشرائط الحماية")}</button>
        <button className={category === "wheel-weights" ? "selected" : ""} onClick={() => { setCategory("wheel-weights"); setBrand(""); setQuery(""); }}>{t("Wheel weights", "أوزان ترصيص العجلات")}</button>
      </div>
      <div className="catalogue-tools">
        <label className="search">
          <Search size={19} />
          <input
            aria-label="Search products"
            placeholder={c("copy-61")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
        </label>
        <button className="button outline filter-toggle" onClick={() => setFilters(!filters)}>
          <SlidersHorizontal size={17} />
          {c("copy-62")}
        </button>
        <span className="technical">
          {products.length} {c("copy-63")}
        </span>
      </div>
      <div className="catalogue-layout">
        <aside className={filters ? "filters visible" : "filters"}>
          <div className="filter-label">{c("copy-64")}</div>
          <button className={!category ? "selected" : ""} onClick={() => setCategory("")}>
            {c("copy-65")}
            <span>{data?.products.length || 0}</span>
          </button>
          {data?.categories.map((c) => (
            <button
              key={c.id}
              className={category === c.id ? "selected" : ""}
              onClick={() => setCategory(c.id)}
            >
              {t(c.name, c.nameAr)}
              <span>{data.products.filter((p) => p.categoryId === c.id).length}</span>
            </button>
          ))}
          <div className="filter-label brand-filter">{c("copy-66")}</div>
          <select
            aria-label="Filter by brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">{c("copy-67")}</option>
            {data?.brands.map((b) => (
              <option key={b.id} value={b.id}>
                {t(b.name, b.nameAr)}
              </option>
            ))}
          </select>
          {(category || brand || query) && (
            <button
              className="clear-filters"
              onClick={() => {
                setBrand("");
                setCategory("");
                setQuery("");
              }}
            >
              {c("copy-68")}
              <X size={14} />
            </button>
          )}
          <div className="filter-help">
            <span className="eyebrow blue">{c("copy-69")}</span>
            <p>{c("copy-70")}</p>
            <Link href="/contact">{c("copy-71")}</Link>
          </div>
        </aside>
        <div>

          {isLoading ? (
            <div className="loading">{c("copy-73")}</div>
          ) : error ? (
            <div className="empty">{c("copy-74")}</div>
          ) : products.length ? (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Search size={32} />
              <h3>{c("copy-75")}</h3>
              <p>{c("copy-76")}</p>
              <button
                className="button outline"
                onClick={() => {
                  setQuery("");
                  setBrand("");
                  setCategory("");
                }}
              >
                {c("copy-77")}
              </button>
            </div>
          )}
        </div>
      </div>
      <CTA />
    </main>
  );
}
export function ProductDetails({ id }: { id: string }) {
  const { t, c } = useLang();
  const { data, isLoading } = useCatalogue();
  const p = data?.products.find((x) => x.id === id);
  if (isLoading) return <div className="loading">{c("copy-78")}</div>;
  if (!p)
    return (
      <div className="empty">
        <h1>{c("copy-79")}</h1>
        <Link href="/products">{c("copy-80")}</Link>
      </div>
    );
  const brand = data?.brands.find((b) => b.id === p.brandId);
  const category = data?.categories.find((c) => c.id === p.categoryId);
  return (
    <main className="section detail-page">
      <div className="breadcrumb">
        <Link href="/products">{c("copy-81")}</Link>
        <span>/</span>
        <span>{t(p.name, p.nameAr)}</span>
      </div>
      <div className="product-detail">
        <div className={"detail-image " + (p.image.includes("patch") ? "contain" : "")}>
          {p.image ? <img src={p.image} alt={t(p.name, p.nameAr)} /> : <div className="product-family-art"><Layers size={85} strokeWidth={1} /><span>{brand?.name}</span></div>}

        </div>
        <div>
          <span className="eyebrow blue">{category ? t(category.name, category.nameAr) : ""}</span>
          <h1>{t(p.name, p.nameAr)}</h1>
          <p>{t(p.description, p.descriptionAr)}</p>
          <dl>
            <dt>{c("copy-83")}</dt>
            <dd>
              <Link href={"/brands/" + p.brandId}>
                {brand ? t(brand.name, brand.nameAr) : p.brandId}
              </Link>
            </dd>
            <dt>{c("copy-84")}</dt>
            <dd>{p.id}</dd>
            <dt>{c("copy-85")}</dt>
            <dd>{c("copy-86")}</dd>
          </dl>
          <Link href={"/contact?product=" + encodeURIComponent(p.name)} className="button orange">
            {c("copy-87")}
          </Link>
          <div className="detail-note">{t(p.details, p.detailsAr)}</div>
          {data && data.products.filter((x) => productFamily(x) === productFamily(p)).length > 1 && <div className="product-variants"><h3>{t("Sizes & pack options", "المقاسات وخيارات العبوات")}</h3>
            {data.products.filter((x) => productFamily(x) === productFamily(p)).map((x) => <Link key={x.id} href={"/products/" + x.id} className={x.id === p.id ? "selected" : ""}>{t(x.name, x.nameAr)}</Link>)}
          </div>}
        </div>
      </div>
      <div className="section-top related-title">
        <h2>{c("copy-88")}</h2>
        <Link href="/products" className="text-link">
          {c("copy-89")}
        </Link>
      </div>
      <div className="product-grid">
        {groupProducts(data?.products || [])
          .filter((x) => productFamily(x) !== productFamily(p) && x.categoryId === p.categoryId)
          .slice(0, 3)
          .map((x) => (
            <ProductCard key={x.id} product={x} />
          ))}
      </div>
    </main>
  );
}
export function Brands() { return <BrandExplorer />; }
export function BrandDetails({ id }: { id: string }) {
  const { t, c } = useLang();
  const { data, isLoading } = useCatalogue();
  const b = data?.brands.find((x) => x.id === id);
  if (isLoading) return <div className="loading">{c("copy-94")}</div>;
  if (!b) return <div className="empty">{c("copy-95")}</div>;
  return (
    <main>
      <PageHeading
        label={c("copy-96")}
        title={t(b.name, b.nameAr)}
        copy={t(b.description, b.descriptionAr)}
      />
      <section className="section">

        <div className="product-grid">
          {(data?.products || [])
            .filter((p) => p.brandId === id)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
        <Link
          href={"/contact?brand=" + encodeURIComponent(b.name)}
          className="button orange space-top"
        >
          {c("copy-98")}
        </Link>
      </section>
      <CTA />
    </main>
  );
}
