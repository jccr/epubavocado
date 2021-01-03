import { Entity } from '../mixins/entity.js'
import { ID } from './mixins/id.js'
import { Properties } from './mixins/properties.js'
import { Maybe } from '../../util.js'
import { ManifestItem } from './manifest-item.js'
import { resolveIdref } from './util.js'

export class SpineItem extends Properties(ID(Entity)) {
  idref(): Maybe<ManifestItem> {
    const idref = this._resolve('./@idref')
    return resolveIdref(this, idref)
  }

  linear(): boolean {
    const linear = this._resolve('./@linear')
    if (linear === 'no') {
      return false
    }
    return true
  }
}
