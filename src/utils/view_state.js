/**
 * view state
 */

const el = document.getElementById('__VIEW_STATE__');
let viewState = {};

if (el) {
  try {
    viewState = JSON.parse(el.value);
  } catch (e) {
    viewState = {};
  }
}

module.exports = viewState;
