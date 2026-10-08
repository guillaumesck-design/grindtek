import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BRAND } from "@/data/content";

const H = ({ children }) => <h3 className="font-display font-bold text-lg text-ink mt-7 mb-2">{children}</h3>;

const Legal = () => (
  <>
    <H>Éditeur du site</H>
    <p>Le site {BRAND.domain} est édité par {BRAND.company}, société par actions simplifiée au capital de [capital social à compléter] €, immatriculée au RCS de Saint-Quentin sous le numéro 105 785 745.</p>
    <p>SIRET : 105 785 745 00016 — TVA intracommunautaire : FR19105785745</p>
    <p>Siège social : {BRAND.address}</p>
    <p>Téléphone : {BRAND.phone} — E-mail : {BRAND.email}</p>
    <p>OW Auto Grinding est une marque exploitée par {BRAND.company}.</p>
    <H>Directeur de la publication</H>
    <p>Guillaume Allart, Président.</p>
    <H>Hébergement</H>
    <p>[Nom de l'hébergeur, adresse et téléphone à compléter]</p>
    <H>Propriété intellectuelle</H>
    <p>L'ensemble des contenus de ce site (textes, visuels, logos, marques) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite. Les visuels des machines sont utilisés avec l'accord de nos partenaires.</p>
    <H>Responsabilité</H>
    <p>Les caractéristiques techniques et résultats présentés sont donnés à titre indicatif et peuvent évoluer. Seule une offre écrite engage {BRAND.company}.</p>
  </>
);

const Privacy = () => (
  <>
    <H>Responsable du traitement</H>
    <p>{BRAND.company}, {BRAND.address}. Contact : {BRAND.email}.</p>
    <H>Données collectées</H>
    <p>Via le formulaire de demande de devis : nom, entreprise, téléphone, e-mail professionnel, matériau principal, machine d'intérêt et message éventuel.</p>
    <H>Finalités et base légale</H>
    <p>Traiter votre demande de devis et assurer le suivi commercial associé, sur la base de mesures précontractuelles prises à votre demande et de notre intérêt légitime à répondre aux sollicitations professionnelles.</p>
    <H>Destinataires</H>
    <p>Les données sont réservées aux équipes commerciales et techniques d'OW Auto Grinding. Elles ne sont ni vendues ni cédées à des tiers.</p>
    <H>Durée de conservation</H>
    <p>Trois ans à compter du dernier contact, puis suppression ou anonymisation.</p>
    <H>Vos droits</H>
    <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Pour l'exercer : {BRAND.email}. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).</p>
    <H>Cookies</H>
    <p>Ce site n'utilise pas de cookies publicitaires ni de mesure d'audience. Seuls des cookies techniques strictement nécessaires (session de l'espace administrateur) peuvent être déposés.</p>
  </>
);

export const LegalDialog = ({ open, onClose }) => (
  <Dialog open={!!open} onOpenChange={(o) => !o && onClose()}>
    <DialogContent data-testid="legal-dialog" className="max-w-2xl rounded-none p-0 gap-0">
      <DialogHeader className="p-6 md:p-8 border-b border-line">
        <DialogTitle className="font-display font-bold text-2xl">{open === "privacy" ? "Politique de confidentialité" : "Mentions légales"}</DialogTitle>
        <DialogDescription className="font-mono text-xs uppercase tracking-[0.14em]">OW Auto Grinding — {BRAND.domain}</DialogDescription>
      </DialogHeader>
      <div data-lenis-prevent className="max-h-[65vh] overflow-y-auto p-6 md:p-8 text-[15px] text-slate-700 leading-relaxed space-y-2">
        {open === "privacy" ? <Privacy /> : <Legal />}
      </div>
    </DialogContent>
  </Dialog>
);
