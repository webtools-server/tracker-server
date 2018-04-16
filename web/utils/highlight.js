/**
 * 简洁版语法高亮
 * @see https://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
 */

function syntaxHighlight(json) {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }

  if (!json) {
    return '';
  }

  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
    let cls = 'hl-number';

    if (/^"/.test(match)) {
      cls = /:$/.test(match) ? 'hl-key' : 'hl-string';
    } else if (/true|false/.test(match)) {
      cls = 'hl-boolean';
    } else if (/null/.test(match)) {
      cls = 'hl-null';
    }
    return `<span class="${cls}">${match}</span>`;
  });
}

export default syntaxHighlight;
