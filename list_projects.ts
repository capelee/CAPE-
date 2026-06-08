import { initialPortfolioData } from './src/data';
initialPortfolioData.forEach(item => {
  console.log(`ID: ${item.id} | Cat: ${item.category} | Title: ${item.title}`);
});
