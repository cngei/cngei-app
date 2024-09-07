/**
 * Formats a date into DD/MM/YYYY format.
 * @param date - The date to format. Can be a Date object or a string that can be parsed by Date constructor.
 * @returns A string representing the date in DD/MM/YYYY format.
 */
export function formatDate(date: Date | string): string {
    const d = new Date(date);
    
    // Check if the date is valid
    if (isNaN(d.getTime())) {
        throw new Error('Invalid date');
    }

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

