import { initialPortfolioData } from './src/data';
import fs from 'fs';

let output = '';
initialPortfolioData.forEach(item => {
  output += `=========================================\n`;
  output += `ID: ${item.id}\n`;
  output += `Category: ${item.category}\n`;
  output += `Title: ${item.title}\n`;
  output += `Philosophy: ${item.philosophy.slice(0, 300)}...\n`;
  output += `Images:\n`;
  if (item.images) {
    item.images.forEach(img => {
      output += `  - ${img}\n`;
    });
  } else {
    output += `  - ${item.imageUrl}\n`;
  }
  output += `\n`;
});

fs.writeFileSync('portfolio_summary.txt', output);
console.log('Dumped portfolio data to portfolio_summary.txt');
