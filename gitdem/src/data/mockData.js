export const initialCases = [
  {
    id: "CLM-2026-0841",
    fieldOfficer: "Rajesh Sharma",
    fieldOfficerId: "LM-FO-4821",
    location: "Apex Hypermarket, Sector 18, Noida",
    date: "2026-09-07",
    commodity: "Refined Sunflower Oil (1 Litre)",
    brand: "SunPure Gold",
    manufacturer: "SunPure Agro Foods Ltd, Plot 14, Phase II Ind. Area, Bhiwadi, Rajasthan",
    declaredNetQty: "1 L / 910 g",
    mrp: "₹185.00 (Incl. of all taxes)",
    batchNo: "B-260901",
    mfgDate: "08/2026",
    status: "Pending",
    statusText: "Pending Review",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
    inspectionNotes: "Sample drawn from retail shelf. Pre-packaged pouch conforms to standard dimensions. Verified weight using certified Class-II electronic scale.",
    checklist: [
      { id: "c1", label: "Name & complete address of Manufacturer/Packer", verified: true, rule: "Rule 6(1)(a)" },
      { id: "c2", label: "Generic / Common name of the commodity", verified: true, rule: "Rule 6(1)(b)" },
      { id: "c3", label: "Net Quantity declaration in standard units (L/ml/g/kg)", verified: true, rule: "Rule 6(1)(c)" },
      { id: "c4", label: "Month and Year of manufacture/packing", verified: true, rule: "Rule 6(1)(d)" },
      { id: "c5", label: "Retail Sale Price (MRP inclusive of all taxes)", verified: true, rule: "Rule 6(1)(e)" },
      { id: "c6", label: "Consumer Care helpline number & email address", verified: true, rule: "Rule 6(1)(n)" }
    ],
    remarks: [
      {
        by: "Rajesh Sharma",
        role: "fieldOfficer",
        date: "2026-09-07 10:45 AM",
        text: "Routine spot inspection at Apex Hypermarket. All 6 mandatory declarations visible on primary packaging. Awaiting final discharge approval from Metrology Officer."
      }
    ]
  },
  {
    id: "CLM-2026-0839",
    fieldOfficer: "Ananya Sen",
    fieldOfficerId: "LM-FO-3310",
    location: "Spices & More Retailers, MG Road, Bengaluru",
    date: "2026-09-06",
    commodity: "Premium Roasted Almonds (500g)",
    brand: "NutriDelight",
    manufacturer: "NutriDry Products LLP, 45 KIADB Industrial Area, Hoskote",
    declaredNetQty: "500 g",
    mrp: "₹590.00 (Overprinted sticker: ₹640.00)",
    batchNo: "ND-ALM-442",
    mfgDate: "07/2026",
    status: "Flagged",
    statusText: "Flagged Violation",
    imageUrl: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80",
    inspectionNotes: "Violation observed under Legal Metrology (Packaged Commodities) Rules: Dual pricing stickers affixed. Original MRP overwritten with higher sticker price.",
    flagReason: "Smudging/Over-stickering of Maximum Retail Price (MRP violation under Section 36 of Legal Metrology Act).",
    checklist: [
      { id: "c1", label: "Name & complete address of Manufacturer/Packer", verified: true, rule: "Rule 6(1)(a)" },
      { id: "c2", label: "Generic / Common name of the commodity", verified: true, rule: "Rule 6(1)(b)" },
      { id: "c3", label: "Net Quantity declaration in standard units (L/ml/g/kg)", verified: true, rule: "Rule 6(1)(c)" },
      { id: "c4", label: "Month and Year of manufacture/packing", verified: true, rule: "Rule 6(1)(d)" },
      { id: "c5", label: "Retail Sale Price (MRP inclusive of all taxes)", verified: false, rule: "Rule 6(1)(e)" },
      { id: "c6", label: "Consumer Care helpline number & email address", verified: true, rule: "Rule 6(1)(n)" }
    ],
    remarks: [
      {
        by: "Ananya Sen",
        role: "fieldOfficer",
        date: "2026-09-06 02:15 PM",
        text: "Dual price stickers detected. Sticker ₹640 placed over original printed price ₹590. Seizure notice issued to store manager."
      },
      {
        by: "Dr. V. K. Malhotra",
        role: "metrologyOfficer",
        date: "2026-09-06 05:30 PM",
        text: "Flagged for show-cause notice under Section 18/36. Forwarding notice to Enforcement Branch."
      }
    ]
  },
  {
    id: "CLM-2026-0835",
    fieldOfficer: "Vikramaditya Roy",
    fieldOfficerId: "LM-FO-5192",
    location: "Metro Wholesale Hub, Grand Trunk Road, Kolkata",
    date: "2026-09-05",
    commodity: "Organic Basmati Rice (5 Kg)",
    brand: "Heritage Grains",
    manufacturer: "Heritage Agro Industries, Burdwan Rice Cluster, West Bengal",
    declaredNetQty: "5.000 kg",
    mrp: "₹650.00 (Incl. of all taxes)",
    batchNo: "HGR-26-09",
    mfgDate: "08/2026",
    status: "Verified",
    statusText: "Verified / Discharged",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
    inspectionNotes: "Gross tare and net weight checked using calibrated standard weights. Average net weight 5.012 kg, complying with maximum permissible error limits.",
    checklist: [
      { id: "c1", label: "Name & complete address of Manufacturer/Packer", verified: true, rule: "Rule 6(1)(a)" },
      { id: "c2", label: "Generic / Common name of the commodity", verified: true, rule: "Rule 6(1)(b)" },
      { id: "c3", label: "Net Quantity declaration in standard units (L/ml/g/kg)", verified: true, rule: "Rule 6(1)(c)" },
      { id: "c4", label: "Month and Year of manufacture/packing", verified: true, rule: "Rule 6(1)(d)" },
      { id: "c5", label: "Retail Sale Price (MRP inclusive of all taxes)", verified: true, rule: "Rule 6(1)(e)" },
      { id: "c6", label: "Consumer Care helpline number & email address", verified: true, rule: "Rule 6(1)(n)" }
    ],
    remarks: [
      {
        by: "Vikramaditya Roy",
        role: "fieldOfficer",
        date: "2026-09-05 11:10 AM",
        text: "Weight sampling completed across 12 master cartons. MPE within prescribed limits. Net weight accurate."
      },
      {
        by: "Dr. V. K. Malhotra",
        role: "metrologyOfficer",
        date: "2026-09-05 03:45 PM",
        text: "Verified and discharged. Inspection certificate issued with digital sign-off."
      }
    ]
  },
  {
    id: "CLM-2026-0831",
    fieldOfficer: "Rajesh Sharma",
    fieldOfficerId: "LM-FO-4821",
    location: "Reliance Fresh Mart, Greater Noida",
    date: "2026-09-04",
    commodity: "Dairy Milk Chocolate (150g Bar)",
    brand: "SweetDelite",
    manufacturer: "SweetDelite Confectionery Pvt Ltd, Baddi, Solan, Himachal Pradesh",
    declaredNetQty: "150 g",
    mrp: "₹120.00 (Incl. of all taxes)",
    batchNo: "SD-CHOC-991",
    mfgDate: "08/2026",
    status: "Verified",
    statusText: "Verified / Discharged",
    imageUrl: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80",
    inspectionNotes: "All declarations comply with font height specifications (minimum 3mm for 150g pack). Accurate unit sale price displayed as required by 2022 amendments.",
    checklist: [
      { id: "c1", label: "Name & complete address of Manufacturer/Packer", verified: true, rule: "Rule 6(1)(a)" },
      { id: "c2", label: "Generic / Common name of the commodity", verified: true, rule: "Rule 6(1)(b)" },
      { id: "c3", label: "Net Quantity declaration in standard units (L/ml/g/kg)", verified: true, rule: "Rule 6(1)(c)" },
      { id: "c4", label: "Month and Year of manufacture/packing", verified: true, rule: "Rule 6(1)(d)" },
      { id: "c5", label: "Retail Sale Price (MRP inclusive of all taxes)", verified: true, rule: "Rule 6(1)(e)" },
      { id: "c6", label: "Consumer Care helpline number & email address", verified: true, rule: "Rule 6(1)(n)" }
    ],
    remarks: [
      {
        by: "Rajesh Sharma",
        role: "fieldOfficer",
        date: "2026-09-04 09:30 AM",
        text: "Unit sale price (₹0.80 per gram) properly displayed alongside MRP."
      },
      {
        by: "Dr. V. K. Malhotra",
        role: "metrologyOfficer",
        date: "2026-09-04 04:00 PM",
        text: "Full compliance verified. Case closed and logged in registry."
      }
    ]
  },
  {
    id: "CLM-2026-0828",
    fieldOfficer: "Pooja Deshmukh",
    fieldOfficerId: "LM-FO-6211",
    location: "Kirana King Store, Dadar West, Mumbai",
    date: "2026-09-03",
    commodity: "Pure Ghee 1L Tin",
    brand: "Gopala Brand",
    manufacturer: "Gopala Dairy Products, Anand, Gujarat",
    declaredNetQty: "1 L (905 g)",
    mrp: "₹680.00 (Incl. of all taxes)",
    batchNo: "GOP-GH-102",
    mfgDate: "07/2026",
    status: "Pending",
    statusText: "Pending Review",
    imageUrl: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",
    inspectionNotes: "Tin packaging verified. Net quantity font size borderline; optical gauge measurement shows 3.8mm against required 4.0mm. Metrology Officer review advised.",
    checklist: [
      { id: "c1", label: "Name & complete address of Manufacturer/Packer", verified: true, rule: "Rule 6(1)(a)" },
      { id: "c2", label: "Generic / Common name of the commodity", verified: true, rule: "Rule 6(1)(b)" },
      { id: "c3", label: "Net Quantity declaration in standard units (L/ml/g/kg)", verified: false, rule: "Rule 6(1)(c)" },
      { id: "c4", label: "Month and Year of manufacture/packing", verified: true, rule: "Rule 6(1)(d)" },
      { id: "c5", label: "Retail Sale Price (MRP inclusive of all taxes)", verified: true, rule: "Rule 6(1)(e)" },
      { id: "c6", label: "Consumer Care helpline number & email address", verified: true, rule: "Rule 6(1)(n)" }
    ],
    remarks: [
      {
        by: "Pooja Deshmukh",
        role: "fieldOfficer",
        date: "2026-09-03 01:20 PM",
        text: "Font height measurement indicates possible non-conformance. Submitted for formal measurement check."
      }
    ]
  },
  {
    id: "CLM-2026-0822",
    fieldOfficer: "Rajesh Sharma",
    fieldOfficerId: "LM-FO-4821",
    location: "Modern Daily Needs, Indirapuram, Ghaziabad",
    date: "2026-09-02",
    commodity: "Iodized Salt (1 Kg Pack)",
    brand: "Crystal Pure",
    manufacturer: "Crystal Minerals Ltd, Gandhidham, Kutch, Gujarat",
    declaredNetQty: "1.0 kg",
    mrp: "₹28.00 (Incl. of all taxes)",
    batchNo: "CP-SLT-772",
    mfgDate: "08/2026",
    status: "Flagged",
    statusText: "Flagged Violation",
    imageUrl: "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=800&q=80",
    inspectionNotes: "Missing Consumer Care email address and customer helpline telephone number on packaging.",
    flagReason: "Non-compliance with Rule 6(1)(n) - Mandatory grievance redressal contact missing from packaging.",
    checklist: [
      { id: "c1", label: "Name & complete address of Manufacturer/Packer", verified: true, rule: "Rule 6(1)(a)" },
      { id: "c2", label: "Generic / Common name of the commodity", verified: true, rule: "Rule 6(1)(b)" },
      { id: "c3", label: "Net Quantity declaration in standard units (L/ml/g/kg)", verified: true, rule: "Rule 6(1)(c)" },
      { id: "c4", label: "Month and Year of manufacture/packing", verified: true, rule: "Rule 6(1)(d)" },
      { id: "c5", label: "Retail Sale Price (MRP inclusive of all taxes)", verified: true, rule: "Rule 6(1)(e)" },
      { id: "c6", label: "Consumer Care helpline number & email address", verified: false, rule: "Rule 6(1)(n)" }
    ],
    remarks: [
      {
        by: "Rajesh Sharma",
        role: "fieldOfficer",
        date: "2026-09-02 11:50 AM",
        text: "Back panel missing consumer grievance telephone number. Only web address printed."
      },
      {
        by: "Dr. V. K. Malhotra",
        role: "metrologyOfficer",
        date: "2026-09-02 04:30 PM",
        text: "Notice issued to Crystal Minerals Ltd under Rule 6(1)(n). Response awaited within 15 working days."
      }
    ]
  }
];

export const officerProfiles = {
  metrologyOfficer: {
    role: "metrologyOfficer",
    name: "Dr. V. K. Malhotra",
    designation: "Senior Metrology Officer / Joint Controller",
    department: "Directorate of Legal Metrology & Consumer Standards",
    badgeId: "LM-HQ-9901",
    jurisdiction: "Headquarters - Standards & Enforcement Wing",
    email: "vk.malhotra@metrology.gov.in",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  fieldOfficer: {
    role: "fieldOfficer",
    name: "Rajesh Sharma",
    designation: "Senior Inspector of Legal Metrology",
    department: "Field Inspection & Verification Wing",
    badgeId: "LM-FO-4821",
    jurisdiction: "Zone 4 - Northern Industrial & Retail Division",
    email: "rajesh.sharma@metrology.gov.in",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  consumer: {
    role: "consumer",
    name: "Aarav Mehta",
    designation: "Verified Citizen Consumer",
    department: "National Consumer Helpline (NCH) Portal",
    badgeId: "NCH-CON-8821",
    jurisdiction: "All India Retail Consumer Market",
    email: "consumer@citizen.in",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
};

