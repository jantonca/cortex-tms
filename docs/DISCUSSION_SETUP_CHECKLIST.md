# GitHub Discussions Setup Checklist

This document contains manual steps to complete the GitHub Discussions setup after pushing the code changes.

## ✅ Automated (Already Done via Code)

- [x] Discussion templates created (Ideas, Q&A, Show and Tell)
- [x] Community guide written (docs/COMMUNITY.md)
- [x] Welcome discussion draft prepared (docs/WELCOME_DISCUSSION.md)
- [x] README updated with community links
- [x] Code committed and merged to main

## 📋 Manual Steps (GitHub UI Required)

### Step 1: Verify Discussion Categories

Go to: https://github.com/cortex-tms/cortex-tms/discussions

**Check that these categories exist:**
- [ ] 📣 Announcements
- [ ] 💬 General
- [ ] 💡 Ideas
- [ ] 🗳️ Polls (optional - can keep or remove)
- [ ] 🙏 Q&A
- [ ] 🌌 Show and tell

**If categories need adjustment:**
1. Go to Settings → Discussions
2. Edit/add/remove categories as needed

### Step 2: Create Welcome Discussion

1. Go to https://github.com/cortex-tms/cortex-tms/discussions
2. Click "New discussion"
3. Select **"📣 Announcements"** category
4. Copy content from `docs/WELCOME_DISCUSSION.md`
5. Paste into discussion body
6. Title: "Welcome to Cortex TMS Discussions! 🎉"
7. Click "Start discussion"

### Step 3: Pin the Welcome Discussion

1. Open the welcome discussion you just created
2. Click the "..." menu (top right)
3. Select "Pin discussion"
4. It will now appear at the top of all discussions

### Step 4: Test Discussion Templates

**Test the Ideas template:**
1. Go to Discussions → New discussion
2. Select "💡 Ideas" category
3. Verify the template loads with all fields
4. Cancel without posting

**Test the Q&A template:**
1. Go to Discussions → New discussion
2. Select "🙏 Q&A" category
3. Verify the template loads
4. Cancel without posting

**Test the Show and Tell template:**
1. Go to Discussions → New discussion
2. Select "🌌 Show and tell" category
3. Verify the template loads
4. Cancel without posting

### Step 5: Enable Template Association (if needed)

If templates don't auto-load:
1. Go to Settings → Discussions
2. Click on each category
3. Select "Use a template"
4. Choose the corresponding .yml file
5. Save

**Template mapping:**
- Ideas category → `ideas.yml`
- Q&A category → `question.yml`
- Show and tell category → `show-and-tell.yml`

### Step 6: Optional Enhancements

**Set discussion permissions:**
- [ ] Decide who can create discussions (anyone, collaborators only)
- [ ] Enable/disable anonymous discussions
- [ ] Set category-specific permissions if needed

**Configure notifications:**
- [ ] Watch the discussions repository for new posts
- [ ] Set up email notifications for specific categories

**Promote discussions:**
- [ ] Add discussions link to website header
- [ ] Mention in next release notes
- [ ] Share welcome discussion on social media

## 🎯 Success Criteria

After completing all steps, verify:

- [ ] Welcome discussion is visible and pinned
- [ ] All three templates work when creating new discussions
- [ ] README shows updated community section
- [ ] Categories are organized and clear
- [ ] First community member can easily:
  - Find how to ask questions
  - Submit feature ideas
  - Share their projects

## 📊 Metrics to Track

After going live, monitor:
- Number of discussions created
- Response time to questions
- Upvotes on popular ideas
- Showcase submissions
- Community growth (discussions vs GitHub stars)

## 🎉 Launch Announcement

Consider posting the welcome discussion link to:
- NPM package README
- Twitter/social media
- Developer communities
- Internal team chat

**Sample announcement:**
> 🎉 We've launched GitHub Discussions for Cortex TMS! Join 146+ stars and help shape the future of AI-optimized project scaffolding.
>
> 💬 Ask questions, share ideas, and showcase your projects!
> https://github.com/cortex-tms/cortex-tms/discussions

---

**Questions?** See [docs/COMMUNITY.md](COMMUNITY.md) for the full community guide.

**Next**: After completing these steps, delete this checklist or move it to `docs/archive/`.
