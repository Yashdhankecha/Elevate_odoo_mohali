import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "https://newsdata.io/api/1/news";

// ── Level 2: Client-side keyword filter ──────────────
// Only keep articles relevant to engineering placements & IT hiring
const RELEVANT_KEYWORDS = [
  "placement", "hiring", "recruitment", "internship",
  "campus", "fresher", "engineer", "software", "it jobs",
  "tech jobs", "off campus", "on campus", "package",
  "lpa", "ctc", "tcs", "infosys", "wipro", "accenture",
  "cognizant", "capgemini", "hcl", "tech mahindra",
  "amazon", "google", "microsoft", "flipkart", "swiggy",
  "zomato", "startup hiring", "coding", "developer",
  "it industry", "it sector", "it company", "it firm",
  "tech company", "layoff", "mass hiring", "job openings",
  "job offer", "offer letter", "joining date", "appraisal",
  "career", "jobs", "salary", "interview", "fresher jobs", "tech placement"
];

const isRelevant = (article) => {
  const text = `${article.title ?? ""} ${article.description ?? ""}`.toLowerCase();
  return RELEVANT_KEYWORDS.some((kw) => text.includes(kw));
};

const filterArticles = (results = []) =>
  results.filter((a) => a.image_url && a.title && isRelevant(a));

// ── Hook ──────────────────────────────────────────────
export function useNewsData() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const API_KEY = import.meta.env.VITE_NEWS_API || import.meta.env.NEWS_API || 'pub_d2f9571462e84cf891163c083aa529d5';

  // ── Level 1: Tight API query ────────────────────────
  const buildParams = (page = null) => ({
    apikey: API_KEY,
    q: '("tech" OR "software" OR "IT") AND ("hiring" OR "jobs" OR "layoff")',
    language: "en",
    category: "technology,business",
    image: 1,
    ...(page && { page }),
  });

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(BASE_URL, { params: buildParams() });
        if (data.status !== "success") throw new Error(data.message);
        if (isMounted) {
            setArticles(filterArticles(data.results));
            setNextPage(data.nextPage || null);
        }
      } catch (err) {
        if (isMounted) {
            setError(err.response?.data?.message || err.message || "Failed to fetch news.");
        }
      } finally {
        if (isMounted) {
            setLoading(false);
        }
      }
    };
    fetchNews();
    
    return () => {
        isMounted = false;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (!nextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const { data } = await axios.get(BASE_URL, { params: buildParams(nextPage) });
      if (data.status !== "success") throw new Error(data.message);
      
      setArticles((prev) => {
          const newFiltered = filterArticles(data.results);
          const existingIds = new Set(prev.map(a => a.article_id || a.title));
          const uniqueNew = newFiltered.filter(a => !existingIds.has(a.article_id || a.title));
          return [...prev, ...uniqueNew];
      });
      setNextPage(data.nextPage || null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [nextPage, loadingMore]);

  return { articles, loading, error, loadMore, loadingMore, hasMore: !!nextPage };
}
