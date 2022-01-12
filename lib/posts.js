import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

function getLocalPosts() {
  const fileNames = fs.readdirSync(postsDirectory);
  const localPosts = fileNames.map((fileName) => {
    const id = fileName.replace(/.md$/, "");

    const fullPath = path.join(postsDirectory, fileName);
    const content = fs.readFileSync(fullPath, "utf-8");

    const { data } = matter(content);

    return {
      id,
      ...data,
    };
  });

  return localPosts;
}

async function getLocalPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}

async function getRemotePosts() {
  const remotePosts = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  ).then((response) => response.json());

  return remotePosts.map((post) => ({
    id: post.id,
    title: post.title,
    date: new Date(
      +new Date() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
  }));
}

async function getRemotePostData(id) {
  const post = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  ).then((response) => response.json());

  return {
    id: post.id,
    title: post.title,
    contentHtml: post.body,
    date: new Date(
      +new Date() - Math.floor(Math.random() * 10000000000)
    ).toISOString(),
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

export async function getPostData(id) {
  if (!isNaN(id)) {
    return getRemotePostData(id);
  }

  return getLocalPostData(id);
}
