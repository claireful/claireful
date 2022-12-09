export function getStorageItemsNumber() {
    let count = 0;
    for (const [key, value] of Object.entries(sessionStorage)) {
        count += Number(value);
    }
    return count;
}