export const parseAgentContent = (content) => {
  if (!content) return '';
  
  return content
    .replace(/<think>.*?<\/think>/gs, '')
    .replace(/(```json|```)/g, '') // Keep markdown formatting
    .replace(/(## LINKEDIN POST:|## X POST:)/gi, '\n')
    .trim();
};