import { ContentControls, ReviewManager, LinkManager } from "./content-controls";
import { ImagePicker } from "../components/image-picker";
import { useEffect, useState } from "react";
import { Link, Redirect, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  Tags,
  Layers,
  FileText,
  Image,
  Search,
  Settings,
  Inbox,
  LogOut,
  Plus,
  X,
  Check,
  Shield,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { authClient, clearAdminToken } from "../lib/auth";
import { client } from "../lib/api";
import { useAdmin, useCMS, useSave, useRemove, useStatus, useEnquiryDelete } from "../queries/catalogue";
import { Logo, useLang } from "../components/site";
export function AdminLogin() {
  const queryClient = useQueryClient();
  const { t } = useLang();
  const [, navigate] = useLocation();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const f = new FormData(e.currentTarget);
    // An expired bearer token must not contaminate a fresh sign-in attempt.
    clearAdminToken();
    try {
      const r = await authClient.signIn.email({
        email: String(f.get("email")).trim().toLowerCase(),
        password: String(f.get("password")),
      });
      if (r.error) {
        const code = r.error.code;
        setError(
          code === "INVALID_EMAIL_OR_PASSWORD"
            ? t(
                "Email or password does not match. Use your assigned admin email, check capitalization and remove any accidentally pasted spaces.",
                "البريد الإلكتروني أو كلمة المرور غير صحيحة. تحقق من حساب الإدارة والأحرف والمسافات غير المقصودة.",
              )
            : r.error.status === 429
              ? t(
                  "Too many attempts. Wait one minute and retry.",
                  "محاولات كثيرة. انتظر دقيقة ثم أعد المحاولة.",
                )
              : r.error.status === 403
                ? t(
                    "This preview could not authorize the login request. Open the admin page in a new tab and retry.",
                    "تعذر التصريح بطلب الدخول. افتح صفحة الإدارة في علامة تبويب جديدة.",
                  )
                : r.error.message ||
                  t("Unable to sign in. Please retry.", "تعذر تسجيل الدخول. يرجى إعادة المحاولة."),
        );
      } else {
        queryClient.clear();
        navigate("/admin");
      }
    } catch {
      setError(
        t(
          "Could not reach the sign-in service. Check your connection and retry.",
          "تعذر الاتصال بخدمة الدخول. تحقق من الاتصال وأعد المحاولة.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-login">
      <div className="login-visual">
        <Logo />
        <span className="eyebrow blue">TIRETECH / MANAGEMENT</span>
        <h1>{t("The control room.", "غرفة التحكم.")}</h1>
        <p>
          {t("One website. Two administrators. Complete control.", "موقع واحد. مسؤولان. تحكم كامل.")}
        </p>
      </div>
      <form onSubmit={submit}>
        <Shield size={26} className="blue" />
        <span className="eyebrow">{t("AUTHORIZED ACCESS ONLY", "دخول للمصرح لهم فقط")}</span>
        <h2>{t("Admin sign in", "تسجيل دخول الإدارة")}</h2>
        <p>
          {t(
            "Use your assigned TireTech administrator account.",
            "استخدم حساب مسؤول تايرتك المخصص لك.",
          )}
        </p>
        <label>
          {t("Email address", "البريد الإلكتروني")}
          <input
            aria-label="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            list="admin-email-options"
            autoCapitalize="none"
            spellCheck={false}
          />
          <datalist id="admin-email-options" aria-label="Assigned administrator emails">
            <option value="abdulrasheednabeeh@gmail.com">abdulrasheednabeeh@gmail.com</option>
            <option value="tmarasheed@gmail.com">tmarasheed@gmail.com</option>
          </datalist>
        </label>
        <label>
          {t("Password", "كلمة المرور")}
          <span className="password-input-wrap">
            <input
              aria-label="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              autoCapitalize="none"
              spellCheck={false}
            />
            <button
              type="button"
              className="password-visibility"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button disabled={busy} className="button orange">
          {busy ? t("Signing in…", "جار تسجيل الدخول…") : t("Sign in securely", "تسجيل دخول آمن")}
        </button>
        <Link href="/" className="muted">
          {t("Return to website", "العودة للموقع")}
        </Link>
      </form>
    </div>
  );
}
const tabs = [
  ["", "Dashboard", LayoutDashboard],
  ["products", "Products", Package],
  ["brands", "Brands", Tags],
  ["categories", "Categories", Layers],
  ["enquiries", "Enquiries", Inbox],
  ["cms", "Pages & homepage", FileText],
  ["content", "Content elements", FileText],
  ["reviews", "Customer reviews", Tags],
  ["links", "Navigation & links", ExternalLink],
  ["media", "Media", Image],
  ["seo", "SEO", Search],
  ["settings", "Website settings", Settings],
  ["account", "Admin & password", Shield],
] as const;
const empty: any = {
  products: {
    id: "",
    name: "",
    nameAr: "",
    brandId: "",
    categoryId: "",
    description: "",
    descriptionAr: "",
    details: "",
    detailsAr: "",
    image: "/images/patch.webp",
    illustrative: true,
  },
  brands: { id: "", name: "", nameAr: "", description: "", descriptionAr: "", image: "" },
  categories: { id: "", name: "", nameAr: "" },
  content: { id: "", type: "page", title: "", titleAr: "", body: "", bodyAr: "", image: "" },
  media: { id: "", name: "", url: "", alt: "", altAr: "" },
  seo: {
    id: "",
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    image: "/images/hero.webp",
  },
  settings: { id: "", value: "" },
};
export function Admin() {
  const me = useAdmin();
  if (me.isLoading) return <div className="loading">Verifying secure session…</div>;
  if (me.error) return <Redirect to="/admin/login" />;
  return <AdminWorkspace email={me.data?.email || ""} />;
}
function AdminWorkspace({ email }: { email: string }) {
  const [path, navigate] = useLocation();
  const tab = path.split("/")[2] || "";
  const cms = useCMS();
  const save = useSave();
  const remove = useRemove();
  const status = useStatus();
  const deleteEnquiry = useEnquiryDelete();
  const [enquiryToDelete, setEnquiryToDelete] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [confirm, setConfirm] = useState<string | null>(null);
  const table = tab === "cms" ? "content" : tab === "content" ? "elements-control" : tab;
  const data = cms.data as any;
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  useEffect(() => {
    setSearch("");
    setBrandFilter("");
    setCategoryFilter("");
    setStatusFilter("");
  }, [tab]);
  const allRows: any[] = data?.[table] || [];
  const matches = (x: any) => {
    const q = search.trim().toLowerCase();
    return !q || Object.values(x).some((v) => typeof v === "string" && v.toLowerCase().includes(q));
  };
  const rows = allRows.filter(
    (x) =>
      matches(x) &&
      (!brandFilter || x.brandId === brandFilter) &&
      (!categoryFilter || x.categoryId === categoryFilter),
  );
  const enquiries: any[] = [...(data?.enquiries || [])]
    .reverse()
    .filter((x) => matches(x) && (!statusFilter || x.status === statusFilter));
  const searchBar = (placeholder: string, total: number, shown: number, extra?: React.ReactNode) => (
    <div className="admin-search">
      <label>
        <Search size={17} />
        <input
          type="search"
          value={search}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button type="button" onClick={() => setSearch("")} aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </label>
      {extra}
      <span className="admin-search-count">
        {shown === total ? total + " items" : shown + " of " + total}
      </span>
    </div>
  );
  const title = tabs.find((x) => x[0] === tab)?.[1] || "Dashboard";
  async function saveRow(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await save.mutateAsync({ table, data: editing } as any);
      setEditing(null);
      setNotice("Changes saved. The public website is updated.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to save");
    }
  }
  async function password(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setNotice("");
    const form = e.currentTarget;
    const f = new FormData(form);
    if (f.get("new") !== f.get("confirm")) {
      setError("New passwords do not match.");
      return;
    }
    const r = await authClient.changePassword({
      currentPassword: String(f.get("current")),
      newPassword: String(f.get("new")),
      revokeOtherSessions: true,
    });
    if (r.error) setError(r.error.message || "Unable to change password");
    else {
      setNotice("Password changed. Other sessions were revoked.");
      form.reset();
    }
  }
  async function uploadFile(file: File) {
    setUploading(true);
    setError("");
    try {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 8 * 1024 * 1024
      )
        throw new Error("Choose JPG, PNG or WebP up to 8 MB.");
      const { url, key } = await client.upload.presign({ type: file.type as any, size: file.size });
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!response.ok) throw new Error("Upload failed");
      await client.upload.complete({ key, name: file.name, alt: file.name, altAr: "" });
      await cms.refetch();
      setNotice("Image uploaded. Copy its URL into the product or page image field.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo />
        <span className="eyebrow blue">CONTENT MANAGEMENT</span>
        <nav>
          {tabs.map(([slug, name, Icon]) => (
            <Link
              key={slug}
              href={"/admin" + (slug ? "/" + slug : "")}
              className={tab === slug ? "active" : ""}
            >
              <Icon size={18} />
              {name}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <small>{email}</small>
          <span>Admin · Full access</span>
          <Link href="/" target="_blank">
            <ExternalLink size={15} />
            View website
          </Link>
          <button
            onClick={async () => {
              await authClient.signOut();
              clearAdminToken();
              navigate("/admin/login");
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header>
          <div>
            <span className="eyebrow blue">TIRETECH / ADMIN</span>
            <h1>{title}</h1>
          </div>
          {empty[table] && (
            <button
              className="button orange"
              onClick={() => {
                setEditing({ ...empty[table] });
                setNotice("");
                setError("");
              }}
            >
              <Plus size={17} />
              Add{" "}
              {table === "content"
                ? "content"
                : table === "settings"
                  ? "setting"
                  : table.replace(/s$/, "")}
            </button>
          )}
        </header>
        {notice && (
          <div className="admin-notice">
            <Check size={17} />
            {notice}
            <button onClick={() => setNotice("")}>
              <X size={15} />
            </button>
          </div>
        )}
        {error && <p className="form-error">{error}</p>}
        {cms.isLoading ? (
          <div className="loading">Loading CMS…</div>
        ) : cms.error ? (
          <p className="form-error">Unable to load CMS.</p>
        ) : (
          <>
            {tab === "content" && <ContentControls />}
            {tab === "reviews" && <ReviewManager />}
            {tab === "links" && <LinkManager />}
            {!tab && (
              <>
                <div className="dashboard-stats">
                  {[
                    ["Products", data.products.length, Package],
                    ["Brands", data.brands.length, Tags],
                    [
                      "New enquiries",
                      data.enquiries.filter((x: any) => x.status === "new").length,
                      Inbox,
                    ],
                    ["Admins", "2", Shield],
                  ].map(([label, value, Icon]: any) => (
                    <div key={label}>
                      <Icon size={22} />
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
                <div className="dashboard-panel">
                  <span className="eyebrow blue">YOUR WEBSITE, MANAGED</span>
                  <h2>Everything in one place.</h2>
                  <p>
                    Manage English and Arabic content, product enquiries, media and website
                    settings. Both administrators have identical permissions. Public registration is
                    closed.
                  </p>
                  <div className="admin-quick">
                    {tabs.slice(1, 6).map(([slug, label, Icon]) => (
                      <Link href={"/admin/" + slug} key={slug}>
                        <Icon size={19} />
                        {label}
                        <ExternalLink size={15} />
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="dashboard-panel">
                  <h3>Before publishing</h3>
                  <ul>
                    <li>
                      Replace illustrative catalogue entries with verified products and brand
                      assignments.
                    </li>
                    <li>
                      Confirm the official contact email, phone and WhatsApp in Website settings.
                    </li>
                    <li>Set a verified map embed URL and canonical website URL.</li>
                    <li>Change the initial password on both accounts.</li>
                  </ul>
                </div>
              </>
            )}
            {tab === "account" && (
              <>
                <div className="dashboard-panel">
                  <h2>Administrator accounts</h2>
                  <p>
                    Exactly two accounts. Both have full access. No other roles or public
                    registration.
                  </p>
                  {["abdulrasheednabeeh@gmail.com", "tmarasheed@gmail.com"].map((x) => (
                    <div className="account-line" key={x}>
                      <Shield size={18} />
                      <strong>{x}</strong>
                      <span>Admin · Full access</span>
                    </div>
                  ))}
                </div>
                <form className="dashboard-panel password-form" onSubmit={password}>
                  <h2>Change your password</h2>
                  <p>Changes apply to your own account. Other active sessions will be revoked.</p>
                  <label>
                    Current password
                    <input
                      aria-label="current"
                      name="current"
                      type="password"
                      required
                      autoComplete="current-password"
                    />
                  </label>
                  <label>
                    New password
                    <input
                      aria-label="new"
                      name="new"
                      type="password"
                      required
                      minLength={10}
                      autoComplete="new-password"
                    />
                  </label>
                  <label>
                    Confirm new password
                    <input
                      aria-label="confirm"
                      name="confirm"
                      type="password"
                      required
                      minLength={10}
                      autoComplete="new-password"
                    />
                  </label>
                  <button className="button orange">Update password</button>
                </form>
              </>
            )}
            {tab === "enquiries" && (
              <div className="enquiries-list">
                {data.enquiries.length > 0 &&
                  searchBar("Search enquiries by name, company, email, phone or product…", data.enquiries.length, enquiries.length,
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
                      <option value="">All statuses</option>
                      <option value="new">New</option>
                      <option value="in-progress">In progress</option>
                      <option value="closed">Closed</option>
                    </select>,
                  )}
                {data.enquiries.length > 0 && !enquiries.length && <div className="empty">No enquiries match your search.</div>}
                {deleteEnquiry.error && <p className="form-error" role="alert">{deleteEnquiry.error.message}</p>}
                {!data.enquiries.length && (
                  <div className="empty">
                    <Inbox size={35} />
                    <h3>No enquiries yet</h3>
                    <p>Submitted website enquiries will appear here.</p>
                  </div>
                )}
                {enquiries.map((x: any) => (
                  <article className="enquiry-record" key={x.id}>
                    <div>
                      <span className="eyebrow blue">
                        {x.type} · {new Date(x.createdAt).toLocaleDateString()}
                      </span>
                      <h3>
                        {x.name} <small>{x.company}</small>
                      </h3>
                      <p>{x.message}</p>
                      <span>{x.product}</span>
                      <div className="enquiry-contacts">
                        <a href={"mailto:" + x.email}>{x.email}</a>
                        <a href={"tel:" + x.phone}>{x.phone}</a>
                      </div>
                    </div>
                    <div className="enquiry-record-actions">
                    <select
                      value={x.status}
                      disabled={status.isPending}
                      onChange={(e) => status.mutate({ id: x.id, status: e.target.value as any })}
                    >
                      <option value="new">New</option>
                      <option value="in-progress">In progress</option>
                      <option value="closed">Closed</option>
                    </select>
                      {enquiryToDelete === x.id ? <div className="enquiry-delete-confirm"><p>Permanently delete this enquiry?</p><button className="danger-button" disabled={deleteEnquiry.isPending} onClick={async () => { try { await deleteEnquiry.mutateAsync({ id: x.id }); setEnquiryToDelete(""); } catch {} }}>{deleteEnquiry.isPending ? "Deleting…" : "Confirm delete"}</button><button disabled={deleteEnquiry.isPending} onClick={() => setEnquiryToDelete("")}>Cancel</button></div> : <button className="danger-button" onClick={() => setEnquiryToDelete(x.id)}>Delete enquiry</button>}
                    </div>
                  </article>
                ))}
              </div>
            )}
            {empty[table] && (
              <>
                {tab === "cms" && (
                  <p className="admin-instructions">
                    Edit pages, homepage, industries and footer content. Select the content type in
                    the editor. Arabic fields appear on the RTL website.
                  </p>
                )}
                {tab === "settings" && (
                  <p className="admin-instructions">
                    Contact email and phone, WhatsApp (international digits), verified map embed
                    URL, location and canonical website URL. Blank contact channels remain hidden.
                  </p>
                )}
                {tab === "media" && (
                  <label className="upload-box">
                    <Image size={25} />
                    <strong>{uploading ? "Uploading…" : "Upload a website image"}</strong>
                    <span>JPG, PNG or WebP · Maximum 8 MB</span>
                    <input
                      aria-label="Upload image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploading}
                      onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
                    />
                  </label>
                )}
                {searchBar(
                  "Search " + title.toLowerCase() + "…",
                  allRows.length,
                  rows.length,
                  table === "products" && (
                    <>
                      <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} aria-label="Filter by brand">
                        <option value="">All brands</option>
                        {data.brands.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} aria-label="Filter by category">
                        <option value="">All categories</option>
                        {data.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </>
                  ),
                )}
                <div className="admin-table">
                  <div className="table-head">
                    <span>{table === "settings" ? "Setting" : "Content"}</span>
                    <span>Reference</span>
                    <span>Actions</span>
                  </div>
                  {rows.map((x: any) => (
                    <div className="table-row" key={x.id}>
                      <div>
                        {(x.image || x.url) && <img src={x.image || x.url} alt="" loading="lazy" />}
                        <div>
                          <strong>{x.name || x.title || x.id}</strong>
                          <small>{x.type || x.description || x.value || x.alt}</small>
                        </div>
                      </div>
                      <code>{x.id}</code>
                      <div>
                        <button
                          onClick={() => {
                            setEditing({ ...x });
                            setError("");
                          }}
                        >
                          Edit
                        </button>
                        {table !== "settings" &&
                          (confirm === x.id ? (
                            <>
                              <button
                                disabled={remove.isPending}
                                onClick={async () => {
                                  try {
                                    await remove.mutateAsync({ table: table as any, id: x.id });
                                    setConfirm(null);
                                  } catch (e) {
                                    setError(e instanceof Error ? e.message : "Unable to remove");
                                  }
                                }}
                              >
                                Confirm delete
                              </button>
                              <button onClick={() => setConfirm(null)}>Cancel</button>
                            </>
                          ) : (
                            <button className="delete" onClick={() => setConfirm(x.id)}>
                              Delete
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                  {!rows.length && (
                    <div className="empty">{allRows.length ? "Nothing matches your search." : "No content yet. Add your first entry."}</div>
                  )}
                </div>
              </>
            )}
          </>
        )}
        {editing && (
          <div className="editor-overlay">
            <form className="editor" onSubmit={saveRow}>
              <header>
                <div>
                  <span className="eyebrow blue">CONTENT EDITOR</span>
                  <h2>{editing.id ? "Edit entry" : "New entry"}</h2>
                </div>
                <button type="button" onClick={() => setEditing(null)} aria-label="Close editor">
                  <X />
                </button>
              </header>
              <div className="editor-fields">
                {Object.entries(editing).map(([key, value]) =>
                  key === "illustrative" ? (
                    <label className="checkbox" key={key}>
                      <input
                        aria-label="Illustrative entry"
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => setEditing({ ...editing, [key]: e.target.checked })}
                      />
                      Illustrative / sample entry
                    </label>
                  ) : ["image", "url"].includes(key) ? (
                    <ImagePicker key={key} label={key === "image" ? "Image / logo" : "Media image"} value={String(value)} onChange={(image) => setEditing({ ...editing, [key]: image })} />
                  ) : (
                    <label key={key}>
                      {key === "details"
                        ? "Technical details / specifications · English"
                        : key === "detailsAr"
                          ? "Technical details / specifications · Arabic"
                          : key.replace(/([A-Z])/g, " $1")}
                      {["brandId", "categoryId", "type"].includes(key) ? (
                        <select
                          required
                          value={String(value)}
                          onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                        >
                          <option value="">Select…</option>
                          {key === "type"
                            ? ["page", "homepage", "industry", "footer"].map((v) => (
                                <option key={v}>{v}</option>
                              ))
                            : data[key === "brandId" ? "brands" : "categories"].map((r: any) => (
                                <option value={r.id} key={r.id}>
                                  {r.name}
                                </option>
                              ))}
                        </select>
                      ) : [
                          "description",
                          "descriptionAr",
                          "details",
                          "detailsAr",
                          "body",
                          "bodyAr",
                          "value",
                        ].includes(key) ? (
                        <textarea
                          aria-label={key}
                          rows={4}
                          dir={key.endsWith("Ar") ? "rtl" : undefined}
                          value={String(value)}
                          onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                        />
                      ) : (
                        <input
                          aria-label={key}
                          required={!["image", "url", "altAr", "alt"].includes(key)}
                          dir={key.endsWith("Ar") ? "rtl" : undefined}
                          value={String(value)}
                          onChange={(e) => setEditing({ ...editing, [key]: e.target.value })}
                        />
                      )}
                    </label>
                  ),
                )}
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="editor-actions">
                <button className="button outline" type="button" onClick={() => setEditing(null)}>
                  Cancel
                </button>
                <button className="button orange" disabled={save.isPending}>
                  {save.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
