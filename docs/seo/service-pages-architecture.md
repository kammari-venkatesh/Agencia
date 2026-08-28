# Vridhio service pages — SEO & content architecture

**Status:** Implemented. Ten catalog-driven service pages are live, prerendered, and listed in the sitemap.

**Date:** 28 Aug 2026 (spec); implementation current as of 28 Aug 2026  
**Canonical URLs:** `https://www.vridhio.com/services/{slug}/`  
**Brand / SEO name:** Vridhio  
**Site origin:** `https://www.vridhio.com`

## Current architecture

```
SERVICE_CATALOG  (src/data/services.ts — ids, names, groups, slugs)
        ↓
SERVICE_PAGE_COPY keyed by ServiceId  (src/data/servicePages.ts)
        ↓
getServicePageBySlug(slug)
        ↓
Vike route  /services/@slug/
        ↓
shared ServicePage template  (src/components/ServicePage.tsx)
```

- Exactly **10** approved service pages exist. Slugs come only from `SERVICE_CATALOG`.
- Public paths are `/services/{slug}/` (trailing slash). Invalid slugs are not prerendered and abort with the existing 404 page.
- Pages are prerendered from `SERVICE_CATALOG` via `+onBeforePrerenderStart.ts`.
- `public/sitemap.xml` contains the homepage plus those 10 service URLs (**11** loc entries). No `/services/digital-marketing/` or other sub-service URLs.
- Each service page emits **one Service** JSON-LD and **one FAQPage** JSON-LD (when FAQs render). **Organization** JSON-LD remains global (`src/pages/+Head.tsx`) with a stable `@id`; `Service.provider` references that `@id`. No ratings, reviews, offers, or OfferCatalog.
- Sub-services such as AI chatbots, workflow automation, n8n, WhatsApp automation, AI calling, local SEO, and technical SEO remain **sections** on the parent service page — not separate routes.

This specification is grounded in:

- The approved 10-service structure
- Copy and capabilities that currently exist in the repository
- The keyword ownership model below

---

## 0. Repository state (implementation)

### Routing

Vike prerenders `/`, `/services/{slug}/` for each catalog slug, and `404`. Route tree: `src/pages/services/@slug/`. `CaseStudyPage.tsx` still has no `+Page` route.

### Sitemap / robots / schema

- `public/sitemap.xml` — homepage + 10 service URLs
- `public/robots.txt` — `Allow: /` + sitemap URL
- `src/seo/schema.ts` — Organization (global), Service + FAQPage (service pages only)
- Canonical / OG: `HOME_SEO` on `/`; per-service SEO from `buildServicePageSeo` + `@slug` Head/title/description

### Service data (single catalog)

| Source | What it lists | Used on site? |
|---|---|---|
| `src/data/services.ts` `SERVICE_CATALOG` | 10 services (ids/names/groups/slugs) | Yes — cards, hrefs, prerender, page resolve |
| `src/data/services.ts` `services[]` | Catalog + homepage presentation copy | Yes — HomePage card stack |
| `leadCapture.ts` `CONTACT_SERVICE_CHIPS` | Catalog names + form-only Other | Yes — contact form |
| `footer.ts` `FOOTER_SERVICES` | Catalog names | Defined; footer nav is still section anchors only |

There is **no** top-level `/services/digital-marketing/` page.

### Copy that informed the pages (homepage / FAQ)

Safe to treat as on-site capability language (not as proof of results):

- Website: business websites, landing pages, ecommerce websites, portfolio websites; conversion-focused websites
- Apps: Android, iOS, web applications, admin dashboards
- AI-related (must become **sections of AI Automation**, not pages): chatbots, WhatsApp AI bots, lead generation bots, n8n, Zapier, CRM automation, AI voice assistants, appointment scheduling
- Graphic: social media creatives, brand identity, pitch decks, UI/UX design
- Video: short-form reels, long-form, brand advertisements, motion graphics
- Growth bullets currently under one Digital Marketing card: Meta ads, Google ads, SEO, social media marketing
- Influencer bullets (not a future top-level URL): outreach, campaign management, creator partnerships
- Sales/growth bullets (map to Lead Generation sections, not a separate URL): sales funnels, CRM systems, lead nurturing, outreach systems
- FAQ: industries (tech, education, healthcare, real estate, ecommerce, professional services); typical project 2–8 weeks; custom marketing (not a fixed package); can manage social accounts (strategy, content planning, creative, ongoing management)
- Entity: based in India, working globally; email `tech@vridhio.com`; phone `+91 93471 71519`; CTAs “Get Free Consultation”, “Book Consultation” (30-min), “Start a Project”
- Positioning: technology, automation & growth company; websites, apps, and marketing that convert

### Do not reuse as verified facts on service pages

Hero stats (150+ brands, 8× ROI, 98% satisfaction), system-section metrics (+140% engagement, &lt;0.4s load, 3.8× ad efficiency, 4.2× lead capture, 8.4× ROI), testimonial identities and metrics, unrouted LuxeFit / Luxe Home case study (120% sales, 5x ROAS), “best agency”, guaranteed rankings/ROI, pricing, Google/Meta partner badges, city offices, years-in-business beyond the hero “EST. 2026” line (unverified for SEO).

---

## A. Master keyword → URL ownership

| Primary keyword | Owner URL | Priority | Intent |
|---|---|---|---|
| website development company | `/services/website-development/` | P1 | Transactional / commercial |
| mobile app development company | `/services/app-development/` | P1 | Transactional / commercial |
| AI automation services | `/services/ai-automation/` | P2/P3 | Informational + commercial |
| graphic design services | `/services/graphic-design/` | P2 | Transactional / commercial investigation |
| video editing services | `/services/video-editing/` | P2 | Transactional / commercial |
| SEO services India | `/services/seo/` | P1 | Transactional |
| Google Ads agency India | `/services/google-ads/` | P1 | Transactional / commercial |
| Facebook Ads agency India | `/services/meta-ads/` | P2 | Transactional / commercial |
| social media marketing agency | `/services/social-media-marketing/` | P1 | Commercial investigation / transactional |
| lead generation services | `/services/lead-generation/` | P1 | Transactional / commercial |

**Do not create:** `/services/digital-marketing/`, `/services/ai-chatbots/`, `/services/local-seo/`, `/services/technical-seo/`, city pages, or vs/cost/what-is URLs in this phase.

---

## B. Cannibalization matrix (high-risk overlaps)

| Cluster | Keep on | Exclude from | Rule |
|---|---|---|---|
| website development company, web development services, custom website, business website design, responsive web design, ecommerce website development | Website Development | App Development, Graphic Design | Apps own mobile/iOS/Android; UI/UX is a Graphic Design subtopic, not the website primary |
| mobile app development company, Android/iOS/cross-platform app development | App Development | Website Development | Do not target generic “development company” on both |
| AI automation services, AI chatbot, workflow/n8n/Zapier, WhatsApp chatbot, CRM automation, AI voice assistants | AI Automation | Lead Generation | Lead gen owns pipeline/appointment-setting **as a service**; chatbots/CRM automation stay AI sections |
| graphic design services, branding, logo, marketing collateral | Graphic Design | SMM, Video | Social creatives may be mentioned; do not rank for SMM agency or video editing |
| video editing / production / reels | Video Editing | SMM, Graphic Design | SMM may mention content; video execution lives here |
| SEO services India, SEO agency, local SEO, technical SEO, SEO audit | SEO | Google Ads, SMM | “SEO vs Google Ads” FAQ on both, but **SEO vs Google Ads** primary explanation lives on SEO; Google Ads page links out |
| Google Ads, PPC, AdWords, search ads | Google Ads | Meta Ads, SEO | No Facebook/Instagram ads keywords here |
| Facebook Ads agency India, Instagram Ads management, paid social | Meta Ads | Google Ads, SMM | SMM owns organic/management; Meta owns paid social |
| social media marketing agency, social media management, community | SMM | Meta Ads, Graphic Design, Video | Paid social → Meta Ads; creatives → Graphic/Video |
| lead generation services, B2B lead gen, appointment setting, pipeline | Lead Generation | AI Automation, SEO | AI may qualify leads as a **use case**; the commercial “lead generation services” query is this page only |

Homepage `/` should not try to rank for any of the 10 primaries. It keeps the current brand query / websites-apps-marketing positioning.

---

## C. Internal linking architecture

```
Homepage /
  ├─ /#services  (cards → each catalog service URL)
  ├─ /#contact
  └─ /#faqs

/services/{slug}/
  ├─ Breadcrumb: Home → Services → Service name
  ├─ 2–4 related services (see each page spec)
  ├─ CTA → /#contact (homepage contact hash)
  └─ Optional later: articles that point UP to this service only

Do not add /services/ as a “digital marketing” ranking hub.
An optional future index may list the 10 services with no extra keyword targeting.

Future blog / cluster articles (not in this build):
  what-is / cost / vs  →  canonical parent service page only
  Never between sibling paid-media pages for the same primary cluster.
```

Sitemap already lists homepage + the 10 service URLs. Do not add sub-service or city URLs.

---

## D. Implementation priority

1. Website Development (P1)  
2. App Development (P1)  
3. SEO (P1)  
4. Google Ads (P1)  
5. Lead Generation (P1)  
6. Social Media Marketing (P1)  
7. Graphic Design (P2)  
8. Video Editing (P2)  
9. Meta Ads (P2)  
10. AI Automation (P2/P3)

**Shipped order:** Website Development → App Development → SEO → Google Ads → Lead Generation → Social Media Marketing → Graphic Design → Video Editing → Meta Ads → AI Automation. All ten use the same catalog → copy → `@slug` template.

---

## E. Unsupported claims — do not add without confirmation

- Guaranteed rankings, traffic, or ROI  
- “Best agency” / “#1” / “top rated”  
- 150+ brands, 8× / 8.4× ROI, 98% satisfaction, 3.8× ad efficiency, 4.2× lead capture, +140% engagement, &lt;0.4s load  
- Named testimonials and case-study metrics (Aura Luxury, Reddy Health, NexGen, Sattva, Strata, LuxeFit / Luxe Home, 120% sales, 5x ROAS)  
- Pricing, retainers, or “how much it costs” **answers** (questions OK in FAQ; answers need Venkat)  
- Google Partner, Meta Business Partner, or other certifications  
- City offices or “SEO in {city}” pages  
- Years of experience / “since 20xx” as a trust claim (hero shows EST. 2026 only)  
- Platform exclusivity (n8n/Zapier/WhatsApp as official partnerships)  
- Employee counts, awards, client logos as proof  

---

# Per-service specifications

Shared defaults unless a page says otherwise:

- **CTA intent:** Book a 30-minute consultation / start a project (existing homepage CTAs).  
- **Do not invent** pricing, timelines beyond the site-wide FAQ “2–8 weeks depending on scope”, or results.  
- **India in H1:** no (avoid stuffing).  
- **Schema:** Service + FAQPage on each service page (matching visible FAQs). Organization is global. Breadcrumb schema is not implemented.

---

## 1. Website Development

| Field | Spec |
|---|---|
| Name | Website Development |
| URL | `https://www.vridhio.com/services/website-development/` |
| Primary | website development company |
| Secondary | web development services; custom website development; business website design; responsive web design; ecommerce website development |
| Intent | Transactional / commercial |
| Funnel | BOFU |
| Priority | P1 |
| Title | Website Development Company \| Vridhio |
| Meta | Vridhio builds custom business websites, landing pages, and ecommerce sites designed to convert visitors into customers. |
| H1 | Website Development for Businesses That Need to Convert |
| Purpose | Capture buyers looking for a company to design and build a business website, not a generic app shop. |
| India | Body only (company is based in India). Not in title or H1. |

**H2 / H3 structure**

- What we build (H3: Business websites, Landing pages, Ecommerce, Portfolio — from current card points)
- Custom vs template / website builder (FAQ-level, not a separate URL)
- What a high-performing business website needs (performance, conversion paths — qualitative, no fake speed metrics)
- How we work
- FAQs
- Related services
- Start a project

**Reuse:** Homepage Website Development description and four points; hero “high-performing websites”; system section “High-Performance Engineering” language **without** `&lt;0.4s` metric.

**Do not invent:** cost of a website in India (question only); Next.js as a public guarantee unless confirmed; case-study conversion rates.

**AEO FAQs:** How much does a business website cost in India?; Website builder vs custom website; What features should a high-performing business website have?

**Internal links:** App Development, Graphic Design, SEO, Lead Generation, `/#contact`

**Cannibalization / excluded:** mobile app development company; Android/iOS app development; graphic design services (primary).

---

## 2. App Development

| Field | Spec |
|---|---|
| Name | App Development |
| URL | `/services/app-development/` |
| Primary | mobile app development company |
| Secondary | app development services; Android app development; iOS app development; custom mobile app development; cross-platform app development |
| Intent | Transactional / commercial |
| Funnel | BOFU |
| Priority | P1 |
| Title | Mobile App Development Company \| Vridhio |
| Meta | Android, iOS, web apps, and admin dashboards — built for performance and business growth. |
| H1 | Mobile App Development for Android, iOS, and Web |
| Purpose | Win commercial queries for a mobile/app development company, distinct from websites. |
| India | Body only. |

**H2 / H3:** What we build (Android, iOS, web applications, admin dashboards); Android vs iOS vs cross-platform (section, not a URL); What to look for in an app partner; How we work; FAQs; Related; CTA.

**Reuse:** App Development card copy and points.

**Do not invent:** delivery timelines beyond site FAQ; “enterprise-ready in weeks” from testimonials.

**AEO FAQs:** How long does it take to develop a mobile app?; What should I look for when hiring an app development company?; Android vs iOS vs cross-platform development?

**Links:** Website Development, AI Automation, Lead Generation.

**Excluded:** website development company; web development services (primary cluster).

---

## 3. AI Automation

| Field | Spec |
|---|---|
| Name | AI Automation |
| URL | `/services/ai-automation/` |
| Primary | AI automation services |
| Secondary | AI chatbot development; workflow automation; WhatsApp chatbot; CRM automation; AI voice assistants |
| Intent | Informational + commercial |
| Funnel | MOFU / BOFU |
| Priority | P2/P3 |
| Title | AI Automation Services \| Vridhio |
| Meta | AI chatbots, workflow automation, CRM automation, WhatsApp bots, and AI voice assistants — as one automation service, not separate products. |
| H1 | AI Automation for Support, Operations, and Outreach |
| Purpose | Own “AI automation services” and house chatbot / n8n / WhatsApp / CRM / calling as **use cases**, never as sibling URLs. |
| India | Body only. |

**H2 / H3 (mandatory sections, not pages):** AI chatbots & WhatsApp; Workflow automation (n8n, Zapier, process optimization); CRM automation; AI voice assistants & calling / appointment scheduling; Chatbot vs CRM automation; Is workflow automation the same as AI automation?; FAQs; Related; CTA.

**Reuse:** Current three homepage cards (Chatbots, Workflow Automations, AI Calling Systems) as section copy/points only.

**Do not invent:** tool partnerships; replacement of an entire sales team; lead-generation **agency** positioning (that URL is Lead Generation).

**AEO FAQs:** What can AI automation do for businesses?; Chatbot vs CRM automation; Is workflow automation the same as AI automation?

**Links:** Lead Generation (qualified pipeline), App Development, Website Development.

**Excluded:** lead generation services; appointment setting services (as primaries); any `/services/ai-chatbots` style slug.

---

## 4. Graphic Design

| Field | Spec |
|---|---|
| Name | Graphic Design |
| URL | `/services/graphic-design/` |
| Primary | graphic design services |
| Secondary | creative design agency; branding design; logo design services; marketing collateral design |
| Intent | Transactional / commercial investigation |
| Funnel | MOFU / BOFU |
| Priority | P2 |
| Title | Graphic Design Services \| Vridhio |
| Meta | Brand identity, social creatives, pitch decks, and UI/UX design for businesses that need a clear visual system. |
| H1 | Graphic Design for Brand Identity and Campaigns |
| Purpose | Commercial design/branding queries. Logo is a **secondary** topic, not a separate page. |
| India | Body only. |

**H2 / H3:** Brand identity & logo; Marketing collateral & social creatives; Pitch decks; UI/UX (supporting product/web, not a second website URL); How we work; FAQs; Related; CTA.

**Reuse:** Graphic Designing card (rename in catalog to Graphic Design); Why-section design language without fake +140% engagement.

**Do not invent:** award-winning, famous logos, or “creative design agency” as a second brand name.

**AEO FAQs:** What is included in graphic design services?; Branding vs logo design; Do you design UI/UX as well as campaign creatives?

**Links:** Website Development, Video Editing, Social Media Marketing (creatives ≠ management).

**Excluded:** social media marketing agency; video editing services; website development company.

---

## 5. Video Editing

| Field | Spec |
|---|---|
| Name | Video Editing |
| URL | `/services/video-editing/` |
| Primary | video editing services |
| Secondary | business video editing; social media video editing; corporate video editing; video production services |
| Intent | Transactional / commercial |
| Funnel | BOFU |
| Priority | P2 |
| Title | Video Editing Services \| Vridhio |
| Meta | Short-form reels, long-form videos, brand ads, and motion graphics for businesses and campaigns. |
| H1 | Video Editing for Brands, Ads, and Social |
| Purpose | Production/editing commercial queries. Do not rank as an SMM agency. |
| India | Body only. |

**H2 / H3:** Short-form / reels; Long-form & corporate; Brand advertisements; Motion graphics; FAQs; Related; CTA.

**Reuse:** Video Editing card points.

**Do not invent:** in-house studio, celebrity editors, or production-house scale.

**AEO FAQs:** What kinds of videos do you edit?; Video editing vs video production; Can you edit content for ads and organic social?

**Links:** Graphic Design, Meta Ads, Social Media Marketing.

**Excluded:** social media marketing agency; Facebook Ads agency India (primary).

---

## 6. SEO

| Field | Spec |
|---|---|
| Name | SEO |
| URL | `/services/seo/` |
| Primary | SEO services India |
| Secondary | SEO agency; SEO company India; local SEO services; technical SEO services; SEO audit services |
| Intent | Transactional |
| Funnel | BOFU |
| Priority | P1 |
| Title | SEO Services India \| Vridhio |
| Meta | SEO for businesses that need search visibility — including technical SEO, local SEO, and audits as part of one service. |
| H1 | SEO Services for Sustainable Search Demand |
| Purpose | Own India-intent SEO commercial queries. Local and technical SEO are **H2s**, not URLs. |
| India | **Title yes** (primary keyword). **H1 no.** Body yes (India-based; local SEO section). |

**H2 / H3:** What our SEO work covers; Technical SEO; Local SEO; SEO audits; SEO vs Google Ads (explain difference, link to Google Ads); How long SEO takes (no fake month guarantees); FAQs; Related; CTA.

**Reuse:** Digital Marketing card bullet “SEO”; Content Marketing bullets organic growth / content strategy as **supporting** mentions only (Content Marketing is not a URL). Site-wide custom marketing FAQ.

**Do not invent:** ranking guarantees; “SEO company India” awards; city landing pages.

**AEO FAQs:** SEO vs Google Ads; How long does SEO take?; What is local SEO?

**Links:** Google Ads, Website Development, Lead Generation.

**Excluded:** Google Ads agency India; PPC; social media marketing agency; SEO vs Ads as a **standalone article URL** in this phase (FAQ only).

---

## 7. Google Ads

| Field | Spec |
|---|---|
| Name | Google Ads |
| URL | `/services/google-ads/` |
| Primary | Google Ads agency India |
| Secondary | PPC management services; AdWords agency; Google advertising services; search ads agency |
| Intent | Transactional / commercial |
| Funnel | BOFU |
| Priority | P1 |
| Title | Google Ads Agency India \| Vridhio |
| Meta | Search and Google advertising management focused on high-intent demand — not Facebook or Instagram ads. |
| H1 | Google Ads Management for High-Intent Search |
| Purpose | Paid search / PPC on Google. Strictly not Meta. |
| India | **Title yes.** **H1 no.** Body yes. |

**H2 / H3:** Search ads & PPC; What to look for in a Google Ads agency; How we work with SEO (complement, not duplicate); FAQs; Related; CTA.

**Reuse:** Digital Marketing bullet “Google ads”; FAQ custom marketing; system “Precision Growth Marketing” **without** 3.8× metric.

**Do not invent:** management fee %, Google Partner badge, ROAS from LuxeFit case.

**AEO FAQs:** How much does Google Ads management cost?; What should I look for in a Google Ads agency?

**Links:** SEO, Lead Generation, Meta Ads (sibling paid media, different network).

**Excluded:** Facebook Ads agency India; Instagram Ads management; SEO services India (primary).

---

## 8. Meta Ads

| Field | Spec |
|---|---|
| Name | Meta Ads |
| URL | `/services/meta-ads/` |
| Primary | Facebook Ads agency India |
| Secondary | Instagram Ads management; Facebook advertising agency; paid social advertising |
| Intent | Transactional / commercial |
| Funnel | BOFU |
| Priority | P2 |
| Title | Facebook Ads Agency India \| Vridhio |
| Meta | Facebook and Instagram ads management — paid social, not Google Search ads and not organic social retainers. |
| H1 | Meta Ads for Facebook and Instagram |
| Purpose | Paid social on Meta. Keep Google Ads keywords off this page. |
| India | **Title yes** (matches primary). **H1 no** (H1 uses Meta/Facebook+Instagram). Body yes. |

**H2 / H3:** What are Meta Ads?; Facebook Ads vs Instagram Ads; Paid social vs organic SMM (link); FAQs; Related; CTA.

**Reuse:** Digital Marketing bullet “Meta ads”; unrouted case study mentions Facebook & Instagram ads **only as capability language**, not as LuxeFit results.

**Do not invent:** Meta Partner, 5x ROAS, named clients.

**AEO FAQs:** What are Meta Ads?; Facebook Ads vs Instagram Ads?

**Links:** Social Media Marketing, Graphic Design, Video Editing, Google Ads.

**Excluded:** Google Ads agency India; PPC; social media marketing agency (primary); community building as a ranking phrase.

---

## 9. Social Media Marketing

| Field | Spec |
|---|---|
| Name | Social Media Marketing |
| URL | `/services/social-media-marketing/` |
| Primary | social media marketing agency |
| Secondary | social media management services; Instagram marketing agency; social media marketing services India; community building |
| Intent | Commercial investigation / transactional |
| Funnel | MOFU / BOFU |
| Priority | P1 |
| Title | Social Media Marketing Agency \| Vridhio |
| Meta | Strategy, content planning, creative direction, and ongoing social management — distinct from Meta Ads buying. |
| H1 | Social Media Marketing and Management |
| Purpose | Organic/management/community. Paid social execution links to Meta Ads. |
| India | Secondary includes “services India” — **body and optional meta**, not H1. Title stays on primary (no India stuffing). |

**H2 / H3:** Strategy & management; Instagram (organic, not ads buying); Community; How social supports growth; Working with a social agency; Creative vs management (link Graphic/Video); FAQs; Related; CTA.

**Reuse:** Homepage FAQ “Can you manage our social media accounts?”; Digital Marketing bullet; influencer bullets as **optional tactics**, not a `/services/influencer-marketing` URL.

**Do not invent:** follower guarantees; “Instagram marketing agency” as a second H1.

**AEO FAQs:** How can social media help grow a business?; What should I ask a social media marketing agency?

**Links:** Meta Ads, Graphic Design, Video Editing, Lead Generation.

**Excluded:** Facebook Ads agency India; Instagram Ads management (paid); graphic design services (primary).

---

## 10. Lead Generation

| Field | Spec |
|---|---|
| Name | Lead Generation |
| URL | `/services/lead-generation/` |
| Primary | lead generation services |
| Secondary | B2B lead generation; appointment setting services; pipeline generation; business lead generation |
| Intent | Transactional / commercial |
| Funnel | BOFU |
| Priority | P1 |
| Title | Lead Generation Services \| Vridhio |
| Meta | Funnels, qualification, CRM follow-up, and outreach systems that turn demand into pipeline — not a generic AI chatbot page. |
| H1 | Lead Generation for Qualified Pipeline |
| Purpose | Commercial lead-gen / B2B pipeline / appointment setting. AI tools may appear as **enablers**, with a link to AI Automation. |
| India | Body only. |

**H2 / H3:** What B2B lead generation means here; Funnels & offers; Qualification & CRM; Appointment setting / outreach; Agency vs in-house; Why lead quality matters; FAQs; Related; CTA.

**Reuse:** Sales & Growth Systems card; system section “Automated Lead & Demand Engine” **without** 4.2× metric; AI “lead generation bots” mentioned only as a use case with link to AI Automation.

**Do not invent:** exclusive databases, guaranteed meeting volume, or replacing in-house sales.

**AEO FAQs:** What is B2B lead generation?; Lead generation agency vs in-house sales; Why does lead quality matter?

**Links:** AI Automation, Google Ads, SEO, Website Development (conversion).

**Excluded:** AI automation services (primary); AI chatbot development as this page’s primary; SEO services India.

---

## Shared on-page modules

1. Breadcrumb: Home / Services / {Service}  
2. Short intro (commercial answer first)  
3. Capabilities from catalog + approved bullets only  
4. FAQ accordion (service-specific)  
5. Related services  
6. CTA matching homepage: consultation / start a project  
7. Service JSON-LD + FAQPage JSON-LD (visible FAQs only)

---

## Remaining gaps (not blockers for the current 10 pages)

1. Cost/timeline FAQ **answers** stay qualitative until exact figures are approved.  
2. Do not add OfferCatalog, ratings, or city landing pages.  
3. Do not add `/services/digital-marketing/` or other retired/sub-service URLs.
