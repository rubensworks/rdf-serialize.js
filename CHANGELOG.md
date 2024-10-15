# Changelog
All notable changes to this project will be documented in this file.

<a name="v4.0.0"></a>
## [v4.0.0](https://github.com/rubensworks/rdf-serialize.js/compare/v3.0.0...v4.0.0) - 2024-10-15

### BREAKING CHANGES
* [Bump to Comunica v4](https://github.com/rubensworks/rdf-serialize.js/commit/dc557ca1cfa5a38a02ab8d2b292d3ca9bf42008f)
  * Besides performance improvements, this increases the minimum requires Node.js version to 18.

<a name="v3.0.0"></a>
## [v3.0.0](https://github.com/rubensworks/rdf-serialize.js/compare/v2.2.3...v3.0.0) - 2024-07-04

### BREAKING CHANGES
* [Replace default exports with named exports for better ESM support (#22)](https://github.com/rubensworks/rdf-serialize.js/commit/1099ba97ce6ab82f8726be66016e614ed6533483)
  * Update your imports to `import  { rdfSerializer } from "rdf-serialize";`

<a name="v2.2.3"></a>
## [v2.2.3](https://github.com/rubensworks/rdf-serialize.js/compare/v2.2.2...v2.2.3) - 2024-02-06

### Changed
* [Update Comunica monorepo packages](https://github.com/rubensworks/rdf-serialize.js/commit/e3715792156206a9f73654208f6f88dc1c2cfb6e)

### Fixed
* [Fix Quad type import in index.d.ts](https://github.com/rubensworks/rdf-serialize.js/commit/63cd8dbc8587e78de094ba9419f1ebdda9865368)

<a name="v2.2.2"></a>
## [v2.2.2](https://github.com/rubensworks/rdf-serialize.js/compare/v2.2.1...v2.2.2) - 2023-02-27

### Fixed
* [Use readable-stream instead of Node streams](https://github.com/rubensworks/rdf-serialize.js/commit/e21f51642c6881a73fce9c1f4c86aee2fcbe7ae2)

<a name="v2.2.1"></a>
## [v2.2.1](https://github.com/rubensworks/rdf-serialize.js/compare/v2.2.0...v2.2.1) - 2023-02-08

### Fixed
* [Update to Comunica 2.6.6 with backpressure fix](https://github.com/rubensworks/rdf-serialize.js/commit/3129681837eb149ec7dfe30796b5e319cd237fea)

<a name="v2.2.0"></a>
## [v2.2.0](https://github.com/rubensworks/rdf-serialize.js/compare/v2.1.0...v2.2.0) - 2023-02-01

### Added
* [Expose `CONTENT_MAPPINGS` and `getContentTypeFromExtension` (#14)](https://github.com/rubensworks/rdf-serialize.js/commit/5c1994344deb5d1b2276c5e6527eb21dce801c00)

<a name="v2.1.0"></a>
## [v2.1.0](https://github.com/rubensworks/rdf-serialize.js/compare/v2.0.1...v2.1.0) - 2023-01-31

### Added
* [Add shaclc support](https://github.com/rubensworks/rdf-serialize.js/commit/ffa92ffa7ec059401efb8db0ab1ac7fce762a64c)

<a name="v2.0.1"></a>
## [v2.0.1](https://github.com/rubensworks/rdf-serialize.js/compare/v2.0.0...v2.0.1) - 2022-11-09

### Fixed
* [Include source map files in packed files](https://github.com/rubensworks/rdf-serialize.js/commit/06043ef0089d942b1b7e347580ffec1c0243ed7e)

<a name="v2.0.0"></a>
## [v2.0.0](https://github.com/rubensworks/rdf-serialize.js/compare/v1.1.0...v2.0.0) - 2022-03-02

Even though this is a major update, there are no breaking changes for most end-users. Only the internal configuration files have breaking changes, which may require manual attention for users that reconfigure this package via config files.

### Changed
* [Update to Comunica 2](https://github.com/rubensworks/rdf-serialize.js/commit/2f410bb739c2df72adb6560d1edc48bf501f8ae1)

<a name="v1.2.0"></a>
## [v1.2.0](https://github.com/rubensworks/rdf-serialize.js/compare/v1.1.0...v1.2.0) - 2021-08-30

### Changed
* [Migrate to @rdfjs/types](https://github.com/rubensworks/rdf-serialize.js/commit/35bf5db5a80e8bd1a8de5df5a954111a6c584f5c)

<a name="v1.1.0"></a>
## [v1.1.0](https://github.com/rubensworks/rdf-serialize.js/compare/v1.0.1...v1.1.0) - 2021-01-15

### Changed
* [Update to Comunica 1.19](https://github.com/rubensworks/rdf-serialize.js/commit/ee7004f92dacb8b9bc20b3a994cf3d37ae716a16)

<a name="v1.0.1"></a>
## [v1.0.1](https://github.com/rubensworks/rdf-serialize.js/compare/v1.0.0...v1.0.1) - 2020-11-12

### Fixed
* [Fix backpressuring not being maintained](https://github.com/rubensworks/rdf-serialize.js/commit/5e72fb8c679af88e52612c9757536db755420327)

### Changed
* [Update Comunica monorepo packages to ~1.18.0](https://github.com/rubensworks/rdf-serialize.js/commit/1db9a1b14d9523cfff5a83c4c8d32dc8d75be4cd)

<a name="v1.0.0"></a>
## [v1.0.0] - 2020-09-01

### Added
* [Add initial serializer implementation](https://github.com/rubensworks/rdf-serialize.js/commit/c6f6e867afe92307eb9bf9cb6e040879f77da20a)
