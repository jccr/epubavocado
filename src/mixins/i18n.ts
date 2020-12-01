import type { EntityConstructor } from './entity.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function I18n<TBase extends EntityConstructor>(Base: TBase) {
  return class I18n extends Base {
    dir() {
      return (
        this._resolve('./@dir') ||
        this._resolve('../@dir') ||
        this._context._resolve('./@dir')
      )
    }

    lang() {
      return (
        this._resolve('./@xml:lang') ||
        this._resolve('../@xml:lang') ||
        this._context._resolve('./@xml:lang')
      )
    }
  }
}
