# Overview

This is a French dictionary web scraper API built with Flask. The application scrapes word definitions, examples, and related information from Le Robert dictionary (dictionnaire.lerobert.com) and exposes them through a REST API endpoint. The service is designed to provide programmatic access to French word definitions for applications that need French language reference data.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture

**Framework Choice: Flask**
- **Problem**: Need a lightweight HTTP server to expose dictionary scraping functionality via API
- **Solution**: Flask microframework for Python
- **Rationale**: Flask provides minimal overhead for building simple REST APIs, making it ideal for this single-purpose web scraping service
- **Pros**: Simple to set up, minimal boilerplate, easy to deploy
- **Cons**: No built-in async support (though not needed for this use case), requires additional libraries for production deployment

## Web Scraping Strategy

**HTML Parsing: BeautifulSoup4 with lxml**
- **Problem**: Need to extract structured data from Le Robert dictionary HTML pages
- **Solution**: BeautifulSoup4 library with lxml parser
- **Rationale**: BeautifulSoup provides intuitive DOM traversal and lxml offers fast HTML parsing
- **Implementation Details**:
  - Targets specific CSS classes (`d_dfn` for definitions, `d_xpl` for examples, `d_cat` for word type)
  - Uses requests library with custom headers to mimic browser behavior and avoid blocking
  - Implements timeout handling (10 seconds) and error handling for network failures

**Data Structure**:
The scraper returns structured JSON containing:
- Word and word type (noun, verb, adjective, etc.)
- Numbered definitions list
- Usage examples (limited to first 5)
- Synonyms list (structure present but implementation incomplete in provided code)

## Error Handling

- Network request failures are caught and returned as JSON error responses
- HTTP status codes are validated using `raise_for_status()`
- Timeouts prevent indefinite hanging on slow connections

## Production Deployment

**WSGI Server: Gunicorn**
- **Problem**: Flask's built-in server is not production-ready
- **Solution**: Gunicorn WSGI HTTP server included in dependencies
- **Rationale**: Industry-standard production server for Python web applications
- **Pros**: Reliable, supports worker processes, well-maintained
- **Cons**: Requires additional configuration for optimal performance

# External Dependencies

## Core Libraries
- **Flask 3.0.0**: Web framework for API endpoints
- **Requests 2.31.0**: HTTP client for fetching dictionary pages
- **BeautifulSoup4 4.12.2**: HTML parsing and DOM traversal
- **lxml 4.9.3**: Fast XML/HTML parser backend for BeautifulSoup
- **Gunicorn 21.2.0**: Production WSGI server

## External Services
- **Le Robert Dictionary (dictionnaire.lerobert.com)**: Primary data source for French word definitions
  - **Dependency Type**: Web scraping target (no official API)
  - **Risk**: Changes to HTML structure will break scraping logic
  - **Rate Limiting**: No authentication or API key system; relies on User-Agent headers to appear as regular browser traffic
  - **Data Access Pattern**: Direct HTTP GET requests to definition URLs following pattern: `https://dictionnaire.lerobert.com/definition/{word}`

## Notes on External Service Integration
- The application is tightly coupled to Le Robert's HTML structure
- No caching mechanism is implemented; each API call triggers a fresh scrape
- No rate limiting is implemented on the application side
- Browser-like headers are used to avoid potential blocking by the dictionary website