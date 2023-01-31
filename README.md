# RDF Serialize

[![Build status](https://github.com/rubensworks/rdf-serialize.js/workflows/CI/badge.svg)](https://github.com/rubensworks/rdf-serialize.js/actions?query=workflow%3ACI)
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
| [JSON-LD](https://json-ld.org/) | `application/ld+json` | `.jsonld` |
| [SHACL Compact Syntax](https://w3c.github.io/shacl/shacl-compact-syntax/) | `text/shaclc` | `.shaclc`, `.shc` |
| [Extended SHACL Compact Syntax](https://github.com/jeswr/shaclcjs#extended-shacl-compact-syntax) | `text/shaclc-ext` | `.shaclce`, `.shce` |

Internally, this library makes use of RDF serializers from the [Comunica framework](https://github.com/comunica/comunica),
which enable streaming processing of RDF.

Internally, the following fully spec-compliant serializers are used:

* [N3.js](https://github.com/rdfjs/n3.js)
* [jsonld-streaming-serializer.js](https://github.com/rubensworks/jsonld-streaming-serializer.js)
* [shaclc-writer](https://github.com/jeswr/shaclc-writer/)

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

### Serializing by content type

The `rdfSerializer.serialize` method takes in an [RDFJS stream](http://rdf.js.org/stream-spec/#stream-interface) emitting RDF quads,
and an options object, and outputs  text stream containing RDF in a certain serialization.

```javascript
const streamifyArray = require('streamify-array');
const stringifyStream = require('stream-to-string');
const quad = require('rdf-quad');

const quadStream = streamifyArray([
  quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
  quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
]);

const textStream = rdfSerializer.serialize(quadStream, { contentType: 'text/turtle' });

// Handle the serialization in the streaming manner
textStream.pipe(process.stdout)
    .on('error', (error) => console.error(error))
    .on('end', () => console.log('All done!'));

// Or merge it in a single string.
console.log(await stringifyStream(textStream));
```

### Serializing for file name

Sometimes, you know the desired path/URL of the serialized RDF document, but not the content type.
For those cases, this library allows you to provide the path/URL of the RDF document,
using which the content type will be determined.

For example, Turtle documents can be detected using the `.ttl` extension.

```javascript
const quadStream = streamifyArray([
  quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o1'),
  quad('http://ex.org/s', 'http://ex.org/p', 'http://ex.org/o2'),
]);

const textStream = rdfSerializer.serialize(quadStream, { path: 'http://example.org/myfile.ttl' });
```

### Getting all known content types

With `rdfSerializer.getContentTypes()`, you can retrieve a list of all content types for which a serializer is available.
Note that this method returns a promise that can be `await`-ed.

`rdfSerializer.getContentTypesPrioritized()` returns an object instead,
with content types as keys, and numerical priorities as values.

```javascript
// An array of content types
console.log(await rdfSerializer.getContentTypes());

// An object of prioritized content types
console.log(await rdfSerializer.getContentTypesPrioritized());
```

## License
This software is written by [Ruben Taelman](http://rubensworks.net/).

This code is released under the [MIT license](http://opensource.org/licenses/MIT).
