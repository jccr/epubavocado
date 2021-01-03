/* eslint-disable */
const { readFileSync } = require('fs')
const { join } = require('path')

const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { buildASTSchema } = require('graphql')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { mergeTypeDefs } = require('@graphql-tools/merge')

const xmldom = require('xmldom')

const { Package, Container } = require('../../lib/cjs/models.js')

const typesArray = loadFilesSync(join(__dirname, 'types/**/*.graphql'))

const containerXML = new xmldom.DOMParser().parseFromString(
  readFileSync(join(__dirname, '../data/container.xml'), 'utf-8'),
)

const packageXML = new xmldom.DOMParser().parseFromString(
  readFileSync(join(__dirname, '../data/package.opf'), 'utf-8'),
)

var schema = buildASTSchema(mergeTypeDefs(typesArray))

var root = {
  container: () => {
    return new Container(containerXML)
  },
  package: () => {
    return new Package(packageXML)
  },
}

var app = express()
app.use(
  '/',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  }),
)
app.listen(4000)
console.log('Running a GraphQL API server at http://localhost:4000/')
