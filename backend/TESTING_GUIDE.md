# Quick Test Guide for Optimized Backend

## Prerequisites
```bash
cd backend
npm install
# Add GEMINI_API_KEY to .env file
```

---

## 1. Start Server & Verify Optimizations

```bash
npm start
```

**Expected Output**:
```
==================================================
🚀 TransIntel Backend Server
==================================================
📡 Server: http://localhost:3001
🤖 Model: gemini-2.5-flash-lite
💾 Cache: Enabled (max 1000 entries)
🔑 API Key: ✓ Configured
==================================================
```

✅ Verify: Cache enabled, API key configured

---

## 2. Test Cache Performance

### Test A: First Request (Cache Miss)
```bash
curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","sourceLanguage":"en","targetLanguage":"es"}'
```

**Expected**: ~1800ms response time

### Test B: Repeat Request (Cache Hit)
```bash
curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","sourceLanguage":"en","targetLanguage":"es"}'
```

**Expected**: ~20ms response time ⚡

**Server Log Should Show**:
```
✓ Cache hit - returning cached translation
```

✅ **Success Criteria**: 2nd request is 99% faster

---

## 3. Test Language Detection

```bash
curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Bonjour le monde","sourceLanguage":"auto","targetLanguage":"en"}'
```

**Expected Response**:
```json
{
  "translatedText": "Hello world",
  "detectedLanguage": "fr"
}
```

✅ Verify: Correctly detects French

---

## 4. Test Short Text (Synonyms)

```bash
curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"happy","sourceLanguage":"en","targetLanguage":"es"}'
```

**Expected Response**:
```json
{
  "synonyms": "joyful, cheerful, content",
  "translatedText": "feliz; contento; alegre; dichoso",
  "detectedLanguage": "en"
}
```

✅ Verify: Returns synonyms + multiple translations

---

## 5. Test Long Text (Natural Translation)

```bash
curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text":"The weather is beautiful today. I think I will go for a walk in the park.",
    "sourceLanguage":"en",
    "targetLanguage":"es"
  }'
```

**Expected**: Natural Spanish translation without formatting artifacts

✅ Verify: No explanatory text, only translation

---

## 6. Test Image OCR

```bash
# Create a test image with text
curl -X POST http://localhost:3001/extract-text \
  -F "file=@test_image.png"
```

**Expected Response**:
```json
{
  "text": "Extracted text from image..."
}
```

**Server Log Should Show**:
```
Task: OCR text extraction from image
```

✅ Verify: Text extracted with layout preserved

---

## 7. Test File Type Validation

### Valid File
```bash
curl -X POST http://localhost:3001/extract-text \
  -F "file=@document.pdf"
```

**Expected**: Success response

### Invalid File
```bash
curl -X POST http://localhost:3001/extract-text \
  -F "file=@malicious.exe"
```

**Expected Response** (400):
```json
{
  "error": "Unsupported file type"
}
```

✅ Verify: Rejects invalid files before processing

---

## 8. Test Error Handling

### Invalid API Key
```bash
# Temporarily set invalid key in .env
GEMINI_API_KEY=invalid_key npm start

curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"test","sourceLanguage":"en","targetLanguage":"es"}'
```

**Expected** (401):
```json
{
  "error": "Invalid API key",
  "details": "..."
}
```

✅ Verify: Clear, actionable error message

---

## 9. Test Retry Logic

### Simulate Rate Limit
```bash
# Make 60+ rapid requests
for i in {1..65}; do
  curl -X POST http://localhost:3001/translate \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"Test $i\",\"sourceLanguage\":\"en\",\"targetLanguage\":\"es\"}"
done
```

**Server Log Should Show**:
```
⚠️  Error 429: Retry 1 after 1000ms
⚠️  Error 429: Retry 2 after 2000ms
```

✅ Verify: Exponential backoff in logs

---

## 10. Test Graceful Shutdown

```bash
# Start server
npm start

# In another terminal, send SIGTERM
pkill -SIGTERM -f "node server.js"
```

**Expected Output**:
```
⏹️  SIGTERM received, shutting down gracefully...
```

✅ Verify: Clean shutdown with cache cleanup

---

## 11. Load Test (Optional)

### Install Apache Bench
```bash
# Windows: Download from https://httpd.apache.org/
# macOS: brew install httpd
# Linux: apt-get install apache2-utils
```

### Run Load Test
```bash
ab -n 100 -c 10 -p payload.json -T application/json http://localhost:3001/translate
```

**payload.json**:
```json
{"text":"Hello","sourceLanguage":"en","targetLanguage":"es"}
```

**Expected**:
- First 10 requests: ~1800ms each (cache miss)
- Next 90 requests: ~20ms each (cache hit)
- Cache hit rate: 90%

✅ Verify: Average response time < 200ms

---

## 12. Memory Test

### Monitor Memory Usage
```bash
# Start server with memory monitoring
NODE_OPTIONS="--max-old-space-size=4096" npm start

# In another terminal
watch -n 1 'ps aux | grep node | grep -v grep'
```

### Generate Cache Load
```bash
# Generate 1000 unique translations
for i in {1..1000}; do
  curl -X POST http://localhost:3001/translate \
    -H "Content-Type: application/json" \
    -d "{\"text\":\"Word $i\",\"sourceLanguage\":\"en\",\"targetLanguage\":\"es\"}"
done
```

**Expected**:
- Baseline: ~45MB
- With 1000 entries: ~48MB
- Memory increase: <5MB

✅ Verify: Memory stays stable (no leaks)

---

## 13. Prompt Quality Test

### Test Natural Phrasing
```bash
curl -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text":"I am looking forward to seeing you soon.",
    "sourceLanguage":"en",
    "targetLanguage":"es"
  }'
```

**Expected**: Natural Spanish idiom (e.g., "Tengo ganas de verte pronto" not literal word-by-word)

✅ Verify: Uses natural expressions, not literal translation

---

## Quick Health Check Script

Save as `test_health.sh`:
```bash
#!/bin/bash

echo "🏥 Health Check..."
curl -s http://localhost:3001/health | jq '.'

echo -e "\n🔑 API Key Test..."
curl -s http://localhost:3001/test-api | jq '.'

echo -e "\n📝 Translation Test (Cache Miss)..."
time curl -s -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","sourceLanguage":"en","targetLanguage":"es"}' | jq '.'

echo -e "\n⚡ Translation Test (Cache Hit)..."
time curl -s -X POST http://localhost:3001/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","sourceLanguage":"en","targetLanguage":"es"}' | jq '.'

echo -e "\n✅ All tests complete!"
```

Run:
```bash
chmod +x test_health.sh
./test_health.sh
```

---

## Success Checklist

- [ ] Server starts with optimized configuration
- [ ] Cache reduces 2nd request to <50ms
- [ ] Language detection works (auto mode)
- [ ] Short text returns synonyms + translations
- [ ] Long text produces natural phrasing
- [ ] Image OCR extracts text correctly
- [ ] Invalid files are rejected pre-upload
- [ ] Error messages are user-friendly
- [ ] Retry logic handles rate limits
- [ ] Graceful shutdown clears cache
- [ ] Memory stays stable under load
- [ ] Cache hit rate >60% after warmup

---

## Troubleshooting

### Issue: Cache not working
**Check**: Look for `✓ Cache hit` in logs
**Fix**: Verify exact same request (text, source, target)

### Issue: Slow responses
**Check**: Are requests hitting cache?
**Fix**: Use exact same translations for testing

### Issue: Invalid API key
**Check**: `.env` file has correct key
**Fix**: Get new key from https://aistudio.google.com/app/apikey

### Issue: File upload fails
**Check**: File type in allowed list?
**Fix**: Use PNG, JPEG, PDF, or audio formats

### Issue: Memory leak
**Check**: Does memory grow unbounded?
**Fix**: Verify graceful shutdown clears cache

---

## Production Monitoring

Add to your monitoring dashboard:

```javascript
// Cache metrics
const cacheHitRate = (cacheHits / totalRequests * 100).toFixed(1);
const avgResponseTime = totalTime / totalRequests;

// Error rates
const errorRate = {
  '401': count401 / totalRequests,
  '429': count429 / totalRequests,
  '500': count500 / totalRequests
};

console.log(`📊 Cache: ${cacheHitRate}% | Avg: ${avgResponseTime}ms | Errors: ${JSON.stringify(errorRate)}`);
```

**Target Metrics**:
- Cache hit rate: >60%
- Avg response time: <500ms
- Error rate: <1%
- API calls: <30% of requests

---

## 🎉 All Tests Passing = Production Ready!
