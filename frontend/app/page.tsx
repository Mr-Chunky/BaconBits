import { graphQLClient } from '@/lib/wordpress';
import { gql } from 'graphql-request';
import Link from 'next/link';

interface WPPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
}

interface GraphQLResponse {
  posts: {
    nodes: WPPost[];
  };
}

const ALL_POSTS_QUERY = gql`
  query GetAllPosts {
    posts {
      nodes {
        id
        title
        slug
        excerpt
      }
    }
  }
`;

export default async function Home() {
  let posts: WPPost[] = [];

  try {
    const data = await graphQLClient.request<GraphQLResponse>(ALL_POSTS_QUERY);
    posts = data.posts.nodes;
  } catch (error) {
    console.error("Failed to fetch posts from WordPress:", error);
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>BaconBits Blog</h1>
      {posts.length === 0 ? (
        <p>No posts found. Add some in your WordPress admin panel!</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: '1.5rem' }}>
              <Link href={`/posts/${post.slug}`}>
                <h2>{post.title}</h2>
              </Link>
              <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
