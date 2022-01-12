import Image from "next/image";
import Head from "next/head";
import Layout from "../../components/layout";
import { getAllPostsIds, getPostData } from "../../lib/posts";
import Date from "../../components/date";

export default function Post({ post }) {
  return (
    <Layout>
      <Head>
        <title>{post.title}</title>
      </Head>

      <article>
        <h1>{post.title}</h1>

        <div className="text-gray-400">
          <Date dateString={post.date}></Date>
        </div>

        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
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
