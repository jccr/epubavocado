import type { EntityConstructor } from './entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Resource<TBase extends EntityConstructor>(Base: TBase) {
  return class Resource extends Base {
    href() {
      return this._resolve('./@href')
    }

    mediaType() {
      return this._resolve('./@media-type')
    }
  }
}
