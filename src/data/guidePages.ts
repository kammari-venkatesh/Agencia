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
    seoTitle: 'SEO Cost in India: What Determines the Price? | Vridhio',
    seoDescription:
      'SEO cost in India varies with site size, competition, content, and ongoing work. Compare proposal scope — not a retainer menu or ranking promise.',
    h1: 'SEO cost in India: what determines the price?',
    intro:
      'SEO cost in India varies because the work varies. An audit is not the same as technical fixes, on-page work, local optimisation, or months of content and measurement. There is no honest universal monthly price, and no responsible provider should sell rankings or traffic as a guaranteed package. Compare what is in the proposal — not a round number.',
    sections: [
      {
        heading: 'Why SEO pricing varies',
        body: 'Price follows the size of the site, how competitive the queries are, how much content and technical debt exists, and whether the engagement is a one-time diagnosis or ongoing optimisation. Two businesses in the same city can need very different work.\n\nThis guide explains cost drivers. It does not publish retainers, package menus, or Vridhio rates. Commercial SEO work lives on [[seo]].',
      },
      {
        heading: 'One-time SEO audits',
        body: 'An audit is a diagnosis: crawl health, indexation, structure, on-page gaps, and usually a prioritised list. It is not the same as doing the fixes. A cheap “audit” that is a generic PDF with no site-specific evidence is not equivalent to a thorough one. Ask what will be inspected and what deliverable you get.',
      },
      {
        heading: 'Technical SEO scope',
        body: 'Technical work can include crawlability, index controls, site speed cooperation with developers, structured data where it is truthful, HTTPS and canonical hygiene, and fixing search-console issues. Scope depends on the CMS and how broken the current site is. Technical SEO is not a separate Vridhio URL; it is part of SEO work when it is needed.',
      },
      {
        heading: 'On-page SEO',
        body: 'Titles, headings, internal links, and content that matches intent. The cost scales with how many templates and URLs need attention, and whether new copy is included or only recommendations for your writers.',
      },
      {
        heading: 'Local SEO',
        body: 'Local work (when it applies) includes location relevance, profile accuracy, and pages that match how people search nearby. It is not a magic city-page factory. Creating dozens of thin city URLs is not a pricing strategy we recommend, and those URLs are not how this site is built.',
      },
      {
        heading: 'Content requirements',
        body: 'If the site cannot answer the query, rankings are unlikely no matter the technical polish. Content cost — briefs, drafts, edits, expert review — is often the largest ongoing line. Confirm whether writing is included or only “content recommendations.”',
      },
      {
        heading: 'Competition',
        body: 'Queries where strong sites already rank take more content, more technical quality, and more time. “SEO for a new brand on a generic keyword” is a different job from supporting a niche service page. Competition is a cost driver, not a keyword-difficulty score we invent here.',
      },
      {
        heading: 'Website size',
        body: 'More indexable URLs mean more templates to get right, more internal linking decisions, and more measurement. A 10-page site and a 10,000-URL catalogue are not priced the same, even if both want “SEO.”',
      },
      {
        heading: 'Ongoing optimisation',
        body: 'Search results move. Ongoing work is measurement, iteration, new content, and fixing what breaks after releases. A one-time cleanup without a plan for change is a project, not a channel. Do not confuse a three-month burst with a finished asset.',
      },
      {
        heading: 'Agency vs freelancer vs in-house',
        body: 'A freelancer can be enough for a focused site with a clear owner. An agency can cover more specialisms if you actually need them — and can cost more in coordination. In-house makes sense when SEO is continuous and you will hire or train for it. None of the three is automatically higher quality. Quality is the people, the access to your site, and the honesty of the plan.',
      },
      {
        heading: 'What an SEO proposal should contain',
        bullets: [
          'Objectives in business language (enquiries, qualified organic landings) — not a guaranteed rank.',
          'Scope: technical, on-page, local (if any), content, and reporting.',
          'What is out of scope (ads, PR, web redesign) unless separately listed.',
          'Access needed (CMS, Search Console, analytics).',
          'Cadence of work and reporting, without fake traffic forecasts.',
          'How success will be reviewed if results are slower than hoped.',
        ],
      },
      {
        heading: 'What cheap SEO can leave out',
        body: 'Thin proposals often skip technical access, skip writing, skip measurement setup, or replace work with ranking guarantees and bulk directory submissions. If the price only works by omitting the site-specific work, it is not a bargain.',
      },
      {
        heading: 'How to compare SEO proposals',
        body: 'Map each line of work to your site. Ignore “X keywords guaranteed.” Ask who does the writing, who implements technical changes, and what happens if developers are slow. A clearer scope at a higher fee is comparable; a vague scope at a lower fee is not.',
      },
      {
        heading: 'Cost vs scope',
        body: 'You are buying a bundle of activities and attention, not a national SEO tariff. If budget is limited, narrow the query set and the URL set rather than buying a pretend full-market campaign. Paid search can cover demand while organic work is still early — that channel lives on [[google-ads]], and it is not a substitute for SEO scope honesty.',
      },
      {
        heading: 'Questions to ask an SEO provider',
        bullets: [
          'What work happens in month one versus later months?',
          'Do you write content, or only advise?',
          'Who implements technical changes on the site?',
          'How do you report without promising rankings or traffic?',
          'What would you refuse to do (guarantees, doorway pages, fake blogs)?',
          'How does this interact with our Google Ads, if we run them?',
        ],
      },
      {
        heading: 'SEO, ads, and leads',
        body: 'Organic search is one demand source. Paid search is another. Turning visits into conversations can involve site conversion paths and follow-up systems on [[lead-generation]]. Those links are so you do not treat SEO as a complete growth stack by itself.',
      },
    ],
    faqs: [
      {
        question: 'What is the average SEO cost in India?',
        answer:
          'There is no reliable average that should drive your decision. Audits, technical work, content, and ongoing optimisation are different jobs. Treat published retainers on other websites as marketing, not a benchmark for your scope.',
      },
      {
        question: 'Why do SEO agencies refuse to guarantee rankings?',
        answer:
          'Because they do not control search results. Competition, the query, and the site all change. A ranking guarantee is a sales tactic, not a professional scope item.',
      },
      {
        question: 'Is cheap SEO worth it?',
        answer:
          'Only if the cheap proposal still includes the work your site actually needs. If cheap means no content, no technical access, and a promise of ranks, you are buying a story.',
      },
      {
        question: 'Should SEO be a monthly retainer?',
        answer:
          'Ongoing optimisation is usually continuous, so some form of ongoing engagement is common. That is not the same as a one-size retainer. A defined project (audit plus fixes) can be the right first step. We do not publish a standard monthly fee here.',
      },
      {
        question: 'Does SEO cost include Google Ads?',
        answer:
          'Not unless the proposal says so. SEO and Google Ads are different services with different cost models. Mixing them in one vague “digital marketing” fee makes it harder to see what you are buying.',
      },
      {
        question: 'How do I know if an SEO quote is too low?',
        answer:
          'Ask what URLs, what content, and what technical work are included. If the answer is mostly “we will get you to page one,” the quote is not describing work. Compare activities and access, not the monthly headline.',
      },
    ],
    relatedIds: ['seo', 'google-ads', 'lead-generation'],
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
