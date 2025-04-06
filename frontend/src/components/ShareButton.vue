<template>
    <div class="overlay" @click.self="closePopup">
      <div class="share-popup">
        <!-- Close Button -->
        <button class="close-btn" @click.stop="closePopup">
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
  
        <!-- Title -->
        <h3 class="popup-title">{{ $t('share.title') }}</h3>
        <hr class="divider" />
  
        <!-- Share Options -->
        <p class="share-title">{{ $t('share.section') }}</p>
        <div class="share-container">
          <a :href="facebookShare" target="_blank" class="share-btn facebook">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
          <a :href="twitterShare" target="_blank" class="share-btn twitter">
            <i class="fa-brands fa-x-twitter"></i>
          </a>
          <a :href="threadsShare" target="_blank" class="share-btn threads">
            <i class="fa-brands fa-threads"></i>
          </a>
          <a :href="linkedinShare" target="_blank" class="share-btn linkedin">
            <i class="fa-brands fa-linkedin"></i>
          </a>
          <a :href="whatsappShare" target="_blank" class="share-btn whatsapp">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
          <a :href="telegramShare" target="_blank" class="share-btn telegram">
            <i class="fa-brands fa-telegram"></i>
          </a>
        </div>
  
        <!-- Copy Link Section -->
        <div class="copy-container">
          <input type="text" :value="shareURL" readonly class="copy-link-input" />
          <button @click="copyLink" class="copy-button">{{ $t('share.copy') }}</button>
        </div>
  
        <p v-if="copied" class="copy-success">{{ $t('share.copied') }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: ["postId"],
    data() {
      return {
        copied: false,
        baseURL: "https://finbud.pro/",
      };
    },
    computed: {
        shareURL() {
            return encodeURIComponent(`https://finbud.pro/forum/thread/${this.postId}`);
        },
        facebookShare() {
            return `https://www.facebook.com/sharer/sharer.php?u=${this.shareURL}`;
        },
        twitterShare() {
            return `https://twitter.com/intent/tweet?url=${this.shareURL}`;
        },
        linkedinShare() {
            return `https://www.linkedin.com/sharing/share-offsite/?url=${this.shareURL}`;
        },
        whatsappShare() {
            return `https://api.whatsapp.com/send?text=${this.shareURL}`;
        },
        telegramShare() {
            return `https://telegram.me/share/url?url=${this.shareURL}`;
        }
    },
    methods: {
      copyLink() {
        navigator.clipboard.writeText(this.shareURL).then(() => {
          this.copied = true;
          setTimeout(() => (this.copied = false), 2000);
        });
      },
      closePopup() {
        this.$emit("close");
      },
    },
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .share-popup {
    background: white;
    color: black;
    padding: 20px;
    border-radius: 15px;
    width: 630px;
    text-align: center;
    position: relative;
  }
  
  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    font-size: 30px;
    color: black;
    cursor: pointer;
  }
  
  .popup-title {
    font-size: 22px;
    margin-bottom: 15px;
  }
  
  .divider {
    border: 0;
    height: 1px;
    background: lightgray;
    margin: 12px 0;
    margin-bottom: 5px;
  }
  
  .share-title {
    font-size: 18px;
    text-align: left;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .share-container {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 30px;
  }
  
  .share-btn {
    font-size: 22px;
    color: white;
    padding: 15px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    width: 40px;
    height: 40px;
  }
  
  .facebook { background: #3b5998; }
  .twitter { background: #1da1f2; }
  .threads { background: black; }
  .linkedin { background: #0077b5; }
  .whatsapp { background: #25d366; }
  .telegram { background: #0088cc; }
  
  .copy-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f0f0f0;
    border-radius: 10px;
    padding: 5px;
    margin-bottom: 15px;
  }
  
  .copy-link-input {
    background: transparent;
    color: black;
    border: none;
    flex: 1;
    padding: 5px;
    outline: none;
    font-size: 16px;
  }
  
  .copy-button {
    background: #007aff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .copy-success {
    color: #25d366;
    font-size: 14px;
    margin-top: 5px;
  }
  </style>
  
