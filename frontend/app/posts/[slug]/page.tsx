import { graphQLClient } from '@/lib/wordpress';
import { gql } from 'graphql-request';

interface SinglePostResponse {
  post: {
    title: string;
    content: string;
    date: string;
  } | null;
}

const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      title
      content
    }
  }
`;

// Next.js automatically injects url params into the page props
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post = null;

  try {
    const data = await graphQLClient.request<SinglePostResponse>(GET_POST_BY_SLUG, { slug });
    post = data.post;
  } catch (error) {
    console.error("Error fetching single post:", error);
  }

  if (!post) {
    return <main style={{ padding: '2rem' }}><h1>Post Not Found</h1></main>;
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </main>
  );
}
