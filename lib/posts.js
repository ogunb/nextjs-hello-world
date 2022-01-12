import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

function getLocalPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const localPosts = fileNames.map(getLocalPostMetaData);

  return localPosts;
}

function getLocalPostMetaData(fileName) {
  const id = fileName.replace(/.md$/, "");

  const fullPath = path.join(postsDirectory, fileName);
  const content = fs.readFileSync(fullPath, "utf-8");

  const { data } = matter(content);

  return {
    id,
    ...data,
  };
}

function getLocalPostData(id) {
  const fileName = `${id}.md`;
  return getLocalPostMetaData(fileName);
}

async function getRemotePosts() {
  const remotePosts = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  ).then((response) => response.json());

  return remotePosts.map((post) => ({
    id: post.id,
    title: post.title,
    date: Date.now(),
  }));
}

async function getRemotePostData(id) {
  const post = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).then((response) => response.json());

  return {
    date: Date.now(),
    ...post,
  };
}

export async function getSortedPostsData() {
  const remotePosts = await getRemotePosts();
  const localPosts = getLocalPosts();

  return [...localPosts, ...remotePosts].sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}

export async function getAllPostsIds() {
  const remotePostIds = (await getRemotePosts()).map(({ id }) => ({
    params: { id: id.toString() },
  }));
  const localPostIds = getLocalPosts().map(({ id }) => ({ params: { id } }));

  return [...localPostIds, ...remotePostIds];
}

export function getPostData(id) {
  if (!isNaN(id)) {
    return getRemotePostData(id);
  }

  return getLocalPostData(id);
}
