export interface Fragment {
    type: 'text' | 'code' | 'hint' | 'link' | 'instruction' | 'title' | 'command';
    content: string;
  }
  
  export const fragmentMessage = (message: string): Fragment[] => {
    const fragments: Fragment[] = [];
    const regex = /(```[\s\S]*?```|Hint:[\s\S]*?(?=\n\n|$)|`[^`]+`|\d+\.\s\*\*[^*]+\*\*|(?:\*\*[^*]+\*\*))/g;
    let lastIndex = 0;
  
    let match;
    while ((match = regex.exec(message)) !== null) {
      if (match.index > lastIndex) {
        fragments.push({ type: 'text', content: message.substring(lastIndex, match.index) });
      }
      if (match[0].startsWith('```')) {
        fragments.push({ type: 'code', content: match[0].slice(3, -3) });
      } else if (match[0].startsWith('Hint:')) {
        fragments.push({ type: 'hint', content: match[0] });
      } else if (match[0].startsWith('`')) {
        const content = match[0].slice(1, -1).trim();
        if (content.startsWith('http')) {
          fragments.push({ type: 'link', content });
        } else if (content.includes(' ') && content.length > 3) {
          fragments.push({ type: 'command', content });
        } else {
          const lastFragment = fragments[fragments.length - 1];
          if (lastFragment && lastFragment.type === 'text') {
            lastFragment.content += match[0]; 
          } else {
            fragments.push({ type: 'text', content: match[0] }); 
          }
        }
      } else if (match[0].match(/^\d+\.\s\*\*[^*]+\*\*/)) {
        fragments.push({ type: 'title', content: match[0].replace(/\*\*/g, '') });
      } else {
        fragments.push({ type: 'instruction', content: match[0].replace(/\*\*/g, '') });
      }
      lastIndex = regex.lastIndex;
    }
  
    if (lastIndex < message.length) {
      fragments.push({ type: 'text', content: message.substring(lastIndex) });
    }
  
    return fragments;
  };
  