import type { EntityConstructor } from '../../mixins/entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function ID<TBase extends EntityConstructor>(Base: TBase) {
  return class ID extends Base {
    id() {
      return this._resolve('./@id')
    }
  }
}
