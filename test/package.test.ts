import 'jest-extended'

import { readFileSync } from 'fs'
import { join } from 'path'

import xmldom from 'xmldom'

import { Package, ManifestItem } from '../src/models.js'

describe('Package', () => {
  const xmlDoc = new xmldom.DOMParser().parseFromString(
    readFileSync(join(__dirname, 'data/package.opf'), 'utf-8'),
  )

  const testPackage = new Package(xmlDoc)

  test('version', () => {
    expect(testPackage.version()).toBe('3.0')
  })

  test('uniqueIdentifier', () => {
    const uniqueIdentifier = testPackage.uniqueIdentifier()
    expect(uniqueIdentifier?.id()).toBe('pub-id')
    expect(uniqueIdentifier?.value()).toBe('urn:isbn:9780316000000')
  })

  describe('manifest', () => {
    const manifest = testPackage.manifest()!
    expect(manifest).toBeDefined()
    test('items', () => {
      const items = manifest.items()!
      expect(items).toBeArray()
      expect(items).not.toBeEmpty()
      for (const item of items) {
        expect(item).toMatchObject(expect.any(ManifestItem))
      }
    })
    test('items(ids:)', () => {
      const ids = ['toc', 'xchapter_001', 'xchapter_136']
      const items = manifest.items({ ids })
      expect(items).toBeArrayOfSize(3)
      for (const item of items) {
        expect(item).toMatchObject(expect.any(ManifestItem))
        expect(item.id()).toBeOneOf(ids)
      }
      expect(items[0].id()).toBe(ids[0])
      expect(items[2].id()).toBe(ids[2])
    })
    test('items(anyProperties:)', () => {
      const ids = [
        'xchapter_004',
        'xchapter_042',
        'xchapter_077',
        'xchapter_088',
      ]
      const items = manifest.items({
        anyProperties: ['remote-resources', 'scripted'],
      })!
      expect(items).toBeArrayOfSize(4)
      for (const item of items) {
        expect(item).toMatchObject(expect.any(ManifestItem))
        expect(item.id()).toBeOneOf(ids)
      }
      expect(items[0].id()).toBe(ids[0])
      expect(items[1].id()).toBe(ids[1])
      expect(items[3].id()).toBe(ids[3])
    })
    test('items(allProperties:)', () => {
      const ids = ['xchapter_004', 'xchapter_042', 'xchapter_077']
      const items = manifest.items({
        allProperties: ['remote-resources', 'scripted'],
      })!
      expect(items).toBeArrayOfSize(3)
      for (const item of items) {
        expect(item).toMatchObject(expect.any(ManifestItem))
        expect(item.id()).toBeOneOf(ids)
      }
      expect(items[0].id()).toBe(ids[0])
      expect(items[2].id()).toBe(ids[2])
    })
    test('items(onlyProperties:)', () => {
      const toc = manifest.items({
        onlyProperties: ['nav'],
      })!
      expect(toc).toBeArrayOfSize(1)
      expect(toc[0].id()).toBe('toc')

      const xchapter_077 = manifest.items({
        onlyProperties: ['remote-resources', 'scripted'],
      })!
      expect(xchapter_077).toBeArrayOfSize(1)
      expect(xchapter_077[0].id()).toBe('xchapter_077')
    })

    test('item', () => {
      const item = manifest.item()!
      expect(item).toMatchObject(expect.any(ManifestItem))
    })
    test('item(id:)', () => {
      const id = 'toc'
      const item = manifest.item({ id })!
      expect(item).toMatchObject(expect.any(ManifestItem))
      expect(item.id()).toBe(id)
    })
    test('item(anyProperties:)', () => {
      const bad = manifest.item({ anyProperties: ['nav'] })!
      expect(bad).toMatchObject(expect.any(ManifestItem))
      expect(bad.id()).toBe('bad')

      const foobar = manifest.item({ anyProperties: ['foobar'] })!
      expect(foobar).not.toBeDefined()
    })
    test('item(allProperties:)', () => {
      const xchapter_004 = manifest.item({
        allProperties: ['remote-resources', 'scripted'],
      })!
      expect(xchapter_004).toMatchObject(expect.any(ManifestItem))
      expect(xchapter_004.id()).toBe('xchapter_004')

      const foobar = manifest.item({ allProperties: ['svg', 'mathml'] })!
      expect(foobar).not.toBeDefined()
    })
    test('item(onlyProperties:)', () => {
      const xchapter_077 = manifest.item({
        allProperties: ['remote-resources', 'scripted'],
      })!
      expect(xchapter_077).toMatchObject(expect.any(ManifestItem))
      expect(xchapter_077.id()).toBe('xchapter_004')

      const toc = manifest.item({ onlyProperties: ['nav'] })!
      expect(toc).toMatchObject(expect.any(ManifestItem))
      expect(toc.id()).toBe('toc')

      const foobar = manifest.item({ onlyProperties: ['foobar'] })!
      expect(foobar).not.toBeDefined()
    })
    test('item.properties()', () => {
      const toc = manifest.item({ id: 'toc' })!
      expect(toc.properties()).toIncludeAllMembers(['nav'])

      const bad = manifest.item({ id: 'bad' })!
      expect(bad.properties()).toIncludeAllMembers(['nav', 'svg'])

      const xchapter_004 = manifest.item({ id: 'xchapter_004' })!
      expect(xchapter_004.properties()).toIncludeAllMembers([
        'mathml',
        'remote-resources',
        'scripted',
      ])
    })
  })
})
