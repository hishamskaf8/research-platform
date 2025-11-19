import { ResearchItem, OWNER_NAME } from '../types';

const STORAGE_KEY = 'imene_research_data';
const PASSWORD_KEY = 'imene_owner_password';
const DEFAULT_PASSWORD = '1234';

const SEED_DATA: ResearchItem[] = [
  {
    id: '1',
    title: 'Cardiovascular Risks in Urban Populations',
    authors: `${OWNER_NAME}, Dr. Sarah Jenkins`,
    date: '2023-10-15',
    views: 0,
    content: `This study investigates the correlation between high-density urban living and cardiovascular health markers. 
    
    Methodology: A cohort of 5,000 individuals aged 30-60 residing in metropolitan areas was tracked over a 5-year period. We utilized wearable bio-monitors to track heart rate variability, blood pressure fluctuations, and sleep patterns.
    
    Results: The data indicates a significant 15% increase in hypertension risk for individuals living within 500 meters of major arterial roads compared to those in suburban environments. Furthermore, cortisol levels were elevated by an average of 20% in the urban group.
    
    Discussion: Noise pollution and particulate matter (PM2.5) exposure appear to be the primary drivers. Specifically, nighttime noise disruptions correlated strongly with arterial stiffness.
    
    Conclusion: Urban planning must integrate more green buffer zones. Future research will focus on the specific biological pathways activated by chronic low-level noise exposure. This research underscores the urgent need for policy changes regarding residential zoning near highways.`,
  },
  {
    id: '2',
    title: 'Novel Approaches to Pediatric Asthma',
    authors: `${OWNER_NAME}`,
    date: '2024-01-20',
    views: 0,
    content: `Pediatric asthma remains a leading cause of emergency room visits globally. This paper reviews novel therapeutic targets involving the interleukin-33 (IL-33) pathway.
    
    Background: Standard corticosteroids, while effective, have long-term growth suppression side effects in children. 
    
    Study Design: We conducted a double-blind, placebo-controlled trial involving a new monoclonal antibody targeting the IL-33 receptor. 
    
    Findings: The experimental group showed a 40% reduction in exacerbation frequency over 12 months. Lung function tests (FEV1) improved by 12% compared to the baseline, whereas the placebo group showed only a 2% improvement.
    
    Significance: This therapy offers a steroid-sparing alternative for severe asthma phenotypes. It highlights the shift towards precision medicine in pediatric pulmonology. Further longitudinal studies are required to assess safety over periods longer than 3 years.`,
  },
  {
    id: '3',
    title: 'The Role of Artificial Intelligence in Early Diagnostic Imaging',
    authors: `${OWNER_NAME}, T. R. Smith`,
    date: '2024-03-10',
    views: 0,
    content: `Artificial Intelligence (AI) is revolutionizing radiology. This paper presents a retrospective analysis of a proprietary deep learning algorithm designed to detect early-stage pulmonary nodules.
    
    Dataset: 10,000 anonymized chest CT scans were used for training and validation (80/20 split).
    
    Performance: The algorithm achieved a sensitivity of 94% and a specificity of 88%, outperforming junior radiologists by a margin of 12%.
    
    Clinical Application: Integration of this tool into standard PACS workflows reduced average reporting time by 30%. However, the "black box" nature of the decision-making process remains a barrier to full clinical trust.
    
    Future Directions: We are currently developing an explainable AI (XAI) module that highlights the specific regions of interest (ROIs) driving the algorithm's prediction to aid radiologist verification.`,
  }
];

export const getResearch = (): ResearchItem[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SEED_DATA;
  }
};

export const addResearch = (item: ResearchItem): ResearchItem[] => {
  const current = getResearch();
  // Ensure views is 0 for new items
  const newItem = { ...item, views: 0 };
  const updated = [newItem, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const updateResearch = (updatedItem: ResearchItem): ResearchItem[] => {
  const current = getResearch();
  const index = current.findIndex(item => item.id === updatedItem.id);
  if (index !== -1) {
    // Preserve existing views if the updatedItem views is undefined (though logic elsewhere handles this)
    current[index] = updatedItem;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
  return current;
};

export const incrementViews = (id: string): ResearchItem[] => {
  const current = getResearch();
  const index = current.findIndex(item => item.id === id);
  if (index !== -1) {
    current[index].views = (current[index].views || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  }
  return current;
};

export const deleteResearch = (id: string): ResearchItem[] => {
  const current = getResearch();
  const updated = current.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// Data Management for Backup/Restore
export const getRawDatabase = (): string => {
  return localStorage.getItem(STORAGE_KEY) || JSON.stringify(SEED_DATA);
};

export const restoreDatabase = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, jsonString);
      return true;
    }
  } catch (e) {
    console.error("Invalid database file");
  }
  return false;
};

export const getPassword = (): string => {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
};

export const updatePassword = (password: string): void => {
  localStorage.setItem(PASSWORD_KEY, password);
};
