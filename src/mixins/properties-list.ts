import type { EntityConstructor } from './entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function PropertiesList<TBase extends EntityConstructor>(Base: TBase) {
  return class PropertiesList extends Base {
    properties() {
      const properties = this._resolve('./@properties') as string
      if (properties) {
        // normalize spaces and split space separated words
        return properties.replace(/\s+/g, ' ').split(' ')
      }
    }
  }
}
