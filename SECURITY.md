# Security Guidelines

## Environment Variables

### Server-Side Only (Secure)
- `OPENAI_API_KEY` - OpenAI API key for AI processing
  - ✅ Uses `process.env` (server-side only)
  - ✅ Never exposed to client
  - ✅ Filtered out of cache storage

### Client-Side Exposed (VITE_ prefix)
⚠️ **IMPORTANT**: Any environment variable with `VITE_` prefix is bundled into the client-side code and publicly accessible.

- `VITE_POCKETBASE_URL` - PocketBase instance URL
  - ⚠️ Public URL - safe to expose
  - Used for client-side database connections

- `VITE_POCKETBASE_ADMIN_EMAIL` - Admin email for PocketBase
  - ⚠️ Consider using public API rules instead of admin auth
  - Currently required for cache operations

- `VITE_POCKETBASE_ADMIN_PASSWORD` - Admin password
  - 🚨 **SECURITY RISK**: Exposed to client-side
  - **Recommendation**: Use PocketBase API rules instead

## Security Best Practices

### ✅ Currently Implemented
1. **API Key Protection**: OpenAI API key is server-side only
2. **Cache Data Filtering**: Sensitive data removed before caching
3. **Environment File**: `.env` is properly gitignored
4. **Reduced Logging**: Removed sensitive URLs from logs

### 🛠️ Recommended Improvements

1. **Remove Admin Authentication**
   ```javascript
   // Instead of admin auth, use PocketBase API rules:
   // Collection Rules > List/View: @request.auth.id != ""
   // This allows authenticated users without exposing admin credentials
   ```

2. **Rate Limiting**
   - Add rate limiting for digest generation
   - Prevent abuse of OpenAI API

3. **Input Validation**
   - Validate story limits and time ranges
   - Sanitize user inputs

4. **CORS Configuration**
   - Configure proper CORS headers for production
   - Restrict origins to your domain

## Production Deployment

### Environment Variables
- Use secure secret management (AWS Secrets Manager, etc.)
- Never commit `.env` files to version control
- Rotate API keys regularly

### PocketBase Security
- Use API rules instead of admin authentication
- Enable HTTPS only
- Configure proper backup retention
- Monitor access logs

### OpenAI API Security
- Monitor usage and set billing limits
- Use least-privilege API keys
- Implement request logging and monitoring

## Incident Response

If API keys are compromised:
1. Immediately rotate the affected keys
2. Review access logs for unauthorized usage
3. Update all deployment environments
4. Monitor for unusual activity

## Contact

For security issues, please contact: [your-security-email]
