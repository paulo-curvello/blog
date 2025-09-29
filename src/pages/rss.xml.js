import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { SUPPORTED_LANGS, DEFAULT_LANG } from '../lib/i18n';

export function getStaticPaths() {
  return SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));
}

export async function GET(context) {
  const lang = (context.params?.lang) || DEFAULT_LANG;
  const all = await getCollection('blog', ({ data }) => data.lang === lang);

  const posts = all.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  const items = posts.map((post) => {
    const noExt = post.id.replace(/\.(md|mdx)$/i, '');
    const [, ...rest] = noExt.split('/'); 
    const slug = rest.join('/');
    return {
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/${lang}/blog/${slug}/`,
    };
  });

  return rss({
    title: `${SITE_TITLE} (${lang.toUpperCase()})`,
    description: SITE_DESCRIPTION,
    site: context.site,
    items,
  });
}
