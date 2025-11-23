# 🚀 GitHub Actions Boilerplate Starter Kit

Production-ready GitHub Actions workflows for modern CI/CD pipelines. Drop these into your project and customize to your needs!

## 📦 What's Included

This starter kit includes 5 production-grade workflows:

1. **`ci.yml`** - Main CI pipeline with testing, linting, and security scanning
2. **`deploy.yml`** - Production deployment with OIDC authentication and blue-green deployment
3. **`reusable-test.yml`** - Reusable testing workflow following DRY principles
4. **`rotate-secrets.yml`** - Automated secrets rotation for better security
5. **`monorepo.yml`** - Smart monorepo CI with path filtering (bonus!)

## 🎯 Features

✅ **Security First**
- OIDC authentication (no long-lived credentials)
- Automated secret scanning
- Vulnerability detection with Trivy
- Regular secrets rotation

✅ **Developer Experience**
- Fast builds with smart caching
- Parallel test execution
- Beautiful job summaries
- Real-time Slack notifications

✅ **Production Ready**
- Blue-green deployments
- Environment protection rules
- Automatic rollback capability
- Comprehensive logging

✅ **Observable**
- Detailed deployment reports
- Performance tracking
- Coverage reporting
- Status badges

## 🚀 Quick Start

### Step 1: Copy Workflow Files

Copy the workflow files to your repository:

```bash
mkdir -p .github/workflows
cp ci.yml .github/workflows/
cp deploy.yml .github/workflows/
cp reusable-test.yml .github/workflows/
cp rotate-secrets.yml .github/workflows/
```

### Step 2: Configure Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

**Required:**
- `SLACK_WEBHOOK_URL` - Your Slack incoming webhook URL
- `AWS_ROLE_ARN_STAGING` - AWS IAM role ARN for staging (if using AWS)
- `AWS_ROLE_ARN_PRODUCTION` - AWS IAM role ARN for production (if using AWS)

**Optional:**
- `CODECOV_TOKEN` - Codecov token for coverage reporting
- `PERSONAL_ACCESS_TOKEN` - For secrets rotation workflow

### Step 3: Set Up Environments

1. Go to **Settings → Environments**
2. Create two environments: `staging` and `production`
3. For `production`, add protection rules:
   - ✅ Required reviewers (at least 1-2 people)
   - ✅ Wait timer (optional, e.g., 5 minutes)

### Step 4: Customize for Your Project

Update these values in the workflow files:

**In `ci.yml`:**
- Node.js versions in the matrix (lines 47-49)
- Test commands to match your `package.json` scripts
- Build output paths

**In `deploy.yml`:**
- S3 bucket names (staging-bucket, prod-bucket)
- CloudFront distribution IDs
- Your application URLs
- Health check endpoints

**In `reusable-test.yml`:**
- Default test command
- Coverage report location

### Step 5: Update Your package.json

Make sure your `package.json` includes these scripts:

```json
{
  "scripts": {
    "lint": "eslint .",
    "format:check": "prettier --check .",
    "test": "jest",
    "test:unit": "jest --testPathPattern=unit",
    "test:integration": "jest --testPathPattern=integration",
    "test:coverage": "jest --coverage",
    "build": "your-build-command"
  }
}
```

## 🔧 Configuration Guide

### OIDC Setup (AWS Example)

1. **Create IAM Role in AWS:**

```bash
# Trust policy for GitHub Actions
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::YOUR_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/YOUR_REPO:*"
        }
      }
    }
  ]
}
```

2. **Attach Necessary Permissions:**
   - S3 bucket access
   - CloudFront invalidation
   - Any other AWS services you use

3. **Add Role ARN to GitHub Secrets:**
   - `AWS_ROLE_ARN_STAGING`
   - `AWS_ROLE_ARN_PRODUCTION`

### Slack Notifications Setup

1. **Create Slack Incoming Webhook:**
   - Go to your Slack workspace
   - Navigate to Apps → Incoming Webhooks
   - Click "Add to Slack"
   - Choose a channel
   - Copy the webhook URL

2. **Add to GitHub Secrets:**
   - Name: `SLACK_WEBHOOK_URL`
   - Value: Your webhook URL

### Environment Protection Rules

**For Production Environment:**

1. Go to **Settings → Environments → production**
2. Check "Required reviewers"
3. Add 1-2 team members who must approve deployments
4. (Optional) Add wait timer for additional safety

**For Staging Environment:**
- No protection rules needed
- Deploys automatically on push to main

## 📊 Workflow Triggers

### CI Pipeline (`ci.yml`)
- ✅ Runs on every push to `main` and `develop`
- ✅ Runs on all pull requests
- ✅ Can be triggered manually

### Deployment (`deploy.yml`)
- ✅ Runs on push to `main` branch
- ✅ Runs on version tags (v1.0.0, v2.1.3, etc.)
- ✅ Can be triggered manually with environment selection

### Secrets Rotation (`rotate-secrets.yml`)
- ✅ Runs automatically on the 1st of every month
- ✅ Can be triggered manually anytime

## 🎨 Customization Examples

### Add Docker Build

Add this to `ci.yml`:

```yaml
- name: Build Docker image
  run: |
    docker build -t myapp:${{ github.sha }} .
    
- name: Push to registry
  run: |
    echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
    docker push myapp:${{ github.sha }}
```

### Add E2E Tests

Add this job to `ci.yml`:

```yaml
test-e2e:
  name: 🎭 E2E Tests
  needs: build
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: cypress-io/github-action@v6
      with:
        start: npm start
        wait-on: 'http://localhost:3000'
```

### Add Performance Testing

```yaml
performance-test:
  name: ⚡ Performance Tests
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run Lighthouse
      uses: treosh/lighthouse-ci-action@v10
      with:
        urls: |
          https://staging.yourapp.com
        uploadArtifacts: true
```

## 🐛 Troubleshooting

### "Permission denied" errors
- Check that your AWS IAM role has the correct permissions
- Verify the trust policy allows your GitHub repository

### Deployment fails at health check
- Ensure your health check endpoint is correct
- Increase the sleep duration before checking
- Check CloudFront propagation time

### Cache not working
- Verify the cache key matches your dependency file
- Check if you've changed the cache version (`v1`, `v2`, etc.)
- Clear cache manually: Settings → Actions → Caches

### Secrets not updating
- Ensure `PERSONAL_ACCESS_TOKEN` has `repo` and `workflow` scopes
- Check that the secret names match exactly (case-sensitive)

## 📈 Best Practices

1. **Start Simple:** Don't enable all features at once. Add workflows incrementally.

2. **Test Locally First:** Use [act](https://github.com/nektos/act) to test workflows on your machine.

3. **Monitor CI Minutes:** Keep an eye on your Actions usage (Settings → Billing).

4. **Review Regularly:** Check workflow runs weekly to spot patterns or issues.

5. **Keep Dependencies Updated:** Update action versions in your workflows quarterly.

6. **Document Changes:** Add comments to workflows explaining why you made specific choices.

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [OIDC Setup Guide](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [Slack Webhooks](https://api.slack.com/messaging/webhooks)
- [Act - Run Actions Locally](https://github.com/nektos/act)

## 💡 Tips & Tricks

**Use Workflow Dispatch for Testing:**
```yaml
on:
  workflow_dispatch:
    inputs:
      debug:
        description: 'Enable debug mode'
        type: boolean
        default: false
```

**Add Status Badges to README:**
```markdown
![CI Status](https://github.com/username/repo/workflows/CI%20Pipeline/badge.svg)
```

**Set Job Timeouts:**
```yaml
jobs:
  build:
    timeout-minutes: 15  # Prevents stuck jobs
```

**Use Concurrency Control:**
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

## 🤝 Contributing

Found a bug or have a suggestion? Please open an issue or submit a pull request!

## 📝 License

MIT License - feel free to use this in your projects!

---

**Made with ❤️ for the developer community**

*Now go build something amazing!* 🚀
