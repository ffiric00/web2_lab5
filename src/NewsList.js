import React, { useEffect, useState } from 'react';  
import axios from 'axios';


const NewsList = () => {
  const [articles, setArticles] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    const apiKey = '541e7a68fe534c10be6899e8c17a17ee'; 
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

 
    const fetchArticles = async () => {
        try { 
          setLoading(true);
          const response = await axios.get(apiUrl);
          setArticles(response.data.articles);
        } catch (error) {
          console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
          }
      };

    fetchArticles();
  }, []); 


  return (
    <div>
    <h1>Top Headlines</h1> 
    {loading ? (
        <p>Loading articles...</p> 
    ) : (
    <ul>
      {articles.map((article) => (
        <li key={article.url}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            {article.title}
          </a>
        </li>
      ))}
    </ul>
    )}
  </div>
  );
};

export default NewsList;
