import { NextApiRequest, NextApiResponse } from 'next';
import { getScreenShot } from './_lib/chromium';
import getThumbnailTemplate from './_lib/thumbTemplate';

const isDev = !process.env.AWS_REGION

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const title = String(req.query.title);

    if (!title) {
      throw new Error('Title is required');
    }

    const html = getThumbnailTemplate(title);

    const file = await getScreenShot(html, isDev)

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=31536000, maxage=31536000')

    return res.end(file);
  } catch (err) {
    console.error(err);

    return res.status(500).send('Internal server error');
  }
}
