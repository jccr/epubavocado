import { readFileSync } from 'fs'
import { join } from 'path'

import xmldom from 'xmldom'

import { Container } from '../src/mod.js'

test('Container', () => {
  const xmlDoc = new xmldom.DOMParser().parseFromString(
    readFileSync(join(__dirname, 'data/container.xml'), 'utf-8'),
  )

  const container = new Container(xmlDoc)
  expect(container.version()).toBe('1.0')

  const rootfiles = container.rootfiles()
  expect(rootfiles.length).toEqual(2)

  const rootfile1 = rootfiles[0]
  expect(rootfile1.fullPath()).toBe('default.opf')
  expect(rootfile1.mediaType()).toBe('application/oebps-package+xml')

  const rootfile2 = rootfiles[1]
  expect(rootfile2.fullPath()).toBe('other.opf')
  expect(rootfile2.mediaType()).toBe('application/oebps-package+xml')

  const links = container.links()
  expect(links.length).toEqual(1)

  const link = links[0]
  expect(link.href()).toBe('mapping.xhtml')
  expect(link.mediaType()).toBe('application/xhtml+xml')
  expect(link.rel()[0]).toBe('mapping')

  const defaultRendition = container.defaultRendition()
  expect(defaultRendition?.fullPath()).toBe('default.opf')
  expect(defaultRendition?.mediaType()).toBe('application/oebps-package+xml')
})
