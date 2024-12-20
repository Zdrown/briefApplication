"use client";

import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import LocalStorageHelper from "../../../utils/localStorageHelper";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Sidebar from "../Sidebar/Sidebar";

// Optional: Configure NProgress to not show spinner and speed up
NProgress.configure({ showSpinner: false, speed: 400, minimum: 0.2 });

// ================ Animations ================
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(5px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const loadingBarAnim = keyframes`
  0%   { transform: translateX(-100%); }
  50%  { transform: translateX(30%); }
  100% { transform: translateX(100%); }
`;

// ================ Styled Components ================ //

// Outer container for the entire page


const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.backgrounds.secondary};
  color: ${({ theme }) => theme.text.secondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;

  &[data-sidebar='true'] {
    /* styles when sidebar is open */
  }
`;

const DateHeading = styled.h1`
  font-size: 2.2rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.darkBlue};
  margin: 0;
`;

const SubHeading = styled.h2`
  font-size: 1.3rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.darkBlue}; 
  margin: 0.5rem 0 2rem;
`;

// Main header
/*const PageHeader = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.darkBlue};
  }
  text-align: center;
  animation: ${fadeIn} 0.6s ease;
  font familt 
`;*/

// Container for everything below the header
const ResultsContainer = styled.div`
  width: 95%; // Slightly wider by default
  max-width: 1400px; // Increase the max width for better use of space
  margin: 1.5rem auto; // Center it with margin auto
  animation: ${fadeIn} 0.6s ease;

  @media (min-width: 1200px) {
    width: 100%; // Use full width on very large screens
  }
`;

// Central loading container
const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 15vh;
  animation: ${fadeIn} 0.6s ease;
`;

// Loading message
const LoadingMessage = styled.div`
  font-size: 1.7rem;
  color: ${({ theme }) => theme.colors.darkBlue};
  margin-bottom: 2rem;
  text-align: center;
`;

// Custom progress bar
const CustomProgressBar = styled.div`
  width: 80%;
  max-width: 400px;
  height: 4px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 40%;
    background: ${({ theme }) => theme.colors.darkBlue};
    animation: ${loadingBarAnim} 2s infinite;
  }
`;

// Each category block
const CategorySection = styled.div`
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: ${({ theme }) => theme.backgrounds.primary};
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  animation: ${fadeInUp} 0.4s ease both;
`;

// Action buttons container (missing from snippet)
const ActionButtonsContainer = styled.div`
  display: ${({ $isOpen }) => ($isOpen ? 'none' : 'flex')};
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: flex-end;
  width: 100%;
  max-width: 1000px;
  margin-left: 29vw;
  transition: opacity 0.3s ease;
`;
// Styled button (missing from snippet)
const ActionButton = styled.button`
  background-color: ${({ theme }) => theme.colors.darkBlue};
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-family: inherit;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondaryBlue };
  }
`;


// Title of each category
const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.backgrounds.secondary};
  margin-bottom: 1rem;
  text-transform: capitalize;
  border-bottom: 2px solid ${({ theme }) => theme.colors.darkBlue};
  padding-bottom: 0.5rem;
`;

const SectionTitle2 = styled.h2`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.backgrounds.secondary};
  margin-bottom: 1rem;
  text-transform: capitalize;
  border-bottom: 2px solid ${({ theme }) => theme.colors.darkBlue};
  padding-bottom: 0.5rem;
`;


// Summaries text styling
const Summary = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.backgrounds.secondary};
  margin-bottom: 1.5rem;
`;

// Optional container for the list of feed items
const FeedItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  
  /* Use a responsive grid layout */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem; /* spacing between cards */
`;

// Individual feed item styling (cards)
const FeedItem = styled.li`
  padding: 1rem;
  background-color: ${({ theme }) => theme.backgrounds.secondary};
  border-radius: 12px; /* more rounded corners */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* softer shadow for a cleaner look */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: ${fadeInUp} 0.4s ease both;

  &:hover {
    background-color: ${({ theme }) => theme.colors.tan};
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  /* Make sure the card doesn't get too large */
  max-width: 100%; 
  overflow: hidden;
`;



// Title of each item
const FeedItemTitle = styled.h3`
  font-size: 1.15rem;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.darkBlue};
`;

// Feed item content
const FeedItemContent = styled.p`
  font-size: 0.95rem;
  line-height: 1.4;
  margin: 0.3rem 0;
  color: ${({ theme }) => theme.colors.darkBlue};
  opacity: 0.9;
`;

// ================ Main Component ================ //

export default function FetchingPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [today, setToday] = useState("");

  const [loadingNewCategory, setLoadingNewCategory] = useState(false);

async function handleNewCategoryAdded(category) {
  setLoadingNewCategory(true);
  try {
    const response = await fetch('/api/newsFetcher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, sourceType: 'self' }),
    });

    const data = await response.json();
    if (response.ok && data.items?.length) {
      // Merge the new category items into existing results
      setResults(prevResults => [...prevResults, {
        category: data.metadata.category,
        summary: data.summary,
        items: data.items,
      }]);
    } else {
      console.warn("No items found for this category:", category);
    }
  } catch (error) {
    console.error("Error fetching new category items:", error);
  } finally {
    setLoadingNewCategory(false);
  }
}


  function generateHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;// hashing function to allow the returned summary to have a unique to render it 
      hash |= 0; // Convert to 32-bit integer
    }
    return `key-${hash}`;
  }
  

  function capitalizeAllWords(str) {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  }
  
  

  useEffect(() => {
    const now = new Date();
    const dateString = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(dateString);
  }, []);

  useEffect(() => {
    const fetchSummaries = async () => {
      setLoading(true);
      NProgress.start();

      const preselectedCategories =
        LocalStorageHelper.getItem("preselectedCategories") || [];
      const selfSelectedCategories =
        LocalStorageHelper.getItem("selfSelectedCategories") || [];

      console.log("Preselected Categories:", preselectedCategories);
      console.log("Self-Selected Categories:", selfSelectedCategories);

      // Combine categories, marking them with sourceType
      const allCategories = [
        ...preselectedCategories.map((category) => ({
          title: category,
          sourceType: "reliable",
        })),
        ...selfSelectedCategories.map((category) => ({
          title: category.title,
          sourceType: "self",
        })),
      ];

      console.log("Combined Categories for Fetching:", allCategories);

      try {
        const summaries = await Promise.allSettled(
          allCategories.map(async ({ title, sourceType }) => {
            if (!title || !sourceType) {
              console.warn("Skipping invalid category:", { title, sourceType });
              return {
                category: title || "Unknown",
                summary: "No data available",
                items: [],
              };
            }

            console.log(`Requesting summary for: ${title} (${sourceType})`);

            const response = await fetch("/api/newsFetcher", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ category: title, sourceType }),
            });

            console.log(
              `Response for ${title}: Status ${response.status}, OK: ${response.ok}`
            );

            if (!response.ok) {
              const data = await response.json();
              console.error(`Failed to fetch summary for ${title}:`, data.error);
              return {
                category: title,
                summary: "Failed to load summary",
                items: [],
              };
            }

            const data = await response.json();
            console.log(`Response Data for ${title}:`, data);

            return {
              category: title,
              summary: data.summary || "No summary available",
              items: data.items || [],
            };
          })
        );

        const finalSummaries = summaries.map((res, i) => {
          if (res.status === "fulfilled") {
            return res.value; 
          }
          const { title } = allCategories[i];
          return {
            category: title || "Unknown",
            summary: "Failed to load summary",
            items: [],
          };
        });

        setResults(finalSummaries)

        console.log("Final Summaries:", finalSummaries);
      } catch (error) {
        console.error("Error fetching summaries:", error);
      } finally {
        NProgress.done();
        setLoading(false);
      }
    };

    fetchSummaries();
  }, []);


  const handleSaveBrief = () => {
    try {
      const existingBriefs = LocalStorageHelper.getItem("dailyBriefs") || [];
      const isoDateString = new Date().toISOString();
      const newBrief = {
        id: isoDateString,
        date: isoDateString,
        data: results,
      };
      existingBriefs.push(newBrief);
      LocalStorageHelper.setItem("dailyBriefs", existingBriefs);
      alert("Brief saved to local storage!");
    } catch (error) {
      console.error("Failed to save brief:", error);
    }
  };



  const handleShareBrief = () => {
    const shareText = results
      .map(
        (r) =>
          `Category: ${r.category}\nSummary: ${r.summary?.slice(0, 200)}...`
      )
      .join("\n\n");

    if (navigator.share) {
      navigator
        .share({
          title: "Daily Brief",
          text: shareText,
          url: window.location.href,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Brief copied to clipboard (Web Share not supported).");
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingMessage>Building your daily brief...</LoadingMessage>
          <CustomProgressBar />
        </LoadingContainer>
      </PageContainer>
    );
  }

  return (// for newly added category in sidebaer 
    <Sidebar results={results} onNewCategoryAdded={handleNewCategoryAdded}>
    {({ sidebarOpen }) => (
     <PageContainer data-sidebar={sidebarOpen ? 'true' : 'false'}>
        <DateHeading>{today}</DateHeading>
        <SubHeading>Your Daily Brief</SubHeading>

      <ActionButtonsContainer $isOpen={sidebarOpen}> 
  <ActionButton onClick={handleSaveBrief}>Save Brief</ActionButton>
  <ActionButton onClick={handleShareBrief}>Share Brief</ActionButton>
</ActionButtonsContainer>

      <ResultsContainer>
        {results.map(({ category, summary, items }) => (
          <CategorySection key={category}>
            <SectionTitle>{capitalizeAllWords(category)}</SectionTitle>
            <div>
  {summary.split(/\n\n+/).map((paragraph) => (
    <Summary key={generateHash(paragraph)}>
      {paragraph}
    </Summary>
  ))}
</div>

            <SectionTitle2>Read The Full Article</SectionTitle2>
            {items && items.length > 0 && (
            
              <FeedItems>
                {items.map((feedItem) => {
                  const itemKey = feedItem.link || feedItem.title;
                  return (
                    <FeedItem key={itemKey}>
                      <FeedItemTitle>{feedItem.title}</FeedItemTitle>
                      <FeedItemContent>{feedItem.content}</FeedItemContent>
                      {feedItem.link && (
                        <a
                          href={feedItem.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "0.9rem", color: "#0066cc" }}
                        >
                          Read more
                        </a>
                      )}
                    </FeedItem>
                  );
                })}
              </FeedItems>
            )}
          </CategorySection>
        ))}
      </ResultsContainer>
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            Loading new category...
          </div>
      </PageContainer>
    )}
  </Sidebar>
);
}