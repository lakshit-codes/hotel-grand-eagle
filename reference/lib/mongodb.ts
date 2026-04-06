import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

let uri = process.env.MONGODB_URI;

// Bypass DNS SRV errors (ECONNREFUSED) by mapping to direct IP/hostname records for the MongoDB cluster
if (
  uri?.startsWith("mongodb+srv://") &&
  uri.includes("@kalpcluster.mr8bacs.mongodb.net")
) {
  uri = uri
    .replace(
      "@kalpcluster.mr8bacs.mongodb.net/",
      "@ac-zxbieql-shard-00-00.mr8bacs.mongodb.net:27017,ac-zxbieql-shard-00-01.mr8bacs.mongodb.net:27017,ac-zxbieql-shard-00-02.mr8bacs.mongodb.net:27017/?ssl=true&replicaSet=atlas-vw7phq-shard-0&authSource=admin&retryWrites=true&w=majority",
    )
    .replace("mongodb+srv://", "mongodb://");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromiseV2?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromiseV2) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromiseV2 = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromiseV2;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
