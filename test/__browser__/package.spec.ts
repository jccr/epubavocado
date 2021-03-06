import { Package } from '../../src/models.js'

it('Package', async () => {
  const xmlData = await (await fetch('/base/test/data/package.opf')).text()
  const xmlDoc = new DOMParser().parseFromString(xmlData, 'application/xml')

  const testPackage = new Package(xmlDoc)
  expect(testPackage.version()).toBe('3.0')

  const uniqueIdentifier = testPackage.uniqueIdentifier()!
  expect(uniqueIdentifier.id()).toBe('pub-id')
  expect(uniqueIdentifier.value()).toBe('urn:isbn:9780316000000')
})
