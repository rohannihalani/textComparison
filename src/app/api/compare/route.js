import { ChromaClient } from "chromadb";
import { CohereEmbeddingFunction } from "@chroma-core/cohere";

const client = new ChromaClient({
  host: "localhost",
  port: 8000,
  ssl: false,
});
const embedder = new CohereEmbeddingFunction({
  apiKey: process.env.COHERE_API_KEY,
});

export async function POST(request) {
  const { input, input2 } = await request.json();

  const embeddings = await embedder.generate([input, input2]);

  const collection = await client.getOrCreateCollection({
    name: "text-comparison",
    embeddingFunction: embedder,
  });

  await collection.add({
    ids: ["id1", "id2"],
    documents: [input, input2],
    embeddings: embeddings,
  });

  const queryResult = await collection.query({
    queryEmbeddings: embeddings,
    nResults: 2,
    include: ["distances", "documents"],
  });

  const similarityScore = 1 - queryResult.distances[0][1];

  return new Response(
    JSON.stringify({
      similarityScore,
      match: queryResult.documents[0][1],
    }),
    { status: 200 }
  );
}
