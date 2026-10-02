import { Check } from 'lucide-react'

type ServiceSelectorProps = {
  services: string[]
  value: string[]
  onChange: (services: string[]) => void
}

/** Toggle list over the configured service catalogue. */
export function ServiceSelector({ services, value, onChange }: ServiceSelectorProps) {
  const toggle = (service: string) =>
    onChange(value.includes(service) ? value.filter((s) => s !== service) : [...value, service])

  return (
    <fieldset className="adm-field adm-lw-fieldset">
      <legend className="adm-field-label">SERVICE NEEDED</legend>
      <div className="adm-lw-service-grid">
        {services.map((service) => {
          const on = value.includes(service)
          return (
            <button
              key={service}
              type="button"
              className={`adm-lw-service ${on ? 'is-on' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(service)}
            >
              {on ? <Check size={12} aria-hidden /> : null}
              {service}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
