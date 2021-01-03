import { readFileSync } from 'fs'
import { join } from 'path'

import xmldom from 'xmldom'
import { graphql, buildASTSchema } from 'graphql'

import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'

import { Container } from '../../src/models.js'

const typesArray = loadFilesSync(join(__dirname, 'types/**/*.graphql'))

test('Container', async () => {
  const xmlDoc = new xmldom.DOMParser().parseFromString(
    readFileSync(join(__dirname, '../data/container.xml'), 'utf-8'),
  )

  const result = await graphql(
    buildASTSchema(mergeTypeDefs(typesArray)),
    `
      {
        container {
          version
          rootfiles {
            fullPath
            mediaType
          }
          links {
            href
            rel
            mediaType
          }
          defaultRendition {
            fullPath
            mediaType
          }
        }
      }
    `,
    {
      container: () => {
        return new Container(xmlDoc)
      },
    },
  )

  expect(result.data).toBeDefined()

  const container = result.data?.container
  expect(container.version).toBe('1.0')

  const rootfiles = container.rootfiles
  expect(rootfiles.length).toEqual(2)

  const rootfile1 = rootfiles[0]
  expect(rootfile1.fullPath).toBe('default.opf')
  expect(rootfile1.mediaType).toBe('application/oebps-package+xml')

  const rootfile2 = rootfiles[1]
  expect(rootfile2.fullPath).toBe('other.opf')
  expect(rootfile2.mediaType).toBe('application/oebps-package+xml')

  const links = container.links
  expect(links.length).toEqual(1)

  const link = links[0]
  expect(link.href).toBe('mapping.xhtml')
  expect(link.mediaType).toBe('application/xhtml+xml')
  expect(link.rel[0]).toBe('mapping')

  const defaultRendition = container.defaultRendition
  expect(defaultRendition.fullPath).toBe('default.opf')
  expect(defaultRendition.mediaType).toBe('application/oebps-package+xml')
})
