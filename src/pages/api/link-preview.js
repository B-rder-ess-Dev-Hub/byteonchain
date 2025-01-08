import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Add timeout and headers
    const response = await axios.get(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    const $ = cheerio.load(html);

    // Try to get OpenGraph image
    let image = $('meta[property="og:image"]').attr('content');

    // Fallback to Twitter image
    if (!image) {
      image = $('meta[name="twitter:image"]').attr('content');
    }

    // Fallback to first image in article
    if (!image) {
      image = $('article img').first().attr('src');
    }

    // Fallback to any image
    if (!image) {
      image = $('img').first().attr('src');
    }

    // Convert relative URLs to absolute
    if (image && !image.startsWith('http')) {
      const baseUrl = new URL(url).origin;
      image = new URL(image, baseUrl).toString();
    }

    // If no image was found, return an error
    if (!image) {
      return res.status(404).json({ error: 'No image found' });
    }

    // Verify the image URL is accessible
    try {
      await axios.head(image, { timeout: 3000 });
    } catch (error) {
      return res.status(404).json({ error: 'Image URL not accessible' });
    }

    res.status(200).json({ image });
  } catch (error) {
    console.error('Error fetching link preview:', error);
    res.status(500).json({ error: 'Failed to fetch link preview' });
  }
} 