// Test file to verify date formatting logic
// This can be run in browser console or Node.js to test the date formatting

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    // Check if it's today
    const isToday = now.toDateString() === date.toDateString();

    if (diffInHours < 1) {
        return 'Just now';
    } else if (isToday) {
        // Same date - show only time
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    } else {
        // Different date - show date and time
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === yesterday.toDateString()) {
            return `Yesterday ${date.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            })}`;
        } else {
            // For older dates, return object with multiline info
            return {
                isMultiLine: true,
                dateText: date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                }),
                timeText: date.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                })
            };
        }
    }
};

// Test cases
console.log('=== Date Formatting Tests ===');

// Test 1: Just now (30 minutes ago)
const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
console.log('30 minutes ago:', formatDate(thirtyMinutesAgo.toISOString()));

// Test 2: Today (3 hours ago)
const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
console.log('3 hours ago (today):', formatDate(threeHoursAgo.toISOString()));

// Test 3: Yesterday
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setHours(14, 30, 0, 0); // 2:30 PM yesterday
console.log('Yesterday:', formatDate(yesterday.toISOString()));

// Test 4: 3 days ago
const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
threeDaysAgo.setHours(10, 15, 0, 0); // 10:15 AM three days ago
console.log('3 days ago:', formatDate(threeDaysAgo.toISOString()));

// Test 5: Different year
const lastYear = new Date();
lastYear.setFullYear(lastYear.getFullYear() - 1);
lastYear.setMonth(5); // June
lastYear.setDate(15);
lastYear.setHours(16, 45, 0, 0); // 4:45 PM
console.log('Last year:', formatDate(lastYear.toISOString()));
