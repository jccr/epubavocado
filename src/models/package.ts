import { Constructor } from '../mixins/constructor.js'
import { Entity } from '../mixins/entity.js'
import { I18n } from '../mixins/i18n.js'
import { ID } from '../mixins/id.js'
import { MetaAttributes } from '../mixins/meta-attributes.js'
import { MetaProperties } from '../mixins/meta-properties.js'
import { PropertiesList } from '../mixins/properties-list.js'
import { Refines } from '../mixins/refines.js'
import { Resource } from '../mixins/resource.js'
import { Value } from '../mixins/value.js'
import { Maybe, splitRelAttribute, toArray } from '../util.js'
import { select } from '../xpath.js'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const nodeTypeMap: () => {
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

const attributeFilter = (
  attribute: string,
  values?: string | string[],
  operator = 'or',
) =>
  values && values.length
    ? `[${toArray(values)
        .map((value) => `${attribute}='${value}'`)
        .join(` ${operator} `)}]`
    : ''

const attributeContainsWordFilter = (
  attribute: string,
  words?: string | string[],
  operator = 'or',
) =>
  words && words.length
    ? `[${toArray(words)
        .map(
          (value) =>
            `contains(concat(' ', normalize-space(${attribute}), ' '), ' ${value} ')`,
        )
        .join(` ${operator} `)}]`
    : ''

const idFilter = (id?: string | string[]) => attributeFilter('@id', id)

const anyPropertiesFilter = (anyProperties?: string[]) =>
  attributeContainsWordFilter('@properties', anyProperties, 'or')
const allPropertiesFilter = (allProperties?: string[]) =>
  attributeContainsWordFilter('@properties', allProperties, 'and')

const anyRelFilter = (anyProperties?: string[]) =>
  attributeContainsWordFilter('@rel', anyProperties, 'or')
const allRelFilter = (allProperties?: string[]) =>
  attributeContainsWordFilter('@rel', allProperties, 'and')

export class Meta extends MetaProperties(
  MetaAttributes(Refines(I18n(Value(ID(Entity))))),
) {
  get __typename(): string {
    return 'Meta'
  }
}

export class Spine extends ID(Entity) {
  get __typename(): string {
    return 'Spine'
  }

  pageProgressionDirection(): Maybe<string> {
    return this._resolve('./@page-progression-direction')
  }

  toc(): Maybe<ManifestItem> {
    const idref = this._resolve('./@toc')
    if (idref) {
      return toArray(
        (this._context as Package).manifest()?.item({ id: idref }),
      )[0]
    }
  }

  itemref({
    id,
    anyProperties,
    allProperties,
    onlyProperties,
    linear,
  }: {
    id?: string | string[]
    anyProperties?: string[]
    allProperties?: string[]
    onlyProperties?: string[]
    linear?: boolean
  }): SpineItem[] {
    if (linear !== undefined) {
      return this.itemref({
        id,
        anyProperties,
        allProperties,
        onlyProperties,
      })?.filter((item) => item.linear() === linear)
    }

    if (onlyProperties) {
      return this.itemref({
        id,
        anyProperties,
        allProperties: onlyProperties,
      })?.filter(
        (item) => toArray(item.properties()).length === onlyProperties.length,
      )
    }

    const expression = `./opf:itemref${idFilter(id)}${anyPropertiesFilter(
      anyProperties,
    )}${allPropertiesFilter(allProperties)}`

    return this._resolveAll(expression, SpineItem)
  }
}

export class SpineItem extends PropertiesList(ID(Entity)) {
  get __typename(): string {
    return 'SpineItem'
  }

  idref(): Maybe<ManifestItem> {
    const idref = this._resolve('./@idref')
    if (idref) {
      return toArray(
        (this._context as Package).manifest()?.item({ id: idref }),
      )[0]
    }
  }

  linear(): boolean {
    const linear = this._resolve('./@linear')
    if (linear === 'no') {
      return false
    }
    return true
  }
}

export class ManifestItem extends Resource(PropertiesList(ID(Entity))) {
  get __typename(): string {
    return 'ManifestItem'
  }

  mediaOverlay(): Maybe<ManifestItem> {
    const idref = this._resolve('./@media-overlay')
    if (idref) {
      return toArray(
        (this._context as Package).manifest()?.item({ id: idref }),
      )[0]
    }
  }

  fallback(): Maybe<ManifestItem> {
    const idref = this._resolve('./@fallback')
    if (idref) {
      return toArray(
        (this._context as Package).manifest()?.item({ id: idref }),
      )[0]
    }
  }
}

export class Manifest extends ID(Entity) {
  get __typename(): string {
    return 'Manifest'
  }

  item({
    id,
    href,
    anyProperties,
    allProperties,
    onlyProperties,
  }: {
    id?: string | string[]
    href?: string
    anyProperties?: string[]
    allProperties?: string[]
    onlyProperties?: string[]
  }): ManifestItem[] {
    if (onlyProperties) {
      return this.item({
        id,
        anyProperties,
        allProperties: onlyProperties,
      })?.filter(
        (item) => toArray(item.properties()).length === onlyProperties.length,
      )
    }

    const expression = `./opf:item${idFilter(id)}${attributeFilter(
      '@href',
      href,
    )}${anyPropertiesFilter(anyProperties)}${allPropertiesFilter(
      allProperties,
    )}`

    return this._resolveAll(expression, ManifestItem)
  }
}

export class Identifier extends Value(MetaProperties(ID(Entity))) {
  get __typename(): string {
    return 'Identifier'
  }

  identifierType(): Maybe<Meta> {
    return this._resolveMetaProperty('identifier-type')
  }
}

export class Title extends Value(I18n(MetaProperties(ID(Entity)))) {
  get __typename(): string {
    return 'Title'
  }

  titleType(): Maybe<Meta> {
    return this._resolveMetaProperty('title-type')
  }
}

export class Language extends Value(MetaProperties(ID(Entity))) {
  get __typename(): string {
    return 'Language'
  }
}

export class Contributor extends Value(I18n(MetaProperties(ID(Entity)))) {
  get __typename(): string {
    return 'Contributor'
  }

  role(): Maybe<Meta> {
    return this._resolveMetaProperty('role')
  }
}

export class Coverage extends Value(I18n(MetaProperties(ID(Entity)))) {
  get __typename(): string {
    return 'Coverage'
  }
}

export class Creator extends Contributor {
  get __typename(): string {
    return 'Creator'
  }
}

export class Date extends Value(MetaProperties(ID(Entity))) {
  get __typename(): string {
    return 'Date'
  }
}

export class Description extends Value(I18n(MetaProperties(ID(Entity)))) {
  get __typename(): string {
    return 'Description'
  }
}

export class Format extends Value(MetaProperties(ID(Entity))) {
  get __typename(): string {
    return 'Format'
  }
}

export class Publisher extends Value(I18n(MetaProperties(ID(Entity)))) {
  get __typename(): string {
    return 'Publisher'
  }
}

export class Relation extends Value(I18n(MetaProperties(ID(Entity)))) {
  get __typename(): string {
    return 'Relation'
  }
}

export class Rights extends Value(I18n(MetaProperties(ID(Entity)))) {
  get __typename(): string {
    return 'Rights'
  }
}

export class Source extends Identifier {
  get __typename(): string {
    return 'Source'
  }

  sourceOf(): Maybe<Meta> {
    return this._resolveMetaProperty('source-of')
  }
}

export class Subject extends Value(I18n(MetaProperties(ID(Entity)))) {
  get __typename(): string {
    return 'Subject'
  }

  authority(): Maybe<Meta> {
    return this._resolveMetaProperty('authority')
  }

  term(): Maybe<Meta> {
    return this._resolveMetaProperty('term')
  }
}

export class Type extends Value(MetaProperties(ID(Entity))) {
  get __typename(): string {
    return 'Type'
  }
}

export class BelongsToCollection extends Value(
  I18n(Refines(MetaAttributes(MetaProperties(ID(Entity))))),
) {
  get __typename(): string {
    return 'BelongsToCollection'
  }

  identifier(): Maybe<Meta> {
    return this._resolveMetaProperty('dcterms:identifier')
  }

  collectionType(): Maybe<Meta> {
    return this._resolveMetaProperty('collection-type')
  }

  belongsToCollection(): Meta[] {
    return this._resolveMetaPropertyList(
      'belongs-to-collection',
      BelongsToCollection,
    )
  }
}

export class Link extends Resource(PropertiesList(Refines(ID(Entity)))) {
  get __typename(): string {
    return 'Link'
  }

  rel(): string[] {
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

  get __typename(): string {
    return 'Metadata'
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

  private _resolveMetaItemProperty(
    id: string,
    property: string,
    constructor = Meta,
  ) {
    return toArray(
      this._resolveMetaItemPropertyAll(id, property, constructor),
    )[0]
  }

  private _resolveMetaItemPropertyAll(
    id: string,
    property: string,
    constructor = Meta,
  ) {
    const propertyMap = this._metaPropertyMap[id]
    if (!propertyMap) {
      return null
    }

    const metaNodes = propertyMap[property]
    if (!metaNodes) {
      return null
    }

    return metaNodes.map((node: Node) => new constructor(node, this._context))
  }

  identifier({ id }: { id?: string | string[] }): Maybe<Identifier> {
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

  title({ id }: { id?: string | string[] }): Title[] {
    return this._resolveAll(`./dc:title${idFilter(id)}`, Title)
  }

  language({ id }: { id?: string | string[] }): Language[] {
    return this._resolveAll(`./dc:language${idFilter(id)}`, Language)
  }

  contributor({ id }: { id?: string | string[] }): Contributor[] {
    return this._resolveAll(`./dc:contributor${idFilter(id)}`, Contributor)
  }

  coverage({ id }: { id?: string | string[] }): Coverage[] {
    return this._resolveAll(`./dc:coverage${idFilter(id)}`, Coverage)
  }

  creator({ id }: { id?: string | string[] }): Creator[] {
    return this._resolveAll(`./dc:creator${idFilter(id)}`, Creator)
  }

  date({ id }: { id?: string | string[] }): Date[] {
    return this._resolveAll(`./dc:date${idFilter(id)}`, Date)
  }

  description({ id }: { id?: string | string[] }): Description[] {
    return this._resolveAll(`./dc:description${idFilter(id)}`, Description)
  }

  format({ id }: { id?: string | string[] }): Format[] {
    return this._resolveAll(`./dc:format${idFilter(id)}`, Format)
  }

  publisher({ id }: { id?: string | string[] }): Publisher[] {
    return this._resolveAll(`./dc:publisher${idFilter(id)}`, Publisher)
  }

  relation({ id }: { id?: string | string[] }): Relation[] {
    return this._resolveAll(`./dc:relation${idFilter(id)}`, Relation)
  }

  rights({ id }: { id?: string | string[] }): Rights[] {
    return this._resolveAll(`./dc:rights${idFilter(id)}`, Rights)
  }

  source({ id }: { id?: string | string[] }): Source[] {
    return this._resolveAll(`./dc:source${idFilter(id)}`, Source)
  }

  subject({ id }: { id?: string | string[] }): Subject[] {
    return this._resolveAll(`./dc:subject${idFilter(id)}`, Subject)
  }

  type({ id }: { id?: string | string[] }): Type[] {
    return this._resolveAll(`./dc:type${idFilter(id)}`, Type)
  }

  belongsToCollection({
    id,
  }: {
    id?: string | string[]
  }): BelongsToCollection[] {
    return this._resolveAll(
      `./opf:meta${idFilter(
        id,
      )}[@property='belongs-to-collection' and not(@refines)]`,
      BelongsToCollection,
    )
  }

  meta({
    id,
    property,
    refines,
  }: {
    id?: string | string[]
    property?: string
    refines?: string
  }): Meta[] {
    return this._resolveAll(
      `./opf:meta${idFilter(id)}${attributeFilter(
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

  link(args: {
    id?: string | string[]
    href?: string
    anyProperties?: string[]
    allProperties?: string[]
    onlyProperties?: string[]
    anyRel?: string[]
    allRel?: string[]
    onlyRel?: string[]
  }): Link[] {
    const {
      id,
      href,
      anyProperties,
      allProperties,
      onlyProperties,
      anyRel,
      allRel,
      onlyRel,
    } = args

    if (onlyProperties) {
      return this.link({
        ...args,
        allProperties: onlyProperties,
        onlyProperties: undefined,
      }).filter(
        (item) => toArray(item.properties()).length === onlyProperties.length,
      )
    }

    if (onlyRel) {
      return this.link({ ...args, allRel: onlyRel, onlyRel: undefined }).filter(
        (item) => toArray(item.rel()).length === onlyRel.length,
      )
    }

    const expression = `./opf:link${idFilter(id)}${attributeFilter(
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

  get __typename(): string {
    return 'Package'
  }

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
