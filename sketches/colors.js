let lastColor = '';
export function getColor() {
    const colors = [ '#393D3F', '#99B2DD', '#B9CFD4'];
    const pickedColor = colors[Math.floor(Math.random() * colors.length)];
    if (pickedColor === lastColor) return getColor();
    lastColor = pickedColor;
    return pickedColor;
}
