export const allCards = [-1, 1, 2, 3, 5, 8, 13, 21, 40, 80, 100];

export function copyStringToClipboard(value: string) {
  if (value) {
    const selectionBox = document.createElement('textarea');
    selectionBox.style.position = 'fixed';
    selectionBox.style.left = '0';
    selectionBox.style.top = '0';
    selectionBox.style.opacity = '0';
    selectionBox.value = value;
    document.body.appendChild(selectionBox);
    selectionBox.focus();
    selectionBox.select();
    document.execCommand('copy');
    document.body.removeChild(selectionBox);
  }
}
