// Utility function to extract YouTube Video ID from various URL formats
export const extractYouTubeVideoId = (input) => {
  if (!input) return null;
  const str = input.trim();

  // If input is already an 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }

  // Regular expressions for various YouTube URL formats
  const regexes = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/
  ];

  for (const regex of regexes) {
    const match = str.match(regex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};
