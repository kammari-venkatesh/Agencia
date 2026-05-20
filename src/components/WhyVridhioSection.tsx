import type { FC } from 'react'
import { motion } from 'framer-motion'
import {
  whyVridhioHeading,
  whyVridhioItems,
  whyVridhioSubheading,
  whyVridhioTrustPills,
} from '../data/whyVridhio'
import { easeIOS, fadeUp, sectionReveal, staggerParent } from '../motion/variants'
import './WhyVridhioSection.css'

const WhyVridhioSection: FC = () => {
  const headingParts = whyVridhioHeading.split('Vridhio?')

  return (
    <section id="why-vridhio" className="wv-section" aria-labelledby="wv-heading">
      <div className="wv-bg-glow" aria-hidden="true" />
      <div className="container wv-section-inner">
        <motion.header
          className="wv-header"
          variants={sectionReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-5% 0px', amount: 0.2 }}
        >
          <h2 id="wv-heading" className="wv-heading">
            {headingParts[0]}
            <span className="wv-heading-gradient">Vridhio?</span>
          </h2>
          <p className="wv-subheading">{whyVridhioSubheading}</p>
        </motion.header>

        <motion.div
          className="wv-grid"
          role="list"
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-5% 0px', amount: 0.1 }}
        >
          {whyVridhioItems.map((item) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.text}
                className="wv-card"
                role="listitem"
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.45, ease: easeIOS }}
              >
                <div className="wv-icon-wrap" aria-hidden="true">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <p className="wv-card-text">{item.text}</p>
              </motion.article>
            )
          })}
        </motion.div>

        <motion.div
          className="wv-trust"
          aria-label="Trust indicators"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-5% 0px', amount: 0.2 }}
          transition={{ duration: 0.55, ease: easeIOS, delay: 0.15 }}
        >
          {whyVridhioTrustPills.map((pill) => (
            <span key={pill} className="wv-trust-pill">
              {pill}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default WhyVridhioSection
