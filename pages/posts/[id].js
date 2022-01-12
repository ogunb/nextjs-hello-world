import Image from "next/image";
import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostsIds, getPostData } from "../../lib/posts";

export default function Post({ post }) {
  console.log(post);
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>

      {post.title}
      <br />
      {post.id}
      <br />
      {post.date}
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllPostsIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostData(params.id);
  return { props: { post } };
}
