export interface BucketRegions {
  /**
   * Western North America
   */
  wnam?: R2Bucket;
  /**
   * Eastern North America
   */
  enam?: R2Bucket;
  /**
   * Western Europe
   */
  weur?: R2Bucket;
  /**
   * Eastern Europe
   */
  eeur?: R2Bucket;
  /**
   * Asia-Pacific
   */
  apac?: R2Bucket;
}

export type Region = 'wnam' | 'enam' | 'weur' | 'eeur' | 'apac';

export type LocalizedBucketOptions = {
  buckets: BucketRegions;
  fallbackRegion?: Region;
};

export type RegionOptions =
  | {
      region: Region;
    }
  | {
      request: Request;
    };

export interface LocalizedBucket {
  head(key: string, options: RegionOptions): Promise<R2Object | null>;

  get(
    key: string,
    options: R2GetOptions & RegionOptions
  ): Promise<R2Object | R2ObjectBody | null>;

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
  ): Promise<R2Object | null>;

  createMultipartUpload(
    key: string,
    options: R2MultipartOptions & RegionOptions
  ): Promise<R2MultipartUpload>;

  resumeMultipartUpload(
    key: string,
    uploadId: string,
    options: RegionOptions
  ): R2MultipartUpload;

  delete(keys: string | string[], options: RegionOptions): Promise<void>;

  list(options: R2ListOptions & RegionOptions): Promise<R2Objects>;
}
