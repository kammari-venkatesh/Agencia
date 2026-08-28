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
  whyHeading: string
  why: string
  faqs: ServiceFaq[]
  relatedIds: ServiceId[]
}

const CONSULTATION =
  'Start with a conversation. We understand your goals, identify the biggest opportunities, and recommend the right combination of strategy, design, technology, and growth.'

const INDUSTRIES =
  'We work with ambitious businesses across technology, education, healthcare, real estate, e-commerce, and professional services. The approach changes based on the business, not an industry label.'

const SERVICE_PAGE_COPY: Record<ServiceId, ServicePageCopy> = {
  'website-development': {
    seoTitle: 'Website Development Company | Vridhio',
    seoDescription:
      'Vridhio builds custom business websites, landing pages, and ecommerce sites designed to convert visitors into customers.',
    h1: 'Website Development for Businesses That Need to Convert',
    intro:
      'Vridhio is a website development company for businesses that need more than a template. We build custom websites, landing pages, ecommerce stores, and portfolios designed to convert visitors into customers.',
    overviewHeading: 'What we help with',
    overview:
      'We create fast, modern, and conversion-focused websites that turn visitors into paying customers. This page is for teams hiring a website development company — not a mobile app studio.',
    capabilitiesHeading: 'What we build',
    capabilities: [
      {
        heading: 'Business websites',
        body: 'Custom business websites with a clear structure, responsive layout, and conversion paths.',
      },
      {
        heading: 'Landing pages',
        body: 'Campaign and offer pages built to capture demand without extra navigation noise.',
      },
      {
        heading: 'Ecommerce websites',
        body: 'Storefronts focused on product clarity and checkout, not generic brochure layouts.',
      },
      {
        heading: 'Portfolio websites',
        body: 'Work-first sites for firms that need to show proof without clutter.',
      },
    ],
    processHeading: 'How we work',
    process: CONSULTATION,
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'What a high-performing business website needs',
    why: 'A business website should load cleanly, explain the offer, and give a visitor a next step. We focus on structure, responsive web design, and conversion paths — not decoration for its own sake. Website builders can be enough for simple pages; custom website development is for businesses that need a site that matches how they actually sell.',
    faqs: [
      {
        question: 'How much does a business website cost in India?',
        answer:
          'We do not publish a fixed price. Cost depends on scope, pages, integrations, and whether you need ecommerce or a simpler business site. A consultation is the starting point.',
      },
      {
        question: 'Website builder vs custom website — which do we need?',
        answer:
          'A website builder can work for a simple presence. Custom website development is a better fit when you need specific conversion paths, ecommerce, or a site that has to grow with the business.',
      },
      {
        question: 'What features should a high-performing business website have?',
        answer:
          'A clear offer, responsive layout, fast pages, and an obvious next step — contact, book a call, or buy. Extra features should support those outcomes, not distract from them.',
      },
    ],
    relatedIds: ['app-development', 'graphic-design', 'seo', 'lead-generation'],
  },
  'app-development': {
    seoTitle: 'Mobile App Development Company | Vridhio',
    seoDescription:
      'Android, iOS, web apps, and admin dashboards — built for performance and business growth.',
    h1: 'Mobile App Development for Android, iOS, and Web',
    intro:
      'Vridhio is a mobile app development company for teams that need Android apps, iOS apps, web applications, or admin dashboards. We design for performance, usability, and how the product will actually be used.',
    overviewHeading: 'What we help with',
    overview:
      'Scalable and user-friendly mobile and web apps designed for performance and business growth. This is app development — distinct from website development.',
    capabilitiesHeading: 'What we build',
    capabilities: [
      { heading: 'Android apps', body: 'Native-quality Android app development for your product workflow.' },
      { heading: 'iOS apps', body: 'iOS app development when Apple users are a core audience.' },
      { heading: 'Web applications', body: 'Web apps when the product needs to run in the browser.' },
      { heading: 'Admin dashboards', body: 'Internal tools so operations can run the product, not fight it.' },
    ],
    processHeading: 'How we work',
    process: CONSULTATION,
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'Android vs iOS vs cross-platform',
    why: 'The right approach depends on your users and the product. Some businesses need Android first, some iOS, some both, and some a web application. Cross-platform app development is a fit when one codebase can serve the product without blocking either platform. We recommend the path after we understand the product — not a default stack pitch.',
    faqs: [
      {
        question: 'How long does it take to develop a mobile app?',
        answer:
          'It depends on scope. On this site we describe typical projects as taking between 2–8 weeks depending on complexity and the number of services involved. A full product app can sit outside that range. We define the timeline before development begins.',
      },
      {
        question: 'What should I look for when hiring an app development company?',
        answer:
          'Look for a team that asks about users, workflows, and admin needs — not only screens. You should leave the first conversation with a clearer build path for Android, iOS, web, or a mix.',
      },
      {
        question: 'Android vs iOS vs cross-platform development?',
        answer:
          'Choose based on where your users are and how the product needs to work. We can build for Android, iOS, web applications, or a cross-platform approach when it is the honest fit.',
      },
    ],
    relatedIds: ['website-development', 'ai-automation', 'lead-generation'],
  },
  'ai-automation': {
    seoTitle: 'AI Automation Services | Vridhio',
    seoDescription:
      'AI chatbots, workflow automation, CRM automation, WhatsApp bots, and AI voice assistants — as one automation service, not separate products.',
    h1: 'AI Automation for Support, Operations, and Outreach',
    intro:
      'AI automation services at Vridhio cover chatbots, workflow automation, CRM automation, WhatsApp bots, and AI voice assistants as one system. These are use cases of the same service — not separate product pages.',
    overviewHeading: 'What we help with',
    overview:
      'Custom automation systems that reduce manual work and streamline operations. Chatbots, n8n workflows, WhatsApp automation, CRM sync, and calling assistants sit under this service.',
    capabilitiesHeading: 'Automation use cases',
    capabilities: [
      {
        heading: 'AI chatbots and WhatsApp',
        body: 'Intelligent AI chatbot systems for customer support, lead capture, and user engagement — including WhatsApp AI bots and AI business assistants.',
        items: ['Customer support bots', 'WhatsApp AI bots', 'Lead generation bots', 'AI business assistants'],
      },
      {
        heading: 'Workflow automation',
        body: 'n8n automations, Zapier workflows, and process optimization that cut repetitive hand-offs. Workflow automation is a core part of AI automation — not a separate URL.',
        items: ['n8n automations', 'Zapier workflows', 'Process optimization'],
      },
      {
        heading: 'CRM automation',
        body: 'CRM automation so new conversations and form fills reach the right place instead of a spreadsheet graveyard.',
      },
      {
        heading: 'AI voice assistants and appointment scheduling',
        body: 'AI-powered voice agents for support, outreach, and appointment booking when voice is the right channel.',
        items: ['AI voice assistants', 'Customer support calling', 'Appointment scheduling'],
      },
    ],
    processHeading: 'How we work',
    process: CONSULTATION,
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'Chatbot vs CRM automation vs workflow automation',
    why: 'A chatbot talks to people. CRM automation files and routes the record. Workflow automation connects the steps in between. AI automation is the umbrella: we use the pieces that match the job. It is not the same as a lead generation retainer — that work lives on our lead generation service.',
    faqs: [
      {
        question: 'What can AI automation do for businesses?',
        answer:
          'It can take repetitive support, routing, and follow-up work off the team: chatbots, WhatsApp bots, workflow automations, CRM updates, and voice assistants where they fit.',
      },
      {
        question: 'Chatbot vs CRM automation?',
        answer:
          'A chatbot is the conversation layer. CRM automation is how that conversation becomes a record, an owner, and a next step. Most useful setups need both.',
      },
      {
        question: 'Is workflow automation the same as AI automation?',
        answer:
          'Not exactly. Workflow automation (including n8n or Zapier) is one part of AI automation. AI automation can also include chatbots, WhatsApp bots, CRM automation, and voice assistants.',
      },
    ],
    relatedIds: ['lead-generation', 'app-development', 'website-development'],
  },
  'graphic-design': {
    seoTitle: 'Graphic Design Services | Vridhio',
    seoDescription:
      'Brand identity, social creatives, pitch decks, and UI/UX design for businesses that need a clear visual system.',
    h1: 'Graphic Design for Brand Identity and Campaigns',
    intro:
      'Graphic design services at Vridhio cover brand identity, social creatives, pitch decks, and UI/UX. Logo work sits inside branding — it is not a separate service page.',
    overviewHeading: 'What we help with',
    overview:
      'Creative designs that build a clear brand identity and support campaigns. This is graphic design, not social media management and not video editing.',
    capabilitiesHeading: 'What we design',
    capabilities: [
      { heading: 'Brand identity and logo', body: 'Identity systems and logo design as part of branding, not a one-off icon with no rules.' },
      { heading: 'Marketing collateral and social creatives', body: 'Campaign visuals and social creatives that match the brand.' },
      { heading: 'Pitch decks', body: 'Decks that explain the offer without visual noise.' },
      { heading: 'UI/UX design', body: 'Interface and interaction design that supports websites and products — not a substitute for website development.' },
    ],
    processHeading: 'How we work',
    process: CONSULTATION,
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'Branding vs a logo file',
    why: 'A logo is one mark. Branding is how type, color, and layout stay consistent across the site, ads, and decks. We treat logo design as part of that system.',
    faqs: [
      {
        question: 'What is included in graphic design services?',
        answer:
          'Brand identity, social media creatives, pitch decks, and UI/UX design. Scope is set around what the business actually needs to ship.',
      },
      {
        question: 'Branding vs logo design?',
        answer:
          'Logo design is one part of branding. Branding also covers how the identity is used across collateral and campaigns.',
      },
      {
        question: 'Do you design UI/UX as well as campaign creatives?',
        answer:
          'Yes. UI/UX design is part of this service. Website engineering still lives on the website development page.',
      },
    ],
    relatedIds: ['website-development', 'video-editing', 'social-media-marketing'],
  },
  'video-editing': {
    seoTitle: 'Video Editing Services | Vridhio',
    seoDescription:
      'Short-form reels, long-form videos, brand ads, and motion graphics for businesses and campaigns.',
    h1: 'Video Editing for Brands, Ads, and Social',
    intro:
      'Video editing services for brands, ads, and social: short-form reels, long-form and corporate video, brand advertisements, and motion graphics. This is production and editing — not a social media marketing retainer.',
    overviewHeading: 'What we help with',
    overview:
      'Professional video editing tailored for brands, creators, ads, and social campaigns. Organic social strategy is a different service; paid social buying is Meta Ads.',
    capabilitiesHeading: 'What we edit',
    capabilities: [
      { heading: 'Short-form reels', body: 'Social media video editing for short-form formats.' },
      { heading: 'Long-form and corporate video', body: 'Longer cuts for explainers, internal, or corporate use.' },
      { heading: 'Brand advertisements', body: 'Ad cuts shaped for campaigns, not only organic posts.' },
      { heading: 'Motion graphics', body: 'Motion that supports the story without becoming the whole product.' },
    ],
    processHeading: 'How we work',
    process: CONSULTATION,
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'Video editing vs video production',
    why: 'Editing shapes footage and graphics into a finished piece. Production can include more of the shoot. We offer video editing services; if a project needs more production support, we scope that in conversation rather than promising a studio we have not documented.',
    faqs: [
      {
        question: 'What kinds of videos do you edit?',
        answer:
          'Short-form reels, long-form videos, brand advertisements, and motion graphics.',
      },
      {
        question: 'Video editing vs video production?',
        answer:
          'Editing is the cut, sound, and graphics. Production can include filming. We start from editing needs and expand only if the project requires it.',
      },
      {
        question: 'Can you edit content for ads and organic social?',
        answer:
          'Yes. Cuts can be for ads or organic social. Running the social accounts or buying Meta ads are separate services.',
      },
    ],
    relatedIds: ['graphic-design', 'meta-ads', 'social-media-marketing'],
  },
  seo: {
    seoTitle: 'SEO Services India | Vridhio',
    seoDescription:
      'SEO for businesses that need search visibility — including technical SEO, local SEO, and audits as part of one service.',
    h1: 'SEO Services for Sustainable Search Demand',
    intro:
      'SEO services in India from Vridhio: search visibility work that can include technical SEO, local SEO, and SEO audits as sections of one service — not separate city or technical landing pages.',
    overviewHeading: 'What we help with',
    overview:
      'Search engine optimization for businesses that need organic visibility. We do not treat Google Ads as SEO, and we do not run a generic digital marketing URL.',
    capabilitiesHeading: 'What SEO work can include',
    capabilities: [
      {
        heading: 'Technical SEO',
        body: 'Technical SEO as part of this page: crawlability, structure, and the site issues that block search — not a /services/technical-seo URL.',
      },
      {
        heading: 'Local SEO',
        body: 'Local SEO services as a section of this page. We are based in India and work with businesses that need local search visibility. We are not launching city landing pages in this phase.',
      },
      {
        heading: 'SEO audits',
        body: 'SEO audit work to see what is actually holding the site back before changing tactics.',
      },
      {
        heading: 'Organic growth and content direction',
        body: 'Content strategy and organic growth as support for SEO — not a separate content marketing URL.',
      },
    ],
    processHeading: 'How we work',
    process:
      'We build marketing around business goals, audience, and growth stage rather than a fixed package. SEO is scoped after we understand the site and the demand you actually need.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'SEO vs Google Ads',
    why: 'SEO compounds in search over time. Google Ads buys visibility on search now. They can work together; they are not the same service. Paid search management lives on the Google Ads page.',
    faqs: [
      {
        question: 'SEO vs Google Ads?',
        answer:
          'SEO is organic search visibility. Google Ads is paid search. We keep them as separate services so the work and the keywords stay distinct.',
      },
      {
        question: 'How long does SEO take?',
        answer:
          'SEO is ongoing. We do not promise rankings in a set number of months. Timeline depends on the site, competition, and what the audit finds.',
      },
      {
        question: 'What is local SEO?',
        answer:
          'Local SEO is search visibility for location-based queries. It is a section of this SEO service, not a separate city website.',
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
      'Vridhio manages Google Ads and PPC for businesses that need search demand in India. This page is search ads — not Facebook Ads, Instagram Ads, or SEO.',
    overviewHeading: 'What we help with',
    overview:
      'Google advertising and PPC management aimed at high-intent search. We do not mix this with Meta paid social on the same keyword set.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      { heading: 'Search ads and PPC', body: 'Google Ads and search advertising management — including the older AdWords-style search demand people still look for.' },
      { heading: 'Working alongside SEO', body: 'Paid search can sit next to SEO. The SEO service owns organic search; this page owns Google Ads.' },
    ],
    processHeading: 'How we work',
    process:
      'We build marketing around business goals, audience, and growth stage rather than a fixed package. Campaign structure follows the offer and the search demand — not a generic template.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'What to look for in a Google Ads agency',
    why: 'Look for a team that separates Google Search from Facebook and Instagram, can explain how ads relate to the site and lead capture, and does not sell guaranteed ROAS.',
    faqs: [
      {
        question: 'How much does Google Ads management cost?',
        answer:
          'We do not list a public retainer or media-fee schedule here. Cost depends on media budget and scope. A consultation is the place to talk numbers.',
      },
      {
        question: 'What should I look for in a Google Ads agency?',
        answer:
          'Ask how they structure search campaigns, how they work with the website and lead flow, and how they keep Google Ads separate from Meta ads. You should hear a plan, not a ranking or ROAS guarantee.',
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
      'Meta Ads at Vridhio means Facebook Ads and Instagram Ads management in India. Paid social sits here. Organic social management sits on social media marketing. Google Search ads sit on Google Ads.',
    overviewHeading: 'What we help with',
    overview:
      'Paid social advertising on Meta: Facebook advertising and Instagram Ads management. Highly targeted Facebook and Instagram ads based on behavior and interests are in scope as capability — not as a named case-study result.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      { heading: 'What Meta Ads are', body: 'Paid placements across Facebook and Instagram, managed as one Meta ads service.' },
      { heading: 'Facebook Ads vs Instagram Ads', body: 'Same network, different placements and creative. We treat them as one paid-social service, not two websites.' },
      { heading: 'Paid social vs organic social', body: 'Buying ads is this page. Day-to-day social management is the social media marketing service.' },
    ],
    processHeading: 'How we work',
    process:
      'We build marketing around business goals, audience, and growth stage rather than a fixed package. Creative and targeting follow the offer.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'Why keep Meta Ads off Google Ads',
    why: 'Search intent and social intent are different. Mixing them in one “ads” page would blur keyword ownership. Google Ads stays on its own URL.',
    faqs: [
      {
        question: 'What are Meta Ads?',
        answer:
          'Paid ads delivered through Meta, mainly Facebook and Instagram. That is this service — not Google Search ads.',
      },
      {
        question: 'Facebook Ads vs Instagram Ads?',
        answer:
          'Both run through Meta. Placement, creative, and audience can differ. We manage them as one Meta Ads service rather than two separate sites.',
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
      'Strategy, content planning, creative direction, and ongoing social management — distinct from Meta Ads buying.',
    h1: 'Social Media Marketing and Management',
    intro:
      'A social media marketing agency engagement at Vridhio covers strategy, content planning, creative direction, and ongoing management. Paid Instagram or Facebook ads are Meta Ads. Video cuts are video editing. Brand systems are graphic design.',
    overviewHeading: 'What we help with',
    overview:
      'We can handle strategy, content planning, creative direction, and ongoing management depending on what the business needs. India-based businesses are in scope; we are not building city social pages.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      { heading: 'Strategy and management', body: 'Social media management services: planning and running the accounts with a point of view.' },
      { heading: 'Instagram (organic)', body: 'Instagram marketing as organic presence and community — not Instagram Ads buying.' },
      { heading: 'Community', body: 'Community building as part of management, not a vanity-follower promise.' },
      {
        heading: 'Creator collaborations when they fit',
        body: 'Influencer outreach, campaign management, creator partnerships, and brand collaborations can support social — they are not a separate top-level service URL.',
      },
    ],
    processHeading: 'How we work',
    process:
      'We build marketing around business goals, audience, and growth stage rather than a fixed package. Creative vs management is split honestly: we design and edit on those services when the work is production, not posting.',
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'How social can support growth',
    why: 'Social can explain the offer, stay in conversation with buyers, and support demand you create elsewhere. It is not a substitute for SEO, Google Ads, or a working website.',
    faqs: [
      {
        question: 'How can social media help grow a business?',
        answer:
          'It can keep the offer visible, support community, and carry content that matches campaigns. It works best next to a clear website and, when needed, paid or search demand — not as the only growth plan.',
      },
      {
        question: 'What should I ask a social media marketing agency?',
        answer:
          'Ask what they manage vs what they design or advertise, whether Instagram ads are included (here they are not — that is Meta Ads), and how they measure usefulness without follower guarantees.',
      },
    ],
    relatedIds: ['meta-ads', 'graphic-design', 'video-editing', 'lead-generation'],
  },
  'lead-generation': {
    seoTitle: 'Lead Generation Services | Vridhio',
    seoDescription:
      'Funnels, qualification, CRM follow-up, and outreach systems that turn demand into pipeline — not a generic AI chatbot page.',
    h1: 'Lead Generation for Qualified Pipeline',
    intro:
      'Lead generation services at Vridhio mean funnels, qualification, CRM follow-up, appointment setting, and outreach systems. AI chatbots can help qualify — that tooling lives under AI automation. This page is the commercial lead-generation service.',
    overviewHeading: 'What we help with',
    overview:
      'Sales funnel systems designed to improve how demand becomes pipeline: offers, capture, nurturing, and routing. We do not sell guaranteed meeting volume.',
    capabilitiesHeading: 'What this service covers',
    capabilities: [
      { heading: 'B2B lead generation and pipeline', body: 'Business lead generation focused on qualified pipeline, not raw form dumps.' },
      { heading: 'Funnels and offers', body: 'Sales funnels and high-converting offers that match the actual product.' },
      { heading: 'Qualification and CRM', body: 'Lead nurturing, CRM systems, and routing so a lead has an owner.' },
      { heading: 'Appointment setting and outreach', body: 'Appointment setting and outreach systems as part of this service — not as a standalone AI calling page.' },
    ],
    processHeading: 'How we work',
    process: CONSULTATION,
    whoForHeading: 'Who this is for',
    whoFor: INDUSTRIES,
    whyHeading: 'Agency vs in-house, and why quality matters',
    why: 'In-house sales still needs a system that feeds it. An agency can build capture, qualification, and follow-up. Lead quality matters because volume without fit wastes the team. AI automation can support qualification; it does not replace this service.',
    faqs: [
      {
        question: 'What is B2B lead generation?',
        answer:
          'Finding and qualifying businesses that might buy, then getting them into a pipeline with an owner and a next step — not collecting emails with no follow-up.',
      },
      {
        question: 'Lead generation agency vs in-house sales?',
        answer:
          'In-house sales closes. Lead generation work builds the system that feeds them. We do not claim to replace an in-house team.',
      },
      {
        question: 'Why does lead quality matter?',
        answer:
          'Unqualified volume creates busywork. Qualification, routing, and nurturing are how demand becomes conversations worth having.',
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
