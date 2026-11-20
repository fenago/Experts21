---
name: web-research
description: "Find current, dated facts online (rules, prices, rents, openings, closures, competitor news) and record the source. Use when the research pack is missing a fact or it may be out of date."
---

# Web and news research

1. Check `docs/` first (research-pack-lookup). Search only for what is missing or may have changed.
2. Search with whatever web tools are available (WebSearch/WebFetch, or Firecrawl tools if connected). Run independent searches in parallel.
3. Prefer primary sources: `.gov` agency pages, official company announcements, broker market reports, then reputable news. Treat vendor blogs as low confidence.
4. Prefer sources from the last 12 months. Note the publish date of each.
5. Cross-check any number that drives a decision against a second source.
6. Never put Dr. Lee's or the client's name, email, or private details into search queries.
7. Return: the fact, source link, date, confidence (see source-citation).
8. If you find something that changes the research pack, flag it: `UPDATE docs/0X-....md: [what changed, source]`.

Useful sources: Florida DBPR (myfloridalicense.com), Sunbiz, Florida Dept. of Revenue, miamidade.gov, miami.gov, municode.com, Census (data.census.gov), FEMA Flood Map Service Center, Cushman & Wakefield / CoStar retail reports, Miami New Times, Eater Miami, The Real Deal Miami, Barista Magazine, ICE arabica futures.
