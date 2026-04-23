---
question: "Can I prefill the input from a URL?"
category: "using-the-tool"
order: 5
---

Yes. Append `?input=` followed by a URL-encoded JSON string:

`https://beautifier.aidalabs.kr/json/?input=%7B%22hello%22%3A%22world%22%7D`

The decoded value of that parameter is placed into the input editor on page load. Useful for sharing links with colleagues or for bookmarking a specific test case.

Because the input is in the URL, this is the one mode where your data leaves your device — the URL itself is part of the HTTP request. Do not put sensitive data in the URL.
