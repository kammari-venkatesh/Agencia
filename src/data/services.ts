export type ServiceOffering = {
  title: string
  description: string
  points: string[]
  image: string
  imageAlt: string
}

/** Consistent 800×500 crop for uniform card image slots */
const img = (id: string, alt: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=500&q=80`

export const services: ServiceOffering[] = [
  {
    title: 'Website Development',
    description:
      'We create fast, modern, and conversion-focused websites that turn visitors into paying customers.',
    points: ['Business websites', 'Landing pages', 'E-commerce websites', 'Portfolio websites'],
    image: img('photo-1460925895917-afdab827c52f', 'Website Development'),
    imageAlt: 'Website Development',
  },
  {
    title: 'App Development',
    description:
      'Scalable and user-friendly mobile & web apps designed for performance, scalability, and business growth.',
    points: ['Android apps', 'iOS apps', 'Web applications', 'Admin dashboards'],
    image: img('photo-1512941937669-90a1b58e7e9c', 'App Development'),
    imageAlt: 'App Development',
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
    image: img('photo-1677442136019-21780ecad995', 'AI Chatbots'),
    imageAlt: 'AI Chatbots',
  },
  {
    title: 'Workflow Automations',
    description:
      'Custom automation systems that reduce manual work and streamline business operations efficiently.',
    points: ['n8n automations', 'Zapier workflows', 'CRM automation', 'Process optimization'],
    image: img('photo-1551288049-bebda4e38f71', 'Workflow Automations'),
    imageAlt: 'Workflow Automations',
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
    image: img('photo-1551836022-d5d88e9c9639', 'AI Calling Systems'),
    imageAlt: 'AI Calling Systems',
  },
  {
    title: 'Graphic Designing',
    description: 'Creative designs that build strong brand identity and grab attention instantly.',
    points: ['Social media creatives', 'Brand identity', 'Pitch decks', 'UI/UX design'],
    image: img('photo-1586717791821-55d37124ea0c', 'Graphic Designing'),
    imageAlt: 'Graphic Designing',
  },
  {
    title: 'Video Editing',
    description:
      'Professional video editing solutions tailored for brands, creators, ads, and social media growth.',
    points: ['Short-form reels', 'Long-form videos', 'Brand advertisements', 'Motion graphics'],
    image: img('photo-1574717024653-61fd2cf4d44d', 'Video Editing'),
    imageAlt: 'Video Editing',
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
    image: img('photo-1492691527719-9d1e072e0a0c', 'Multimedia Production'),
    imageAlt: 'Multimedia Production',
  },
  {
    title: 'Digital Marketing',
    description:
      'Data-driven marketing strategies to generate leads, increase visibility, and boost revenue.',
    points: ['Meta ads', 'Google ads', 'SEO', 'Social media marketing'],
    image: img('photo-1620714223084-8fcacc6dfd8d', 'Digital Marketing'),
    imageAlt: 'Digital Marketing',
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
    image: img('photo-1611162616305-c69b3fa7a2be', 'Influencer Marketing'),
    imageAlt: 'Influencer Marketing',
  },
  {
    title: 'Sales & Growth Systems',
    description:
      'Complete sales funnel systems designed to improve conversions and scale business growth.',
    points: ['Sales funnels', 'CRM systems', 'Lead nurturing', 'Outreach systems'],
    image: img('photo-1556761175-5973dc0d32e7', 'Sales and Growth Systems'),
    imageAlt: 'Sales and Growth Systems',
  },
  {
    title: 'Content Marketing',
    description:
      'Content strategies that help businesses grow organically, build authority, and attract customers.',
    points: ['Content strategy', 'Copywriting', 'Organic growth', 'Brand content'],
    image: img('photo-1499750310107-5fef28a66643', 'Content Marketing'),
    imageAlt: 'Content Marketing',
  },
]
