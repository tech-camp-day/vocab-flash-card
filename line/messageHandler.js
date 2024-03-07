/**
 * จัดการกับเหตุการณ์ที่เข้ามา
 * @param {object} event - อ็อบเจ็กต์เหตุการณ์
 */
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

}

module.exports = { handleEvent };