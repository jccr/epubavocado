import { readFileSync } from 'fs'
import { join } from 'path'

import xmldom from 'xmldom'
import { graphql, buildASTSchema } from 'graphql'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'

import { Package } from '../../src/mod.js'

const typesArray = loadFilesSync(join(__dirname, 'types/**/*.graphql'))

it('initializes Package', async () => {
  const xmlDoc = new xmldom.DOMParser().parseFromString(
    readFileSync(join(__dirname, '../data/input.opf'), 'utf-8'),
  )

  const result = await graphql(
    buildASTSchema(mergeTypeDefs(typesArray)),
    `
      {
        package {
          version
          uniqueIdentifier {
            id
            value
          }
        }
      }
    `,
    {
      package: () => {
        return new Package(xmlDoc)
      },
    },
  )

  const testPackage = result.data?.package

  expect(testPackage.version).toBe('3.0')

  const uniqueIdentifier = testPackage.uniqueIdentifier
  expect(uniqueIdentifier.id).toBe('pub-id')
  expect(uniqueIdentifier.value).toBe('urn:isbn:9780316000000')
})
