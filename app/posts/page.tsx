import { PostsView } from "./posts-view";

/**
 * `/posts` route entry. A Server Component that simply renders the client-side
 * view; all data fetching and interactivity live inside `<PostsView />`.
 */
export default function PostsPage() {
  return <PostsView />;
}
