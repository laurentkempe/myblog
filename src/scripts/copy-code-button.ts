// Copy Code Button
// This script adds a copy button to all code blocks on the page

/**
 * Create a copy button element
 */
function createCopyButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'copy-code-button';
  button.setAttribute('aria-label', 'Copy code to clipboard');
  button.innerHTML = `
    <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    <svg class="check-icon copy-button-hidden" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  return button;
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
}

/**
 * Show success feedback on button
 */
function showCopyFeedback(button: HTMLButtonElement) {
  const copyIcon = button.querySelector('.copy-icon');
  const checkIcon = button.querySelector('.check-icon');
  
  if (copyIcon && checkIcon) {
    copyIcon.classList.add('copy-button-hidden');
    checkIcon.classList.remove('copy-button-hidden');
    button.classList.add('copied');
    
    setTimeout(() => {
      copyIcon.classList.remove('copy-button-hidden');
      checkIcon.classList.add('copy-button-hidden');
      button.classList.remove('copied');
    }, 2000);
  }
}

/**
 * Add copy button to a code block
 */
function addCopyButtonToCodeBlock(pre: HTMLPreElement) {
  // Skip if already wrapped
  if (pre.parentElement?.classList.contains('code-block-wrapper')) {
    return;
  }

  // Wrap pre in a container so the button stays fixed during horizontal scroll
  const wrapper = document.createElement('div');
  wrapper.className = 'code-block-wrapper';
  pre.parentNode?.insertBefore(wrapper, pre);
  wrapper.appendChild(pre);

  const button = createCopyButton();
  
  button.addEventListener('click', async () => {
    const code = pre.querySelector('code');
    if (code) {
      // Use innerText to get user-friendly text without extra whitespace from syntax highlighting
      const text = code.innerText || code.textContent || '';
      const success = await copyToClipboard(text);
      
      if (success) {
        showCopyFeedback(button);
      }
    }
  });

  wrapper.appendChild(button);
}

/**
 * Add copy buttons to all code blocks
 */
function addCopyButtonsToAllCodeBlocks() {
  // Find all pre elements that contain code
  const preElements = document.querySelectorAll('pre');
  
  preElements.forEach((pre) => {
    // Check if pre contains a code element
    if (pre.querySelector('code')) {
      addCopyButtonToCodeBlock(pre as HTMLPreElement);
    }
  });
}

/**
 * Initialize the script
 */
function init() {
  addCopyButtonsToAllCodeBlocks();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
