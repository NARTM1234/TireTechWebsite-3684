import { useEffect } from "react";
import { useLocation } from "wouter";
export function PageMotion() {
  const [path] = useLocation();
  useEffect(() => {
    if (path.startsWith('/admin') || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    }), { threshold: 0.04 });
    const watch = () => document.querySelectorAll('main .section-top, main .brand-focus, main .brand-service-strip, .review-stage, .product-grid .product-card, .industry-article').forEach((el) => {
      if (el.classList.contains('in-view')) return;
      el.classList.add('motion-reveal'); observer.observe(el);
    });
    watch();
    const mutations = new MutationObserver(watch);
    mutations.observe(document.getElementById('root')!, { childList:true, subtree:true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  },[path]);
  return null;
}