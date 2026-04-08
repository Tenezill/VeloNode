export interface CatalogCategory {
  id: string
  label: string
  description: string
}

export interface CatalogProduct {
  id: string
  name: string
  categoryId: string
  moq: number
  country: string
  /** Flexible JSONB-like attributes coming from the backend */
  attributes: Record<string, string | number | boolean>
  summary: string
}

export const catalogCategories: CatalogCategory[] = [
  {
    id: 'cnc',
    label: 'CNC machining',
    description: 'Precision milled/turned parts for industrial assemblies.',
  },
  {
    id: 'injection',
    label: 'Injection molding',
    description: 'High-volume molded components with repeatable QA.',
  },
  {
    id: 'sheet',
    label: 'Sheet metal',
    description: 'Laser cut, bent, powder-coated enclosures and brackets.',
  },
  {
    id: 'pcb',
    label: 'Electronics / PCB',
    description: 'PCB assembly, harnessing, and box-build partners.',
  },
]

export const catalogProducts: CatalogProduct[] = [
  {
    id: 'p-1001',
    name: '6061 Aluminum CNC Bracket',
    categoryId: 'cnc',
    moq: 200,
    country: 'CN',
    summary: 'Tight-tolerance bracket with anodizing and inspection report.',
    attributes: {
      Material: 'Aluminum 6061',
      Finish: 'Anodized (black)',
      Tolerance: '±0.02mm',
      'Lead time': '14–21 days',
      'Sample available': true,
    },
  },
  {
    id: 'p-1002',
    name: 'ABS Enclosure (Injection Molded)',
    categoryId: 'injection',
    moq: 5000,
    country: 'CN',
    summary: 'Consumer-grade enclosure with matte texture and color match.',
    attributes: {
      Material: 'ABS',
      Color: 'RAL 9005 (custom)',
      'Gate type': 'Submarine',
      'Parting line': 'Optimized',
      'Lead time': '25–35 days',
    },
  },
  {
    id: 'p-1003',
    name: 'Sheet Metal Mounting Plate',
    categoryId: 'sheet',
    moq: 300,
    country: 'CN',
    summary: 'Laser cut + bending, powder-coated, packaged per EU transit.',
    attributes: {
      Material: 'SPCC / cold rolled steel',
      Thickness: '2.0mm',
      Finish: 'Powder coat',
      'RoHS': true,
      'Lead time': '10–16 days',
    },
  },
  {
    id: 'p-1004',
    name: 'PCB Assembly (SMT + THT)',
    categoryId: 'pcb',
    moq: 1000,
    country: 'CN',
    summary: 'Turnkey assembly with sourcing, AOI, and functional test.',
    attributes: {
      Layers: 4,
      'Assembly type': 'SMT + THT',
      'Testing': 'AOI + functional',
      'Conformal coating': 'Optional',
      'Lead time': '12–18 days',
    },
  },
]
