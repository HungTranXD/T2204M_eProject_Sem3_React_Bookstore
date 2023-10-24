const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[date.getMonth()];

    // Add leading zero for single-digit days and hours
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Format the date as "day Month, Year"
    const formattedDate = `${day} ${month}, ${date.getFullYear()}`;

    // Format the date as MM/DD/YYYY
    const formattedDateNumeric = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${day}/${date.getFullYear()}`;

    // Format the time as HH:mm AM/PM
    const time12Hour = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    // Format the time as HH:mm:ss
    const time24Hour = `${hours}:${minutes}:${seconds}`;

    return { month, day, time12Hour, time24Hour, formattedDate, formattedDateNumeric };
};

export default formatDate;