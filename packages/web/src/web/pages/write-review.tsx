import { useState } from "react";
import { Link } from "wouter";
import { CheckCircle2 } from "lucide-react";
import { useLang } from "../components/site";
import { useCatalogue } from "../queries/catalogue";
import { useReviewSubmit } from "../queries/review-submissions";

export function WriteReview() {
  const { ar, c } = useLang();
  const catalogue = useCatalogue();
  const submit = useReviewSubmit();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState("");
  const [website, setWebsite] = useState("");
  const [consent, setConsent] = useState(false);
  if (catalogue.isLoading) return <div className="loading">{ar ? "جارٍ التحميل…" : "Loading…"}</div>;
  if (catalogue.error) return <div className="loading">{c("copy-24")}</div>;
  return <main className="write-review-page section">
    <div className="write-review-intro">
      <span className="eyebrow blue">{c("review-form-kicker")}</span>
      <h1>{c("review-form-heading")}</h1>
      <p>{c("review-form-intro")}</p>
      <Link href="/" className="text-link">{c("review-form-back")}</Link>
    </div>
    {submit.isSuccess ? <div className="review-submitted enquiry-form" aria-live="polite">
      <CheckCircle2 size={38} className="blue" />
      <h2>{c("review-form-success-title")}</h2>
      <p>{c("review-form-success-body")}</p>
      <Link href="/" className="button orange">{c("review-form-back")}</Link>
    </div> : <form className="enquiry-form review-writing-form" onSubmit={(e) => {
      e.preventDefault();
      submit.mutate({ name, company, quote, rating: rating ? Number(rating) : null,
        website, consent: true, language: ar ? "ar" : "en" });
    }}>
      <div className="form-row">
        <label>{c("review-form-name")}<input aria-label={c("review-form-name")} name="name" autoComplete="name" required minLength={2} maxLength={120} value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>{c("review-form-company")}<input aria-label={c("review-form-company")} name="company" autoComplete="organization" maxLength={150} value={company} onChange={(e) => setCompany(e.target.value)} /></label>
      </div>
      <label>{c("review-form-rating")}<select name="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
        <option value="">{c("review-form-no-rating")}</option>
        {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} / 5</option>)}
      </select></label>
      <label>{c("review-form-quote")}<textarea aria-label={c("review-form-quote")} name="quote" rows={6} required minLength={10} maxLength={3000} value={quote} onChange={(e) => setQuote(e.target.value)} /></label>
      <div className="honeypot" aria-hidden="true"><label>Website<input aria-label="Website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label></div>
      <label className="review-consent"><input aria-label={c("review-form-consent")} type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} />{c("review-form-consent")}</label>
      {submit.error && <p className="form-error" role="alert">{c((submit.error as { code?: string }).code === "TOO_MANY_REQUESTS" ? "review-form-rate-error" : (submit.error as { code?: string }).code === "CONFLICT" ? "review-form-duplicate-error" : "review-form-error")}</p>}
      <div className="form-end"><small>{c("review-form-notice")}</small><button className="button orange" disabled={submit.isPending || !consent}>{c(submit.isPending ? "review-form-sending" : "review-form-submit")}</button></div>
    </form>}
  </main>;
}