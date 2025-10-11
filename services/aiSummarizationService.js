const OpenAI = require('openai');

// Check for OpenAI API key
let openai = null;
if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn('⚠️ OPENAI_API_KEY not set! AI summarization will be disabled.');
}

class AISummarizationService {
  /**
   * Generate AI summary from reviews
   * @param {Array} reviews - Array of review objects with comment and rating
   * @param {String} listingTitle - Title of the listing
   * @returns {String} - AI generated summary
   */
  static async generateSummary(reviews, listingTitle) {
    if (!reviews || reviews.length === 0) {
      return "No reviews available yet. Be the first to share your experience!";
    }

    if (reviews.length < 2) {
      return "Limited reviews available. More feedback needed for AI summary.";
    }

    // If OpenAI is not available, return fallback summary
    if (!openai) {
      console.log('Using fallback summary generation (OpenAI not configured)');
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      if (avgRating >= 4.5) {
        return `This destination has received excellent reviews with an average rating of ${avgRating.toFixed(1)}/5. Travelers consistently praise the experience and recommend it highly.`;
      } else if (avgRating >= 4.0) {
        return `This destination has good reviews with an average rating of ${avgRating.toFixed(1)}/5. Most travelers had positive experiences with some room for improvement.`;
      } else {
        return `This destination has mixed reviews with an average rating of ${avgRating.toFixed(1)}/5. Experiences vary among travelers.`;
      }
    }

    try {
      // Prepare reviews text for AI
      const reviewsText = reviews.map(review =>
        `Rating: ${review.rating}/5\nComment: ${review.comment}`
      ).join('\n\n');

      const prompt = `You are an AI travel assistant. Based on the following reviews for "${listingTitle}", create a concise, engaging summary (2-3 sentences) that highlights the key experiences, pros, and any common themes. Focus on what travelers loved and any important considerations. Keep it positive and informative.

Reviews:
${reviewsText}

Summary:`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful travel assistant that creates engaging summaries from user reviews.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const summary = response.choices[0].message.content.trim();

      // Validate summary length
      if (summary.length < 20) {
        throw new Error('Summary too short');
      }

      return summary;
    } catch (error) {
      console.error('AI Summarization Error:', error.message);

      // Fallback summary based on average rating
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      if (avgRating >= 4.5) {
        return `This destination has received excellent reviews with an average rating of ${avgRating.toFixed(1)}/5. Travelers consistently praise the experience and recommend it highly.`;
      } else if (avgRating >= 4.0) {
        return `This destination has good reviews with an average rating of ${avgRating.toFixed(1)}/5. Most travelers had positive experiences with some room for improvement.`;
      } else {
        return `This destination has mixed reviews with an average rating of ${avgRating.toFixed(1)}/5. Experiences vary among travelers.`;
      }
    }
  }

  /**
   * Check if summary needs updating
   * @param {Date} lastUpdated - Last update timestamp
   * @param {Number} reviewCount - Current review count
   * @returns {Boolean} - Whether update is needed
   */
  static needsUpdate(lastUpdated, reviewCount) {
    if (!lastUpdated) return true;

    const now = new Date();
    const hoursSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60);

    // Update if more than 24 hours old, or if significant new reviews (every 5 new reviews)
    return hoursSinceUpdate > 24 || (reviewCount > 0 && reviewCount % 5 === 0);
  }
}

module.exports = AISummarizationService;
