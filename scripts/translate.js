const axios = require("axios");
const { yandexAuth } = require("@/config.json");

module.exports = {
  async exec(originalText) {
    const language = await axios.post("https://translate.api.cloud.yandex.net/translate/v2/detect", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ yandexAuth }`
      },
      params: {
        key: yandexAuth,
        text: originalText
      }
    }).then((response) => response.data);
    const translatedText = await axios.post("https://translate.yandex.net/api/v1.5/tr.json/translate", {
      params: {
        key: yandexAuth,
        text: originalText,
        lang: `${ language.lang }-en`
      }
    }).then((response) => response.data.text[0]);
    return translatedText;
  }
}