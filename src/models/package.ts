import { Constructor } from './mixins/constructor.js'
import { Entity, EntityConstructor } from './mixins/entity.js'
import { I18n } from './package/mixins/i18n.js'
import { ID } from './package/mixins/id.js'
import { Properties } from './package/mixins/properties.js'
import { Resource } from './mixins/resource.js'
import { Value } from './package/mixins/value.js'
import { Maybe, splitRelAttribute, toArray } from '../util.js'
import { prefixMap, select } from '../xpath.js'
import { ManifestItem } from './package/manifest-item.js'
import { Manifest } from './package/manifest.js'
import { SpineItem } from './package/spine-item.js'
import { Spine } from './package/spine.js'
import {
  idFilter,
  attributeFilter,
  anyPropertiesFilter,
  allPropertiesFilter,
  anyRelFilter,
  allRelFilter,
} from './package/util.js'

export { ManifestItem, Manifest, SpineItem, Spine }

const nodeTypeMap: () => {
  [prefix: string]: Constructor<Entity>
} = () => ({
  'opf:package': Package,
  'opf:metadata': Metadata,
  'opf:manifest': Manifest,
  'opf:spine': Spine,
  'opf:meta': Meta,
  'opf:item': ManifestItem,
  'opf:itemref': SpineItem,
  'opf:link': Link,
  // 'opf:collection': Collection,
  'dc:identifier': Identifier,
  'dc:title': Title,
  'dc:language': Language,
  'dc:contributor': Contributor,
  'dc:coverage': Coverage,
  'dc:creator': Creator,
  'dc:date': Date,
  'dc:description': Description,
  'dc:format': Format,
  'dc:publisher': Publisher,
  'dc:relation': Relation,
  'dc:rights': Rights,
  'dc:source': Source,
  'dc:subject': Subject,
  'dc:type': Type,
})

function MetaProperties<TBase extends EntityConstructor>(Base: TBase) {
  return class MetaProperties extends Base {
    _resolveMetaProperty(property: string, constructor = Meta) {
      return toArray(this._resolveMetaPropertyList(property, constructor))[0]
    }

    _resolveMetaPropertyList(property: string, constructor = Meta) {
      const id = ((this as unknown) as Meta).id()
      if (!id) {
        return []
      }

      const propertyMap = (this._context as Package).metadata()
        ?._metaPropertyMap[id]

      if (!propertyMap) {
        return []
      }

      const metaNodes = propertyMap[property]
      if (!metaNodes) {
        return []
      }

      return metaNodes.map((node: Node) => new constructor(node, this._context))
    }

    alternateScript() {
      return this.alternateScripts()[0]
    }

    alternateScripts() {
      return this._resolveMetaPropertyList('alternate-script')
    }

    displaySeq() {
      return this._resolveMetaProperty('display-seq')
    }

    fileAs() {
      return this._resolveMetaProperty('file-as')
    }

    groupPosition() {
      return this._resolveMetaProperty('group-position')
    }

    metaAuth() {
      return this._resolveMetaProperty('meta-auth')
    }
  }
}

function MetaAttributes<TBase extends EntityConstructor>(Base: TBase) {
  return class MetaAttributes extends Base {
    property() {
      return this._resolve('./@property')
    }

    scheme() {
      return this._resolve('./@scheme')
    }
  }
}

function Refines<TBase extends EntityConstructor>(Base: TBase) {
  return class Refines extends Base {
    refines() {
      const refines = this._resolve('./@refines') as string
      if (!refines) {
        return null
      }

      // drop the # prefix
      const idRefined = refines[0] === '#' ? refines.substr(1) : refines
      const node = this._context._select(`//*[@id='${idRefined}']`) as Attr
      if (!node) {
        return null
      }

      const name = node.localName
      const namespace = node.namespaceURI
      if (!namespace) {
        return null
      }

      const prefix = prefixMap[namespace]
      const typeConstructor = nodeTypeMap()[`${prefix}:${name}`]
      if (!typeConstructor) {
        return null
      }

      return new typeConstructor(node, this._context)
    }
  }
}

export class Meta extends MetaProperties(
  MetaAttributes(Refines(I18n(Value(ID(Entity))))),
) {}

export class Identifier extends Value(MetaProperties(ID(Entity))) {
  identifierType(): Maybe<Meta> {
    return this._resolveMetaProperty('identifier-type')
  }
}

export class Title extends Value(I18n(MetaProperties(ID(Entity)))) {
  titleType(): Maybe<Meta> {
    return this._resolveMetaProperty('title-type')
  }
}

export class Language extends Value(MetaProperties(ID(Entity))) {}

export class Contributor extends Value(I18n(MetaProperties(ID(Entity)))) {
  role(): Maybe<Meta> {
    return this._resolveMetaProperty('role')
  }
}

export class Coverage extends Value(I18n(MetaProperties(ID(Entity)))) {}

export class Creator extends Contributor {}

export class Date extends Value(MetaProperties(ID(Entity))) {}

export class Description extends Value(I18n(MetaProperties(ID(Entity)))) {}

export class Format extends Value(MetaProperties(ID(Entity))) {}

export class Publisher extends Value(I18n(MetaProperties(ID(Entity)))) {}

export class Relation extends Value(I18n(MetaProperties(ID(Entity)))) {}

export class Rights extends Value(I18n(MetaProperties(ID(Entity)))) {}

export class Source extends Identifier {
  sourceOf(): Maybe<Meta> {
    return this._resolveMetaProperty('source-of')
  }
}

export class Subject extends Value(I18n(MetaProperties(ID(Entity)))) {
  authority(): Maybe<Meta> {
    return this._resolveMetaProperty('authority')
  }

  term(): Maybe<Meta> {
    return this._resolveMetaProperty('term')
  }
}

export class Type extends Value(MetaProperties(ID(Entity))) {}

export class BelongsToCollection extends Value(
  I18n(Refines(MetaAttributes(MetaProperties(ID(Entity))))),
) {
  identifier(): Maybe<Meta> {
    return this._resolveMetaProperty('dcterms:identifier')
  }

  collectionType(): Maybe<Meta> {
    return this._resolveMetaProperty('collection-type')
  }

  belongsToCollection(): Meta {
    return this.belongsToCollections()[0]
  }

  belongsToCollections(): Meta[] {
    return this._resolveMetaPropertyList(
      'belongs-to-collection',
      BelongsToCollection,
    )
  }
}

export class Link extends Resource(Properties(Refines(ID(Entity)))) {
  rel(): Maybe<string> {
    return this.rels()[0]
  }

  rels(): string[] {
    const rel = this._resolve('./@rel') as string
    if (rel) {
      return splitRelAttribute(rel)
    }
    return []
  }
}

export class Metadata extends ID(Entity) {
  _metaPropertyMap: {
    [idRefined: string]: {
      [property: string]: Node[]
    }
  }

  constructor(node: Node, context: Entity) {
    super(node, context)

    this._metaPropertyMap = {}

    const metaRefiningSelected = toArray(
      this._selectAll('./opf:meta[@refines and @property]'),
    )

    metaRefiningSelected.forEach((selectedValue) => {
      const node = selectedValue as Node
      if (!node) {
        return
      }

      const refinesAttr = select('./@refines', node)
      if (!refinesAttr) {
        return
      }

      const refinesValue = (refinesAttr as Attr).value

      // drop the # prefix
      const idRefined =
        refinesValue[0] === '#' ? refinesValue.substr(1) : refinesValue

      const propertyAttr = select('./@property', node)
      if (!propertyAttr) {
        return
      }

      const property = (propertyAttr as Attr).value

      if (!this._metaPropertyMap[idRefined]) {
        this._metaPropertyMap[idRefined] = {}
      }

      if (!this._metaPropertyMap[idRefined][property]) {
        this._metaPropertyMap[idRefined][property] = []
      }

      this._metaPropertyMap[idRefined][property].push(node)
    })
  }

  identifier({ id }: { id?: string }): Maybe<Identifier> {
    return this._resolve(`./dc:identifier${idFilter(id)}`, Identifier)
  }

  modified(): Maybe<Meta> {
    const node = this._select(
      "./opf:meta[@property='dcterms:modified' and not(@refines)]",
    ) as Node
    if (node) {
      return new Meta(node, this._context)
    }
  }

  title({ id }: { id?: string }): Title {
    return this.titles({ ids: id ? [id] : [] })[0]
  }

  titles({ ids }: { ids?: string[] }): Title[] {
    return this._resolveAll(`./dc:title${idFilter(ids)}`, Title)
  }

  language({ id }: { id?: string }): Language {
    return this.languages({ ids: id ? [id] : [] })[0]
  }

  languages({ ids }: { ids?: string[] }): Language[] {
    return this._resolveAll(`./dc:language${idFilter(ids)}`, Language)
  }

  contributor({ id }: { id?: string }): Contributor {
    return this.contributors({ ids: id ? [id] : [] })[0]
  }

  contributors({ ids }: { ids?: string[] }): Contributor[] {
    return this._resolveAll(`./dc:contributor${idFilter(ids)}`, Contributor)
  }

  coverage({ id }: { id?: string }): Coverage {
    return this.coverages({ ids: id ? [id] : [] })[0]
  }

  coverages({ ids }: { ids?: string[] }): Coverage[] {
    return this._resolveAll(`./dc:coverage${idFilter(ids)}`, Coverage)
  }

  creator({ id }: { id?: string }): Creator {
    return this.creators({ ids: id ? [id] : [] })[0]
  }

  creators({ ids }: { ids?: string[] }): Creator[] {
    return this._resolveAll(`./dc:creator${idFilter(ids)}`, Creator)
  }

  date({ id }: { id?: string }): Maybe<Date> {
    return this._resolve(`./dc:date${idFilter(id)}`, Date)
  }

  description({ id }: { id?: string }): Description {
    return this.descriptions({ ids: id ? [id] : [] })[0]
  }

  descriptions({ ids }: { ids?: string[] }): Description[] {
    return this._resolveAll(`./dc:description${idFilter(ids)}`, Description)
  }

  format({ id }: { id?: string }): Format {
    return this.formats({ ids: id ? [id] : [] })[0]
  }

  formats({ ids }: { ids?: string[] }): Format[] {
    return this._resolveAll(`./dc:format${idFilter(ids)}`, Format)
  }

  publisher({ id }: { id?: string }): Publisher {
    return this.publishers({ ids: id ? [id] : [] })[0]
  }

  publishers({ ids }: { ids?: string[] }): Publisher[] {
    return this._resolveAll(`./dc:publisher${idFilter(ids)}`, Publisher)
  }

  relation({ id }: { id?: string }): Relation {
    return this.relations({ ids: id ? [id] : [] })[0]
  }

  relations({ ids }: { ids?: string[] }): Relation[] {
    return this._resolveAll(`./dc:relation${idFilter(ids)}`, Relation)
  }

  rights({ id }: { id?: string }): Rights {
    return this.rightses({ ids: id ? [id] : [] })[0]
  }

  rightses({ ids }: { ids?: string[] }): Rights[] {
    return this._resolveAll(`./dc:rights${idFilter(ids)}`, Rights)
  }

  source({ id }: { id?: string }): Source {
    return this.sources({ ids: id ? [id] : [] })[0]
  }

  sources({ ids }: { ids?: string[] }): Source[] {
    return this._resolveAll(`./dc:source${idFilter(ids)}`, Source)
  }

  subject({ id }: { id?: string }): Subject {
    return this.subjects({ ids: id ? [id] : [] })[0]
  }

  subjects({ ids }: { ids?: string[] }): Subject[] {
    return this._resolveAll(`./dc:subject${idFilter(ids)}`, Subject)
  }

  type({ id }: { id?: string }): Type {
    return this.types({ ids: id ? [id] : [] })[0]
  }

  types({ ids }: { ids?: string[] }): Type[] {
    return this._resolveAll(`./dc:type${idFilter(ids)}`, Type)
  }

  belongsToCollection({ id }: { id?: string }): BelongsToCollection {
    return this.belongsToCollections({ ids: id ? [id] : [] })[0]
  }

  belongsToCollections({
    ids,
  }: {
    ids?: string[]
  } = {}): BelongsToCollection[] {
    return this._resolveAll(
      `./opf:meta${idFilter(
        ids,
      )}[@property='belongs-to-collection' and not(@refines)]`,
      BelongsToCollection,
    )
  }

  meta({
    id,
    property,
    refines,
  }: {
    id?: string
    property?: string
    refines?: string
  } = {}): Maybe<Meta> {
    return this.metas({
      ids: id ? [id] : [],
      property,
      refines,
    })[0]
  }

  metas({
    ids,
    property,
    refines,
  }: {
    ids?: string[]
    property?: string
    refines?: string
  } = {}): Meta[] {
    return this._resolveAll(
      `./opf:meta${idFilter(ids)}${attributeFilter(
        '@property',
        property,
        'and',
      )}${attributeFilter(
        '@refines',
        refines ? `#${refines}` : undefined,
        'or',
      )}`,
      Meta,
    )
  }

  link({
    id,
    href,
    anyProperties,
    allProperties,
    onlyProperties,
    anyRel,
    allRel,
    onlyRel,
  }: {
    id?: string
    href?: string
    anyProperties?: string[]
    allProperties?: string[]
    onlyProperties?: string[]
    anyRel?: string[]
    allRel?: string[]
    onlyRel?: string[]
  } = {}): Maybe<Link> {
    return this.links({
      ids: id ? [id] : [],
      href,
      anyProperties,
      allProperties,
      onlyProperties,
      anyRel,
      allRel,
      onlyRel,
    })[0]
  }

  links(
    args: {
      ids?: string[]
      href?: string
      anyProperties?: string[]
      allProperties?: string[]
      onlyProperties?: string[]
      anyRel?: string[]
      allRel?: string[]
      onlyRel?: string[]
    } = {},
  ): Link[] {
    const {
      ids,
      href,
      anyProperties,
      allProperties,
      onlyProperties,
      anyRel,
      allRel,
      onlyRel,
    } = args

    if (onlyProperties) {
      return this.links({
        ...args,
        allProperties: onlyProperties,
        onlyProperties: undefined,
      }).filter(
        (item) => toArray(item.properties()).length === onlyProperties.length,
      )
    }

    if (onlyRel) {
      return this.links({
        ...args,
        allRel: onlyRel,
        onlyRel: undefined,
      }).filter((item) => toArray(item.rels()).length === onlyRel.length)
    }

    const expression = `./opf:link${idFilter(ids)}${attributeFilter(
      '@href',
      href,
    )}${anyPropertiesFilter(anyProperties)}${allPropertiesFilter(
      allProperties,
    )}${anyRelFilter(anyRel)}${allRelFilter(allRel)}`

    return this._resolveAll(expression, Link)
  }
}

export class Package extends I18n(ID(Entity)) {
  private _metadata: Maybe<Metadata>
  private _spine: Maybe<Spine>
  private _manifest: Maybe<Manifest>

  constructor(doc: Node) {
    super(select('/opf:package', doc) as Node)
  }

  version(): Maybe<string> {
    return this._resolve('./@version')
  }

  uniqueIdentifier(): Maybe<Identifier> {
    const uniqueIdentifierIDRef = this._resolve('./@unique-identifier')
    if (uniqueIdentifierIDRef) {
      return this.metadata()?.identifier({ id: uniqueIdentifierIDRef })
    }
  }

  releaseIdentifier(): Maybe<string> {
    const uniqueIdentifier = this.uniqueIdentifier()
    const modified = this.metadata()?.modified()
    if (uniqueIdentifier && modified) {
      return `${uniqueIdentifier.value()}@${modified.value()}`
    }
  }

  metadata(): Maybe<Metadata> {
    return (this._metadata =
      this._metadata || this._resolve('./opf:metadata', Metadata))
  }

  spine(): Maybe<Spine> {
    return (this._spine = this._spine || this._resolve('./opf:spine', Spine))
  }

  manifest(): Maybe<Manifest> {
    return (this._manifest =
      this._manifest || this._resolve('./opf:manifest', Manifest))
  }
}
