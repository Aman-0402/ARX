import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'ARX Infotech'
const SITE_URL = 'https://arxinfo.tech'

export default function SEO({ title, description, path = '', type = 'website', image = '/logo.png', jsonLd, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | IT Services & Tech Solutions Provider`
  const canonical = `${SITE_URL}${path}`
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={imageUrl} />

      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
