import axios from 'axios';

// ─── BACKEND PROXY ──────────────────────────────────────────────────────────
// Using the project's own backend to proxy LeetCode requests to bypass CORS
const API_URL = `${import.meta.env.VITE_API_URL}/practice/leetcode`;

const leetcodeRequest = async (query, variables = {}) => {
  try {
    const response = await axios.post(API_URL, {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data;
  } catch (error) {
    console.error('LeetCode API Error:', error.message);
    throw error;
  }
};

export const leetcodeService = {
  /**
   * Fetches today's daily coding challenge
   */
  fetchDailyChallenge: async () => {
    const query = `
      query questionOfToday {
        activeDailyCodingChallengeQuestion {
          date
          link
          question {
            questionId
            questionFrontendId
            title
            titleSlug
            difficulty
            exampleTestcases
            topicTags {
              name
              slug
            }
          }
        }
      }
    `;
    const data = await leetcodeRequest(query);
    return data.activeDailyCodingChallengeQuestion.question;
  },

  /**
   * Fetches problems filtered by a specific tag/topic
   */
  fetchProblemsByTopic: async (tag = '', limit = 20) => {
    const query = `
      query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: $filters
        ) {
          total: totalNum
          questions: data {
            difficulty
            frontendQuestionId: questionFrontendId
            title
            titleSlug
            topicTags {
              name
              slug
            }
          }
        }
      }
    `;
    
    const variables = {
      categorySlug: "",
      limit,
      skip: 0,
      filters: tag && tag !== 'all' ? { tags: [tag] } : {}
    };

    const data = await leetcodeRequest(query, variables);
    return data.problemsetQuestionList.questions;
  },

  /**
   * Fetches full problem details by its slug
   */
  fetchProblemDetail: async (titleSlug) => {
    const query = `
      query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          title
          titleSlug
          content
          difficulty
          exampleTestcases
          sampleTestCase
          topicTags {
            name
            slug
          }
          codeSnippets {
            lang
            langSlug
            code
          }
          stats
          hints
        }
      }
    `;
    
    const data = await leetcodeRequest(query, { titleSlug });
    return data.question;
  }
};
