export type ServiceOffering = {
  title: string
  description: string
  points: string[]
  image: string
  imageAlt: string
  /** Fine-tune crop so the subject stays visible in the card frame */
  imagePosition?: string
}

const serviceImage = (slug: string) => `/images/services/${slug}.png`

/** Neutral fallback if a service image fails to load */
export const SERVICE_IMAGE_FALLBACK = serviceImage('website-development')

export const services: ServiceOffering[] = [
  {
    title: 'Website Development',
    description:
      'We create fast, modern, and conversion-focused websites that turn visitors into paying customers.',
    points: ['Business websites', 'Landing pages', 'E-commerce websites', 'Portfolio websites'],
    image: serviceImage('website-development'),
    imageAlt: 'Professional website development workspace with modern business site on laptop',
    imagePosition: 'center 40%',
  },
  {
    title: 'App Development',
    description:
      'Scalable and user-friendly mobile & web apps designed for performance, scalability, and business growth.',
    points: ['Android apps', 'iOS apps', 'Web applications', 'Admin dashboards'],
    image: serviceImage('app-development'),
    imageAlt: 'Mobile app development with smartphones showing polished app interfaces',
    imagePosition: 'center center',
  },
  {
    title: 'AI Chatbots',
    description:
      'Intelligent AI chatbot systems that automate customer support, lead generation, and user engagement.',
    points: [
      'Customer support bots',
      'WhatsApp AI bots',
      'Lead generation bots',
      'AI business assistants',
    ],
    image: serviceImage('ai-chatbots'),
    imageAlt: 'AI chatbot technology with conversational interface in a modern office',
    imagePosition: 'center center',
  },
  {
    title: 'Workflow Automations',
    description:
      'Custom automation systems that reduce manual work and streamline business operations efficiently.',
    points: ['n8n automations', 'Zapier workflows', 'CRM automation', 'Process optimization'],
    image: serviceImage('workflow-automations'),
    imageAlt: 'Workflow automation dashboard with connected business process pipelines',
    imagePosition: 'center top',
  },
  {
    title: 'AI Calling Systems',
    description:
      'AI-powered voice agents designed for sales calls, customer support, appointment booking, and outreach.',
    points: [
      'AI voice assistants',
      'Automated sales calls',
      'Customer support calling',
      'Appointment scheduling',
    ],
    image: serviceImage('ai-calling-systems'),
    imageAlt: 'AI calling system with professional on headset in modern office',
    imagePosition: 'center 35%',
  },
  {
    title: 'Graphic Designing',
    description: 'Creative designs that build strong brand identity and grab attention instantly.',
    points: ['Social media creatives', 'Brand identity', 'Pitch decks', 'UI/UX design'],
    image: serviceImage('graphic-designing'),
    imageAlt: 'Graphic designer creating brand visuals and creative layouts',
    imagePosition: 'center center',
  },
  {
    title: 'Video Editing',
    description:
      'Professional video editing solutions tailored for brands, creators, ads, and social media growth.',
    points: ['Short-form reels', 'Long-form videos', 'Brand advertisements', 'Motion graphics'],
    image: serviceImage('video-editing'),
    imageAlt: 'Video editor at professional multi-monitor editing workstation',
    imagePosition: 'center center',
  },
  {
    title: 'Multimedia Production',
    description:
      'High-quality multimedia production services that help brands communicate visually and creatively.',
    points: [
      'Content production',
      'Brand storytelling',
      'Commercial creatives',
      'Multimedia campaigns',
    ],
    image: serviceImage('multimedia-production'),
    imageAlt: 'Professional film crew shooting a brand video production',
    imagePosition: 'center center',
  },
  {
    title: 'Digital Marketing',
    description:
      'Data-driven marketing strategies to generate leads, increase visibility, and boost revenue.',
    points: ['Meta ads', 'Google ads', 'SEO', 'Social media marketing'],
    image: serviceImage('digital-marketing'),
    imageAlt: 'Digital marketing analytics and campaign performance on devices',
    imagePosition: 'center top',
  },
  {
    title: 'Influencer Marketing',
    description:
      'Strategic influencer collaborations that increase reach, trust, engagement, and brand awareness.',
    points: [
      'Influencer outreach',
      'Campaign management',
      'Creator partnerships',
      'Brand collaborations',
    ],
    image: serviceImage('influencer-marketing'),
    imageAlt: 'Influencer content creator filming a brand collaboration',
    imagePosition: 'center 30%',
  },
  {
    title: 'Sales & Growth Systems',
    description:
      'Complete sales funnel systems designed to improve conversions and scale business growth.',
    points: ['Sales funnels', 'CRM systems', 'Lead nurturing', 'Outreach systems'],
    image: serviceImage('sales-growth-systems'),
    imageAlt: 'Sales and growth strategy session with funnel planning',
    imagePosition: 'center center',
  },
  {
    title: 'Content Marketing',
    description:
      'Content strategies that help businesses grow organically, build authority, and attract customers.',
    points: ['Content strategy', 'Copywriting', 'Organic growth', 'Brand content'],
    image: serviceImage('content-marketing'),
    imageAlt: 'Content marketer crafting brand stories on laptop',
    imagePosition: 'center center',
  },
]
