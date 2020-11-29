[![ci](https://github.com/jccr/epubavocado/workflows/ci/badge.svg)](https://github.com/jccr/epubavocado/actions?query=workflow%3Aci)
[![npm](https://img.shields.io/npm/v/epubavocado)](https://www.npmjs.com/package/epubavocado)
[![TypeScript](https://badgen.net/badge/-/TypeScript/blue?icon=typescript&label)](http://www.typescriptlang.org/)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)

# 📗epubavocado🥑
I am an [EPUB 3.2](https://www.w3.org/publishing/epub3/index.html) object model aspiring to be standards compliant.

## Features
- [ ] Works in browser
- [x] Runs in Node.js
- [ ] Runs in [Deno](https://deno.land/)
- [ ] Types
- [ ] Test suite
- [ ] Benchmarks
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
See this [example](https://github.com/jccr/epubavocado/blob/main/test/package.test.ts) from the tests.
