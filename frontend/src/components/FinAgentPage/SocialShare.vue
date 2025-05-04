<template>
  <div class="social-share">
    <div class="share-buttons">
      <button class="share-button copy" title="Copy link">
        <span class="icon-copy"></span>
      </button>
      <button class="share-button twitter" title="Share on Twitter">
        <span class="icon-twitter"></span>
      </button>
      <button class="share-button facebook" title="Share on Facebook">
        <span class="icon-facebook"></span>
      </button>
      <button class="share-button linkedin" title="Share on LinkedIn">
        <span class="icon-linkedin"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SocialShare'
}
</script>

<style scoped>
.social-share {
  display: flex;
  align-items: center;
}

.share-buttons {
  display: flex;
}

.share-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.share-button:hover {
  transform: scale(1.05);
}

.copy {
  background-color: #cbd5e0;
}

.twitter {
  background-color: #38b2f8;
}

.facebook {
  background-color: #4267B2;
}

.linkedin {
  background-color: #0077B5;
}

.icon-copy, .icon-twitter, .icon-facebook, .icon-linkedin {
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: white;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
}

.icon-copy {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'%3E%3C/path%3E%3C/svg%3E");
}

.icon-twitter {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'%3E%3C/path%3E%3C/svg%3E");
}

.icon-facebook {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'%3E%3C/path%3E%3C/svg%3E");
}

.icon-linkedin {
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'%3E%3C/path%3E%3Crect x='2' y='9' width='4' height='12'%3E%3C/rect%3E%3Ccircle cx='4' cy='4' r='2'%3E%3C/circle%3E%3C/svg%3E");
}
</style>