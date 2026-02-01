
// src https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
export function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
}

export async function shareHandler({
  shareUrl,
  shareTitle,
  shareText,
  onSuccess,
  onError,
}) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  try {
    // Desktop: Copy to clipboard
    if (!isMobile) {
      // Feature detection for Clipboard API
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error("Clipboard API not supported in this browser");
      }

      await navigator.clipboard.writeText(shareUrl);
      if (onSuccess) {
        onSuccess("Link copied to clipboard");
      } else {
        alert("Link copied to clipboard");
      }
      return;
    }

    // Mobile: Use native share if available
    if (navigator.share) {
      await navigator.share({
        title: shareTitle || document.title,
        text: shareText || "Know Your Rights",
        url: shareUrl,
      });
      
      if (onSuccess) {
        onSuccess("Thanks for sharing!");
      }
      console.log("Thanks for sharing!");
    } else {
      // Fallback to clipboard on mobile if share not available
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error("Neither Share API nor Clipboard API are supported in this browser");
      }

      await navigator.clipboard.writeText(shareUrl);
      if (onSuccess) {
        onSuccess("Link copied to clipboard");
      } else {
        alert("Link copied to clipboard");
      }
    }
  } catch (error) {
    // User cancelled share dialog (not an error)
    if (error.name === "AbortError") {
      console.log("Share cancelled by user");
      return;
    }

    // Permission denied for clipboard
    if (error.name === "NotAllowedError") {
      const message = "Permission denied. Please allow clipboard access in your browser settings.";
      console.error(message, error);
      if (onError) {
        onError(message);
      } else {
        alert(message);
      }
      return;
    }

    // Other errors
    const message = error.message || "Unable to share. Please try again.";
    console.error("Share failed:", error);
    if (onError) {
      onError(message);
    } else {
      alert(`Share failed: ${message}`);
    }
  }
}