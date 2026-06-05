import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';
import { useStaticQuery, graphql } from 'gatsby';

// https://www.gatsbyjs.com/docs/add-seo-component/

const Head = ({ title, description, image }) => {
  const { pathname } = useLocation();

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            defaultTitle: title
            defaultDescription: description
            siteUrl
            defaultImage: image
            twitterUsername
            author
            siteName
            siteLanguage
            siteLocale
            siteType
            jobTitle
            keywords
            socialLinks
          }
        }
      }
    `,
  );

  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    defaultImage,
    twitterUsername,
    author,
    siteName,
    siteLanguage,
    siteLocale,
    siteType,
    jobTitle,
    keywords,
    socialLinks,
  } = site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };

  const keywordsContent = Array.isArray(keywords) ? keywords.filter(Boolean).join(', ') : null;
  const sameAsLinks = Array.isArray(socialLinks) ? socialLinks.filter(Boolean) : [];
  const language = siteLanguage || 'en';
  const locale = siteLocale || 'en_US';
  const ogType = siteType || 'website';
  const personId = `${siteUrl}/#person`;
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': personId,
    name: author || defaultTitle,
    url: siteUrl,
    image: seo.image,
  };

  if (jobTitle) {
    personSchema.jobTitle = jobTitle;
  }

  if (sameAsLinks.length) {
    personSchema.sameAs = sameAsLinks;
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName || defaultTitle,
    publisher: { '@id': personId },
    inLanguage: language,
  };

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${seo.url}#webpage`,
    url: seo.url,
    name: seo.title,
    description: seo.description,
    inLanguage: language,
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': personId },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: seo.image,
    },
    publisher: { '@id': personId },
  };

  return (
    <Helmet title={title} defaultTitle={seo.title} titleTemplate={`%s | ${defaultTitle}`}>
      <html lang={language} />

      <meta name="description" content={seo.description} />
      <meta name="author" content={author || defaultTitle} />
      {keywordsContent && <meta name="keywords" content={keywordsContent} />}
      <meta name="robots" content="index,follow" />
      <meta name="googlebot" content="index,follow" />
      <meta name="image" content={seo.image} />
      <link rel="canonical" href={seo.url} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:alt" content={seo.title} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName || defaultTitle} />
      <meta property="og:locale" content={locale} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterUsername} />
      <meta name="twitter:creator" content={twitterUsername} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      <meta name="twitter:image:alt" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />

      <meta name="google-site-verification" content="DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk" />

      <script type="application/ld+json">
        {JSON.stringify([personSchema, websiteSchema, webPageSchema])}
      </script>

      {sameAsLinks.map((link) => (
        <link key={link} rel="me" href={link} />
      ))}
    </Helmet>
  );
};

export default Head;

Head.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

Head.defaultProps = {
  title: null,
  description: null,
  image: null,
};
