/**
 * Run a callback over all children of a given element using depth-first
 * traversal.
 *
 * @param {HTMLElement} element
 * @param {Function}    callback
 */
function iterateDOM(element, callback) {
  const nodes = [];

  nodes.push(element);

  do {
    element = nodes.shift();

    callback(element);

    nodes.unshift(element.children);
  } while (nodes.length > 0);
}

/**
 * Determine if an element matches a given string query.
 *
 * @param {HTMLElement} element
 * @param {string}      query
 *
 * @return {bool}
 */
function matchElement(element, query) {
  return element.tagName === query.toUpperCase() || element.classList.contains(query);
}

/**
 * Return the first element matching the given query.
 *
 * @param {string} query
 *
 * @return {HTMLElement}
 */
function querySelector(query) {
  return querySelectorAll(query)[0];
}

/**
 * Return all elements matching the given query.
 *
 * @param {string} query
 *
 * @return {HTMLElement[]}
 */
function querySelectorAll(query) {
  const elements = [];

  iterateDOM(this, function (element) {
    if (matchElement(element, query)) {
      elements.push(element);
    }
  });

  return elements;
}
