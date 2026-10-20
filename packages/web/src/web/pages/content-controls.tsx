import { useState } from "react";
import { Search, Check, Plus, X, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import {
  useControls,
  useElementSave,
  useReviewSave,
  useReviewRemove,
  useReviewOrder,
  useLinkSave,
  useLinkRemove,
} from "../queries/controls";
import { useCMS, useSave } from "../queries/catalogue";
import { ImagePicker } from "../components/image-picker";
export function ContentControls() {
  const query = useControls();
  const cms = useCMS();
  const [group, setGroup] = useState("Homepage");
  const [search, setSearch] = useState("");
  const [section, setSection] = useState("");
  const groups = [...new Set(query.data?.elements.map((e) => e.group) || [])];
  const sections = [
    ...new Set(query.data?.elements.filter((e) => e.group === group).map((e) => e.section) || []),
  ];
  const fields =
    query.data?.elements.filter(
      (e) =>
        e.group === group &&
        (!section || e.section === section) &&
        (!search ||
          [e.label, e.value, e.section].join(" ").toLowerCase().includes(search.toLowerCase())),
    ) || [];
  return (
    <div className="granular-cms">
      <p className="admin-instructions">
        Edit individual website elements in English and Arabic. Clear an enquiry option to hide it.
        Changes are saved per field. Image controls support upload, preview, replacement and your
        media library.
      </p>
      <div className="content-group-tabs">
        {groups.map((g) => (
          <button
            key={g}
            onClick={() => {
              setGroup(g);
              setSection("");
            }}
            className={group === g ? "selected" : ""}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="control-search">
        <Search size={17} />
        <input
          aria-label="Find content field"
          placeholder="Search content…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          aria-label="Select content section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="">All sections</option>
          {sections.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      {query.isLoading ? (
        <div className="loading">Loading content controls…</div>
      ) : query.error ? (
        <p className="form-error">Unable to load controls.</p>
      ) : (
        sections
          .filter((s) => !section || section === s)
          .map((s) => (
            <section className="cms-section" key={s}>
              <h2>
                {group} <span>/</span> {s}
              </h2>
              {group === "Homepage" &&
                s === "Hero" &&
                cms.data?.content.find((x) => x.id === "home") && (
                  <PageFields page={cms.data.content.find((x) => x.id === "home")!} />
                )}
              <div className="granular-fields">
                {fields
                  .filter((e) => e.section === s)
                  .map((e) => (
                    <ElementField key={e.id + e.value + e.valueAr} element={e} />
                  ))}
              </div>
            </section>
          ))
      )}
      <section className="cms-section">
        <h2>Existing page & section records</h2>
        <p>About, homepage, industries and footer records remain editable below.</p>
        {cms.isLoading ? (
          <p>Loading…</p>
        ) : (
          cms.data?.content.map((page) => (
            <details key={page.id}>
              <summary>
                {page.title} <span>{page.type}</span>
              </summary>
              <PageFields page={page} />
            </details>
          ))
        )}
      </section>
    </div>
  );
}
function ElementField({ element }: { element: any }) {
  const [value, setValue] = useState(element.value);
  const [valueAr, setValueAr] = useState(element.valueAr);
  const save = useElementSave();
  const dirty = value !== element.value || valueAr !== element.valueAr;
  return (
    <form
      className="element-field"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate({ id: element.id, value, valueAr });
      }}
    >
      <h3>{element.label}</h3>
      {element.kind === "image" ? (
        <ImagePicker value={value} onChange={setValue} label={element.label} />
      ) : element.kind === "link" ? (
        <label>
          Destination
          <input
            aria-label={element.label}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
      ) : (
        <div className="form-row">
          <label>
            English
            <textarea
              aria-label={element.label + " English"}
              rows={value.length > 110 ? 3 : 2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
          <label>
            Arabic
            <textarea
              aria-label={element.label + " Arabic"}
              dir="rtl"
              rows={valueAr.length > 110 ? 3 : 2}
              value={valueAr}
              onChange={(e) => setValueAr(e.target.value)}
            />
          </label>
        </div>
      )}
      <div className="field-save">
        <button className="button outline" disabled={save.isPending || !dirty}>
          {save.isPending ? "Saving…" : "Save element"}
        </button>
        {save.isSuccess && !dirty && (
          <span>
            <Check size={14} />
            Saved
          </span>
        )}
      </div>
      {save.error && <p className="form-error">{save.error.message}</p>}
    </form>
  );
}
function PageFields({ page }: { page: any }) {
  const [draft, setDraft] = useState({ ...page });
  const save = useSave();
  return (
    <form
      className="page-record-fields"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate({ table: "content", data: draft });
      }}
    >
      <div className="form-row">
        {["title", "titleAr", "body", "bodyAr"].map((key) => (
          <label key={key}>
            {key === "title"
              ? "Heading · English"
              : key === "titleAr"
                ? "Heading · Arabic"
                : key === "body"
                  ? "Description · English"
                  : "Description · Arabic"}
            <textarea
              aria-label={page.id + " " + key}
              dir={key.endsWith("Ar") ? "rtl" : undefined}
              rows={key.startsWith("body") ? 4 : 2}
              value={draft[key]}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <ImagePicker
        label={page.id + " image"}
        value={draft.image}
        onChange={(image) => setDraft({ ...draft, image })}
      />
      <button className="button orange" disabled={save.isPending}>
        {save.isPending ? "Saving…" : "Save section record"}
      </button>
      {save.isSuccess && <p className="blue">Section saved.</p>}
      {save.error && <p className="form-error">{save.error.message}</p>}
    </form>
  );
}
export function ReviewManager() {
  const query = useControls();
  const save = useReviewSave();
  const remove = useReviewRemove();
  const order = useReviewOrder();
  const [draft, setDraft] = useState<any>(null);
  const [confirm, setConfirm] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewStatus, setReviewStatus] = useState("");
  const reviews = query.data?.reviews || [];
  const reviewMatches = (r: any) => {
    const q = reviewSearch.trim().toLowerCase();
    const state = r.published ? "published" : r.source === "visitor" ? "pending" : "draft";
    return (
      (!reviewStatus || reviewStatus === state) &&
      (!q || [r.name, r.company, r.quote, r.quoteAr].some((v) => String(v || "").toLowerCase().includes(q)))
    );
  };
  const shownReviews = reviews.filter(reviewMatches).length;
  function move(i: number, direction: number) {
    const ids = reviews.map((r) => r.id);
    [ids[i], ids[i + direction]] = [ids[i + direction], ids[i]];
    order.mutate({ ids });
  }
  return (
    <>
      <div className="manager-heading">
        <p>
          Visitor submissions arrive here as Pending approval. Approve & publish makes a review
          visible on the website; Reject / delete removes it. Only publish genuine feedback.
        </p>
        <button
          className="button orange"
          onClick={() =>
            setDraft({
              id: crypto.randomUUID(),
              name: "",
              company: "",
              quote: "",
              quoteAr: "",
              rating: null,
              position: reviews.length,
              published: false,
            })
          }
        >
          <Plus size={16} />
          Add review
        </button>
      </div>
      <p className="review-queue-summary">{reviews.filter((r) => r.source === "visitor" && !r.published).length} pending visitor reviews</p>
      {reviews.length > 0 && (
        <div className="admin-search">
          <label>
            <Search size={17} />
            <input type="search" value={reviewSearch} placeholder="Search reviews by name, company or text…" aria-label="Search reviews" onChange={(e) => setReviewSearch(e.target.value)} />
            {reviewSearch && <button type="button" onClick={() => setReviewSearch("")} aria-label="Clear search"><X size={15} /></button>}
          </label>
          <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)} aria-label="Filter reviews">
            <option value="">All reviews</option>
            <option value="pending">Pending approval</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <span className="admin-search-count">{shownReviews === reviews.length ? reviews.length + " items" : shownReviews + " of " + reviews.length}</span>
        </div>
      )}
      {reviews.length > 0 && !shownReviews && <div className="empty">No reviews match your search.</div>}
      {save.error && <p className="form-error" role="alert">{save.error.message}</p>}
      {remove.error && <p className="form-error" role="alert">{remove.error.message}</p>}
      {query.isLoading ? (
        <div className="loading">Loading reviews…</div>
      ) : !reviews.length ? (
        <div className="empty">
          <h3>No customer reviews yet</h3>
          <p>The homepage shows an honest empty state until you publish a verified review.</p>
        </div>
      ) : (
        reviews.map((r, i) => !reviewMatches(r) ? null : (
          <article className="review-admin-record" key={r.id}>
            <div>
              <span className={r.published ? "published-pill" : "draft-pill"}>
                {r.published ? "Published" : r.source === "visitor" ? "Pending approval" : "Draft"}
              </span>
              {r.source === "visitor" && <small className="review-origin">Visitor submission · {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</small>}
              <h3>{r.name}</h3>
              <small>{r.company}</small>
              <p>{r.quote}</p>
            </div>
            <div className="record-actions">
              <button
                disabled={i === 0 || order.isPending}
                aria-label={"Move " + r.name + " up"}
                onClick={() => move(i, -1)}
              >
                <ArrowUp size={17} />
              </button>
              <button
                disabled={i === reviews.length - 1 || order.isPending}
                aria-label={"Move " + r.name + " down"}
                onClick={() => move(i, 1)}
              >
                <ArrowDown size={17} />
              </button>
              <button
                disabled={save.isPending}
                onClick={() => save.mutate({ ...r, published: !r.published })}
              >
                {r.published ? <EyeOff size={16} /> : <Eye size={16} />}{" "}
                {r.published ? "Unpublish" : r.source === "visitor" ? "Approve & publish" : "Publish"}
              </button>
              <button onClick={() => setDraft({ ...r })}>Edit</button>
              {confirm === r.id ? (
                <>
                  <button
                    onClick={() => {
                      remove.mutate({ id: r.id });
                      setConfirm("");
                    }}
                  >
                    Confirm delete
                  </button>
                  <button onClick={() => setConfirm("")}>Cancel</button>
                </>
              ) : (
                <button onClick={() => setConfirm(r.id)}>{r.source === "visitor" && !r.published ? "Reject / delete" : "Delete"}</button>
              )}
            </div>
          </article>
        ))
      )}
      {draft && (
        <div className="editor-overlay">
          <form
            className="editor"
            onSubmit={async (e) => {
              e.preventDefault();
              await save.mutateAsync(draft);
              setDraft(null);
            }}
          >
            <header>
              <h2>Customer review</h2>
              <button aria-label="Close review editor" type="button" onClick={() => setDraft(null)}>
                <X />
              </button>
            </header>
            <div className="editor-fields">
              {["name", "company", "quote", "quoteAr"].map((key) => (
                <label key={key}>
                  {key === "quoteAr"
                    ? "Review · Arabic"
                    : key === "quote"
                      ? "Review · English"
                      : key === "name"
                        ? "Customer name"
                        : "Company (optional)"}
                  <textarea
                    aria-label={key}
                    required={["name", "quote"].includes(key)}
                    minLength={key === "quote" ? 10 : undefined}
                    dir={key === "quoteAr" ? "rtl" : undefined}
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  />
                </label>
              ))}
              <label>
                Rating (optional)
                <select
                  aria-label="Review rating"
                  value={draft.rating || ""}
                  onChange={(e) =>
                    setDraft({ ...draft, rating: e.target.value ? Number(e.target.value) : null })
                  }
                >
                  <option value="">No rating supplied</option>
                  {[1, 2, 3, 4, 5].map((x) => (
                    <option key={x} value={x}>
                      {x} / 5
                    </option>
                  ))}
                </select>
              </label>
              <label className="checkbox">
                <input
                  aria-label="Publish review"
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Publish this genuine review
              </label>
            </div>
            {save.error && <p className="form-error">{save.error.message}</p>}
            <button className="button orange" disabled={save.isPending}>
              {save.isPending ? "Saving…" : "Save review"}
            </button>
          </form>
        </div>
      )}
      {(remove.error || order.error) && (
        <p className="form-error">{remove.error?.message || order.error?.message}</p>
      )}
    </>
  );
}
export function LinkManager() {
  const query = useControls();
  const save = useLinkSave();
  const remove = useLinkRemove();
  const [draft, setDraft] = useState<any>(null);
  const [confirm, setConfirm] = useState("");
  return (
    <>
      <div className="manager-heading">
        <p>Manage navigation, footer and social links. Position controls their order.</p>
        <button
          className="button orange"
          onClick={() =>
            setDraft({
              id: crypto.randomUUID(),
              location: "footer",
              label: "",
              labelAr: "",
              url: "",
              position: query.data?.links.length || 0,
              published: true,
            })
          }
        >
          Add link
        </button>
      </div>
      {query.isLoading ? (
        <p>Loading links…</p>
      ) : (
        query.data?.links.map((link) => (
          <article className="link-record" key={link.id}>
            <span>{link.location}</span>
            <strong>{link.label}</strong>
            <code>{link.url}</code>
            <span>
              {link.published ? "Visible" : "Hidden"} · {link.position}
            </span>
            <button onClick={() => setDraft({ ...link })}>Edit</button>
            {confirm === link.id ? (
              <button
                onClick={() => {
                  remove.mutate({ id: link.id });
                  setConfirm("");
                }}
              >
                Confirm delete
              </button>
            ) : (
              <button onClick={() => setConfirm(link.id)}>Delete</button>
            )}
          </article>
        ))
      )}
      {draft && (
        <div className="editor-overlay">
          <form
            className="editor"
            onSubmit={async (e) => {
              e.preventDefault();
              await save.mutateAsync(draft);
              setDraft(null);
            }}
          >
            <header>
              <h2>Website link</h2>
              <button type="button" aria-label="Close link editor" onClick={() => setDraft(null)}>
                <X />
              </button>
            </header>
            <div className="editor-fields">
              <label>
                Location
                <select
                  aria-label="Link location"
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                >
                  {["navigation", "footer", "social"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              {["label", "labelAr", "url"].map((key) => (
                <label key={key}>
                  {key === "label"
                    ? "Label · English"
                    : key === "labelAr"
                      ? "Label · Arabic"
                      : "Destination"}
                  <input
                    aria-label={key}
                    required
                    value={draft[key]}
                    onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                  />
                </label>
              ))}
              <label>
                Position
                <input
                  aria-label="Link position"
                  type="number"
                  min={0}
                  required
                  value={draft.position}
                  onChange={(e) => setDraft({ ...draft, position: Number(e.target.value) })}
                />
              </label>
              <label className="checkbox">
                <input
                  aria-label="Show link"
                  type="checkbox"
                  checked={draft.published}
                  onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                />
                Visible
              </label>
            </div>
            {save.error && <p className="form-error">{save.error.message}</p>}
            <button className="button orange" disabled={save.isPending}>
              Save link
            </button>
          </form>
        </div>
      )}
    </>
  );
}
