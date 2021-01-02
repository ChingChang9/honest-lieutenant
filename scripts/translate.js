const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { azurAuth } = require("@/config.json");

module.exports = {
  exec(text) {
    return axios({
      baseURL: "https://api.cognitive.microsofttranslator.com",
      url: "/translate",
      method: "post",
      headers: {
        "Ocp-Apim-Subscription-Key": azurAuth,
        "Ocp-Apim-Subscription-Region": "global",
        "Content-Type": "application/json",
        "X-ClientTraceId": uuidv4().toString()
      },
      params: {
        "api-version": "3.0",
        to: "en",
        toScript: "latn"
      },
      data: [{
        text
      }],
      responseType: "json"
    }).then(response => response.data[0].translations[0].text);
  }
};