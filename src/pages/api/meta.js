import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log('Fetching meta data for URL:', url);

    // Try direct request first
    try {
      const directResponse = await axios.get(url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const $ = cheerio.load(directResponse.data);
      let image = $('meta[property="og:image"]').attr('content');
      
      if (image) {
        return res.status(200).json({ 
          image,
          source: 'direct'
        });
      }
    } catch (directError) {
      console.log('Direct request failed, trying proxy...');
    }

    // If direct request fails, try using cors-anywhere proxy
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    const response = await axios.get(proxyUrl, {
      timeout: 5000,
      headers: {
        'Origin': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Try different methods to find the image
    const possibleImages = [
      $('meta[property="og:image"]').attr('content'),
      $('meta[name="twitter:image"]').attr('content'),
      $('.wp-post-image').attr('src'),
      $('.entry-content img').first().attr('src'),
      $('article img').first().attr('src'),
      $('.post-thumbnail img').attr('src'),
      $('img').first().attr('src')
    ].filter(Boolean); // Remove null/undefined values

    let image = possibleImages[0]; // Take the first valid image

    // Convert relative URLs to absolute
    if (image && !image.startsWith('http')) {
      const baseUrl = new URL(url).origin;
      image = new URL(image, baseUrl).toString();
    }

    if (image) {
      // Quick check if image exists
      try {
        await axios.head(image, { timeout: 2000 });
        return res.status(200).json({ 
          image,
          source: 'proxy'
        });
      } catch (imageError) {
        console.error('Image verification failed:', imageError.message);
      }
    }

    // If no image found or verification failed, try to extract first image from HTML content
    const imgMatch = response.data.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      const extractedImage = imgMatch[1].startsWith('http') 
        ? imgMatch[1] 
        : new URL(imgMatch[1], new URL(url).origin).toString();
      
      return res.status(200).json({ 
        image: extractedImage,
        source: 'extracted'
      });
    }

    // Fallback to default image
    return res.status(200).json({ 
      image: '/up1.png',
      source: 'default'
    });

  } catch (error) {
    console.error('Error in meta API:', error.message);
    return res.status(200).json({ 
      image: '/up1.png',
      source: 'error-fallback'
    });
  }
} 