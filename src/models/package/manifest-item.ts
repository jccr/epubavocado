import { Entity } from '../mixins/entity.js'
import { ID } from './mixins/id.js'
import { Properties } from './mixins/properties.js'
import { Resource } from '../mixins/resource.js'
import { Maybe } from '../../util.js'
import { resolveIdref } from './util.js'

export class ManifestItem extends Resource(Properties(ID(Entity))) {
  mediaOverlay(): Maybe<ManifestItem> {
    const idref = this._resolve('./@media-overlay')
    return resolveIdref(this, idref)
  }

  fallback(): Maybe<ManifestItem> {
    const idref = this._resolve('./@fallback')
    return resolveIdref(this, idref)
  }
}
