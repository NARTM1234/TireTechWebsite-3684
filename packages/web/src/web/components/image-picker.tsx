import { useState } from "react";
import { Upload, Images, X, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCMS } from "../queries/catalogue";
import { client } from "../lib/api";
export function ImagePicker({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const cms = useCMS();
  const q = useQueryClient();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(file: File) {
    setBusy(true);
    setError("");
    try {
      if (
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 8 * 1024 * 1024
      )
        throw new Error("JPG, PNG or WebP up to 8 MB.");
      const { url, key } = await client.upload.presign({ type: file.type as any, size: file.size });
      const response = await fetch(url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!response.ok) throw new Error("Upload failed. Please retry.");
      const result = await client.upload.complete({
        key,
        name: file.name,
        alt: file.name,
        altAr: "",
      });
      onChange(result.url);
      await q.invalidateQueries();
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to upload");
    } finally {
      setBusy(false);
    }
  }
  const images = [
    { name: "TireTech logo", url: "/images/tiretech-logo.png" },
    ...(cms.data?.media.map((m) => ({ name: m.name, url: m.url })) || []),
    ...["hero", "workshop", "fleet", "patch"].map((x) => ({
      name: x,
      url: "/images/" + x + ".webp",
    })),
  ];
  return (
    <div className="image-picker">
      <span className="field-label">{label}</span>
      <div className="image-picker-preview">
        {value ? <img src={value} alt={label} /> : <span>No image selected</span>}
      </div>
      <div className="image-picker-actions">
        <label className="upload-button">
          <Upload size={15} />
          {busy ? "Uploading…" : "Upload / replace"}
          <input
            aria-label={"Upload " + label}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={busy}
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
        <button type="button" onClick={() => setOpen(!open)}>
          <Images size={15} />
          Choose media
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")}>
            <X size={15} />
            Remove
          </button>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {open && (
        <div className="media-chooser">
          {cms.isLoading ? (
            <p>Loading media…</p>
          ) : (
            images.filter((item, index, all) => all.findIndex((entry) => entry.url === item.url) === index).map((item, i) => (
              <button
                type="button"
                key={item.url + i}
                onClick={() => {
                  onChange(item.url);
                  setOpen(false);
                }}
                className={item.url === value ? "chosen" : ""}
              >
                <img src={item.url} alt={item.name} loading="lazy" />
                <span>{item.name}</span>
                {item.url === value && <Check size={14} />}
              </button>
            ))
          )}
        </div>
      )}
      <details>
        <summary>Advanced image URL</summary>
        <input
          aria-label={label + " URL"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
        />
      </details>
    </div>
  );
}
