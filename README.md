[![npm](https://img.shields.io/npm/v/epubavocado)](https://www.npmjs.com/package/epubavocado)
[![Node.js](https://github.com/jccr/epubavocado/workflows/Node.js/badge.svg)](https://github.com/jccr/epubavocado/actions?query=workflow%3ANode.js)
[![Browser](https://github.com/jccr/epubavocado/workflows/Browser/badge.svg)](https://github.com/jccr/epubavocado/actions?query=workflow%3ABrowser)
[![Deno](https://github.com/jccr/epubavocado/workflows/Deno/badge.svg)](https://github.com/jccr/epubavocado/actions?query=workflow%3ADeno)

# 📗epubavocado🥑
I am an [EPUB 3.2](https://www.w3.org/publishing/epub3/index.html) object model aspiring to be standards compliant.

## Features
- [ ] Documentation
- [x] Types
  - [ ] TypeScript strict
- [ ] Test suite
- [ ] Benchmarks
- [ ] Performance tuning

### Runtime support
- [ ] Browser
- [x] Node.js
- [ ] [Deno](https://deno.land/)
- [x] [GraphQL.js](https://graphql.org/graphql-js/)

### Standards-compliance
- [EPUB Open Container Format (OCF) 3.2](https://www.w3.org/publishing/epub32/epub-ocf.html)
  - [ ] [3.5.2.1 Container File (`container.xml`)](https://www.w3.org/publishing/epub32/epub-ocf.html#sec-container-metainf-container.xml)
- [EPUB Packages 3.2](https://www.w3.org/publishing/epub32/epub-packages.html)
  - [x] [3.4.1 The `package` Element](https://www.w3.org/publishing/epub32/epub-packages.html#sec-package-elem)
  - [x] [3.4.2 Shared Attributes](https://www.w3.org/publishing/epub32/epub-packages.html#sec-shared-attrs)
  - [x] [3.4.3 Metadata](https://www.w3.org/publishing/epub32/epub-packages.html#sec-pkg-metadata)
  - [x] [3.4.4 Manifest](https://www.w3.org/publishing/epub32/epub-packages.html#sec-pkg-manifest)
  - [x] [3.4.5 Spine](https://www.w3.org/publishing/epub32/epub-packages.html#sec-pkg-spine)
  - [ ] [3.4.6 Collections](https://www.w3.org/publishing/epub32/epub-packages.html#sec-pkg-collections)
  - [ ] [3.4.7 Legacy](https://www.w3.org/publishing/epub32/epub-packages.html#sec-pkg-legacy)
  - [x] [4.1.1 Unique Identifier](https://www.w3.org/publishing/epub32/epub-packages.html#sec-metadata-elem-identifiers-uid)
  - [x] [4.1.2 Release Identifier](https://www.w3.org/publishing/epub32/epub-packages.html#sec-metadata-elem-identifiers-pid)
  - [ ] [4.2.4 The `prefix` Attribute](https://www.w3.org/publishing/epub32/epub-packages.html#sec-prefix-attr)
    - [x] Raw value
    - [ ] Syntax
    - [ ] Resolving as model
    - [ ] Processing IRI
  - [ ] [4.2.4 The `property` Data Type](https://www.w3.org/publishing/epub32/epub-packages.html#sec-property-datatype)
    - [x] Syntax
    - [x] Resolving as model
    - [ ] Processing IRI
  - [ ] [4.3 Package Rendering Metadata](https://www.w3.org/publishing/epub32/epub-packages.html#sec-package-metadata-rendering)
    - [x] Raw value
    - [ ] Syntax
    - [ ] Resolving as model
    - [ ] Processing IRI

## Usage

### Node.js

See this [example](https://github.com/jccr/epubavocado/blob/main/test/package.test.ts) from the tests.

### GraphQL.js

See this [example](https://github.com/jccr/epubavocado/blob/main/test/graphql/graphql.spec.ts) from the tests.
