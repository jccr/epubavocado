import xmldom from 'https://jspm.dev/xmldom'
import { assertEquals } from 'https://deno.land/std@0.79.0/testing/asserts.ts'

import { Package } from '../../lib/esm/mod.js'

Deno.test('initializes Package', () => {
  const xmlDoc = new xmldom.DOMParser().parseFromString(
    Deno.readTextFileSync('test/data/package.opf'),
  )

  const testPackage = new Package(xmlDoc)
  assertEquals(testPackage.version(), '3.0')

  const uniqueIdentifier = testPackage.uniqueIdentifier()
  assertEquals(uniqueIdentifier.id(), 'pub-id')
  assertEquals(uniqueIdentifier.value(), 'urn:isbn:9780316000000')
})
