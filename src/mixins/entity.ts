import type { SelectedValue } from 'xpath'
import { Maybe } from '../util.js'
import { select, selectAll } from '../xpath.js'

import { Constructor } from './constructor.js'

export type EntityConstructor = Constructor<Entity>

export class Entity {
  _node: Node
  _context: Entity

  constructor(node: Node, context?: Entity) {
    this._node = node
    this._context = context || this
  }

  _select(expression: string): Maybe<SelectedValue> {
    return select(expression, this._node)
  }

  _selectAll(expression: string): SelectedValue[] {
    return selectAll(expression, this._node)
  }

  _resolve(expression: string): Maybe<string>
  _resolve<T>(expression: string, constructor: Constructor<T>): Maybe<T>
  _resolve<T>(
    expression: string,
    constructor?: Constructor<T>,
  ): Maybe<T | string> {
    const node = this._select(expression)
    if (!node) {
      return null
    }
    if (constructor) {
      return new constructor(node, this._context)
    }
    const attrType = node as Attr
    const nodeType = node as Node
    if (attrType.value) {
      return attrType.value
    }
    if (nodeType.nodeValue) {
      return nodeType.nodeValue
    }
  }

  _resolveAll(expression: string): string[]
  _resolveAll<T>(expression: string, constructor: Constructor<T>): T[]
  _resolveAll<T>(
    expression: string,
    constructor?: Constructor<T>,
  ): T[] | string[] {
    const nodes = this._selectAll(expression)
    if (!nodes) {
      return []
    }
    if (constructor) {
      return nodes.map((node) => new constructor(node, this._context))
    }
    return nodes.map((node) => (node as Node).nodeValue) as string[]
  }
}
