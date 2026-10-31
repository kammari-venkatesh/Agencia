/**
 * Guide article copy keyed by GuideId.
 * Inline service links use [[service-id]] or [[service-id|anchor text]].
 */

import { buildGuidePageSeo, type PageSeo } from '../seo/site'
import { getGuideBySlug, type GuideId } from './guides'
import { getServiceById, serviceHref, type ServiceId } from './services'

export type GuideFaq = {
  question: string
  answer: string
}

export type GuideTable = {
  headers: string[]
  rows: string[][]
}

export type GuideSection = {
  heading: string
  body?: string
  bullets?: string[]
  table?: GuideTable
  /** Shown immediately after the table (e.g. pricing disclaimer). */
  afterTable?: string
  subsections?: {
    heading: string
    body?: string
    bullets?: string[]
  }[]
}

export type GuidePageCopy = {
  seoTitle: string
  seoDescription: string
  h1: string
  intro: string
  sections: GuideSection[]
  faqs: GuideFaq[]
  relatedIds: ServiceId[]
  /** Optional bottom CTA band; falls back to the default “Start a project” copy. */
  ctaBand?: {
    heading: string
    body: string
  }
}

const GUIDE_PAGE_COPY: Record<GuideId, GuidePageCopy> = {
  'website-development-cost-india': {
    seoTitle: 'Website Development Cost in India | Vridhio',
    seoDescription:
      'Website development cost in India depends on scope — pages, design, features, and maintenance — not a published rate. Learn what to compare in a quote.',
    h1: 'Website development cost in India',
    intro:
      'Website development cost in India is driven by scope, not a single published price. A business site, an ecommerce store, and a landing page are different jobs — and quotes only become comparable when you know what is included in development, design, content, third-party tools, and ongoing maintenance.',
    sections: [
      {
        heading: 'What determines website development cost',
        body: 'Price follows the work required to design, build, launch, and keep the site usable. Two proposals that look similar on a one-line fee can hide very different page counts, design depth, integrations, and post-launch support.\n\nThis guide explains the cost drivers. It does not publish Vridhio rates or invented INR tables. For how we approach the commercial work, see [[website-development]].',
      },
      {
        heading: 'Business website vs ecommerce vs landing page',
        body: 'Scope starts with what the site has to do.',
        subsections: [
          {
            heading: 'Landing page',
            body: 'Usually a focused campaign or offer page: one message, one primary action, limited navigation. Cost is typically lower because there are fewer templates, content types, and conversion paths to design and test.',
          },
          {
            heading: 'Business or corporate website',
            body: 'Needs a clear information architecture: home, about, services or products, contact, and often supporting pages. Cost rises with the number of unique layouts, content types, and enquiry or booking flows.',
          },
          {
            heading: 'Ecommerce',
            body: 'Adds catalogue structure, product detail, cart, checkout, and usually payment and order handling. That is a different class of build from a brochure site, even if both are “a website.”',
          },
        ],
      },
      {
        heading: 'Design complexity',
        body: 'A small set of reused layouts costs less than many unique page designs, custom illustration, or a full visual system. Brand work — logos, colour, type, and still creatives — is often a separate design cost, not “free with the website.” Related brand and layout work lives on [[graphic-design]].',
      },
      {
        heading: 'Number of pages',
        body: 'Page count is a useful starting point, but unique templates matter more than raw numbers. Ten pages that reuse two layouts are not the same job as ten unique layouts. CMS-managed pages, blog templates, and location or product variants also change the work.',
      },
      {
        heading: 'Functional requirements',
        body: 'Forms, booking, gated content, search, multilingual content, user accounts, or custom calculators all add specification, build, and testing. Describe the behaviour you need, not only the page names.',
      },
      {
        heading: 'Integrations',
        body: 'CRM, email, analytics, payment, booking, or inventory connections add discovery, implementation, and failure cases. Each integration has a licence or vendor cost that is not the same as development time.',
      },
      {
        heading: 'Content requirements',
        body: 'Copywriting, photography, product data, and migration from an old site are often underestimated. If the quote assumes you supply all content, missing copy will delay launch or add a content cost later.',
      },
      {
        heading: 'Responsive and mobile requirements',
        body: 'A site that has to work cleanly on phones, tablets, and desktops needs layout, type, and interaction decisions for each breakpoint. “Mobile-friendly” as a checkbox is not the same as designing the primary journey on a small screen.',
      },
      {
        heading: 'Performance requirements',
        body: 'Lean front-end structure, image handling, and careful third-party scripts take extra care. Performance is a requirement you can specify; it is not a guaranteed Lighthouse score unless that is explicitly in scope.',
      },
      {
        heading: 'SEO requirements',
        body: 'Technical and structural SEO — titles, headings, indexable URLs, sensible internal links, and a site that search engines can crawl — belongs in the website build. Ongoing organic work (content, links, local or competitive campaigns) is a different service. That work lives on [[seo]].',
      },
      {
        heading: 'Cost types: development, design, content, tools, and maintenance',
        body: 'Quotes mix several cost types. Keep them separate when you compare.',
        bullets: [
          'Development cost — engineering the templates, behaviour, CMS, and launch.',
          'Design cost — layout, visual system, and UI decisions; sometimes a separate brand engagement.',
          'Content cost — writing, media, product data, and migration.',
          'Third-party and tool costs — domains, hosting, CMS licences, plugins, fonts, analytics, payments.',
          'Maintenance — updates, security, content changes, and small fixes after launch.',
        ],
      },
      {
        heading: 'One-time vs recurring costs',
        body: 'Build and launch are usually one-time (or phased) project fees. Hosting, licences, SSL, backups, and retainers for changes are recurring. A lower project fee that leaves you with unpaid licences or no update plan is not cheaper — it is incomplete.',
      },
      {
        heading: 'Custom development vs a website builder',
        body: 'Builders can be faster and cheaper for a simple presence with limited customization. Custom development makes more sense when conversion paths, integrations, performance control, or future change are part of the job. Custom is not automatically better. A fuller comparison is in [[guide:custom-website-vs-website-builder|custom website vs website builder]].',
      },
      {
        heading: 'Maintenance and ongoing costs',
        body: 'After launch, sites need dependency updates, content edits, form or analytics fixes, and occasional new pages. Ask what is included for 30–90 days after launch, what is billed as change requests, and who owns hosting access.',
      },
      {
        heading: 'Questions to ask before comparing quotes',
        bullets: [
          'What page templates and unique layouts are included?',
          'Who writes and enters content?',
          'Which integrations are in scope, and who owns the vendor accounts?',
          'Is responsive behaviour specified, or assumed?',
          'What SEO structure is included versus later SEO work?',
          'What happens after launch — warranty, training, and change requests?',
          'Which costs are one-time versus licences and hosting?',
        ],
      },
      {
        heading: 'How to evaluate two website proposals',
        body: 'Line up scope, not the bottom-line fee. Compare templates, integrations, content ownership, performance and SEO inclusions, and post-launch support. A proposal that lists assumptions is usually clearer than one that only lists a price.',
      },
      {
        heading: 'When a lower quote can mean lower scope',
        body: 'A lower fee often means fewer unique pages, stock layouts, client-supplied content, no integrations, a builder with limited control, or no maintenance. That can be the right buy if the scope matches. It is a problem when you expected a custom conversion-focused site and received a thin brochure.',
      },
      {
        heading: 'Where this sits with other work',
        body: 'A website can support enquiries with clear CTAs and forms. Full pipeline systems — qualification, CRM follow-up, outreach — live on [[lead-generation]]. Use those links to understand adjacent work, not as a substitute for a scoped website quote.',
      },
    ],
    faqs: [
      {
        question: 'Is there a standard website development cost in India?',
        answer:
          'No. Cost follows scope: site type, pages, design depth, features, integrations, content, and maintenance. A single national average is not a reliable quote.',
      },
      {
        question: 'Why do two agencies quote such different amounts for a “business website”?',
        answer:
          'They are usually pricing different work. One quote may assume a few template pages and client-supplied copy; another may include unique layouts, integrations, content, and post-launch support. Compare the inclusions, not only the fee.',
      },
      {
        question: 'Are hosting, domain, and plugins included in website development cost?',
        answer:
          'Not always. Those are often third-party or recurring costs. Ask which tools are included, which you will pay separately, and who owns the accounts.',
      },
      {
        question: 'Does a cheaper website quote include SEO?',
        answer:
          'Sometimes it includes basic technical structure; sometimes it includes almost none. Ongoing SEO — content, local work, competitive research — is usually separate from the build. Confirm what is in the website scope versus later SEO work.',
      },
      {
        question: 'Should I compare quotes on price per page?',
        answer:
          'Page count is a starting signal, not a complete measure. Unique templates, ecommerce behaviour, integrations, and content work change the job more than a simple page multiplier.',
      },
    ],
    relatedIds: ['website-development', 'graphic-design', 'seo', 'lead-generation'],
  },

  'mobile-app-development-cost-india': {
    seoTitle: 'Mobile App Development Cost in India | Vridhio',
    seoDescription:
      'Mobile app development cost in India depends on platforms, screens, backend, and launch — not a single rate. Learn the cost drivers before you compare quotes.',
    h1: 'Mobile app development cost in India',
    intro:
      'Mobile app development cost in India depends on what the product has to do: platforms, screens, backend and APIs, login, payments, notifications, admin tools, testing, and store launch. There is no honest single price for “an app.” Quotes only become comparable when those pieces are named.',
    sections: [
      {
        heading: 'What determines app development cost',
        body: 'Cost follows product scope and the systems around it. A simple informational app is a different engagement from a product with accounts, payments, and an admin dashboard.\n\nThis guide covers cost drivers, not Vridhio rates, not invented INR ranges, and not claims about a particular framework or cloud vendor. For how we approach the commercial work, see [[app-development]].',
      },
      {
        heading: 'Android vs iOS vs cross-platform',
        body: 'Shipping on one store is not the same job as shipping on two. Native work on each platform, or a shared codebase with platform-specific testing, changes design, engineering, and QA. Cross-platform can reduce duplicated UI work; it does not remove store rules, device testing, or backend cost. Choose platforms from where your users actually are — not from a default stack claim.',
      },
      {
        heading: 'Number and complexity of screens',
        body: 'Screen count is a rough signal. Complex flows — onboarding, search, filters, maps, media, or multi-step checkout — cost more than a handful of static views. Empty states, errors, permissions, and offline behaviour are part of the real screen list.',
      },
      {
        heading: 'Backend and API requirements',
        body: 'If the app stores user data, syncs across devices, or talks to other systems, you need APIs, data models, and environments (development, staging, production). Backend work is often a large share of cost and is easy to omit from a “screens only” quote.',
      },
      {
        heading: 'Authentication',
        body: 'Email, phone, social login, roles, password reset, and session security add specification and testing. “Users can log in” is a feature family, not a single checkbox.',
      },
      {
        heading: 'Payments',
        body: 'In-app purchases, subscriptions, or gateway checkout each have provider rules, receipts, failed payments, and tax or regional constraints. Payment scope should be explicit, including who holds the merchant account.',
      },
      {
        heading: 'Notifications',
        body: 'Push notifications need device permissions, a delivery path, and usually rules for what is sent and when. Email or SMS alongside push is additional integration, not a free extra.',
      },
      {
        heading: 'Admin dashboards',
        body: 'Someone has to manage users, content, orders, or reports. An admin web app is often a separate surface from the mobile client. If it is missing from the quote, operations will still need a way to run the product.',
      },
      {
        heading: 'Integrations',
        body: 'Maps, analytics, CRM, support chat, or third-party APIs add vendor cost, keys, and failure handling. List each integration and who owns the account.',
      },
      {
        heading: 'Testing',
        body: 'Device and OS coverage, regression on each release, and store-review dry runs take time. A quote that skips QA usually shifts that cost into delays or a brittle first release.',
      },
      {
        heading: 'App-store launch requirements',
        body: 'Apple App Store and Google Play each need listing assets, privacy disclosures, review notes, and sometimes additional review for payments or sensitive categories. Launch is a scoped activity, not an afternoon after coding stops.',
      },
      {
        heading: 'Maintenance',
        body: 'OS updates, store policy changes, library updates, and small product fixes are ongoing. Ask what is covered after launch and what is billed as new work.',
      },
      {
        heading: 'MVP vs a larger product',
        body: 'An MVP should still be a usable slice: enough screens, enough backend, and a path to learn from real users. Cutting authentication, crash handling, or store compliance to hit a number is not an MVP — it is an incomplete launch. A larger product adds more roles, more edge cases, and more operational tooling.',
      },
      {
        heading: 'One-time vs ongoing costs',
        body: 'Design and first release are typically project fees. Store developer accounts, cloud hosting, SMS or email vendors, and retainers for updates are recurring. A low build fee with unspecified running costs is incomplete pricing.',
      },
      {
        heading: 'Questions to ask an app development company',
        bullets: [
          'Which platforms are in the first release, and why?',
          'Is backend and admin included, or only the mobile UI?',
          'How are login, payments, and notifications specified?',
          'What devices and OS versions will be tested?',
          'Who handles store listings, privacy labels, and review?',
          'What is included for a period after launch?',
          'Which costs are project fees versus licences and hosting?',
        ],
      },
      {
        heading: 'Related work around an app',
        body: 'Many products also need a marketing site — that lives on [[website-development]]. Operational workflows around the product may sit with [[ai-automation]]. Enquiry and pipeline systems live on [[lead-generation]]. Those are adjacent services, not substitutes for a scoped app quote.',
      },
    ],
    faqs: [
      {
        question: 'Is there a typical mobile app development cost in India?',
        answer:
          'No useful single figure. Cost depends on platforms, screen complexity, backend, integrations, testing, and store launch. Treat published “average app prices” as marketing, not a quote.',
      },
      {
        question: 'Does building for Android and iOS double the cost?',
        answer:
          'Not automatically, and not necessarily half either. Shared work (product design, backend, QA planning) can serve both. Platform-specific UI, testing, and store requirements still add cost. Ask how the team plans to share work without skipping device testing.',
      },
      {
        question: 'Why do MVP quotes vary so widely?',
        answer:
          'Teams define “MVP” differently. Some include accounts, analytics, and store launch; others deliver a few screens with no backend. Compare the user journeys and operational tools included, not the label.',
      },
      {
        question: 'Are app-store fees part of development cost?',
        answer:
          'Developer account fees and store commissions are usually paid to Apple or Google, not to the development team. Launch work (listings, review, assets) may be in the project fee — confirm it.',
      },
      {
        question: 'What ongoing costs should I expect after launch?',
        answer:
          'Hosting or backend usage, third-party APIs, store accounts, and time for OS and library updates. Ask for a plain list of recurring vendors, even if amounts depend on usage.',
      },
    ],
    relatedIds: ['app-development', 'website-development', 'ai-automation', 'lead-generation'],
  },

  'seo-vs-google-ads': {
    seoTitle: 'SEO vs Google Ads: Which Should You Choose? | Vridhio',
    seoDescription:
      'SEO vs Google Ads is not a universal winner. SEO builds organic visibility over time; Google Ads buys placement now. Choose by intent, timeline, and execution.',
    h1: 'SEO vs Google Ads: which should you choose?',
    intro:
      'SEO vs Google Ads is a choice between two different jobs: organic visibility that compounds slowly, and paid search placement you can start (and stop) with budget. There is no universal winner. Fit depends on the business, the query, the offer, the landing page, competition, budget, and execution — not a default “SEO is better” or “ads are faster so ads win.”',
    sections: [
      {
        heading: 'SEO vs Google Ads: short answer',
        body: 'Choose SEO when you can invest in a site and content that deserve to rank, and you can wait for compounding visibility. Choose Google Ads when you need demand captured now on queries people already type, and you can fund clicks plus a page that converts. Use both when organic and paid search support the same offer without pretending one replaces the other.\n\nThis article is a comparison guide, not a substitute for the service pages. Commercial work lives on [[seo]] and [[google-ads]].',
      },
      {
        heading: 'How SEO works',
        body: 'SEO is the work of making relevant pages discoverable and useful for search: technical access, clear structure, content that matches intent, and authority that is earned over time. Results are not instant. Rankings can move down as well as up. SEO does not buy a guaranteed position.',
      },
      {
        heading: 'How Google Ads works',
        body: 'Google Ads lets you bid to show ads on Search (and related Google surfaces you choose to use). You pay when someone clicks (or for other billed events you set up). You can start quickly relative to organic, pause spend, and change targeting. Ads are not automatically better: poor targeting, weak offers, or weak landing pages waste budget.',
      },
      {
        heading: 'Cost model',
        table: {
          headers: ['', 'SEO', 'Google Ads'],
          rows: [
            [
              'How you pay',
              'Usually project or ongoing work on the site, content, and optimisation',
              'Media spend to Google plus management/setup work',
            ],
            [
              'When spend stops',
              'Earned visibility can persist, but it is not permanent',
              'Ads typically stop appearing when budget stops',
            ],
            [
              'What “cheap” often means',
              'Thin content, no technical work, or ranking promises',
              'Low bids on poor queries, or ignoring landing-page quality',
            ],
          ],
        },
        body: 'Neither model has a universal ROI. Cost quality depends on whether the work matches the queries and the offer.',
      },
      {
        heading: 'Time to results',
        body: 'SEO is not instant. Useful movement often takes sustained work; competitive queries take longer. Google Ads can show on eligible queries once campaigns are live and approved — that is speed of appearance, not a guarantee of profitable customers.',
      },
      {
        heading: 'Intent',
        body: 'Both can target people with search intent, but the mechanism differs. SEO tries to earn the organic listing for that intent. Ads rent placement next to (or above) those results. If nobody searches for your offer, neither search SEO nor search ads will invent that demand.',
      },
      {
        heading: 'Control',
        body: 'Ads give faster control over copy, bids, schedules, and which queries trigger a listing (within Google’s policies). SEO gives less day-to-day control: you influence pages and reputation; you do not set the rank. Algorithm and competitor moves are outside a switch you can flip.',
      },
      {
        heading: 'Sustainability',
        body: 'SEO can keep sending visits after a given month’s work, if the pages stay relevant and the site stays healthy. That is not a perpetual machine without maintenance. Ads are sustainable only while budget, conversion, and account quality hold. Neither is “set and forget.”',
      },
      {
        heading: 'Measurement',
        body: 'Ads usually give clearer click and conversion reporting inside the ad platform, still dependent on tracking setup. SEO measurement is slower and noisier: rankings, organic landings, and assisted conversions. Do not treat last-click ads data or a single keyword rank as the full story.',
      },
      {
        heading: 'When SEO makes sense',
        bullets: [
          'You have (or will build) pages that genuinely answer the query.',
          'You can wait for compounding visibility rather than only next-week leads.',
          'The offer is searchable and the site can be crawled and understood.',
          'You are willing to treat content and technical quality as ongoing work.',
        ],
      },
      {
        heading: 'When Google Ads makes sense',
        bullets: [
          'People already search for the problem or offer, and you can pay to appear now.',
          'You have a landing page and follow-up path ready for the click.',
          'You need demand while organic visibility is still being built.',
          'You can watch query quality and stop spend that does not fit.',
        ],
      },
      {
        heading: 'When using both makes sense',
        body: 'Both make sense when the same offer has search demand, the site can support organic pages, and ads can cover high-intent queries or tests while SEO compounds. Using both is not “double spend for its own sake.” It is two channels with different time profiles. Do not pause SEO the week ads go live, or starve ads because a blog post ranked once.',
      },
      {
        heading: 'Common mistakes',
        bullets: [
          'Treating SEO as instant or ads as automatically profitable.',
          'Sending ads to a homepage that does not match the query.',
          'Buying cheap SEO that only promises rankings.',
          'Comparing channels on one week of data.',
          'Ignoring the offer, sales follow-up, and page quality.',
        ],
      },
      {
        heading: 'Decision framework',
        body: 'Start with the query and the offer, not the channel brand. If search demand exists and you need pipeline this month, ads are usually the faster on-switch — if the page converts. If you can invest in durable pages and the queries are worth owning, SEO belongs in the plan. If both are true, sequence them: ads for learning and capture, SEO for compounding, measured separately without a fake universal ROI winner.',
      },
    ],
    faqs: [
      {
        question: 'Is SEO cheaper than Google Ads?',
        answer:
          'Not in a way you can declare in advance. SEO is mostly work cost; ads add media spend. Cheap SEO that does not match intent is wasted work. Efficient ads on the wrong landing page are wasted media. Compare total cost against qualified demand, not a channel slogan.',
      },
      {
        question: 'Should a new website start with SEO or Google Ads?',
        answer:
          'A new site can do technical and structural SEO from day one, but organic results are rarely immediate. Ads can capture existing search demand sooner if budget and a relevant page exist. Many businesses use ads while the site is still earning organic visibility.',
      },
      {
        question: 'Can Google Ads replace SEO?',
        answer:
          'Ads can replace some pipeline that organic search might have provided, but only while you pay. They do not replace a crawlable, useful site. Stopping ads typically stops those clicks; SEO is a different asset with different risks.',
      },
      {
        question: 'Do I need both SEO and Google Ads?',
        answer:
          'Only if both match how people look for your offer and you can execute both without starving one. Some businesses are ads-first; some are organic-first. Neither is required by default.',
      },
      {
        question: 'Which has better ROI, SEO or Google Ads?',
        answer:
          'There is no universal answer. ROI depends on query competition, conversion rate, follow-up, and how well the work is done. Anyone promising a fixed ROI for either channel is overselling.',
      },
    ],
    relatedIds: ['seo', 'google-ads'],
  },

  'google-ads-vs-meta-ads': {
    seoTitle: 'Google Ads vs Meta Ads: Which Is Better? | Vridhio',
    seoDescription:
      'Google Ads captures search demand; Meta Ads uses audience and creative for discovery. Neither has universal ROI. Choose by intent, funnel stage, and execution.',
    h1: 'Google Ads vs Meta Ads: which is better for your business?',
    intro:
      'Google Ads vs Meta Ads is not a contest with one winner. Google Search captures people who are already looking. Meta (Facebook and Instagram paid social) reaches people through audience signals and creative — closer to demand creation than to typing a query. Which fits depends on whether your buyer searches first, whether you can fund and test creative, and where they are in the funnel. Neither platform universally has better ROI.',
    sections: [
      {
        heading: 'Google Ads vs Meta Ads: short answer',
        body: 'Use Google Ads (especially Search) when people already search for the problem or offer and you can send them to a matching page. Use Meta Ads when you need to introduce the offer to people who are not searching right now, and you can support that with creative and a clear next step. Use both when search capture and social discovery support the same funnel without mixing their jobs.\n\nCommercial work lives on [[google-ads]] and [[meta-ads]].',
      },
      {
        heading: 'Search intent vs audience targeting',
        body: 'Search starts from a query: the person has expressed intent in words. Paid social starts from who you choose to reach (and who the system finds similar), plus whether the creative earns the stop. That is a different targeting primitive. Do not treat a Meta interest as equivalent to a Google search term.',
      },
      {
        heading: 'Demand capture vs demand creation',
        body: 'Google Search is primarily demand capture: you show up when the demand is already typed. Meta is primarily paid social discovery: you interrupt or accompany a feed with a message. You can generate some demand with search ads on broader queries, and you can retarget people who already know you on either platform. The default jobs remain different.',
      },
      {
        heading: 'Search campaigns',
        body: 'Search campaigns bid on queries (and related matching you configure). Success depends on query quality, ad relevance, and the landing page. If the query volume for your offer is thin, Search cannot invent it.',
      },
      {
        heading: 'Facebook and Instagram paid social',
        body: 'Meta Ads place creative in feeds, stories, and related placements you enable. Success depends more on the hook, visual, offer, and audience definition than on a typed keyword. Weak creative on a “perfect” audience still underperforms.',
      },
      {
        heading: 'Creative requirements',
        body: 'Search ads are mostly copy constrained by character limits and extensions. Meta typically needs images or video, variations, and a reason to stop scrolling. Creative production is part of Meta cost even when media spend looks similar.',
      },
      {
        heading: 'Audience targeting',
        body: 'Google Search targeting is dominated by the query (plus location, device, and related campaign settings). Meta targeting is audience- and behaviour-led, with platform policies and automation that change over time. Privacy and signal loss affect both; they do not make the platforms the same.',
      },
      {
        heading: 'Funnel stage',
        table: {
          headers: ['Stage', 'Often a better first fit'],
          rows: [
            ['Already searching for the offer', 'Google Search'],
            ['Does not know you yet; needs a story', 'Meta paid social'],
            ['Visited the site; needs a reminder', 'Either, via remarketing if set up'],
            ['Ready to compare vendors', 'Often Search; Meta can still assist with proof-led creative'],
          ],
        },
        body: 'Funnel labels are a planning aid, not a rule that one platform “owns” a stage forever.',
      },
      {
        heading: 'Landing pages',
        body: 'Search clicks should land on a page that matches the query. Meta clicks should land on a page that continues the creative’s promise. Sending both to a generic homepage is a common way to waste budget on either platform.',
      },
      {
        heading: 'Measurement',
        body: 'Each platform reports its own conversions using its own attribution window. Those numbers are not automatically comparable, and they are not automatically “ROI.” Use them as directional, aligned to the same business events (enquiry, purchase) rather than as a verdict that one UI has better ROI.',
      },
      {
        heading: 'Budget considerations',
        body: 'Search budgets fight auction prices on those queries. Meta budgets fight attention and creative fatigue. A small budget split across both without enough data on either is often worse than doing one channel properly. There is no honest global “minimum CPC” to publish here.',
      },
      {
        heading: 'When Google Ads fits',
        bullets: [
          'The offer is searchable and you can cover the important queries.',
          'You need capture more than a brand story in the feed.',
          'You can match ad copy to a specific landing page.',
        ],
      },
      {
        heading: 'When Meta Ads fits',
        bullets: [
          'You can show the offer visually and test creative.',
          'Buyers may not search first, or search volume is thin.',
          'You have a clear next step after the click (lead form, shop, booking).',
        ],
      },
      {
        heading: 'When both fit',
        body: 'Both fit when you have search demand to capture and a story worth showing in social, plus enough budget and operations to run two measurement systems without mixing their jobs. Remarketing can connect them. That is coordination, not a claim that stacking platforms always raises ROI.',
      },
      {
        heading: 'Decision framework',
        body: 'Ask: does the buyer type this into Google before they buy? If yes, Search belongs in the plan. Ask: do we need people who are not searching yet, and can we earn the stop with creative? If yes, Meta belongs in the plan. If only one is true, start there. Do not pick a platform because a generic article said it has better ROI.',
      },
    ],
    faqs: [
      {
        question: 'Is Google Ads better than Meta Ads?',
        answer:
          'Not universally. Google Search is stronger when intent is typed. Meta is stronger when you must create attention with audience and creative. Better is about fit and execution, not a platform trophy.',
      },
      {
        question: 'Can Meta Ads replace Google Search ads?',
        answer:
          'Only if your buyers do not search, or you accept that you are no longer capturing typed demand. Social can generate demand; it does not automatically show you to people who just searched your category.',
      },
      {
        question: 'Which is cheaper, Google Ads or Meta Ads?',
        answer:
          'Cheap clicks are not the goal. Cost per useful action depends on auction, creative, and conversion. Published average CPCs are not a decision tool for your account.',
      },
      {
        question: 'Do I need both Google Ads and Meta Ads?',
        answer:
          'Only if both jobs exist in how you acquire customers and you can operate both. Many businesses start with one channel and add the second when the first is stable.',
      },
      {
        question: 'Should a local business always start with Google Ads?',
        answer:
          'Local businesses often have search demand (“near me,” service + city), which can make Search a natural fit — if the page and follow-up work. It is not a rule. Some local offers are discovered more through social proof and creative.',
      },
    ],
    relatedIds: ['google-ads', 'meta-ads'],
  },

  'custom-website-vs-website-builder': {
    seoTitle: 'Custom Website vs Website Builder | Vridhio',
    seoDescription:
      'A website builder can be enough for a simple site. Custom development fits when you need control, integrations, or specific conversion paths.',
    h1: 'Custom website vs website builder: which should you choose?',
    intro:
      'A website builder can be enough when you need a simple, maintainable presence quickly. Custom website development makes more sense when you need specific conversion paths, integrations, performance control, or room to change how the site behaves. Custom is not automatically better. The right choice is the one whose limits you can live with.',
    sections: [
      {
        heading: 'Short answer',
        body: 'Pick a builder if the templates, plugins, and hosting model cover your pages and you are comfortable with the platform’s constraints. Pick custom development when the site is part of how you sell — unusual flows, cleaner performance control, or integrations that templates fight. Many businesses start on a builder and move later; that migration is a project, not a settings toggle.\n\nHow we approach custom commercial sites is on [[website-development]].',
      },
      {
        heading: 'What a website builder is',
        body: 'A website builder is a hosted or installable product where you assemble pages from themes, sections, and apps. You trade some flexibility for speed and a familiar editor. The vendor or the theme author decides a lot of what is easy versus painful.',
      },
      {
        heading: 'What custom development means',
        body: 'Custom development means specifying structure, design, and behaviour for this business, then implementing it in a stack chosen for that job. “Custom” is not a synonym for expensive decoration. It can still use a CMS. It should not mean inventing a unique framework for its own sake.',
      },
      {
        heading: 'Cost considerations',
        body: 'Builders often look cheaper at the start: subscription plus a theme. Cost shows up later in apps, transaction fees, designer hours fighting the theme, or a rebuild when you outgrow it. Custom often costs more up front and can cost less in workarounds if the scope was honest. Neither path has a universal price. Brand and layout systems that support either path may sit with [[graphic-design]].',
      },
      {
        heading: 'Speed',
        body: 'Builders usually launch a first version faster if you accept the template. Custom takes longer because structure and behaviour are specified. Fast-and-wrong is still wrong: a builder site with no offer or no mobile care is not “done.”',
      },
      {
        heading: 'Flexibility',
        body: 'Builders are flexible inside the product’s model. Unusual booking flows, data views, or integrations may require apps, custom code on top, or a dead end. Custom is flexible where you invested in it — and rigid where you did not budget for it.',
      },
      {
        heading: 'Design',
        body: 'Builders can look excellent with a well-chosen theme and restraint. They struggle when every page needs a one-off composition. Custom design is worth it when the layout is part of conversion, not when you only wanted a different header colour.',
      },
      {
        heading: 'Integrations',
        body: 'Builders integrate well with popular apps on that platform. Unusual CRMs, internal tools, or data models may need custom work or may not be viable. List the systems the site must talk to before you choose the platform.',
      },
      {
        heading: 'Maintenance',
        body: 'Builders shift a lot of maintenance to the vendor (hosting, some updates). You still maintain content, apps, and theme changes. Custom sites need a plan for hosting, updates, and security. “No maintenance” is not a real option on either path.',
      },
      {
        heading: 'Performance',
        body: 'Either approach can be fast or slow. Builders accumulate scripts and sections; custom sites accumulate features. Performance is a requirement you set and test, not a trophy that only custom automatically wins.',
      },
      {
        heading: 'SEO considerations',
        body: 'Search engines care about crawlable pages, clear structure, speed, and useful content. Builders can be fine if URLs, titles, and content are sensible. Custom can be better when you need control over templates and internals — and worse if the build ignores basics. SEO is not won by the label “custom.”',
      },
      {
        heading: 'Ownership and control',
        body: 'Ask who owns the domain, the content export, the design files, and the billing. Some builders make export painful. Custom does not automatically mean you own everything unless contracts and repositories say so. Control is a contract and access question.',
      },
      {
        heading: 'When a builder is enough',
        bullets: [
          'A straightforward brochure or simple store that fits the platform.',
          'You need to publish soon and can live with theme limits.',
          'Your team will edit pages in that editor without fighting it weekly.',
          'Integrations you need are first-class on that platform.',
        ],
      },
      {
        heading: 'When custom development makes sense',
        bullets: [
          'Conversion paths, data, or integrations do not fit templates.',
          'You need performance, accessibility, or structural control beyond theme knobs.',
          'The site will change in ways apps and page builders keep blocking.',
          'You have a realistic budget and a maintainer after launch.',
        ],
      },
      {
        heading: 'Decision checklist',
        bullets: [
          'What must the site do in the first 90 days versus “someday”?',
          'Which integrations are mandatory on day one?',
          'Who will edit content, and in what tool?',
          'Can we export content and design if we leave the platform?',
          'Is the extra cost of custom paying for behaviour we will actually use?',
          'Do we have hosting and update ownership either way?',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is a custom website always better than a website builder?',
        answer:
          'No. Custom is better when you need behaviour or control the builder cannot provide at a sensible cost. A builder is better when its limits match the job and you value speed and a known editor.',
      },
      {
        question: 'Can I start on a builder and move to custom later?',
        answer:
          'Yes, and it is common. Plan for content export, URL mapping, and a rebuild of templates. It is a project. Do not assume a one-click migration.',
      },
      {
        question: 'Are website builders bad for SEO?',
        answer:
          'Not automatically. Poor structure, thin content, and slow pages are bad for SEO on any stack. Builders add a risk of plugin bloat and awkward URLs — which you can often avoid with care.',
      },
      {
        question: 'Does custom development mean a fully unique design?',
        answer:
          'Not necessarily. Custom can reuse a design system and a CMS. The point is control over structure and behaviour, not novelty for its own sake.',
      },
      {
        question: 'Which option is cheaper long term?',
        answer:
          'It depends on apps, transaction fees, designer workarounds, and how often you outgrow the setup. Compare a two-year view of licences plus labour, not only the month-one invoice.',
      },
    ],
    relatedIds: ['website-development', 'graphic-design'],
  },

  'seo-cost-india': {
    seoTitle: 'SEO Cost in India (2026): Pricing, Packages & Guide | Vridhio',
    seoDescription:
      'Explore SEO costs in India in 2026, including monthly pricing, one-time audits, service deliverables and factors that affect your SEO budget.',
    h1: 'How Much Does SEO Cost in India in 2026?',
    intro:
      'SEO cost in India in 2026 depends on your website size, competition, target locations, technical condition, content needs, and how much work a provider includes. Indicative monthly packages often fall somewhere between a few thousand rupees for limited freelancer work and well over a lakh for competitive or enterprise campaigns. The ranges below are editorial estimates for planning — not Vridhio’s prices, fixed market rates, or ranking guarantees.',
    sections: [
      {
        heading: 'How much does SEO cost in India in 2026?',
        body: 'Most small businesses and startups in India pay for SEO as a monthly engagement, because search results, competitors, and your own site keep changing. A clinic in Hyderabad targeting one city is a different job from a national SaaS site or an ecommerce catalogue with thousands of URLs.\n\nUse the table as a planning overview. Ranges overlap because freelancers, local specialists, and agencies sell different deliverables, experience levels, and hours of work. For how Vridhio approaches commercial SEO scope — without a published rate card — see [[seo|SEO services]].',
        table: {
          headers: ['SEO provider / scope', 'Indicative monthly price', 'Typical fit'],
          rows: [
            [
              'Freelancer / basic SEO',
              '₹5,000–₹25,000',
              'Very small websites and limited requirements',
            ],
            [
              'Local SEO / single location',
              '₹8,000–₹25,000',
              'Local service businesses',
            ],
            [
              'Small or mid-sized agency',
              '₹15,000–₹50,000',
              'Small businesses and early-stage startups',
            ],
            [
              'Growth-focused SEO',
              '₹40,000–₹1,00,000',
              'Growing businesses targeting multiple services or markets',
            ],
            [
              'Competitive / enterprise SEO',
              '₹80,000–₹2,00,000+',
              'Large websites, e-commerce and competitive national markets',
            ],
          ],
        },
        afterTable:
          'These prices are indicative estimates based on publicly published Indian SEO pricing guides available in 2026. They are not fixed market rates, a guarantee of service quality, or Vridhio\'s own pricing. Actual costs vary by provider, website condition, competition, deliverables, content requirements and project scope. GST and third-party expenses may be additional where applicable. Vridhio provides customised quotations after understanding your requirements.',
      },
      {
        heading: 'What do you get at different SEO budgets?',
        body: 'Price should buy a clear scope of work — not a promise of first-page rankings. Exact deliverables depend on the agreement and your site. The bands below describe what businesses in India often receive at different budgets; they are not Vridhio packages and they do not fix numbers of backlinks, articles, or keywords.',
        subsections: [
          {
            heading: 'Lower budgets (roughly freelancer or limited local work)',
            body: 'You may get a basic review of titles and headings, limited keyword research, a short list of on-page fixes, light local profile checks if you serve one city, and simple monthly reporting. Deep technical rewrites, large content programmes, and competitive authority work are usually out of scope at this level.',
          },
          {
            heading: 'Mid-range agency budgets',
            body: 'Proposals often include structured keyword research, competitor review, technical SEO checks and prioritised fixes, on-page optimisation across key templates, a content plan (sometimes with writing included, sometimes recommendations only), local SEO where relevant, and regular performance reporting. Ask what is written versus only advised.',
          },
          {
            heading: 'Growth and competitive budgets',
            body: 'Higher fees usually fund more URLs, more content and editorial review, stronger technical cooperation with developers, broader location or service coverage, and more deliberate authority-building or digital PR. Ecommerce and national campaigns also need more measurement and iteration. If the site itself is weak, [[website-development]] work may sit alongside SEO rather than inside the SEO line.',
          },
        ],
        bullets: [
          'Basic SEO audits and on-page optimisation — depth scales with fee and site size.',
          'Technical SEO checks and fixes — depends on CMS access and how broken the current build is.',
          'Keyword research and content planning — often the largest ongoing cost when writing is included.',
          'Competitor analysis — useful when it maps to your pages, not a generic slide deck.',
          'Local SEO — profiles, location relevance, and pages that match nearby search intent.',
          'Reporting and monitoring — Search Console, analytics, and honest progress reviews.',
          'Authority-building — only where it fits the strategy; quality and relevance matter more than volume.',
        ],
      },
      {
        heading: 'SEO cost by business type',
        body: 'The same “SEO” label covers very different scopes. Use business type as a starting filter, then confirm cities, pages, and deliverables in the proposal.',
        subsections: [
          {
            heading: 'SEO cost for small businesses',
            body: 'A local service business — for example a clinic, salon, tutoring centre, or home-services firm in Hyderabad, Vijayawada, or another Indian city — often needs a focused set of service pages, accurate local presence, and steady on-page work. Mid-range local or small-agency retainers are a common fit when the site is small and the geography is limited. Thin city-page factories are not a substitute for useful pages.',
          },
          {
            heading: 'SEO cost for startups',
            body: 'Early-stage startups usually need a solid foundation: crawlable structure, clear positioning pages, keyword priorities that match the product, and a realistic content plan. A smaller site can start with a focused retainer or a project that sets the foundation, then expand. Burning budget on national head terms before the product story is clear rarely helps.',
          },
          {
            heading: 'SEO cost for growing service businesses',
            body: 'Agencies, B2B services, and multi-offer firms often add more service URLs, comparison or guide content, and stronger competitor pressure. Growth-focused retainers make sense when you are expanding into more cities in Telangana, Andhra Pradesh, or other major metros, or when paid search already shows demand you want to win organically over time — see [[google-ads]] for the paid channel.',
          },
          {
            heading: 'SEO cost for e-commerce businesses',
            body: 'Catalogues with hundreds or thousands of product and category URLs need more technical SEO (indexation, faceted navigation, duplicates, speed cooperation) and more templated content work. Expect higher fees than a brochure site. Scope should name which templates and marketplaces are in or out.',
          },
          {
            heading: 'SEO cost for multi-location and national businesses',
            body: 'Multiple cities or a national footprint means more location or service combinations, stronger competitors, and more content and measurement. Competitive or enterprise bands are more realistic than a single-location local package. Each extra market should be deliberate — not dozens of near-duplicate pages.',
          },
        ],
      },
      {
        heading: 'One-time SEO cost vs monthly SEO cost',
        body: 'One-time work diagnoses or remediates a defined problem. Monthly SEO is continuous optimisation: measurement, new content, technical follow-through after releases, and response to competitors. An audit is not the same as doing the fixes. Migration support is usually scoped to a launch window, not a forever retainer.\n\nWebsite rebuilds also change SEO cost and risk — for build pricing context, see [[guide:website-development-cost-india|Website Development Cost in India]].',
        table: {
          headers: ['SEO service', 'Indicative cost'],
          rows: [
            ['Basic SEO audit', '₹5,000–₹15,000'],
            ['Detailed SEO audit', '₹15,000–₹50,000'],
            ['Technical SEO implementation', '₹15,000–₹80,000+'],
            ['Website migration SEO support', 'Scope-based quotation'],
          ],
        },
        afterTable:
          'These prices are indicative estimates based on publicly published Indian SEO pricing guides available in 2026. They are not fixed market rates, a guarantee of service quality, or Vridhio\'s own pricing. Actual costs vary by provider, website condition, competition, deliverables, content requirements and project scope. GST and third-party expenses may be additional where applicable. Vridhio provides customised quotations after understanding your requirements.',
        subsections: [
          {
            heading: 'When a one-time project makes sense',
            body: 'You need a clear diagnosis, a migration checklist, or a defined technical cleanup before deciding on a retainer. Ask what deliverable you get and who implements changes on the live site.',
          },
          {
            heading: 'When monthly SEO makes sense',
            body: 'You want ongoing organic demand, content production, and iteration. Search results move; a three-month burst without a plan for change is a project, not a finished channel. Paid search can cover demand while organic work is still early — that is separate from SEO scope honesty.',
          },
        ],
      },
      {
        heading: 'Factors that determine SEO pricing',
        body: 'Providers quote differently because the work differs. Useful proposals map price to these drivers with examples from your site — not a generic difficulty score.',
        subsections: [
          {
            heading: 'Keyword competition',
            body: 'Ranking for a niche service query in one city is a different job from competing for broad commercial terms where national brands already dominate. Higher competition usually means more content quality, technical polish, and time.',
          },
          {
            heading: 'Website size and technical condition',
            body: 'A 10-page brochure site and a 10,000-URL catalogue are not priced the same. Crawl errors, slow templates, duplicate URLs, and missing analytics access all add hours before “SEO content” can help.',
          },
          {
            heading: 'Number of target locations',
            body: 'One city versus many metros changes page count, local profile work, and reporting. Expanding from Hyderabad-only to pan-India should be a scoped decision, not an automatic upsell of thin location URLs.',
          },
          {
            heading: 'Content creation requirements',
            body: 'If the site cannot answer the query, rankings are unlikely. Briefs, drafts, edits, and expert review are often the largest ongoing line. Confirm whether writing is included or only “content recommendations.”',
          },
          {
            heading: 'Technical development requirements',
            body: 'Some fixes need developers — redirects, template changes, Core Web Vitals cooperation, structured data that stays truthful. Slow access or a brittle CMS raises cost and timeline.',
          },
          {
            heading: 'Competitor strength',
            body: 'Strong incumbents with deep content and authority raise the bar. Niche service pages with weak competition can move with a smaller, focused scope.',
          },
          {
            heading: 'Link acquisition and digital PR',
            body: 'Relevant mentions and links can support competitive topics, but bulk directory submissions and paid junk links are not a substitute for useful pages. Ask what methods are used and what is excluded.',
          },
          {
            heading: 'Reporting and ongoing strategy',
            body: 'Honest reporting covers Search Console, analytics, work completed, and next priorities — without fake traffic forecasts. Strategy time is part of what you pay for on a retainer.',
          },
        ],
      },
      {
        heading: 'Cheap SEO vs professional SEO',
        body: 'A lower fee is not automatically bad — a small site with a clear owner and limited goals can succeed with focused, honest work. Problems start when the price only works by skipping site-specific work or selling rankings.\n\nWatch for automated reports with little implementation, bulk directory submissions, poor-quality link schemes, duplicate or AI-generated pages published without editorial review, no technical SEO access, no clear reporting, and guaranteed ranking promises. Compare deliverables, methodology, experience, and accountability — not the monthly headline alone.',
      },
      {
        heading: 'How much should your business spend on SEO?',
        body: 'Match spend to reality, not to the highest package on a sales sheet.',
        bullets: [
          'Current website condition — Fix critical technical and conversion issues before funding a large content programme.',
          'Business objectives — Enquiries, qualified demos, or store purchases each imply different pages and measurement.',
          'Competition — If strong brands already own your head terms, plan a longer horizon or a narrower query set.',
          'Target locations — One city can justify a local-focused budget; national coverage needs more content and usually a higher band.',
          'Available budget — If funds are limited, narrow URLs and queries rather than buying a pretend full-market campaign.',
          'Expected deliverables — Know who writes, who implements technical changes, and what is out of scope (ads, redesign, PR).',
        ],
      },
      {
        heading: 'How long does SEO take?',
        body: 'SEO is an ongoing process, not a one-week switch. Timing depends on website condition, competition, content quality, unresolved technical issues, how consistently work is implemented, and how much authority the domain already has.\n\nEarly months often emphasise diagnosis, technical hygiene, and foundations. Visible organic gains usually take longer on competitive topics. No responsible provider should guarantee first-page rankings or a fixed calendar of positions. Use organic search alongside clear conversion paths — [[lead-generation]] work is separate when visits need to become conversations.',
      },
    ],
    faqs: [
      {
        question: 'How much does SEO cost per month in India?',
        answer:
          'Indicative 2026 editorial ranges often run from about ₹5,000–₹25,000 for limited freelancer or basic work, through roughly ₹15,000–₹50,000 for many small-business agency retainers, and into ₹40,000–₹2,00,000+ for growth or competitive programmes. Your actual quote depends on scope, not a national tariff.',
      },
      {
        question: 'What is the average SEO cost for a small business in India?',
        answer:
          'There is no single reliable average. Many small local businesses plan somewhere in the local or small-agency bands when the site is modest and geography is limited. Treat published “averages” elsewhere as marketing context, then compare the activities in your proposal.',
      },
      {
        question: 'How much does SEO cost for a startup?',
        answer:
          'Startups often need a focused foundation rather than an enterprise retainer: clear pages, technical basics, and a realistic content plan. Cost scales with how many markets and keywords you chase in the first phase.',
      },
      {
        question: 'How much does a one-time SEO audit cost in India?',
        answer:
          'Indicative editorial ranges for 2026 often put a basic audit around ₹5,000–₹15,000 and a detailed audit around ₹15,000–₹50,000. An audit is a diagnosis; implementation is usually a separate fee or retainer.',
      },
      {
        question: 'Why do SEO agencies charge different prices?',
        answer:
          'Because deliverables, seniority, hours, content writing, technical depth, locations covered, and reporting cadence differ. Two quotes with the same monthly number can hide very different work.',
      },
      {
        question: 'Is cheap SEO worth it?',
        answer:
          'It can be, if the low fee still covers the work your site needs and the methods are sound. It is not worth it if cheap means no content, no technical access, junk links, or ranking guarantees.',
      },
      {
        question: 'How long should a business invest in SEO?',
        answer:
          'Plan for an ongoing channel if organic demand matters to the business. A defined project (audit plus fixes) can be a sensible first step; continuous optimisation usually needs months of consistent work, not a one-off burst.',
      },
      {
        question: 'Does SEO pricing include content writing?',
        answer:
          'Only if the proposal says so. Many quotes include recommendations or briefs only. Writing, editing, and expert review are often the largest cost line when included.',
      },
      {
        question: 'Are SEO tools and link-building costs included?',
        answer:
          'Tool subscriptions and third-party outreach or PR costs may be included, itemised, or excluded. Ask explicitly. GST and other third-party expenses can be additional where applicable.',
      },
      {
        question: 'Is local SEO cheaper than national SEO?',
        answer:
          'Often yes, because fewer locations and competitors are in scope — but a competitive local market in a major city can still need serious content and technical work. National or multi-city programmes usually cost more.',
      },
      {
        question: 'Is GST included in SEO service pricing?',
        answer:
          'Not always. Many Indian proposals quote fees exclusive of GST. Confirm whether taxes and third-party costs are included before you compare two numbers.',
      },
      {
        question: 'Can I customise an SEO package for my business?',
        answer:
          'Yes. Serious providers scope work to your website, competition, locations, and goals rather than forcing a fixed menu. Vridhio provides customised quotations after understanding requirements — not a public package price list.',
      },
    ],
    relatedIds: ['seo', 'google-ads', 'website-development', 'lead-generation'],
    ctaBand: {
      heading: 'Not sure how much SEO your business needs?',
      body: 'Every business starts from a different position. Your website, competition, target locations and growth goals determine the SEO work required.\n\nVridhio can help you assess your current website, identify key opportunities and define a practical SEO scope.\n\nDiscuss your SEO requirements with Vridhio.',
    },
  },
}

export type ResolvedGuidePage = {
  id: GuideId
  name: string
  slug: string
  href: string
  category: 'cost' | 'comparison'
  datePublished: string
  seo: PageSeo
  copy: GuidePageCopy
  related: { id: ServiceId; name: string; href: string }[]
}

export function getGuidePageBySlug(slug: string): ResolvedGuidePage | null {
  const entry = getGuideBySlug(slug)
  if (!entry) return null
  const copy = GUIDE_PAGE_COPY[entry.id]
  const related = copy.relatedIds.flatMap((id) => {
    const relatedEntry = getServiceById(id)
    if (!relatedEntry) return []
    return [{ id: relatedEntry.id, name: relatedEntry.name, href: serviceHref(relatedEntry.slug) }]
  })
  return {
    id: entry.id,
    name: entry.name,
    slug: entry.slug,
    href: `/guides/${entry.slug}/`,
    category: entry.category,
    datePublished: entry.datePublished,
    seo: buildGuidePageSeo({
      slug: entry.slug,
      title: copy.seoTitle,
      description: copy.seoDescription,
    }),
    copy,
    related,
  }
}
