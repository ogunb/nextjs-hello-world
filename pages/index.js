import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Self Introduction</p>
        <Link href="/posts/first-post">
          <a>First Post</a>
        </Link>
      </section>
    </Layout>
  );
}
