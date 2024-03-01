import Layout from "@/layout/layoutTemplate";
import Head from "next/head";

export async function getStaticPaths() {
  return {
    paths: [{ params: { dynamicmeta: "meta" } }],
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      "api/getHomePageStaticData?pageName=contact_us"
  );

  const data1 = await response.json();
  const data = data1?.data[0];
  data.title = data?.header_text;
  data.description = data?.page_text;

  return {
    props: {
      data,
      openGraphData: [
        {
          property: "og:image",
          content: process.env.NEXT_PUBLIC_SITE_URL + data?.image,
          key: "ogimage",
        },
        {
          property: "og:image:width",
          content: "400",
          key: "ogimagewidth",
        },
        {
          property: "og:image:height",
          content: "300",
          key: "ogimageheight",
        },
        {
          property: "og:url",
          content: data?.impact_link,
          key: "ogurl",
        },
        {
          property: "og:image:secure_url",
          content: process.env.NEXT_PUBLIC_SITE_URL + data?.image,
          key: "ogimagesecureurl",
        },
        {
          property: "og:title",
          content: data?.header_text,
          key: "ogtitle",
        },
        {
          property: "og:description",
          content: data?.page_text,
          key: "ogdesc",
        },
        {
          property: "og:type",
          content: "website",
          key: "website",
        },
      ],
    },
    revalidate: 10,
  };
}

function DynamicMetaInfo({ data }) {
  return (
    <>
      <Layout>
        <Head>
          <title>{data?.header_text}</title>
          <meta name="description" content={data?.page_text} />

          <meta property="og:type" content="website" />
          <meta property="og:url" content={data?.impact_link} key="og-url" />
          <meta
            property="og:title"
            content={data?.header_text}
            key="og-title"
          />
          <meta
            property="og:description"
            content={data.page_text}
            key="og-desc"
          />
          <meta
            property="og:image"
            content={process.env.NEXT_PUBLIC_SITE_URL + data?.image}
            key="og-image"
          />

          <meta property="twitter:card" content="summary_large_image" />
          <meta property="twitter:url" content={data?.impact_link} />
          <meta property="twitter:title" content={data?.header_text} />
          <meta property="twitter:description" content={data?.page_text} />
          <meta
            property="twitter:image"
            content={process.env.NEXT_PUBLIC_SITE_URL + data?.image}
          />

          <link rel="canonical" href={data?.impact_link} />
        </Head>
      </Layout>
    </>
  );
}

export default DynamicMetaInfo;
