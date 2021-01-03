import { Entity } from './mixins/entity.js'
import { Resource } from './mixins/resource.js'
import { Maybe, splitRelAttribute } from '../util.js'
import { select } from '../xpath.js'

export class ContainerLink extends Resource(Entity) {
  rel(): string[] {
    const rel = this._resolve('./@rel') as string
    if (rel) {
      return splitRelAttribute(rel)
    }
    return []
  }
}

export class Rootfile extends Entity {
  fullPath(): Maybe<string> {
    return this._resolve('./@full-path')
  }

  mediaType(): Maybe<string> {
    return this._resolve('./@media-type')
  }
}

export class Container extends Entity {
  constructor(doc: Node) {
    super(select('/ocf:container', doc) as Node)
  }

  version(): Maybe<string> {
    return this._resolve('./@version')
  }

  rootfiles(): Rootfile[] {
    return this._resolveAll('./ocf:rootfiles/ocf:rootfile', Rootfile)
  }

  links(): ContainerLink[] {
    return this._resolveAll('./ocf:links/ocf:link', ContainerLink)
  }

  defaultRendition(): Maybe<Rootfile> {
    return this.rootfiles()[0]
  }
}
