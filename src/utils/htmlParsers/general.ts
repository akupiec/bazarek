import { JSDOM } from 'jsdom';

export function findNodeAndGetText(node: JSDOM, selector: string): string | undefined {
  const queryNode = node.window.document.querySelector(selector);
  if (queryNode) {
    return queryNode.textContent?.trim() || undefined;
  }
}

export function findNodeAndGetInt(node: JSDOM, selector: string): number | undefined {
  const srt = findNodeAndGetText(node, selector);
  const match = srt?.match(/\d+/);
  if (match && match[0]) {
    return parseInt(match[0]);
  }
}

export function findNodeAndGetFloat(node: JSDOM, selector: string): number | undefined {
  const srt = findNodeAndGetText(node, selector);
  const match = srt?.match(/\d+[,.]?\d+/);
  if (match && match[0]) {
    return parseFloat(match[0].replace(',', '.'));
  }
}
