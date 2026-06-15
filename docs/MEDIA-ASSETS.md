# Media Assets

Large video files must not be committed to Git by default.

`public/videos` may only contain tiny demo or placeholder files when explicitly approved. Real course videos should later live on external storage, a CDN, or video hosting. The app should store and use video URLs instead of shipping large course media in the repository.

Temporary video assets should use predictable names:

- `codecraft-session-1.mp4`
- `codecraft-session-1-cover.jpg`

`CodeCraftAI_logo.mp4` is a brand/logo animation. It must not be used as the lesson video for the Video Grid.

Before commits, check:

```bash
git status --short --untracked-files=all
```
