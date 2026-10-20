import { Mail, Phone, MessageCircle } from "lucide-react";
import { useCatalogue } from "../queries/catalogue";
import { useLang } from "./site";
export function ContactChannels({ compact = false }: { compact?: boolean }) {
  const { data } = useCatalogue();
  const { t } = useLang();
  const settings = data?.settings || {};
  return <div className={compact ? "contact-channels compact" : "contact-channels"}>
    {settings.email && <a className="contact-channel" href={"mailto:" + settings.email}><Mail size={18} /><span>{settings.email}</span></a>}
    {["", "-2"].map((suffix) => settings["phone" + suffix] && <div className="phone-channel" key={suffix}>
      <a className="contact-channel" href={"tel:" + settings["phone" + suffix].replace(/\s/g, "")}><Phone size={18} /><bdi>{settings["phone" + suffix]}</bdi></a>
      {settings["whatsapp" + suffix] && <a className="whatsapp-channel" href={"https://wa.me/" + settings["whatsapp" + suffix]} target="_blank" rel="noreferrer" aria-label={"WhatsApp " + settings["phone" + suffix]}><MessageCircle size={16} />{t("WhatsApp", "واتساب")}</a>}
    </div>)}
  </div>;
}