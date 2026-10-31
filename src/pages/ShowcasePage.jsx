import { useRef, useState, useLayoutEffect } from "react";
import { products } from "../data/products";
import TopBar from "../components/TopBar";
import { ArrowLeft, ArrowRight } from "../components/Icons";

export default function ShowcasePage({ onNavigate, theme, onToggleTheme, a11y, onA11yChange }) {
  const [selectedId, setSelectedId] = useState(null);
  const [index, setIndex] = useState(0);
  const trackRef = useRef(null);
  const indexRef = useRef(0);
  const selected = products.find((p) => p.id === selectedId);
  const active = products[index];

  // The carousel unmounts while a detail view is open; restore its position on return.
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!selectedId && el) el.scrollLeft = indexRef.current * el.clientWidth;
  }, [selectedId]);

  function goTo(i) {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(products.length - 1, i));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: next * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  function onScroll(e) {
    const el = e.currentTarget;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    indexRef.current = i;
    setIndex(i);
  }

  const toPoll = () => onNavigate("poll");

  if (selected) {
    return (
      <div className="page wide">
        <TopBar
          onBack={() => setSelectedId(null)}
          backLabel="Back to products"
          theme={theme}
          onToggleTheme={onToggleTheme}
          a11y={a11y}
          onA11yChange={onA11yChange}
        />
        <article className="detail">
          <img
            className="detail-img"
            src={selected.image}
            alt={`${selected.name} ${selected.category}`}
            style={{ "--glow": selected.glow }}
          />
          <div className="detail-copy glass">
            <p className="eyebrow">{selected.category}</p>
            <h1 className="serif">{selected.name}</h1>
            <p className="shade">{selected.shade}</p>
            <p className="muted">{selected.tagline}</p>
            <button type="button" className="btn primary block" onClick={toPoll}>
              Continue to Live Poll <ArrowRight />
            </button>
            <button type="button" className="btn ghost block" onClick={() => setSelectedId(null)}>
              Back to all shades
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="page wide">
      <TopBar
        onBack={() => onNavigate("")}
        backLabel="Back to welcome"
        theme={theme}
        onToggleTheme={onToggleTheme}
        a11y={a11y}
        onA11yChange={onA11yChange}
      />
      <section className="intro">
        <p className="eyebrow">Peptide Lip Tint</p>
        <h1 className="serif">Meet the shades</h1>
      </section>

      {/* Mobile and tablet: one product at a time, swipeable. */}
      <section className="carousel" aria-roledescription="carousel" aria-label="Lip tint shades">
        <div className="carousel-stage">
          <button
            type="button"
            className="icon-btn glass"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous shade"
          >
            <ArrowLeft />
          </button>
          <div className="carousel-track" ref={trackRef} onScroll={onScroll} tabIndex={0}>
            {products.map((p, i) => (
              <div
                key={p.id}
                className="slide"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${products.length}: ${p.name}`}
              >
                <button
                  type="button"
                  className="slide-btn"
                  onClick={() => setSelectedId(p.id)}
                  aria-label={`View ${p.name} details`}
                  style={{ "--glow": p.glow }}
                >
                  <img src={p.image} alt={`${p.name} ${p.category}`} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="icon-btn glass"
            onClick={() => goTo(index + 1)}
            disabled={index === products.length - 1}
            aria-label="Next shade"
          >
            <ArrowRight />
          </button>
        </div>

        <div className="dots">
          {products.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className="dot-hit"
              onClick={() => goTo(i)}
              aria-label={`Show ${p.name}`}
              aria-current={i === index ? "true" : undefined}
            >
              <span className={`dot ${i === index ? "on" : ""}`} />
            </button>
          ))}
        </div>

        <div className="caption" aria-live="polite">
          <h2 className="serif">{active.name}</h2>
          <p className="muted">
            {active.category} · {active.shade}
          </p>
        </div>
      </section>

      {/* Desktop: all four products at once. */}
      <ul className="product-grid">
        {products.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              className="product-card glass"
              onClick={() => setSelectedId(p.id)}
              style={{ "--glow": p.glow }}
            >
              <img src={p.image} alt={`${p.name} ${p.category}`} />
              <span className="product-meta">
                <strong className="serif">{p.name}</strong>
                <span className="muted small">{p.category} · {p.shade}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="cta-row">
        <button type="button" className="btn primary" onClick={toPoll}>
          Continue to Live Poll <ArrowRight />
        </button>
      </div>
    </div>
  );
}
