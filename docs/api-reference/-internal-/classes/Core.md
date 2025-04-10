[**narodb**](../../../README.md)

***

[narodb](../../../README.md) / [index](../../README.md) / [\<internal\>](../README.md) / Core

# Class: Core

Defined in: [core/Core.ts:5](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/core/Core.ts#L5)

## Constructors

### Constructor

> **new Core**(`rootPath`): `Core`

Defined in: [core/Core.ts:10](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/core/Core.ts#L10)

#### Parameters

##### rootPath

`string`

#### Returns

`Core`

## Methods

### getCollection()

> **getCollection**(`name`): `any`[]

Defined in: [core/Core.ts:34](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/core/Core.ts#L34)

#### Parameters

##### name

`string`

#### Returns

`any`[]

***

### getStructuredCollections()

> **getStructuredCollections**(): `object`

Defined in: [core/Core.ts:19](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/core/Core.ts#L19)

#### Returns

`object`

***

### initialize()

> **initialize**(): `Promise`\<`void`\>

Defined in: [core/Core.ts:14](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/core/Core.ts#L14)

#### Returns

`Promise`\<`void`\>

***

### loadCollections()

> **loadCollections**(): `Promise`\<\{[`key`: `string`]: `any`; \}\>

Defined in: [core/Core.ts:23](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/core/Core.ts#L23)

#### Returns

`Promise`\<\{[`key`: `string`]: `any`; \}\>

***

### updateCollection()

> **updateCollection**(`name`, `data`): `void`

Defined in: [core/Core.ts:39](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/core/Core.ts#L39)

#### Parameters

##### name

`string`

##### data

`any`[]

#### Returns

`void`

***

### writeCollections()

> **writeCollections**(): `Promise`\<`void`\>

Defined in: [core/Core.ts:43](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/core/Core.ts#L43)

#### Returns

`Promise`\<`void`\>
