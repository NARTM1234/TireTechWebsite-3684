import { CompanyCopy } from "../components/company-copy";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { ContactChannels } from "../components/contact-channels";
import { useState } from "react";
import { useCatalogue, useEnquire } from "../queries/catalogue";
import { useLang, PageHeading, CTA, Location } from "../components/site";
export function About() {
  const { t, c } = useLang();
  const { data, isLoading } = useCatalogue();
  const about = data?.content.find((x) => x.id === "about");
  return (
    <main>
      <PageHeading
        label={c("copy-99")}
        title={about ? t(about.title, about.titleAr) : c("copy-100")}
      />
      <section className="about-editorial section">
        {about?.image && <img src={about.image} alt={c("copy-101")} />}
        <div>
          <span className="eyebrow blue">{c("copy-102")}</span>
          <h2>{c("copy-103")}</h2>
          {isLoading ? (
            <p>{c("copy-104")}</p>
          ) : (
            <p>
              <CompanyCopy text={about ? t(about.body, about.bodyAr) : ""} />
            </p>
          )}
          <div className="about-company">
            <span className="eyebrow">{c("copy-105")}</span>
            <h3><CompanyCopy text={c("about-parent-name")} /></h3>
          </div>
          <Link href="/products" className="text-link">
            {c("copy-106")}
          </Link>
        </div>
      </section>
      <Location />
      <CTA />
    </main>
  );
}
export function Industries() {
  const { t, c } = useLang();
  const { data, isLoading } = useCatalogue();
  return (
    <main>
      <PageHeading label={c("copy-107")} title={c("copy-108")} copy={c("copy-109")} />
      <section className="section industry-editorial">
        {isLoading ? (
          <div className="loading">{c("copy-110")}</div>
        ) : (
          data?.content
            .filter((c) => c.type === "industry")
            .map((x, i) => (
              <article id={x.id} className="industry-article" key={x.id}>
                <div>
                  <span className="technical blue">
                    0{i + 1} / {c("copy-111")}
                  </span>
                  <h2>{t(x.title, x.titleAr)}</h2>
                  <p>{t(x.body, x.bodyAr)}</p>
                  <Link className="text-link" href={"/contact?industry=" + x.id}>
                    {c("copy-112")}
                  </Link>
                </div>
                {x.image && <img src={x.image} alt={t(x.title, x.titleAr)} loading="lazy" />}
              </article>
            ))
        )}
      </section>
      <CTA />
    </main>
  );
}
export function Contact() {
  const { ar, c } = useLang();
  const { data } = useCatalogue();
  const enquire = useEnquire();
  const [submitted, setSubmitted] = useState(false);
  const product =
    new URLSearchParams(location.search).get("product") ||
    new URLSearchParams(location.search).get("brand") ||
    "";
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await enquire.mutateAsync({
        name: String(f.get("name")),
        company: String(f.get("company")),
        phone: String(f.get("phone")),
        email: String(f.get("email")),
        type: String(f.get("type")) as any,
        product: String(f.get("product")),
        message: String(f.get("message")),
        website: String(f.get("website") || ""),
      });
      setSubmitted(true);
      history.pushState({}, "", "/enquiry-success");
    } catch {}
  }
  if (submitted) return <Success />;
  return (
    <main>
      <PageHeading label={c("copy-113")} title={c("copy-114")} copy={c("copy-115")} />
      <section className="contact-layout section">
        {c("contact-image") && (
          <img className="contact-editorial-image" src={c("contact-image")} alt={c("copy-116")} />
        )}
        <aside>
          <span className="eyebrow blue">{c("copy-116")}</span>
          <h3>{c("copy-117")}</h3>
          <p>{c("copy-118")}</p>
          <div className="contact-item">
            <span className="eyebrow">{c("copy-119")}</span>
            <p>{data?.settings[ar ? "location-ar" : "location"]}</p>
          </div>
          <ContactChannels />
        </aside>
        <form className="enquiry-form" onSubmit={submit}>
          <span className="eyebrow">{c("copy-122")}</span>
          <div className="form-row">
            <label>
              {c("copy-123")}
              <input
                aria-label="name"
                name="name"
                required
                minLength={2}
                maxLength={120}
                placeholder={c("copy-124")}
                autoComplete="name"
              />
            </label>
            <label>
              {c("copy-125")}
              <input
                aria-label="company"
                name="company"
                required
                minLength={2}
                maxLength={150}
                placeholder={c("copy-126")}
                autoComplete="organization"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              {c("copy-127")}
              <input
                aria-label="phone"
                name="phone"
                type="tel"
                required
                minLength={6}
                maxLength={40}
                placeholder="+965"
                autoComplete="tel"
              />
            </label>
            <label>
              {c("copy-128")}
              <input
                aria-label="email"
                name="email"
                type="email"
                required
                maxLength={254}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              {c("copy-129")}
              <select name="type" defaultValue={product ? "Products" : "General enquiry"}>
                {data?.elements
                  .filter((x) => x.kind === "option" && x.value)
                  .map((option) => (
                    <option key={option.id} value={option.value}>
                      {ar ? option.valueAr || option.value : option.value}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              {c("copy-130")}
              <input
                aria-label="product"
                name="product"
                maxLength={200}
                defaultValue={product}
                placeholder={c("copy-131")}
              />
            </label>
          </div>
          <label>
            {c("copy-132")}
            <textarea
              aria-label="message"
              name="message"
              required
              minLength={10}
              maxLength={3000}
              rows={5}
              placeholder={c("copy-133")}
            />
          </label>
          <input
            className="honeypot"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          {enquire.error && (
            <p role="alert" className="form-error">
              {enquire.error.message}
            </p>
          )}
          <div className="form-end">
            <small>{c("copy-134")}</small>
            <button type="submit" className="button orange" disabled={enquire.isPending}>
              {enquire.isPending ? c("copy-135") : c("copy-136")}
            </button>
          </div>
        </form>
      </section>
      <Location showContactLink={false} />
    </main>
  );
}
export function Success() {
  const { c } = useLang();
  return (
    <main className="success-page">
      <span className="success-icon">
        <Check size={32} />
      </span>
      <span className="eyebrow blue">{c("copy-137")}</span>
      <h1>{c("copy-138")}</h1>
      <p>{c("copy-139")}</p>
      <div>
        <Link href="/products" className="button orange">
          {c("copy-140")}
        </Link>
        <Link href="/" className="button outline">
          {c("copy-141")}
        </Link>
      </div>
    </main>
  );
}
