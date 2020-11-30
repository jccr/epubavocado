import { readFileSync } from 'fs'
import xmldom from 'xmldom'

import { Package } from '../src/package'

it('initializes Package', () => {
  const xmlDoc = new xmldom.DOMParser().parseFromString(
    readFileSync('test/data/input.opf', 'utf-8'),
  )

  const testPackage = new Package(xmlDoc)
  expect(testPackage.version()).toBe('3.0')

  const uniqueIdentifier = testPackage.uniqueIdentifier()
  expect(uniqueIdentifier.id()).toBe('pub-id')
  expect(uniqueIdentifier.value()).toBe('urn:isbn:9780316000000')
})
