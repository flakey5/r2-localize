import {
  BucketRegions,
  LocalizedBucket,
  LocalizedBucketOptions,
  Region,
  RegionOptions,
} from './types';

const COLO_TO_REGION_MAP = (await import('./colo-to-region.json'))
  .default as Record<string, Region>;

class LocalizedBucketImpl implements LocalizedBucket {
  private buckets: BucketRegions;
  private fallbackBucket: R2Bucket;

  constructor({ buckets, fallbackRegion }: LocalizedBucketOptions) {
    this.buckets = buckets;

    fallbackRegion ??= 'wnam';

    const fallbackBucket = this.buckets[fallbackRegion];
    if (fallbackBucket === undefined) {
      throw new Error(`default bucket (${fallbackRegion}) is undefined`);
    }

    this.fallbackBucket = fallbackBucket;
  }

  findBucket(options: RegionOptions): R2Bucket {
    if ('region' in options) {
      const bucket = this.buckets[options.region];
      if (bucket === undefined) {
        throw new Error(`bucket for region ${options.region} is undefined`);
      }
      return bucket;
    }

    const { cf } = options.request;
    if (cf === undefined) {
      throw new Error(
        `can't get colo from request, request.cf object undefined`
      );
    }

    const colo = cf.colo as string;

    let coloRegion: Region;
    if (colo in COLO_TO_REGION_MAP) {
      coloRegion = COLO_TO_REGION_MAP[colo];
    } else {
      console.warn(`colo ${colo} not mapped to a region`);
      return this.fallbackBucket;
    }

    const bucket = this.buckets[coloRegion] ?? this.fallbackBucket;
    return bucket;
  }

  head(key: string, options: RegionOptions): Promise<R2Object | null> {
    const bucket = this.findBucket(options);
    return bucket.head(key);
  }

  get(
    key: string,
    options: R2GetOptions & RegionOptions
  ): Promise<R2Object | R2ObjectBody | null> {
    const bucket = this.findBucket(options);
    return bucket.get(key, options);
  }

  put(
    key: string,
    value:
      | ReadableStream
      | ArrayBuffer
      | ArrayBufferView
      | string
      | null
      | Blob,
    options: R2PutOptions & RegionOptions
  ): Promise<R2Object | null> {
    const bucket = this.findBucket(options);
    return bucket.put(key, value, options);
  }

  createMultipartUpload(
    key: string,
    options: R2MultipartOptions & RegionOptions
  ): Promise<R2MultipartUpload> {
    const bucket = this.findBucket(options);
    return bucket.createMultipartUpload(key, options);
  }

  resumeMultipartUpload(
    key: string,
    uploadId: string,
    options: RegionOptions
  ): R2MultipartUpload {
    const bucket = this.findBucket(options);
    return bucket.resumeMultipartUpload(key, uploadId);
  }

  delete(keys: string | string[], options: RegionOptions): Promise<void> {
    const bucket = this.findBucket(options);
    return bucket.delete(keys);
  }

  list(options: R2ListOptions & RegionOptions): Promise<R2Objects> {
    const bucket = this.findBucket(options);
    return bucket.list(options);
  }
}

export function localizeBucket(
  options: LocalizedBucketOptions
): LocalizedBucket {
  return new LocalizedBucketImpl(options);
}

export * from './types';
