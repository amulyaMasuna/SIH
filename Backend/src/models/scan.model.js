const mongoose = require("mongoose");

const violationItemSchema = new mongoose.Schema({
  rule: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  severity: { type: String, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"], default: "HIGH" },
  penalty: { type: String, default: "Penalty under Section 36 of Legal Metrology Act, 2009 (up to ₹25,000 for first offence)" },
  field: { type: String }
}, { _id: false });

const complianceItemSchema = new mongoose.Schema({
  rule: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  value: { type: String },
  field: { type: String }
}, { _id: false });

const scanSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  userName: {
    type: String,
    default: "Inspecting User"
  },
  userRole: {
    type: String,
    enum: ["officer", "consumer", "fieldOfficer", "metrologyOfficer"],
    default: "officer"
  },
  commodity: {
    type: String,
    default: "Packaged Commodity"
  },
  brand: {
    type: String,
    default: "Unspecified"
  },
  location: {
    type: String,
    default: "Market Inspection Point"
  },
  imageUrl: {
    type: String
  },
  status: {
    type: String,
    enum: ["LEGAL", "ILLEGAL"],
    required: true
  },
  isCompliant: {
    type: Boolean,
    required: true
  },
  complianceScore: {
    type: Number,
    default: 0
  },
  violations: [violationItemSchema],
  compliances: [complianceItemSchema],
  extractedFields: {
    type: Object,
    default: {}
  },
  rawText: {
    type: String,
    default: ""
  },
  boxes: {
    type: Array,
    default: []
  },
  remarks: [{
    by: String,
    role: String,
    date: { type: Date, default: Date.now },
    text: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Scan", scanSchema);
