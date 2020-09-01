# RDF Serialize

[![Build Status](https://travis-ci.org/rubensworks/rdf-serialize.js.svg?branch=master)](https://travis-ci.org/rubensworks/rdf-serialize.js)
[![Coverage Status](https://coveralls.io/repos/github/rubensworks/rdf-serialize.js/badge.svg?branch=master)](https://coveralls.io/github/rubensworks/rdf-serialize.js?branch=master)
[![npm version](https://badge.fury.io/js/rdf-serialize.svg)](https://www.npmjs.com/package/rdf-serialize)

This library serializes [RDF/JS](http://rdf.js.org/) quad streams to _RDF streams_ based on _content type_.

This is useful in situations where have a stream of RDF/JS quads,
and you want to _serialize_ them to a certain RDF serialization.

The following RDF serializations are supported:

| **Name** | **Content type** | **Extensions** |
| -------- | ---------------- | ------------- |
| [TriG](https://www.w3.org/TR/trig/) | `application/trig` | `.trig` |
| [N-Quads](https://www.w3.org/TR/n-quads/) | `application/n-quads` | `.nq`, `.nquads` |
| [Turtle](https://www.w3.org/TR/turtle/) | `text/turtle` | `.ttl`, `.turtle` |
| [N-Triples](https://www.w3.org/TR/n-triples/) | `application/n-triples` | `.nt`, `.ntriples` |
| [Notation3](https://www.w3.org/TeamSubmission/n3/) | `text/n3` | `.n3` |
| [JSON-LD](https://json-ld.org/) | `application/ld+json`, `application/json` | `.json`, `.jsonld` |

Internally, this library makes use of RDF serializers from the [Comunica framework](https://github.com/comunica/comunica),
which enable streaming processing of RDF.

Internally, the following fully spec-compliant serializers are used:

* [N3.js](https://github.com/rdfjs/n3.js)
* [jsonld-streaming-serializer.js](https://github.com/rubensworks/jsonld-streaming-serializer.js)

## Installation

```bash
$ npm install rdf-serialize
```

or

```bash
$ yarn add rdf-serialize
```

This package also works out-of-the-box in browsers via tools such as [webpack](https://webpack.js.org/) and [browserify](http://browserify.org/).

## Require

```typescript
import rdfSerializer from "rdf-serialize";
```

_or_

```javascript
const rdfSerializer = require("rdf-serialize").default;
```

## Usage

TODO

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
