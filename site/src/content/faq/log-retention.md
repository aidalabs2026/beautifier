---
question: "How long do you keep server logs?"
category: "privacy"
order: 4
---

Our Nginx access logs are rotated automatically and removed within 60 days. They contain:

- IP address
- Timestamp
- Requested URL
- HTTP status and response size
- User-Agent and Referer headers

The logs do not contain any of the content you paste into the tool — that content never reaches our server in the first place.
