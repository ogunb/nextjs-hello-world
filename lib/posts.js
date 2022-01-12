import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export async function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const postList = fileNames.map((fileName) => {
    const id = fileName.replace(/.md$/, "");

    const fullPath = path.join(postsDirectory, fileName);
    const content = fs.readFileSync(fullPath, "utf-8");

    const { data } = matter(content);

    return {
      id,
      ...data,
    };
  });

  return postList.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
  });
}
