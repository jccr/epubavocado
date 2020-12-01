import type { EntityConstructor } from './entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function MetaAttributes<TBase extends EntityConstructor>(Base: TBase) {
  return class MetaAttributes extends Base {
    property() {
      return this._resolve('./@property')
    }

    scheme() {
      return this._resolve('./@scheme')
    }
  }
}
