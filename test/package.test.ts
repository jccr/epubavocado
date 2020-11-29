import { readFileSync } from 'fs'

import { Package } from '../src/package'
import xmldom from 'xmldom'

test('init Package', () => {
  const xmlDoc = new xmldom.DOMParser().parseFromString(
    readFileSync('test/data/input.opf', 'utf-8'),
  )

  const testPackage = new Package(xmlDoc)
  expect(testPackage.version()).toBe('3.0')

  const uniqueIdentifier = testPackage.uniqueIdentifier()
  expect(uniqueIdentifier.id()).toBe('pub-id')
  expect(uniqueIdentifier.value()).toBe('urn:isbn:9780316000000')
})
