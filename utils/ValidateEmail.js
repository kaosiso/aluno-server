require("dotenv").config();
const axios = require("axios");

const validateEmail = async (email) => {
  try {
    const apiKey = process.env.ABSTRACT_API_KEY;
    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
    const { data } = await axios.get(url);

    // 🧪 Log full response
    console.log("📨 AbstractAPI Response:");
    console.log(JSON.stringify(data, null, 2));

    // 🚫 Block if format is invalid
    if (
      data.is_valid_format?.value === false ||
      data.is_valid_format?.value === "FALSE"
    ) {
      return {
        isValid: false,
        message: "Email format is invalid. Please use a correct email.",
      };
    }

    // 🚫 Block if disposable
    if (
      data.is_disposable_email === true ||
      data.is_disposable_email === "TRUE"
    ) {
      return {
        isValid: false,
        message:
          "Disposable email addresses are not allowed. Please use a permanent email.",
      };
    }

    // 🚫 Block if not deliverable
    if (data.deliverability !== "DELIVERABLE") {
      let message = "This email doesn't exist. Please check and try again.";
      if (data.deliverability === "RISKY") {
        message = "This email looks risky or temporary. Please use another.";
      } else if (data.deliverability === "UNKNOWN") {
        message =
          "We couldn't verify this email. Please double-check it or try a different one.";
      }

      return { isValid: false, message };
    }

    // 🚫 Block if quality score is low
    if (parseFloat(data.quality_score) < 0.3) {
      return {
        isValid: false,
        message:
          "This email appears low-quality or suspicious. Please use a more reliable one.",
      };
    }

    // ✅ All good
    return { isValid: true };
  } catch (error) {
    console.error(
      "Email validation API error:",
      error?.response?.data || error.message
    );
    return {
      isValid: false,
      message: "Email validation failed. Please try again later.",
    };
  }
};

module.exports = validateEmail;
