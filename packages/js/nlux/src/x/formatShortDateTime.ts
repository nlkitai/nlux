export const formatShortDateTime = (date: Date) => {
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    const nowDate = now.getDate();
    const nowHours = now.getHours();
    const nowMinutes = now.getMinutes();
    const nowSeconds = now.getSeconds();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    if (year === nowYear && month === nowMonth && day === nowDate) {
        if (hours === nowHours && minutes === nowMinutes && seconds === nowSeconds) {
            return 'now';
        } else {
            if (hours === nowHours && minutes === nowMinutes) {
                return `${seconds - nowSeconds}s ago`;
            } else {
                if (hours === nowHours) {
                    return `${minutes - nowMinutes}m ago`;
                } else {
                    return `${hours - nowHours}h ago`;
                }
            }
        }
    } else {
        return `${year}-${month}-${day}`;
    }
};
