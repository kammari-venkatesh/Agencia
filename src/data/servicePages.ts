import {
  SERVICE_CATALOG,
  getServiceById,
  serviceHref,
  type ServiceId,
} from './services'
import { buildServicePageSeo, type PageSeo } from '../seo/site'

export type ServiceFaq = {
  question: string
  answer: string
}

export type ServiceCapabilityBlock = {
  heading: string
  body?: string
  items?: string[]
}

export type ServicePageCopy = {
  seoTitle: string
  seoDescription: string
  h1: string
  intro: string
  overviewHeading: string
  overview: string
  capabilitiesHeading: string
  capabilities: ServiceCapabilityBlock[]
  processHeading: string
  process: string
  whoForHeading: string
  whoFor: string
  /** Optional extra H2 sections (comparison / decision blocks). */
  additionalSections?: {
    heading: string
    body: string
    seeAlsoId?: ServiceId
  }[]
  whyHeading: string
  why: string
  faqs: ServiceFaq[]
  relatedIds: ServiceId[]
}

const INDUSTRIES =
  'We work with ambitious businesses across technology, education, healthcare, real estate, e-commerce, and professional services. The approach changes based on the business, not an industry label.'

const SERVICE_PAGE_COPY: Record<ServiceId, ServicePageCopy> = {
  'website-development': {
    seoTitle: 'Website Development Company | Vridhio',
    seoDescription:
      'Website development company for custom business websites, landing pages, and ecommerce — built for usability, performance, and conversion.',
    h1: 'Website Development for Businesses That Need to Convert',
    intro:
      'Vridhio is a website development company for businesses that need more than a template. Our web development services cover custom website development for business and corporate sites, landing pages, ecommerce stores, and portfolios — designed around usability, performance, and conversion, not appearance alone.',
    overviewHeading: 'What website development means here',
    overview:
      'Business website development means a site that explains the offer, works on every device, and gives visitors a clear next step. Corporate website design and startup website development share that same job: credibility, clarity, and conversion paths that match how the business sells.\n\nThis page is for teams hiring web design services and engineering together as one website engagement — not a mobile app studio. App products live on App Development.',
    capabilitiesHeading: 'What we build',
    capabilities: [
      {
        heading: 'Business website development',
        body: 'Custom business websites with clear structure, service or product pages, and conversion paths — including corporate and startup sites when that is the need.',
      },
      {
        heading: 'Landing pages',
        body: 'Campaign and offer pages built to capture demand without extra navigation noise.',
      },
      {
        heading: 'Ecommerce website development',
        body: 'Storefronts focused on product clarity and checkout flow, not generic brochure layouts. We do not name a specific ecommerce platform unless scoped in a project.',
      },
      {
        heading: 'Responsive web development',
        body: 'Responsive web design so layouts, typography, and actions work cleanly on phones, tablets, and desktops.',
      },
      {
        heading: 'Performance-focused development',
        body: 'High-performing websites through efficient implementation and lean front-end structure. We do not invent Lighthouse scores or Core Web Vitals guarantees here.',
      },
      {
        heading: 'Conversion-focused structure',
        body: 'Clear offers, CTAs, contact and consultation flows, and page hierarchy that support enquiries or purchases — not decoration for its own sake.',
      },
    ],
    processHeading: 'How we work',
    process:
      'Start with a conversation. We clarify goals, pages, and conversion paths — then scope structure, design direction, and build. Simple projects can fit shorter timelines; larger or custom projects take longer depending on scope. On this site, typical multi-service projects are described as roughly 2–8 weeks; that is not a promise for every website.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    additionalSections: [
      {
        heading: 'When website development is a good fit',
        body: 'A good fit includes launching a new website, replacing an outdated site, establishing a startup web presence, building campaign landing pages, redesigning for conversion, or fixing a site that no longer supports business goals.',
      },
      {
        heading: 'Custom website development vs website builders',
        body: 'A website builder can be enough for a simple presence with limited customization. Custom website development makes more sense when you need specific conversion paths, deeper customization, performance control, integrations that match how you sell, or room to scale. Custom is not automatically better for every business — scope decides.',
      },
      {
        heading: 'Website development and SEO',
        body: 'Website development is the technical and structural foundation: pages, performance, and usable structure. SEO is search visibility and organic demand. They work together, but they are different services. Organic search work lives on',
        seeAlsoId: 'seo',
      },
      {
        heading: 'Website development and lead generation',
        body: 'A website can support lead capture with clear CTAs, contact forms, consultation flows, and conversion paths. Full pipeline systems — qualification, CRM follow-up, outreach — live on',
        seeAlsoId: 'lead-generation',
      },
      {
        heading: 'What to look for in a website development company',
        body: 'Look for business understanding, clear scope, responsive implementation, performance care, maintainable build choices, conversion structure, clear communication, realistic timelines, and honest post-launch considerations — not guarantees or vanity awards. Brand systems and still creatives that support the site often sit with',
        seeAlsoId: 'graphic-design',
      },
    ],
    whyHeading: 'What a high-performing business website needs',
    why: 'A high-performing business website should load cleanly, explain the offer, and give a visitor a next step. Structure, responsive experience, and conversion paths matter more than decoration. Mobile products and admin tools are a different engagement — that work lives on App Development.',
    faqs: [
      {
        question: 'How much does website development cost in India?',
        answer:
          'We do not publish fixed packages on this site. Cost depends on pages, functionality, integrations, ecommerce needs, and design or content requirements. A consultation is where a scope-based estimate belongs.',
      },
      {
        question: 'How long does it take to build a business website?',
        answer:
          'Timeline depends on scope. Simple sites can finish faster; larger custom builds take longer. On this site, typical projects involving one or more services are described as roughly 2–8 weeks — we define the timeline before development begins, and some projects sit outside that range.',
      },
      {
        question: 'What is the difference between custom website development and a website builder?',
        answer:
          'A website builder suits simpler presence with limited customization. Custom website development fits when you need specific conversion paths, performance control, integrations, ecommerce depth, or a site that must grow with the business.',
      },
      {
        question: 'What should a high-performing business website include?',
        answer:
          'A clear offer, responsive layout, efficient pages, and an obvious next step — contact, book a call, or buy. Structure and conversion paths should support those outcomes; extra features should not distract from them.',
      },
    ],
    relatedIds: ['app-development', 'graphic-design', 'seo', 'lead-generation'],
  },
  'app-development': {
    seoTitle: 'Mobile App Development Company | Vridhio',
    seoDescription:
      'Mobile app development company for Android, iOS, web apps, and admin dashboards — custom products, not marketing websites.',
    h1: 'Mobile App Development for Android, iOS, and Web',
    intro:
      'Vridhio is a mobile app development company for teams that need a custom product — Android apps, iOS apps, web applications, or admin dashboards. App development services cover product requirements and the experience people use. This is not a marketing website and not an AI automation retainer.',
    overviewHeading: 'What mobile app development means here',
    overview:
      'Mobile app development turns a product idea into an application with its own screens, workflows, and users. Custom mobile app development is the path when a template or no-code builder cannot match how the business operates. We build for Android, iOS, and the web when the product needs those surfaces. Startup app development sits here when the company is launching an application rather than a brochure site.',
    capabilitiesHeading: 'What we build',
    capabilities: [
      {
        heading: 'Android app development',
        body: 'Android app development for products whose audience is on Android, scoped around the product workflow — not a generic store listing.',
      },
      {
        heading: 'iOS app development',
        body: 'iOS app development when Apple users are a core audience. Platform choice follows users and product requirements.',
      },
      {
        heading: 'Cross-platform app development',
        body: 'Cross-platform app development when one product should reach more than one platform without treating each as an unrelated project. It is not automatically better than a single-platform build.',
      },
      {
        heading: 'Custom mobile applications',
        body: 'Custom mobile applications when the product needs business-specific workflows, screens, and behavior. Customization, integrations, and scale are reasons to go custom — not proof that custom always wins.',
      },
      {
        heading: 'Business and product applications',
        body: 'Business and product applications are tools customers or teams use as the product itself, including startup products that need a dedicated app rather than a brochure.',
      },
      {
        heading: 'Web applications',
        body: 'Web applications when the product should run in the browser with app-like workflows — a product surface, not a marketing website.',
      },
      {
        heading: 'Admin dashboards',
        body: 'Admin dashboards so operations can run the product — users, content, or whatever the application needs to manage.',
      },
    ],
    processHeading: 'How we work',
    process:
      'We start with requirements: users, what the product must do, and which platforms matter. Then we define scope — screens, workflows, integrations, backend needs, and admin surfaces — plan the experience, and move through development, testing, and launch.\n\nSimple projects can fit shorter timelines; larger custom products take longer. Typical work involving one or more services is described on this site as roughly 2–8 weeks — not a promise that every app ships in that window. We set the timeline before development begins. Maintenance and updates after launch are scoped when needed, not assumed in every engagement.',
    whoForHeading: 'When app development is a good fit',
    whoFor:
      'App development is a good fit when a business is launching a digital product, a startup is building an application, or a company needs app-specific workflows a marketing website cannot cover. It also fits when a dedicated mobile experience is required — not an extra page on a brochure site. It is a weaker fit when the real need is a public website, paid advertising, or standalone chatbots and workflows.',
    additionalSections: [
      {
        heading: 'Custom app development vs app builders',
        body: 'No-code and app builders can be sufficient for simple tools, limited customization, and a small set of screens. Custom development makes sense for business-specific workflows, deeper customization, integrations, or a product that must scale. Custom is not always better; a builder can be the right choice for a lightweight need.',
      },
      {
        heading: 'Android vs iOS vs cross-platform',
        body: 'Android, iOS, and cross-platform development are options inside the same service. The right approach depends on target users, business goals, platform requirements, product scope, budget and resources, and required functionality. No platform universally performs better.',
      },
      {
        heading: 'Website vs mobile app',
        body: 'A website is browser-based access and broad reach. A mobile app is an installed product experience with app-specific workflows. Many companies need both; they are still different engagements. Marketing websites live on',
        seeAlsoId: 'website-development',
      },
      {
        heading: 'App development and AI automation',
        body: 'An application can later connect to chatbots or operational workflows. Chatbots, WhatsApp automation, and workflow systems are a different service. That work lives on',
        seeAlsoId: 'ai-automation',
      },
      {
        heading: 'App products and lead generation',
        body: 'A product can include sign-up or in-app conversion. Full pipeline systems — qualification, CRM follow-up, outreach — live on',
        seeAlsoId: 'lead-generation',
      },
    ],
    whyHeading: 'What to look for in an app development company',
    why: 'Look for a partner that defines users, workflows, platforms, and admin needs before promising screens. You should see a clear scope, an honest platform recommendation, a realistic timeline, and a process that includes testing and launch. Stack names and awards are not a substitute for product understanding.',
    faqs: [
      {
        question: 'How long does it take to develop a mobile app?',
        answer:
          'Timeline depends on platform scope, functionality, and how custom the product is. Simple projects can finish faster; larger custom apps take longer. Typical projects involving one or more services are described on this site as roughly 2–8 weeks — we define the timeline before development begins, and some products sit outside that range.',
      },
      {
        question: 'What should I look for when hiring an app development company?',
        answer:
          'Look for a company that asks about users, workflows, platforms, and admin needs — not only screens. You should leave the first conversation with a clearer scope, a platform recommendation you can evaluate, and an honest view of custom work versus a builder.',
      },
      {
        question: 'Android vs iOS vs cross-platform app development: which should I choose?',
        answer:
          'Choose based on target users, product scope, platform requirements, and the functionality you actually need. Android, iOS, and cross-platform approaches can all be valid; none is universally better. The right mix follows the audience and the product, not a default stack.',
      },
      {
        question: 'How much does mobile app development cost?',
        answer:
          'We do not publish fixed mobile app prices on this site. Cost depends on platform scope, functionality, number of screens, integrations, backend requirements, design requirements, and complexity. A consultation is where a scope-based estimate belongs.',
      },
    ],
    relatedIds: ['website-development', 'ai-automation', 'lead-generation'],
  },
  'ai-automation': {
    seoTitle: 'AI Automation Services | Vridhio',
    seoDescription:
      'AI automation services for chatbots, WhatsApp, workflow automation, CRM automation, and AI voice assistants — one service, not separate products.',
    h1: 'AI Automation for Support, Operations, and Outreach',
    intro:
      'AI automation services at Vridhio combine AI capabilities with automated workflows to reduce repetitive manual work and support business processes. AI chatbot development, WhatsApp chatbot work, workflow automation, CRM automation, and AI voice assistants sit here as use cases of one service — not separate URLs. AI-powered automation is built to support teams, not to replace employees.',
    overviewHeading: 'What AI automation means here',
    overview:
      'AI automation combines AI capabilities with automated workflows so repetitive tasks can run with less manual copying, routing, and follow-up. Traditional automation follows predefined rules. AI-powered automation can interpret or generate information as part of a workflow when that helps. Not every workflow needs AI.\n\nThis page is the technology and process layer: support, operations, and outreach automation. It is not website development, not app development, not social media marketing, and not a lead-generation retainer. Those remain separate catalog services.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      {
        heading: 'AI chatbots',
        body: 'AI chatbot development for customer support, FAQs, conversational assistance, and qualification where those steps belong in the conversation. A chatbot is one application of AI automation — not the whole system.',
      },
      {
        heading: 'WhatsApp automation',
        body: 'WhatsApp chatbot service and WhatsApp AI bots for business communication and automated interactions when WhatsApp is the channel the customer already uses. We do not claim a WhatsApp partnership.',
      },
      {
        heading: 'Workflow automation',
        body: 'Workflow automation connects steps between tools so hand-offs are not copied by hand. n8n workflow automation is in scope as a workflow approach already listed on this site. Rule-based routing is enough for many processes; AI is added only when a step needs interpretation.',
      },
      {
        heading: 'CRM automation',
        body: 'CRM automation for relevant CRM-related workflows: routing conversations, updating records, and triggering follow-up so enquiries do not sit in a spreadsheet. We do not name a specific CRM product unless it is scoped in a project.',
      },
      {
        heading: 'AI voice assistants',
        body: 'AI voice assistants for voice-based automated assistance — support or outreach calling when voice is the right channel. Voice is one interface, not a claim that automation replaces a sales team.',
      },
      {
        heading: 'Appointment scheduling',
        body: 'Automated appointment scheduling where booking is a repeatable workflow step: capturing details, confirming a time, and handing off to a calendar. Sales appointment setting as a pipeline service is a different engagement.',
      },
    ],
    processHeading: 'How we work',
    process:
      'Start with a conversation. We clarify the actual problem, which steps repeat, what data the workflow needs, and where a person should take over — then scope chatbots, WhatsApp, n8n workflows, CRM automation, voice assistants, or scheduling only where they fit. Build and maintenance expectations are set before work starts.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    additionalSections: [
      {
        heading: 'When AI automation is a good fit',
        body: 'A good fit includes repetitive customer interactions, repetitive operational workflows, support automation, appointment scheduling as a process step, CRM follow-up that currently depends on manual copy-paste, and repetitive qualification inside a conversation. If every case needs fresh judgment, automation may not be the first step.',
      },
      {
        heading: 'AI automation vs traditional automation',
        body: 'Traditional automation follows predefined rules: if this happens, do that. AI automation can interpret or generate information inside a workflow — for example reading a message and choosing a next step. That does not mean every workflow should use AI. Simple, stable processes often work better with rules alone.',
      },
      {
        heading: 'AI automation vs chatbots',
        body: 'A chatbot is one application. AI automation is the broader system and process layer. AI chatbot development can be one component of a workflow that also updates a CRM, notifies a team member, or books a time. Buying only a chatbot is not the same as designing the surrounding automation.',
      },
      {
        heading: 'AI automation vs lead generation',
        body: 'AI automation can support lead capture, qualification, or follow-up as a workflow. Lead Generation is the broader sales and pipeline service: funnels, qualification criteria, outreach, and appointment setting as customer acquisition. This page stays on technology and process automation. Pipeline work lives on',
        seeAlsoId: 'lead-generation',
      },
      {
        heading: 'What to evaluate before implementing AI automation',
        body: 'Evaluate the actual problem, how often the process repeats, what data or inputs the workflow needs, where a human handoff must happen, whether existing systems can connect, who will maintain it, how reliable the process must be, and privacy or security constraints that apply to customer data. We do not offer legal or security guarantees on this page.',
      },
    ],
    whyHeading: 'What AI automation services cost',
    why: 'We do not publish fixed packages. Cost depends on workflow complexity, number of processes, integrations, whether the workflow needs AI or only rules, customization, and ongoing maintenance. A consultation is where a scope-based estimate belongs.',
    faqs: [
      {
        question: 'What can AI automation do for a small business?',
        answer:
          'It can automate repetitive support, routing, scheduling, and follow-up — chatbots, WhatsApp bots, workflow automation, CRM updates, and voice assistants where they fit. It supports the team; it does not replace employees.',
      },
      {
        question: 'What is the difference between a chatbot and AI automation?',
        answer:
          'A chatbot is one application. AI automation is the broader system and process layer. A chatbot can be one component of an automation workflow that also updates records or books a time.',
      },
      {
        question: 'Is workflow automation the same as AI automation?',
        answer:
          'No. Workflow automation is one part of AI automation. AI automation can also include chatbots, WhatsApp bots, CRM automation, and AI voice assistants. n8n workflow automation is one workflow approach already in scope here; not every workflow needs AI.',
      },
      {
        question: 'How much do AI automation services cost?',
        answer:
          'There is no fixed public price. Cost depends on workflow complexity, number of processes, integrations, AI requirements, customization, and maintenance. A consultation is where a scope-based estimate belongs.',
      },
    ],
    relatedIds: ['lead-generation', 'app-development', 'website-development'],
  },
  'graphic-design': {
    seoTitle: 'Graphic Design Services | Vridhio',
    seoDescription:
      'Graphic design services for brand identity, social creatives, pitch decks, and UI/UX — visual systems, not social management or video editing.',
    h1: 'Graphic Design for Brand Identity and Campaigns',
    intro:
      'Graphic design services at Vridhio are the visual work a business hires: brand identity, logo and visual identity as part of that system, social and campaign creatives, marketing collateral, pitch decks, and UI/UX design. This is design execution — not social media management, not video editing, and not website engineering.',
    overviewHeading: 'What graphic design services include',
    overview:
      'Graphic design produces the still assets a business uses to look consistent and explain the offer. A graphic design company is hired for identity, campaign graphics, collateral, and interface design that match how the business actually communicates.\n\nLogo design services sit inside visual identity — not as a separate URL. Branding design here means the marks, type, color, and layout rules that keep assets coherent. We are based in India and work with businesses globally; this is not a city design page.',
    capabilitiesHeading: 'What we design',
    capabilities: [
      {
        heading: 'Brand identity',
        body: 'Identity systems so type, color, and layout stay consistent across the site, ads, and decks — not a one-off mood board with no rules.',
      },
      {
        heading: 'Logo and visual identity',
        body: 'Logo design as part of visual identity: the mark plus how it is used. A logo file without usage rules is not a brand system.',
      },
      {
        heading: 'Social and campaign creatives',
        body: 'Social media graphics and campaign visuals that match the identity and the channel. Design of the asset is this page; posting the account is not.',
      },
      {
        heading: 'Marketing collateral',
        body: 'Marketing collateral design for sales and campaign use — one-pagers, leave-behinds, and related stills that follow the same visual system.',
      },
      {
        heading: 'Pitch decks',
        body: 'Pitch decks that explain the offer without visual noise, so the story and the next step stay readable.',
      },
      {
        heading: 'UI/UX design',
        body: 'UI/UX design as interface and interaction support for websites and products. It is a section of this service, not a substitute for website development or a separate UI/UX URL.',
      },
    ],
    processHeading: 'How we work',
    process:
      'Start with a conversation. We clarify the brand context, the channels, and which assets are actually needed — then scope identity work, campaign creatives, collateral, decks, or UI/UX only where they fit. Revision rhythm is set in that scope; we do not publish a fixed revision SLA on this page.',
    whoForHeading: 'When graphic design is a good fit',
    whoFor:
      'A good fit includes new businesses establishing a visual identity, teams that need consistent campaign assets, social teams that need repeatable creative, sales teams that need pitch decks, or businesses whose visual communication is inconsistent. These are situations, not named client results.',
    additionalSections: [
      {
        heading: 'Graphic design vs branding',
        body: 'Graphic design is execution: the assets. Branding is the broader identity and how it is meant to work across touchpoints. Logo design is one part of branding, not the whole of it. You can hire design without a full rebrand; a rebrand still needs design to become usable assets.',
      },
      {
        heading: 'Graphic design vs Social Media Marketing',
        body: 'Graphic Design creates visual assets. Social Media Marketing handles strategy, content planning, publishing, and community management. Many businesses need both. Organic social management lives on',
        seeAlsoId: 'social-media-marketing',
      },
      {
        heading: 'Graphic design vs Video Editing',
        body: 'Graphic Design is static visual communication. Video Editing is post-production, motion, and finished video. Still systems and campaign graphics sit here; cuts, captions, and reels sit on',
        seeAlsoId: 'video-editing',
      },
    ],
    whyHeading: 'What to look for in a graphic design service',
    why: 'Look for someone who understands brand context, keeps assets consistent, can produce systems or templates where they help, and can adapt work to the intended channel. Ask how scope and revisions are set before production starts. Do not treat awards or a stacked logo sheet as a substitute for that process. Website engineering that uses the identity still lives on Website Development.',
    faqs: [
      {
        question: 'What does a graphic design service include?',
        answer:
          'A graphic design service typically includes brand identity, logo and visual identity, social and campaign creatives, marketing collateral, pitch decks, and UI/UX design where those assets are needed. Scope follows what the business actually has to ship — not every item for every client.',
      },
      {
        question: 'What is the difference between branding and graphic design?',
        answer:
          'Graphic design is the execution of visual assets. Branding is the broader identity — how the business should look and feel across touchpoints. Logo design is part of branding; it is not the whole brand, and branding is not a separate URL on this site.',
      },
      {
        question: 'How much does graphic design cost?',
        answer:
          'The cost depends on asset types, volume, whether identity work is included, how much existing brand context you have, and revision needs. We do not publish fixed packages or rates on this site. A consultation is where a scope-based estimate belongs.',
      },
      {
        question: 'Why does professional graphic design matter for a business?',
        answer:
          'Professional graphic design matters because inconsistent visuals make the offer harder to trust and harder to reuse across campaigns. A coherent identity, collateral, and channel-ready creatives help the business look like one company — they do not replace strategy, ads, or a working website.',
      },
    ],
    relatedIds: ['website-development', 'video-editing', 'social-media-marketing'],
  },
  'video-editing': {
    seoTitle: 'Video Editing Services | Vridhio',
    seoDescription:
      'Video editing services for business videos, social content, brand ads, and motion graphics — short-form reels and long-form cuts for campaigns.',
    h1: 'Video Editing for Brands, Ads, and Social',
    intro:
      'Vridhio offers video editing services for businesses that need polished short-form reels, long-form and corporate video, brand advertisements, and motion graphics. We edit existing footage and assets into finished social content and campaign videos — post-production work, not a social media marketing retainer.',
    overviewHeading: 'What we help with',
    overview:
      'Business video editing shapes raw clips, sound, text, and graphics into a clear story for a specific audience. Teams hire professional editing when they have footage and need consistent cuts for social platforms, brand ads, or longer explainers.\n\nSocial media video editing focuses on pacing, captions, and platform formats. Corporate video editing services cover longer business pieces — product explainers, internal updates, or company narratives. Ad cuts follow a campaign objective; organic social video supports feed engagement and brand presence.\n\nWe stay in editing and post-production. Organic social strategy lives on Social Media Marketing. Paid social buying lives on Meta Ads. Brand systems and still creatives live on Graphic Design.',
    capabilitiesHeading: 'What we edit',
    capabilities: [
      {
        heading: 'Short-form video and reels',
        body: 'Social media video editing for short-form formats: reels and vertical clips with pacing, text treatment, and hooks suited to scroll behavior. Scope is the edit — not posting the account.',
      },
      {
        heading: 'Long-form and corporate video',
        body: 'Corporate video editing services for longer business content: explainers, product walkthroughs, and brand films where structure and message come first.',
      },
      {
        heading: 'Brand and campaign ads',
        body: 'Advertising-focused edits for video campaigns and brand ads — cuts shaped around an offer or objective, not only evergreen organic posts.',
      },
      {
        heading: 'Motion graphics',
        body: 'Motion graphics that support the story: titles, lower thirds, and simple animated emphasis — not a standalone animation studio.',
      },
      {
        heading: 'Social media video editing',
        body: 'Adaptation for social content: aspect ratios, captions, and length suited to the platform you plan to publish on — without inventing platform guarantees.',
      },
    ],
    processHeading: 'How we work',
    process:
      'Start with a conversation. We clarify the objective, review footage and assets, and recommend edit scope, deliverables, and revision rhythm before work begins.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    additionalSections: [
      {
        heading: 'When video editing is a good fit',
        body: 'Professional editing fits recurring social content, marketing or video campaigns, brand or product videos, raw footage that needs a clear story, or teams that need consistent video output without an in-house edit desk. If you only need still creatives, start with Graphic Design. If you need someone to run the channel day to day, that is',
        seeAlsoId: 'social-media-marketing',
      },
      {
        heading: 'What to look for in a video editing service',
        body: 'Look for storytelling and pacing that match the audience, correct platform format, captions and text treatment, and brand consistency. Ask how revisions work and whether the editor understands the objective — awareness, lead capture, or product clarity — not only visual polish. Still systems that sit beside the video live on',
        seeAlsoId: 'graphic-design',
      },
      {
        heading: 'Video for ads vs organic social',
        body: 'Ad creative is edited around an advertising objective and campaign brief. Organic social video is edited for ongoing social content and audience engagement. Length, hook, and CTA usually differ. Paid social buying and campaign management live on',
        seeAlsoId: 'meta-ads',
      },
    ],
    whyHeading: 'Video editing vs video production',
    why: 'Video editing is post-production: working with existing footage and assets to produce the final video — cut, sound, captions, graphics, and export. Video production typically includes filming and production activities in addition to that work.\n\nWe offer video editing services and related post-production — not a full video production services studio claim. We do not claim filming crews, studio cinematography, or live production on this page. If a project needs more production support than editing, we discuss that in consultation.',
    faqs: [
      {
        question: 'What types of videos can a business use professional editing for?',
        answer:
          'Businesses commonly use professional editing for short-form reels, social content, long-form and corporate video, brand advertisements, and motion-supported campaign cuts. The right format depends on the channel and the goal — awareness, product clarity, or paid traffic.',
      },
      {
        question: 'What is the difference between video editing and video production?',
        answer:
          'Video editing is post-production work on existing footage and assets to create the finished video. Video production usually includes filming and production activities as well as editing. Vridhio’s focus on this page is editing and post-production; broader production needs are scoped only if the project requires them.',
      },
      {
        question: 'How much does video editing cost?',
        answer:
          'We do not publish fixed packages or rates on this site. Pricing depends on source footage length, final video length, edit complexity, motion graphics needs, number of deliverables, and revision requirements. A consultation is where a scope-based estimate belongs.',
      },
      {
        question: 'Should businesses create different videos for ads and organic social media?',
        answer:
          'Often yes. Ad creative should match the campaign objective and placement; organic social video is usually built for feed engagement and ongoing content. You can share brand assets across both, but length, hook, and CTA are frequently different. Running Meta campaigns or managing social accounts are separate services from editing.',
      },
    ],
    relatedIds: ['graphic-design', 'meta-ads', 'social-media-marketing', 'website-development'],
  },
  seo: {
    seoTitle: 'SEO Services India | Vridhio',
    seoDescription:
      'SEO for businesses that need search visibility — including technical SEO, local SEO, and audits as part of one service.',
    h1: 'SEO Services for Sustainable Search Demand',
    intro:
      'SEO is the process of improving a website’s visibility in organic search results through technical, structural, content, and relevance improvements. SEO services in India from Vridhio cover that work as one service: technical SEO, on-page structure, local SEO, SEO audits, and search-focused content — not paid search, not a city landing page, and not a separate technical-SEO URL.',
    overviewHeading: 'What we help with',
    overview:
      'SEO services are for businesses that need organic search visibility: people finding the site because the pages match what they are looking for, not because an ad is running. An SEO agency or SEO company in India is usually hired to diagnose what is blocking that visibility and to improve the site over time. We scope the work to the site, the demand, and the starting point — not a ranking promise.\n\nVridhio is based in India and works with businesses globally. Local SEO and technical SEO are sections of this page. Google Ads, website engineering, and social management are different services.',
    capabilitiesHeading: 'What SEO work can include',
    capabilities: [
      {
        heading: 'Technical SEO',
        body: 'Technical SEO services cover crawlability, indexing, and site health at a general level: whether search engines can find, understand, and keep the important pages. Site structure belongs here when it blocks search. We do not invent a tool stack on this page, and we do not run /services/technical-seo/.',
      },
      {
        heading: 'On-page SEO',
        body: 'On-page SEO is how titles, headings, content structure, and internal linking help a page match search intent. The job is clearer pages that deserve to be found — not stuffing keywords into every block.',
      },
      {
        heading: 'Local SEO',
        body: 'Local SEO services are search visibility for location-based queries: people looking for a business or service in a place. Local SEO sits on this page. We do not create city SEO URLs, and we do not claim city offices. The business is based in India and works globally.',
      },
      {
        heading: 'SEO audits',
        body: 'SEO audit services look at technical and content opportunities before changing tactics: what is crawlable, what is thin or confusing, and what is actually worth fixing first. An audit is a starting point, not a ranking forecast.',
      },
      {
        heading: 'Search-focused content',
        body: 'Search-focused content means aligning useful pages with search demand and intent, then improving them as you learn what queries the site can honestly serve. Organic growth here supports SEO. It is not a separate content-marketing URL, and it is not social media management.',
      },
    ],
    processHeading: 'How we work',
    process:
      'SEO is scoped after we understand the site, the audience, and the search demand you actually need. Work is usually ongoing: technical and on-page fixes, content direction, and measurement — not a one-week switch. Cost depends on starting point, competition, site condition, and whether the work is a focused fix or ongoing optimization. We do not publish monthly retainers, packages, minimum budgets, or guaranteed traffic. A consultation is where we define scope.',
    whoForHeading: 'When SEO is a good fit',
    whoFor:
      'SEO is a fit when a business wants organic visibility rather than only paid clicks, when a startup is building long-term search demand, when a small business is hard to find for the queries that matter, or when a website needs technical and search improvements before campaigns can work. SEO for startups and SEO for small business is the same service on this page, scoped to the site — not a promise of traffic.',
    additionalSections: [
      {
        heading: 'SEO vs Google Ads',
        body: 'SEO is organic visibility built over time through the site itself. Google Ads is paid search visibility while campaigns are active and funded. Neither is universally better. They can sit together: paid search can capture demand now; SEO is a longer build. Paid search management lives on',
        seeAlsoId: 'google-ads',
      },
      {
        heading: 'SEO vs website development',
        body: 'Website development creates the technical and product foundation — pages, speed, structure, conversion paths. SEO focuses on organic search visibility for those pages. A weak site can limit SEO; search work does not replace a build. Site engineering lives on',
        seeAlsoId: 'website-development',
      },
    ],
    whyHeading: 'What to look for in an SEO agency',
    why: 'Look for technical understanding, respect for search intent, and content quality — not a secret ranking method. A useful SEO agency is clear about scope, realistic about timelines, and honest about measurement. They should distinguish SEO from paid media and will not sell certifications, awards, or guaranteed positions. Communication should explain what is being worked on and why, not a dashboard of vanity metrics.',
    faqs: [
      {
        question: 'What are SEO services?',
        answer:
          'SEO services are the work of improving organic search visibility: technical health, on-page structure, local visibility where it matters, audits, and content aligned with search intent. At Vridhio that work is one SEO service — not Google Ads, not a city page, and not a ranking guarantee.',
      },
      {
        question: 'How long does SEO take to show results?',
        answer:
          'SEO does not have a guaranteed number of months. Results depend on the starting point, competition, site condition, search demand, scope, and consistency of the work. It is ongoing. We do not promise rankings by a set date.',
      },
      {
        question: 'What is local SEO and why is it important for small businesses?',
        answer:
          'Local SEO is search visibility for location-based queries — people looking for a service or business in a place. It matters for small businesses when nearby demand is how customers actually search. It is a section of this SEO service, not a separate city website, and it is not a claim that every business needs it.',
      },
      {
        question: 'SEO vs Google Ads: which should a business invest in first?',
        answer:
          'Neither is always first. SEO builds organic visibility over time; Google Ads buys search visibility while you spend. The better starting point depends on how urgent demand is, how ready the site is, and whether people already search for what you sell. We do not declare a universal winner.',
      },
    ],
    relatedIds: ['google-ads', 'website-development', 'lead-generation'],
  },
  'google-ads': {
    seoTitle: 'Google Ads Agency India | Vridhio',
    seoDescription:
      'Search and Google advertising management focused on high-intent demand — not Facebook or Instagram ads.',
    h1: 'Google Ads Management for High-Intent Search',
    intro:
      'Vridhio manages Google Ads and PPC for businesses that need search demand in India. This page is paid search — search ads, query targeting, and campaign management on Google. It is not Facebook Ads, Instagram Ads, or SEO.',
    overviewHeading: 'What Google Ads means here',
    overview:
      'Google Ads is paid search: ads shown when someone is already looking. PPC management and Google advertising services on this page mean structuring campaigns around search intent, then tracking whether clicks become useful actions. Older “AdWords” language still points at the same search demand.\n\nPaid search can sit next to organic SEO and next to a lead-generation system. Those remain different services. Paid social on Facebook and Instagram lives on Meta Ads.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      {
        heading: 'Campaign strategy',
        body: 'Campaign structure follows the offer, the search demand, and the conversion path — not a generic account template.',
      },
      {
        heading: 'Keyword and query research',
        body: 'Keyword targeting starts from how people actually search: queries, intent, and which terms are worth bidding on versus excluding.',
      },
      {
        heading: 'Search ads and testing',
        body: 'Search ads and ad copy shaped around the query and the offer, with testing where the account has enough volume to learn from.',
      },
      {
        heading: 'Conversion tracking',
        body: 'Conversion tracking so the account can see which clicks become enquiries or other agreed actions. We do not invent a tracking-stack guarantee on this page.',
      },
      {
        heading: 'Campaign optimization',
        body: 'Ongoing campaign management: queries, ads, bids, and waste — scoped to the account, not a set ROAS promise.',
      },
      {
        heading: 'Landing-page alignment',
        body: 'Ads should match the page the click reaches. Building or rebuilding that page is website work; alignment between ad and page is part of paid-search management.',
      },
    ],
    processHeading: 'How we work',
    process:
      'Start with a conversation. We clarify the offer, the search demand, and what a conversion means — then scope campaigns, tracking, and whether the landing page can support the click. We do not sell guaranteed ROAS or rankings.',
    whoForHeading: 'When Google Ads is a good fit',
    whoFor:
      'A good fit includes businesses whose customers search for the offer, teams that need demand while organic search is still building, or accounts that need clearer structure, tracking, and query control. If nobody searches for what you sell, paid search may not be the first channel.',
    additionalSections: [
      {
        heading: 'Paid search vs SEO',
        body: 'Google Ads buys visibility on search while campaigns are funded. SEO is organic visibility built through the site over time. They can work together; they are not the same service. Organic search work lives on',
        seeAlsoId: 'seo',
      },
      {
        heading: 'Google Ads vs Meta Ads',
        body: 'Google Ads is paid search and active intent. Meta Ads is paid social — Facebook and Instagram placements based on audience and creative, not a typed query. Mixing them on one “ads” URL would blur ownership. Paid social lives on',
        seeAlsoId: 'meta-ads',
      },
      {
        heading: 'Google Ads and lead generation',
        body: 'Paid search can send high-intent clicks into a capture path. Lead Generation is the pipeline layer: qualification, CRM follow-up, and outreach. This page stays campaign management. Pipeline work lives on',
        seeAlsoId: 'lead-generation',
      },
    ],
    whyHeading: 'What to look for in a Google Ads agency',
    why: 'Look for a team that separates Google Search from Facebook and Instagram, can explain keyword targeting and search intent, can talk about conversion tracking and landing-page alignment, and will not sell guaranteed ROAS. You should hear how the account will be structured and reported — not a ranking promise or a partner-badge pitch. We do not claim Google Partner status on this page.',
    faqs: [
      {
        question: 'What is Google Ads?',
        answer:
          'Google Ads is paid advertising on Google, mainly search ads shown when someone is looking for a product or service. On this page it means PPC and search-campaign management — not Facebook or Instagram ads, and not SEO.',
      },
      {
        question: 'How much does Google Ads management cost?',
        answer:
          'The cost depends on two parts: media spend paid to Google, and the management or service cost for running the account. We do not list a public retainer, media-fee schedule, or typical budget on this site. A consultation is where a scope-based estimate belongs.',
      },
      {
        question: 'What should I look for in a Google Ads agency?',
        answer:
          'Look for clear campaign structure, an explanation of search intent and keyword targeting, conversion tracking, landing-page alignment, and reporting you can follow. You should hear a plan, not a ranking or ROAS guarantee, and Google Ads should stay separate from Meta ads.',
      },
      {
        question: 'Google Ads vs Facebook Ads: which is better?',
        answer:
          'Neither is universally better. Google Ads serves people who are already searching. Facebook Ads (Meta Ads) reach people in a social feed based on audience and creative. The better fit depends on whether you need search intent or paid social discovery — not a universal winner.',
      },
    ],
    relatedIds: ['seo', 'lead-generation', 'meta-ads'],
  },
  'meta-ads': {
    seoTitle: 'Facebook Ads Agency India | Vridhio',
    seoDescription:
      'Facebook and Instagram ads management — paid social, not Google Search ads and not organic social retainers.',
    h1: 'Meta Ads for Facebook and Instagram',
    intro:
      'Meta Ads at Vridhio means Facebook Ads and Instagram Ads management in India: paid social advertising, audience targeting, and campaign management on Meta. Organic social management sits on Social Media Marketing. Google Search ads sit on Google Ads.',
    overviewHeading: 'What Meta Ads means here',
    overview:
      'Meta Ads is paid advertising across Facebook and Instagram. Facebook advertising and Instagram Ads management are placements and creative inside one paid-social service — not two websites, and not an organic social retainer.\n\nAudience targeting, campaign setup, testing, conversion tracking, and optimization sit here as capability language, not as named case-study results. Highly targeted ads based on behavior and interests are in scope as a method, not as a promised outcome.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      {
        heading: 'Campaign strategy',
        body: 'Campaign structure follows the offer, the audience, and the objective — awareness, traffic, or conversions — not a generic boost of a page post.',
      },
      {
        heading: 'Audience targeting',
        body: 'Audience targeting uses who should see the ad: interests, behavior, and other Meta audience options scoped to the offer. We do not invent reach guarantees.',
      },
      {
        heading: 'Facebook campaign setup',
        body: 'Facebook campaign setup as placements and creative suited to Facebook. It is part of Meta Ads, not a separate Facebook-only URL.',
      },
      {
        heading: 'Instagram campaign setup',
        body: 'Instagram Ads management as placements and creative suited to Instagram. Same network as Facebook; different format and context.',
      },
      {
        heading: 'Creative coordination',
        body: 'Ads need assets that match the placement and the offer. Still production often sits with Graphic Design; video cuts with Video Editing. Buying the ads is this page.',
      },
      {
        heading: 'Ad testing',
        body: 'Ad testing compares creative, audiences, or messages when the account has enough delivery to learn from. Testing is not a claim that every ad will win.',
      },
      {
        heading: 'Conversion tracking',
        body: 'Conversion tracking so campaigns can see which ads lead to agreed actions. We do not invent a pixel-stack or ROAS guarantee here.',
      },
      {
        heading: 'Campaign optimization',
        body: 'Ongoing optimization of audiences, creative, and delivery against the objective — scoped to the account, not a set return.',
      },
      {
        heading: 'Landing-page alignment',
        body: 'The click should reach a page that matches the ad. Building that page is website work; keeping ad and destination aligned is part of campaign management.',
      },
    ],
    processHeading: 'How we work',
    process:
      'Start with a conversation. We clarify the offer, the audience, and the campaign objective — then scope Facebook and Instagram placements, creative needs, tracking, and optimization. We do not sell guaranteed ROAS or follower growth.',
    whoForHeading: 'When Meta Ads is a good fit',
    whoFor:
      'A good fit includes businesses that need paid reach on Facebook or Instagram, offers that work in a social feed, or teams that need structured campaign management rather than boosting posts. If the real need is organic content and community, that is Social Media Marketing. If the real need is search intent, that is Google Ads.',
    additionalSections: [
      {
        heading: 'Facebook Ads vs Instagram Ads',
        body: 'Both run through Meta. Placement, creative, and audience can differ. Neither platform always performs better. Choice depends on where the audience is, what the creative is, the campaign objective, and context — not a universal winner. We manage them as one Meta Ads service rather than two sites.',
      },
      {
        heading: 'Meta Ads vs Google Ads',
        body: 'Meta Ads is paid social: audience-based discovery in Facebook and Instagram feeds. Google Ads is paid search: ads for people who are already looking. They can both exist in a media mix. They are different services. Paid search lives on',
        seeAlsoId: 'google-ads',
      },
      {
        heading: 'Meta Ads vs Social Media Marketing',
        body: 'Meta Ads is paid advertising campaigns. Social Media Marketing is organic strategy, content planning, publishing, and community management. Buying ads is this page. Running the account day to day lives on',
        seeAlsoId: 'social-media-marketing',
      },
    ],
    whyHeading: 'What to look for in a Meta Ads agency',
    why: 'Look for campaign structure, audience strategy, creative testing, conversion tracking, optimization, landing-page alignment, and reporting you can follow. Ask how Facebook and Instagram are treated as placements, not as two separate agencies. We do not claim Meta Partner status, awards, or a guaranteed return. Still campaign assets often sit with Graphic Design; motion with Video Editing.',
    faqs: [
      {
        question: 'What are Meta Ads?',
        answer:
          'Meta Ads are paid ads delivered through Meta, mainly Facebook and Instagram. That is this service — not Google Search ads, and not organic social management.',
      },
      {
        question: 'What is included in Meta Ads management?',
        answer:
          'Meta Ads management typically includes campaign strategy, audience targeting, Facebook and Instagram campaign setup, creative coordination, ad testing, conversion tracking, optimization, and landing-page alignment. Scope follows the offer and the objective.',
      },
      {
        question: 'How much does Meta Ads management cost?',
        answer:
          'The cost depends on two parts: media spend paid to Meta, and the management or service cost for running the campaigns. We do not publish retainers, typical budgets, or ROAS figures on this site. A consultation is where a scope-based estimate belongs.',
      },
      {
        question: 'Facebook Ads vs Instagram Ads: which is better?',
        answer:
          'Neither is always better. Both are Meta placements. The better choice depends on audience, creative format, campaign objective, and context. We manage them as one Meta Ads service rather than two separate sites.',
      },
    ],
    relatedIds: [
      'social-media-marketing',
      'graphic-design',
      'video-editing',
      'google-ads',
    ],
  },
  'social-media-marketing': {
    seoTitle: 'Social Media Marketing Agency | Vridhio',
    seoDescription:
      'Social media marketing agency work: strategy, content planning, creative direction, and social media management — organic presence, not Meta Ads buying.',
    h1: 'Social Media Marketing and Management',
    intro:
      'Vridhio is a social media marketing agency for businesses that need strategy, content planning, creative direction, and ongoing social media management. Social media marketing services here mean organic presence and community — not Facebook or Instagram ad buying, which lives on Meta Ads.',
    overviewHeading: 'What social media marketing means here',
    overview:
      'Social media marketing can include strategy, content planning, creative direction, publishing and management, community engagement, platform-specific content, and influencer collaborations where they fit. Not every client needs every activity.\n\nSocial media management is the ongoing layer: planning, publishing, and engagement so accounts stay consistent. Instagram marketing on this page means organic presence and community building — not Instagram Ads. India-based businesses are in scope; we are not building city-only social pages.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      {
        heading: 'Social strategy',
        body: 'Goals, audiences, platform selection, and content direction so posts support the business — not random posting.',
      },
      {
        heading: 'Content planning',
        body: 'Recurring content plans tied to offers, seasons, and growth goals so social media management stays structured.',
      },
      {
        heading: 'Creative direction',
        body: 'Visual and content concepts that support the social strategy. Still production often sits with Graphic Design; motion and cuts with Video Editing.',
      },
      {
        heading: 'Publishing and management',
        body: 'Scheduling, publishing, and account management where ongoing social media management services are in scope.',
      },
      {
        heading: 'Community engagement',
        body: 'Responding to relevant interactions and keeping an active presence — community building as management, not a vanity-follower promise.',
      },
      {
        heading: 'Influencer campaigns',
        body: 'Influencer collaborations, creator partnerships, and brand collaborations when they fit the strategy. We do not claim owned influencer networks or guaranteed reach.',
      },
    ],
    processHeading: 'How we work',
    process:
      'Start with a conversation. We clarify goals, audience, and which platforms matter — then scope strategy, planning, creative direction, and management. Production work is scoped on Graphic Design or Video Editing when the need is assets, not posting.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    additionalSections: [
      {
        heading: 'When social media marketing is a good fit',
        body: 'A good fit includes businesses that need a consistent social presence, lack internal social strategy, need structured content planning, want ongoing account management, need community engagement, or want creative content coordinated with business goals as part of broader growth.',
      },
      {
        heading: 'Organic social vs Meta Ads',
        body: 'Social media marketing is organic strategy, content, management, engagement, and community. Meta Ads is paid advertising on Facebook and Instagram. Many businesses use both. Paid social buying lives on',
        seeAlsoId: 'meta-ads',
      },
      {
        heading: 'Short-form video and platform-native content',
        body: 'Reels and other short-form video often carry social attention when pacing and captions fit the platform. Content consistency matters more than one-off posts. Editing and cutdowns for social formats live on',
        seeAlsoId: 'video-editing',
      },
      {
        heading: 'Social media vs design and video',
        body: 'Social Media Marketing is the strategic and management layer. Graphic Design can support social creative production; Video Editing can support reels, short-form videos, and campaign assets. Still creative systems live on',
        seeAlsoId: 'graphic-design',
      },
      {
        heading: 'What to look for in a social media marketing agency',
        body: 'Look for clear strategy, audience understanding, platform selection, content planning, creative quality, consistency, reporting, a clear line between organic activity and paid advertising, and realistic expectations — not follower guarantees or engagement-rate promises. Pipeline work beyond organic social lives on',
        seeAlsoId: 'lead-generation',
      },
    ],
    whyHeading: 'How social can support growth',
    why: 'Organic social can explain the offer, stay in conversation with buyers, and support demand created elsewhere. It is not a substitute for SEO, Google Ads, Lead Generation, or a working website — and it is not Meta Ads management.',
    faqs: [
      {
        question: 'What does a social media marketing agency do?',
        answer:
          'A social media marketing agency plans and runs organic social work: strategy, content planning, creative direction, publishing, community engagement, and influencer collaborations when they fit. Paid Facebook or Instagram ads are a separate advertising service.',
      },
      {
        question: 'What is included in social media management?',
        answer:
          'Social media management typically includes content planning, scheduling and publishing, account upkeep, and community engagement so presence stays consistent. Scope follows the platforms and publishing cadence you need — not every tactic for every client.',
      },
      {
        question: 'How much does social media marketing cost?',
        answer:
          'We do not publish fixed packages on this site. Cost can depend on number of platforms, content volume, creative requirements, management scope, publishing frequency, community management, and campaign needs. A consultation is where a scope-based estimate belongs.',
      },
      {
        question: 'What is the difference between social media marketing and Meta Ads?',
        answer:
          'Social media marketing is organic strategy, content, management, and community. Meta Ads is paid advertising on Facebook and Instagram. They can work together, but they are different services with different goals and reporting.',
      },
    ],
    relatedIds: ['meta-ads', 'graphic-design', 'video-editing', 'lead-generation'],
  },
  'lead-generation': {
    seoTitle: 'Lead Generation Services | Vridhio',
    seoDescription:
      'Lead generation services for qualified pipeline: funnels, qualification, CRM follow-up, outreach, and appointment setting — not a generic marketing or AI chatbot page.',
    h1: 'Lead Generation for Qualified Pipeline',
    intro:
      'Lead generation services at Vridhio focus on turning demand into a sales pipeline: capture, qualification, CRM follow-up, outreach, appointment setting, and lead nurturing. This is business lead generation for qualified opportunities — not a generic digital marketing page, and not a substitute for AI automation.',
    overviewHeading: 'What lead generation means here',
    overview:
      'Lead generation creates and captures potential customer opportunities. Lead qualification decides which opportunities fit. Lead nurturing continues relevant follow-up until a prospect is ready for sales.\n\nB2B lead generation usually means identifiable companies entering a pipeline with an owner and a next step. Business lead generation for services works the same way: clear capture, clear criteria, and follow-up that does not lose the enquiry. Channels such as Google Ads, SEO, Meta Ads, or outreach can feed that system — this page is the pipeline outcome, not every channel.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      {
        heading: 'Lead capture and funnels',
        body: 'Sales funnels and capture paths that turn interest into identifiable leads — offers, landing or form flow, and routing into follow-up.',
      },
      {
        heading: 'Lead qualification',
        body: 'Separating relevant prospects from low-quality enquiries with criteria that match the target customer.',
      },
      {
        heading: 'CRM and follow-up',
        body: 'CRM systems and structured follow-up so a lead has an owner, a status, and a next step — process and ownership, not a named CRM platform claim.',
      },
      {
        heading: 'Outreach',
        body: 'Outreach systems when outbound contact should support the offer. We do not invent cold-email stacks, LinkedIn automation products, or scraped databases here.',
      },
      {
        heading: 'Appointment setting',
        body: 'Sales appointment setting so qualified conversations land on a calendar when that is the handoff. We do not promise a fixed number of meetings.',
      },
      {
        heading: 'Lead nurturing',
        body: 'Lead nurturing for prospects that are not ready yet — continued relevant follow-up instead of treating delay as a lost lead.',
      },
    ],
    processHeading: 'How we work',
    process:
      'Start with a conversation. We clarify the offer, target customer, and sales handoff — then scope capture, qualification, follow-up, and whether outreach or appointment setting belongs. We do not sell guaranteed meeting volume.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    additionalSections: [
      {
        heading: 'When lead generation is a good fit',
        body: 'A good fit includes businesses that need a more consistent sales pipeline, B2B teams with identifiable prospects, service businesses with a defined offer, teams that lose enquiries in follow-up, or teams that need qualification before sales conversations.',
      },
      {
        heading: 'Lead quality vs lead quantity',
        body: 'More leads are not automatically better. Fit, relevance, intent, qualification, follow-up, and conversion into real sales conversations matter more than raw volume. Unqualified volume creates busywork; qualified leads create conversations worth having.',
      },
      {
        heading: 'Lead generation vs AI automation',
        body: 'Lead generation creates and qualifies sales opportunities. AI automation automates workflows, support, and operational processes. AI can support qualification inside a lead system, but this page stays pipeline generation. Automation tooling lives on',
        seeAlsoId: 'ai-automation',
      },
      {
        heading: 'Lead generation vs paid advertising',
        body: 'Lead generation is the outcome system. Channels such as Google Ads, SEO, and Meta Ads can contribute prospects without turning this page into an ads service. Paid search management lives on',
        seeAlsoId: 'google-ads',
      },
      {
        heading: 'What to look for in a lead generation service',
        body: 'Look for a clear target customer, qualification criteria, transparent reporting, source visibility, CRM or follow-up process, sales handoff, and realistic expectations — not guaranteed appointments or black-box lead dumps. Organic search that feeds demand lives on',
        seeAlsoId: 'seo',
      },
    ],
    whyHeading: 'Agency support vs in-house sales',
    why: 'In-house sales still needs a system that feeds it. Lead generation builds capture, qualification, follow-up, and handoff. We do not claim to replace an in-house sales team. Website capture paths often sit next to this work on Website Development when the site is part of the funnel.',
    faqs: [
      {
        question: 'What is B2B lead generation?',
        answer:
          'B2B lead generation is finding and capturing businesses that might buy, then qualifying them into a pipeline with an owner and a next step. It is not collecting contacts with no follow-up.',
      },
      {
        question: 'What does a lead generation service include?',
        answer:
          'A lead generation service typically includes capture and funnels, lead qualification, CRM follow-up, outreach where it fits, appointment setting, and lead nurturing. Scope follows the offer and the sales handoff.',
      },
      {
        question: 'How much do lead generation services cost?',
        answer:
          'We do not publish fixed packages on this site. Cost can depend on target market, channel scope, volume needs, qualification requirements, outreach or funnel complexity, CRM follow-up, and ongoing management. A consultation is where a scope-based estimate belongs.',
      },
      {
        question: 'Why is lead quality more important than lead quantity?',
        answer:
          'Lead quality matters more than quantity because unfit volume wastes sales time. Fit, intent, qualification, and follow-up determine whether an enquiry becomes a conversation worth having.',
      },
    ],
    relatedIds: ['ai-automation', 'google-ads', 'seo', 'website-development'],
  },
}

export type ResolvedServicePage = {
  id: ServiceId
  name: string
  group: 'core' | 'growth'
  slug: string
  href: string
  seo: PageSeo
  copy: ServicePageCopy
  related: { id: ServiceId; name: string; href: string }[]
}

export function getServicePageBySlug(slug: string): ResolvedServicePage | null {
  const entry = SERVICE_CATALOG.find((service) => service.slug === slug)
  if (!entry) return null
  const copy = SERVICE_PAGE_COPY[entry.id]
  const related = copy.relatedIds.flatMap((id) => {
    const relatedEntry = getServiceById(id)
    if (!relatedEntry) return []
    return [{ id: relatedEntry.id, name: relatedEntry.name, href: serviceHref(relatedEntry.slug) }]
  })
  return {
    id: entry.id,
    name: entry.name,
    group: entry.group,
    slug: entry.slug,
    href: serviceHref(entry.slug),
    seo: buildServicePageSeo({
      slug: entry.slug,
      title: copy.seoTitle,
      description: copy.seoDescription,
    }),
    copy,
    related,
  }
}
