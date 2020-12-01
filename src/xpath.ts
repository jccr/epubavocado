import xpath from 'xpath'
import { Maybe } from './util.js'

export const namespaceMap = {
  xml: 'http://www.w3.org/XML/1998/namespace',
  opf: 'http://www.idpf.org/2007/opf',
  dc: 'http://purl.org/dc/elements/1.1/',
}

export const selectAll = xpath.useNamespaces(namespaceMap)
export const select = function (
  expression: string,
  node: Node,
): Maybe<xpath.SelectedValue> {
  return selectAll(expression, node, true)
}

/**
 * inverse of `namespaceMap`
 * ```
 *  {
 *    'http://www.idpf.org/2007/opf': 'opf',
 *    ...
 *  }
 * ```
 */
export const prefixMap: { [namespace: string]: string } = Object.assign(
  {},
  ...Object.entries(namespaceMap).map(([prefix, namespace]) => ({
    [namespace]: prefix,
  })),
)
