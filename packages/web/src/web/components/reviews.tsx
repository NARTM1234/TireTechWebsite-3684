import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Pause, Play } from "lucide-react";
import { Link } from "wouter";
import { useCatalogue } from "../queries/catalogue";
import { useLang } from "./site";
export function Reviews() {
  const { data, isLoading } = useCatalogue();
  const { ar, c, t } = useLang();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const reviews = data?.reviews || [];
  const review = reviews[index % Math.max(reviews.length, 1)];
  useEffect(() => {
    if (reviews.length < 2 || paused || interacting) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setDirection(1);
        setIndex((current) => (current + 1) % reviews.length);
      }
    }, 4000);
    return () => window.clearInterval(timer);
  }, [reviews.length, paused, interacting, index]);
  return (
    <section className="reviews-section section" aria-label={t("Customer reviews", "مراجعات العملاء")}
      onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}>
      <div className="reviews-heading">
        <span className="eyebrow blue">{c("reviews-eyebrow")}</span>
        <h2>{c("reviews-heading")}</h2>
        <Link className="text-link" href={c("reviews-url")}>
          {c("reviews-action")}
        </Link>
      </div>
      <div className={"review-stage " + (!review ? "review-stage-empty" : "")}>
        <Quote size={35} className="blue" />
        {isLoading ? (
          <p>Loading…</p>
        ) : review ? (
          <div className={"review-content " + (direction > 0 ? "review-forward" : "review-backward")} key={review.id}>
            {review.rating && (
              <div className="review-rating" aria-label={review.rating + " out of 5"}>
                {Array.from({ length: review.rating }, (_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
            )}
            <blockquote>{ar ? review.quoteAr || review.quote : review.quote}</blockquote>
            <div className="review-byline">
              <span className="review-avatar" aria-hidden="true">{review.name.trim().split(/\s+/).slice(0,2).map((n) => n[0]).join("")}</span>
              <div>
              <strong>{review.name}</strong>
              {review.company && <span>{review.company}</span>}
              </div>
            </div>
          </div>
        ) : (
          <div className="reviews-empty">
            <h3>{c("reviews-empty-heading")}</h3>
            <p>{c("reviews-empty")}</p>
            <Link className="button outline" href={c("reviews-url")}>{c("reviews-action")}</Link>
          </div>
        )}
        {reviews.length > 1 && (
          <div className="review-controls">
            <button aria-label={paused ? t("Play reviews", "تشغيل المراجعات") : t("Pause reviews", "إيقاف المراجعات")}
              aria-pressed={paused} onClick={() => setPaused((current) => !current)}>
              {paused ? <Play size={15} /> : <Pause size={15} />}
            </button>
            <button
              aria-label={t("Previous review", "المراجعة السابقة")}
              onClick={() => { setDirection(-1); setIndex((index + reviews.length - 1) % reviews.length); }}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="review-dots">{reviews.map((r,i) => <button key={r.id} aria-label={t("Show review "+(i+1), "عرض المراجعة "+(i+1))} aria-pressed={index % reviews.length === i} onClick={() => { setDirection(i >= index % reviews.length ? 1 : -1); setIndex(i); }} />)}</div>
            <button aria-label={t("Next review", "المراجعة التالية")} onClick={() => { setDirection(1); setIndex((index + 1) % reviews.length); }}>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
