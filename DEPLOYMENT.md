# GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

## Setup Instructions

### 1. Enable GitHub Pages in Repository Settings

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Repository Configuration

The deployment is configured to work with the repository name `LocaStat.github.io` which will be hosted at the root path `/`.

### 3. Workflow Configuration

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:

- Trigger on pushes to `main` or `master` branches
- Build the Vite React application
- Deploy to GitHub Pages automatically

### 4. Build Configuration

- **Base Path**: `/` (root of GitHub Pages)
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`
- **Node Version**: 18

### 5. Manual Deployment

If you need to trigger a manual deployment:

1. Push changes to the `main` or `master` branch
2. The workflow will automatically start
3. Check the **Actions** tab in your repository to monitor progress

### 6. Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS settings to point to GitHub Pages
3. Enable the custom domain in repository settings

## Troubleshooting

### Common Issues

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **404 Errors**: Ensure the base path is set to `/` in `vite.config.ts`
3. **Assets Not Loading**: Verify that the build output includes all assets

### Checking Deployment Status

- Go to **Actions** tab in your repository
- Look for the "Deploy to GitHub Pages" workflow
- Check the logs for any errors

## Local Development

To test the build locally:

```bash
npm run build
npm run preview
```

This will build the project and serve it locally to verify everything works correctly.
