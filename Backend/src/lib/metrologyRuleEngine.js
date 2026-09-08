/**
 * Statutory Compliance Engine for Legal Metrology (Packaged Commodities) Rules, 2011
 * Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
 * Problem Statement: SIH26034
 */

function validateLegalMetrology(extractedFields = {}, rawText = "") {
  const violations = [];
  const compliances = [];

  const textLower = (rawText || "").toLowerCase();

  // -------------------------------------------------------------
  // 1. Rule 6(1)(a): Manufacturer / Packer / Importer Identity
  // -------------------------------------------------------------
  const manufacturer = extractedFields.Manufacturer_Identity;
  if (!manufacturer || String(manufacturer).trim().length < 6) {
    violations.push({
      rule: "Rule 6(1)(a)",
      title: "Missing / Incomplete Manufacturer / Packer Address",
      description: "The complete name and registered postal address (including city/state) of the manufacturer, packer, or importer is missing or illegible on the packaging.",
      severity: "HIGH",
      penalty: "Compounding notice or fine up to ₹25,000 under Section 36(1) of the Legal Metrology Act, 2009.",
      field: "Manufacturer_Identity"
    });
  } else {
    compliances.push({
      rule: "Rule 6(1)(a)",
      title: "Manufacturer / Packer Identity Declared",
      description: "Conspicuous display of registered manufacturer/packer name and address.",
      value: String(manufacturer).trim(),
      field: "Manufacturer_Identity"
    });
  }

  // -------------------------------------------------------------
  // 2. Rule 6(1)(b): Generic / Common Name of Commodity
  // -------------------------------------------------------------
  const genericName = extractedFields.Generic_Name;
  if (!genericName || String(genericName).trim().length < 3) {
    violations.push({
      rule: "Rule 6(1)(b)",
      title: "Generic / Common Commodity Name Missing",
      description: "The common or generic identity of the pre-packaged commodity is not prominently stated on the principal display panel.",
      severity: "HIGH",
      penalty: "Notice for seizure/prosecution under Rule 6(1)(b) read with Section 36.",
      field: "Generic_Name"
    });
  } else {
    compliances.push({
      rule: "Rule 6(1)(b)",
      title: "Generic / Common Name Declared",
      description: "Clear and unambiguous declaration of commodity nature.",
      value: String(genericName).trim(),
      field: "Generic_Name"
    });
  }

  // -------------------------------------------------------------
  // 3. Rule 6(1)(c): Standard Net Quantity & Unit Symbols
  // -------------------------------------------------------------
  const netQtyRaw = extractedFields.Net_Quantity_Raw;
  const illegalUnits = ["gms", "kgs", "ltr", "ltrs", "ml.", "m.l.", "pieces", "nos", "pcs"];

  if (!netQtyRaw || String(netQtyRaw).trim().length === 0) {
    violations.push({
      rule: "Rule 6(1)(c)",
      title: "Net Quantity Declaration Missing",
      description: "Net quantity in standard units of weight, measure or number is absent from the principal display panel.",
      severity: "CRITICAL",
      penalty: "Section 36 violation; mandatory fine up to ₹25,000 for first offence, ₹50,000 for second.",
      field: "Net_Quantity_Raw"
    });
  } else {
    const qtyStrLower = String(netQtyRaw).toLowerCase();
    const hasIllegalUnit = illegalUnits.some(unit => qtyStrLower.includes(unit));

    if (hasIllegalUnit) {
      violations.push({
        rule: "Rule 6(1)(c)",
        title: `Non-Standard Net Quantity Unit Symbol: '${netQtyRaw}'`,
        description: `Use of non-standard units (e.g. 'gms', 'kgs', 'ltr', 'pcs'). Only standard SI symbols ('g', 'kg', 'ml', 'l', 'N') are permissible under Legal Metrology Rules.`,
        severity: "HIGH",
        penalty: "Statutory violation under Rule 6(1)(c) & Second Schedule.",
        field: "Net_Quantity_Raw"
      });
    } else {
      compliances.push({
        rule: "Rule 6(1)(c)",
        title: "Net Quantity in Standard Metric Units",
        description: "Standard metric symbol used compliant with the First and Second Schedules.",
        value: String(netQtyRaw).trim(),
        field: "Net_Quantity_Raw"
      });
    }
  }

  // -------------------------------------------------------------
  // 4. Rule 6(1)(d): Month and Year of Manufacture / Packing
  // -------------------------------------------------------------
  const mfgDate = extractedFields.Mfg_Date;
  if (!mfgDate || String(mfgDate).trim().length === 0) {
    violations.push({
      rule: "Rule 6(1)(d)",
      title: "Month and Year of Manufacture / Packing Absent",
      description: "Mandatory date of packaging/manufacturing/import is missing from the consumer panel.",
      severity: "HIGH",
      penalty: "Actionable offence under Rule 6(1)(d); product non-saleable.",
      field: "Mfg_Date"
    });
  } else {
    compliances.push({
      rule: "Rule 6(1)(d)",
      title: "Month & Year of Manufacture / Packing Declared",
      description: "Traceability date clearly stamped for consumer shelf-life awareness.",
      value: String(mfgDate).trim(),
      field: "Mfg_Date"
    });
  }

  // -------------------------------------------------------------
  // 5. Rule 6(1)(e): Maximum Retail Price & Tax Declaration
  // -------------------------------------------------------------
  const mrpValue = extractedFields.MRP_Value;
  const taxDeclared = Boolean(extractedFields.Tax_Declaration);

  if (!mrpValue || String(mrpValue).trim().length === 0) {
    violations.push({
      rule: "Rule 6(1)(e)",
      title: "Maximum Retail Price (MRP) Declaration Missing",
      description: "Retail sale price in Indian Rupees (₹ or Rs.) is not displayed.",
      severity: "CRITICAL",
      penalty: "Strict liability under Section 36(1); seizure of non-compliant packages.",
      field: "MRP_Value"
    });
  } else {
    compliances.push({
      rule: "Rule 6(1)(e)",
      title: "Maximum Retail Price (MRP) Stated",
      description: "Clear numeric retail price displayed in statutory format.",
      value: `₹ ${String(mrpValue).trim()}`,
      field: "MRP_Value"
    });
  }

  if (!taxDeclared) {
    violations.push({
      rule: "Rule 6(1)(e)",
      title: "Missing Mandatory Clause 'Inclusive of all taxes'",
      description: "Statutory mandatory text '(Inclusive of all taxes)' or 'Incl. of all taxes' is missing near the Maximum Retail Price declaration.",
      severity: "HIGH",
      penalty: "Direct infringement of Rule 6(1)(e); punishable with financial fine.",
      field: "Tax_Declaration"
    });
  } else {
    compliances.push({
      rule: "Rule 6(1)(e)",
      title: "Inclusive of All Taxes Declared",
      description: "Unambiguous tax declaration protects consumers from unauthorized price surcharges.",
      value: "Inclusive of all taxes (Verified)",
      field: "Tax_Declaration"
    });
  }

  // -------------------------------------------------------------
  // 6. Rule 6(1)(n) / 6(1)(f): Consumer Care Grievance Redressal
  // -------------------------------------------------------------
  const carePhone = extractedFields.Care_Phone;
  const careEmail = extractedFields.Care_Email;

  if (!carePhone && !careEmail) {
    violations.push({
      rule: "Rule 6(1)(n)",
      title: "Consumer Grievance Redressal Details Missing",
      description: "Name, address, telephone number, or email address of the person/office to be contacted for consumer grievances is missing.",
      severity: "HIGH",
      penalty: "Mandatory redressal non-compliance under Rule 6(1)(n).",
      field: "Care_Contact"
    });
  } else {
    const contactStr = [carePhone ? `Tel: ${carePhone}` : null, careEmail ? `Email: ${careEmail}` : null].filter(Boolean).join(" | ");
    compliances.push({
      rule: "Rule 6(1)(n)",
      title: "Consumer Grievance Redressal Stamped",
      description: "Active consumer contact channels provided for public redressal.",
      value: contactStr,
      field: "Care_Contact"
    });
  }

  // -------------------------------------------------------------
  // 7. Rule 6(10): Country of Origin (Imported Commodities)
  // -------------------------------------------------------------
  const origin = extractedFields.Country_of_Origin;
  if (origin) {
    compliances.push({
      rule: "Rule 6(10)",
      title: "Country of Origin Displayed",
      description: "Country of origin clearly identified on packaged unit.",
      value: String(origin).trim(),
      field: "Country_of_Origin"
    });
  } else {
    // If text hints at imported commodity but no origin
    if (textLower.includes("imported by") || textLower.includes("import") || textLower.includes("foreign")) {
      violations.push({
        rule: "Rule 6(10)",
        title: "Country of Origin Missing on Imported Package",
        description: "Imported pre-packaged commodity lacks conspicuous declaration of country of origin.",
        severity: "HIGH",
        penalty: "Prohibited under Rule 6(10) of Packaged Commodities Rules.",
        field: "Country_of_Origin"
      });
    } else {
      compliances.push({
        rule: "Rule 6(10)",
        title: "Domestic Commodity Origin Standard",
        description: "Manufactured domestically under Indian Legal Metrology jurisdiction.",
        value: "India (Domestic Standard)",
        field: "Country_of_Origin"
      });
    }
  }

  // -------------------------------------------------------------
  // 8. Rule 6(11): Unit Sale Price (USP) Calculation & Check
  // -------------------------------------------------------------
  const rawUsp = extractedFields.Unit_Sale_Price_Raw;
  if (mrpValue && netQtyRaw) {
    try {
      const cleanMrp = parseFloat(String(mrpValue).replace(/,/g, ""));
      const numMatch = String(netQtyRaw).match(/([\d\.]+)/);
      const unitMatch = String(netQtyRaw).match(/(kg|g|ml|l|n|units|pcs)/i);

      if (cleanMrp && numMatch && unitMatch) {
        const qtyNum = parseFloat(numMatch[1]);
        const qtyUnit = unitMatch[1].toLowerCase();

        // 1kg / 1L packages are exempt from USP
        const isExempt = (['kg', 'l'].includes(qtyUnit) && qtyNum === 1.0) || (['g', 'ml'].includes(qtyUnit) && qtyNum === 1000.0);

        if (!isExempt) {
          if (!rawUsp) {
            let expectedUsp = 0;
            let displayUnit = qtyUnit;
            if (qtyUnit === 'g') {
              expectedUsp = cleanMrp / qtyNum;
              displayUnit = 'g';
            } else if (qtyUnit === 'kg') {
              expectedUsp = cleanMrp / qtyNum;
              displayUnit = 'kg';
            } else if (qtyUnit === 'ml') {
              expectedUsp = cleanMrp / qtyNum;
              displayUnit = 'ml';
            } else if (qtyUnit === 'l') {
              expectedUsp = cleanMrp / qtyNum;
              displayUnit = 'l';
            } else {
              expectedUsp = cleanMrp / qtyNum;
            }

            violations.push({
              rule: "Rule 6(11)",
              title: "Unit Sale Price (USP) Declaration Missing",
              description: `Under 2022 amendments, packages with net quantity not equal to 1 kg/1 L must declare Unit Sale Price. Calculated required USP: ₹${expectedUsp.toFixed(2)} per ${displayUnit}.`,
              severity: "MEDIUM",
              penalty: "Notice for contravention of Rule 6(11) of Legal Metrology (Packaged Commodities) Rules.",
              field: "Unit_Sale_Price_Raw"
            });
          } else {
            compliances.push({
              rule: "Rule 6(11)",
              title: "Unit Sale Price (USP) Declared",
              description: "Transparent unit rate allows consumers fair price comparison across brand volumes.",
              value: String(rawUsp).trim(),
              field: "Unit_Sale_Price_Raw"
            });
          }
        } else {
          compliances.push({
            rule: "Rule 6(11)",
            title: "Unit Sale Price (USP) Exemption Satisfied",
            description: "Standard unit volume package (1 kg / 1 L) qualifies for statutory USP exemption.",
            value: "Statutory 1-Unit Exemption",
            field: "Unit_Sale_Price_Raw"
          });
        }
      }
    } catch (e) {
      console.warn("USP computation notice:", e.message);
    }
  }

  // -------------------------------------------------------------
  // 9. Rule 18(1): Smudging / Dual Pricing / Sticker Alteration
  // -------------------------------------------------------------
  if (textLower.includes("overprinted") || textLower.includes("dual mrp") || textLower.includes("overwritten")) {
    violations.push({
      rule: "Rule 18(1)",
      title: "Dual MRP Sticker / Unauthorized Price Alteration",
      description: "Alteration, obliteration, or affixing higher price stickers over the original manufacturer MRP is strictly prohibited.",
      severity: "CRITICAL",
      penalty: "Severe offence under Section 18 & 36 of Legal Metrology Act, 2009; immediate product seizure.",
      field: "MRP_Alteration"
    });
  }

  // Overall Legality Determination
  const isCompliant = violations.length === 0;
  const status = isCompliant ? "LEGAL" : "ILLEGAL";
  const totalChecks = violations.length + compliances.length;
  const complianceScore = totalChecks > 0 ? Math.round((compliances.length / totalChecks) * 100) : 0;

  return {
    status,
    isCompliant,
    complianceScore,
    violationsCount: violations.length,
    compliancesCount: compliances.length,
    violations,
    compliances
  };
}

module.exports = {
  validateLegalMetrology
};
