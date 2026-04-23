/** lib/seed/products.ts — static seed data for Phase 0. Always access via lib/data/products.ts */

// ── Atoms Smart Switch 1G — Seed / Placeholder Data ──────────
// Replace images with real photography before launch.

export const ATOMS_SWITCH_1G: Product = {
  id: 'prod_switch_1g_v1',
  slug: 'atoms-smart-switch-1g',
  name: 'Atoms Smart Switch 1G',
  tagline: 'One gang. Full control. Works locally.',
  description:
    'A professional-grade smart wall switch designed for reliability, local-first operation, and clean integration into any home or commercial installation.',
  longDescription: `
The Atoms Smart Switch 1G is engineered for installers and homeowners who want
smart control without cloud dependency. Built on a proven ESP32 module with
onboard relay, it works with Home Assistant, ESPHome, Tasmota, and your own
REST API — no proprietary app required.

Designed for the standard Cambodian and ASEAN single-gang wall box, it ships
pre-flashed with Atoms firmware and ready to provision in under two minutes.
  `.trim(),
  category: 'switches',
  status: 'in_stock',
  price: 18,
  currency: 'USD',
  sku: 'ATM-SW1G-V1',
  isNew: true,
  isFeatured: true,

  images: [
    { src: '/images/products/switch-1g-front.jpg', alt: 'Atoms Smart Switch 1G — Front view', type: 'render' },
    { src: '/images/products/switch-1g-side.jpg',  alt: 'Atoms Smart Switch 1G — Side profile', type: 'render' },
    { src: '/images/products/switch-1g-wiring.jpg', alt: 'Atoms Smart Switch 1G — Wiring diagram', type: 'diagram' },
    { src: '/images/products/switch-1g-installed.jpg', alt: 'Atoms Smart Switch 1G — Installed', type: 'photo' },
  ],

  features: [
    'Local-first — works without internet after setup',
    'Compatible with Home Assistant, ESPHome, Tasmota',
    'REST API for custom integrations',
    'Standard single-gang fit (ASEAN wall box)',
    'Physical button override always works',
    'Firmware update via web UI — no cable needed',
    'Status LED with configurable behavior',
    '10A relay — suitable for lighting loads',
  ],

  specs: [
    { group: 'Electrical',   label: 'Input voltage',      value: '100–240V AC, 50/60Hz' },
    { group: 'Electrical',   label: 'Max load',           value: '10A / 2200W resistive' },
    { group: 'Electrical',   label: 'Standby power',      value: '< 0.5W' },
    { group: 'Connectivity', label: 'Wireless',           value: 'Wi-Fi 802.11 b/g/n (2.4GHz)' },
    { group: 'Connectivity', label: 'Protocol',           value: 'HTTP REST, MQTT, mDNS' },
    { group: 'Module',       label: 'MCU',                value: 'ESP32-C3' },
    { group: 'Module',       label: 'Flash memory',       value: '4MB' },
    { group: 'Module',       label: 'Firmware',           value: 'Atoms Firmware v1.x / ESPHome / Tasmota' },
    { group: 'Physical',     label: 'Form factor',        value: 'Single gang (86×86mm plate)' },
    { group: 'Physical',     label: 'Installation depth', value: 'Min. 35mm wall box' },
    { group: 'Physical',     label: 'Housing material',   value: 'PC/ABS, flame-retardant V0' },
    { group: 'Physical',     label: 'Weight',             value: '68g' },
    { group: 'Compliance',   label: 'Operating temp',     value: '0°C to 40°C' },
    { group: 'Compliance',   label: 'Storage temp',       value: '-20°C to 70°C' },
  ],

  packageContents: [
    '1× Atoms Smart Switch 1G unit',
    '1× Switch plate (white)',
    '4× M3 mounting screws',
    '1× Quick Start card',
  ],

  downloads: [
    { label: 'Quick Start Guide',  filename: 'atoms-switch-1g-quickstart.pdf',  url: '/downloads/atoms-switch-1g-quickstart.pdf',  type: 'quickstart', size: '1.2 MB' },
    { label: 'Installation Manual', filename: 'atoms-switch-1g-manual.pdf',      url: '/downloads/atoms-switch-1g-manual.pdf',      type: 'manual',     size: '3.4 MB' },
    { label: 'Datasheet',           filename: 'atoms-switch-1g-datasheet.pdf',   url: '/downloads/atoms-switch-1g-datasheet.pdf',   type: 'datasheet',  size: '890 KB' },
    { label: 'Firmware v1.2.0',     filename: 'atoms-switch-1g-fw-1.2.0.bin',   url: '/downloads/atoms-switch-1g-fw-1.2.0.bin',   type: 'firmware',   size: '512 KB' },
    { label: 'Wiring Diagram (PDF)', filename: 'atoms-switch-1g-wiring.pdf',    url: '/downloads/atoms-switch-1g-wiring.pdf',    type: 'datasheet',  size: '420 KB' },
  ],

  faqs: [
    {
      question: 'Does it work without an internet connection after setup?',
      answer: 'Yes. Once provisioned to your Wi-Fi, all switching functions work locally. Cloud connectivity is never required for basic operation.',
    },
    {
      question: 'Can I use it with Home Assistant?',
      answer: 'Yes. It integrates natively via REST API or MQTT. It is also compatible with ESPHome and Tasmota if you prefer to flash alternative firmware.',
    },
    {
      question: 'Does it require a neutral wire?',
      answer: 'Yes. The Atoms Smart Switch 1G requires a neutral wire (N). Please check your wall box wiring before ordering.',
    },
    {
      question: 'Can I still control the light with a physical button if Wi-Fi is down?',
      answer: 'Yes. The physical button always works regardless of network status.',
    },
    {
      question: 'What wall box does it fit?',
      answer: 'It fits standard 86×86mm single-gang wall boxes with a minimum installation depth of 35mm. Common in Cambodia, Thailand, and most of Southeast Asia.',
    },
    {
      question: 'How do I update the firmware?',
      answer: 'Firmware can be updated via the built-in web UI. Navigate to the device IP address, open Settings, and use the OTA update function. No USB cable required.',
    },
  ],

  relatedSlugs: [],
  worksWithPlatforms: ['Home Assistant', 'ESPHome', 'Tasmota', 'Node-RED', 'Custom REST API'],
  firmwareVersion: '1.2.0',
  docSlug: 'atoms-switch-1g',

  revisionHistory: [
    { version: 'v1.2.0', date: '2025-03-01', notes: 'Improved Wi-Fi reconnect logic. Added mDNS support.' },
    { version: 'v1.1.0', date: '2025-01-15', notes: 'Added MQTT support. Fixed LED behavior on boot.' },
    { version: 'v1.0.0', date: '2024-12-01', notes: 'Initial release.' },
  ],

  createdAt: '2024-12-01T00:00:00Z',
  updatedAt: '2025-03-01T00:00:00Z',
}

export const PRODUCTS: Product[] = [ATOMS_SWITCH_1G]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isFeatured)
}
