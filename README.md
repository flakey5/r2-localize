# r2-localize

Allows for serving files from different R2 buckets based on the request's region.

Primary use cases would be lowering latency or serving localized files.

## Usage

### Initializing

```typescript
const localizedBucket = localizeBucket({
  buckets: {
    wnam: env.WNAM_BUCKET,
    enam: env.ENAM_BUCKET,
    weur: env.WEUR_BUCKET,
    eeur: env.EEUR_BUCKET,
    apac: env.APAC_BUCKET,
  },
  // Region to use if one of the regions is undefined or we couldn't identify what region a colo is in/closest to
  fallbackRegion: 'wnam',
});
```

### Head

```typescript
// Heading a file
const object: R2Object | null = await localizedBucket.head('some-object', {
  request,
});
```

### Get

```typescript
const object: R2Object | R2ObjectBody | null = await localizedBucket.get(
  'some-object',
  {
    request,
    // R2GetOptions properties here, e.g.
    onlyIf: {
      // ...
    },
  }
);
```

### Put

Note: this puts the object in the nearest bucket only. The other buckets are unaffected.

```typescript
const object: R2Object | null = await localizedBucket.put(
  'some-object',
  'some-value',
  {
    request,
    // R2PutOptions properties here, e.g.
    onlyIf: {
      // ...
    },
  }
);
```

### CreateMultipartUpload

Note: this puts the object in the nearest bucket only. The other buckets are unaffected.

```typescript
const object: R2MultipartUpload = await localizedBucket.createMultipartUpload(
  'some-object',
  {
    request,
    // R2MultipartOptions properties here, e.g.
    httpMetadata: {
      // ...
    },
  }
);
```

### ResumeMultipartUpload

Note: this puts the object in the nearest bucket only. The other buckets are unaffected.

```typescript
const object: R2MultipartUpload = await localizedBucket.resumeMultipartUpload(
  'some-object',
  'upload id',
  { request }
);
```

### Delete

Note: this deletes the object in the nearest bucket only. The other buckets are unaffected.

```typescript
await localizedBucket.resumeMultipartUpload('some-object', 'upload id', {
  request,
});
```

### List

```typescript
const object: R2Objects = await localizedBucket.list({
  request,
  // R2ListOptions properties here, e.g.
  prefix: 'asd',
});
```

### Accessing a specific region

To access the bucket of a specific region, you can pass in the region's name instead of the request object.

```typescript
const object: R2Object | R2ObjectBody | null = await localizedBucket.get(
  'some-object',
  {
    region: 'wnam',
    // R2GetOptions properties here, e.g.
    onlyIf: {
      // ...
    },
  }
);
```

# License

This repository is licensed under the terms of the [MIT License](./LICENSE).
