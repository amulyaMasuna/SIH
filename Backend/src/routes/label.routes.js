const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const labelRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

labelRouter.post("/audit-label", upload.single("label_file"), async (req, res) => {
  console.log("Image recieved at backend.");
  try {
    if(!req.file) {
      return res.status(400).json({ success: false, message: "No image file received." });
    }

    const form = new FormData();
    form.append("file", req.file.buffer, req.file.originalname);

    const pythonServiceResponse = await axios.post("http://127.0.0.1:8080/api/process-label", form, {
      headers: { ...form.getHeaders() },
      timeout: 90000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    const { extracted_fields, compliance_audit, raw_text_dump } = pythonServiceResponse.data;

    // Database Save

    console.log(extracted_fields);

    return res.status(200).json({
      success: true,
      audit: compliance_audit,
      fields: extracted_fields, 
      rawText: raw_text_dump,
    })
  } catch(err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error."
    })
  }
})

module.exports = labelRouter;