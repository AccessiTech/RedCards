
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

export function shareHandler({
  shareUrl,
  shareTitle,
  shareText,
}) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobile) {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard");
    return;
  }

  navigator
    .share({
      title: shareTitle || document.title,
      text: shareText || "Know Your Rights",
      url: shareUrl,
    })
    .then(() => {
      console.log("Thanks for sharing!");
    })
    .catch(console.error);
}