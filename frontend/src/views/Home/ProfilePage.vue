<template>
  <div class="profile-root">
    <!-- Hero Header -->
    <header class="profile-hero animate-in">
      <div class="hero-content">
        <img src="@/assets/finbud_logo.png" alt="FinBud Mascot" class="hero-mascot" />
        <div class="hero-text">
          <h1 class="hero-title">Hey, {{ profile.displayName || 'Friend' }}! 👋</h1>
          <p class="hero-subtitle">Welcome to your financial command center. Looking sharp today!</p>
        </div>
      </div>
    </header>

    <div class="profile-grid">
      <!-- Left Column: Stats & Balance -->
      <aside class="profile-sidebar">
        <div class="balance-card border card-glow">
          <div class="profile-image-section">
            <div class="profile-image-container">
              <img
                class="profile-image"
                :class="{ 'image-uploaded': imageUploaded }"
                :src="profileImage"
                alt="Profile Image"
              />
              <label for="file-upload" class="custom-file-upload" title="Change Avatar">
                <font-awesome-icon icon="fa-solid fa-camera" />
              </label>
              <input id="file-upload" type="file" @change="uploadImage" hidden />
            </div>
          </div>

          <div class="balance">
            <div
              class="stat-tile"
              v-for="item in financialData"
              :key="item.label"
            >
              <h3 class="stat-label">{{ item.label }}</h3>
              <p class="stat-value" :class="statValueClass(item.value)">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Column: Info Form -->
      <main class="profile-main">
        <div class="info-card border">
          <div class="info-body">
            <form @submit.prevent="updateProfile">
              <div
                class="section"
                v-for="(section, sectionIndex) in sections"
                :key="sectionIndex"
              >
                <div class="header-section">{{ section.title }}</div>
                <div class="form-grid">
                  <div
                    class="form-group"
                    v-for="(field, fieldIndex) in section.fields"
                    :key="fieldIndex"
                    :class="{ 'full-width': field.type === 'textarea' }"
                  >
                    <label :for="field.id">{{ field.label }}</label>
                    <div class="input-wrapper">
                      <input
                        v-if="field.type !== 'textarea'"
                        :type="field.type"
                        :id="field.id"
                        v-model="profile[field.model]"
                        :placeholder="field.label"
                        :readonly="field.id === 'email'"
                      />
                      <textarea
                        v-else
                        :id="field.id"
                        v-model="profile[field.model]"
                        :placeholder="field.label"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="btn-container">
                <button type="submit" class="btn btn-save">
                  <span>Save Changes</span>
                  <font-awesome-icon icon="fa-solid fa-check" class="btn-icon" />
                </button>
                <button type="button" @click="cancelChange" class="btn btn-cancel">
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>

    <!-- Leaderboard Section -->
    <section class="leaderboard-section border">
      <div class="section-header">
        <font-awesome-icon icon="fa-solid fa-trophy" class="header-icon" />
        <h2>FinCoin Leaderboard</h2>
      </div>
      <FinCoinLeaderboard
        :leaderboard-data="leaderboardData"
        :current-user-rank="currentUserRank"
        :selected-time-frame="selectedTimeFrame"
        :time-frames="timeFrames"
        :current-user-id="currentUserId"
        :default-image="defaultImage"
        @time-frame-change="changeTimeFrame"
      />
    </section>
  </div>
</template>

<script>
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import defaultImage from "@/assets/anonymous.png";
import api from "@/utils/api";
import FinCoinLeaderboard from "@/components/FinCoinLeaderboard.vue";

export default {
  components: {
    FinCoinLeaderboard,
  },
  data() {
    return {
      imageUploaded: false,
      profile: {
        displayName: "",
        firstName: "",
        lastName: "",
        email: "",
        image: "",
      },
      sections: [
        {
          title: "User Information",
          fields: [
            {
              id: "displayName",
              label: "Display name",
              type: "text",
              model: "displayName",
            },
            {
              id: "email",
              label: "Email address",
              type: "email",
              model: "email",
            },
            {
              id: "firstName",
              label: "First name",
              type: "text",
              model: "firstName",
            },
            {
              id: "lastName",
              label: "Last name",
              type: "text",
              model: "lastName",
            },
          ],
        },
        // {
        //   title: 'Contact Information',
        //   fields: [
        //     { id: 'address', label: 'Address', type: 'text', model: 'address' },
        //     { id: 'city', label: 'City', type: 'text', model: 'city' },
        //     { id: 'country', label: 'Country', type: 'text', model: 'country' },
        //     { id: 'postalCode', label: 'Postal code', type: 'text', model: 'postalCode' }
        //   ]
        // },
      ],
      financialData: [
        { label: "Account Value", value: "$0" },
        { label: "Stock Value", value: "$0" },
        { label: "Cash", value: "$0" },
      ],
      // Leaderboard related data
      leaderboardData: [],
      currentUserRank: null,
      selectedTimeFrame: "all-time",
      timeFrames: [
        { label: "Daily", value: "daily" },
        { label: "Weekly", value: "weekly" },
        { label: "All Time", value: "all-time" },
      ],
      currentUserId: null,
    };
  },
  computed: {
    profileImage() {
      return this.profile.image || defaultImage;
    },
    isAuthenticated() {
      return this.$store.getters["users/isAuthenticated"];
    },
  },
  methods: {
    statValueClass(value) {
      const n = parseFloat(String(value).replace(/[$,]/g, ""));
      if (Number.isNaN(n)) return "";
      return n < 5000 ? "stat-value--low" : "stat-value--high";
    },
    uploadImage(e) {
      const file = e.target.files[0];
      //check file type
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(file.type)) {
        toast.error("Invalid file type", {
          autoClose: 1000,
          collapsed: false,
        });
        return;
      }
      //check file size
      const maxSize = 1024 * 1024 * 5; //5MB
      if (file.size > maxSize) {
        toast.error("File size exceed 5mb", {
          autoClose: 1000,
          collapsed: false,
        });
        return;
      }
      const reader = new FileReader();

      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;

        image.onload = () => {
          // Create a canvas and get its context
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          // Define new width and height
          const newWidth = 5000; // Adjust as needed
          const newHeight = (image.height / image.width) * newWidth;

          // Set canvas dimensions
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Draw the image on the canvas with the new dimensions
          ctx.drawImage(image, 0, 0, newWidth, newHeight);

          // Convert canvas to data URL and update resizedImage
          this.profile.image = canvas.toDataURL("image/jpeg"); // 'image/jpeg' or 'image/png'
        };
      };
      reader.readAsDataURL(file);
      this.imageUploaded = true;
      toast.info("Click the save button to store the image", {
        autoClose: 1000,
        collapsed: false,
      });
    },
    async updateProfile() {
      try {
        const newIdentityData = {
          displayName: this.profile.displayName,
          firstName: this.profile.firstName,
          lastName: this.profile.lastName,
          profilePicture: this.profile.image,
        };

        // Get user data from store instead of localStorage
        const userData = this.$store.getters["users/currentUser"];

        //check if user profile change or not
        if (
          newIdentityData.displayName === userData.identityData?.displayName &&
          newIdentityData.firstName === userData.identityData?.firstName &&
          newIdentityData.lastName === userData.identityData?.lastName &&
          newIdentityData.profilePicture ===
            userData.identityData?.profilePicture
        ) {
          toast.info("No changes detected!", {
            autoClose: 1000,
            collapsed: false,
          });
          return;
        }

        //update in database
        const userId = userData._id;
        const api = `${process.env.VUE_APP_DEPLOY_URL}/users/${userId}`;
        const response = await axios.put(
          api,
          {
            identityData: newIdentityData,
          },
          { withCredentials: true }
        );

        // Refresh user data in store
        await this.$store.dispatch("users/fetchCurrentUser");

        //if image was updated, update to false
        if (this.imageUploaded) {
          this.imageUploaded = false;
        }

        toast.success("Updated successfully!", {
          autoClose: 1000,
          collapsed: false,
        });
        console.log("Profile updated", response.data);
      } catch (err) {
        toast.error("Something wrong when updating", {
          autoClose: 1000,
          collapsed: false,
        });
        console.log(err);
      }
    },
    async cancelChange() {
      // Get fresh user data from API
      const userData = this.$store.getters["users/currentUser"];
      if (!userData) {
        toast.error("User data not available", {
          autoClose: 1000,
          collapsed: false,
        });
        return;
      }

      try {
        const userId = userData._id;
        const response = await api.get(`/users/${userId}`);
        const data = response.data;

        // Reset profile data from API
        this.profile = {
          displayName: data.identityData?.displayName || "",
          firstName: data.identityData?.firstName || "",
          lastName: data.identityData?.lastName || "",
          email: data.accountData?.username || "",
          image: data.identityData?.profilePicture || "",
        };

        // Reset imageUploaded
        this.imageUploaded = false;
        toast.success("Changes canceled!", {
          autoClose: 1000,
          collapsed: false,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to reset profile data", {
          autoClose: 1000,
          collapsed: false,
        });
      }
    },
    async fetchLeaderboardData() {
      try {
        // Fetch from API
        const response = await api.get(
          `/leaderboard?timeFrame=${this.selectedTimeFrame}`
        );

        console.log("leaderboard", response.data);

        // Process API response
        if (response.data && response.data.topUsers) {
          // Map the API response to our UI format
          this.leaderboardData = response.data.topUsers.map((user) => {
            return {
              _id: user._id,
              // Use the displayName from the API response directly
              displayName: user.displayName || `User ${user._id.slice(-4)}`,
              profilePicture: user.profilePicture || null,
              fincoins: user.fincoin_balance || 0,
              quizzesCompleted: user.quizzesCompleted || 0,
              tradesExecuted: user.tradesExecuted || 0,
            };
          });

          // Set current user rank if provided by the backend
          if (response.data.currentUserRank) {
            const curr = response.data.currentUserRank;
            this.currentUserRank = {
              rank: curr.rank,
              _id: curr._id,
              displayName: curr.displayName || `User ${curr._id.slice(-4)}`,
              profilePicture: curr.profilePicture || null,
              fincoins: curr.fincoin_balance || 0,
              quizzesCompleted: curr.quizzesCompleted || 0,
              tradesExecuted: curr.tradesExecuted || 0,
            };
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);

        // Fall back to mock data if API call fails
        console.log("Using mock data for leaderboard");

        // Mock current user if available
        const userData = this.$store.getters["users/currentUser"];
        if (userData) {
          this.currentUserRank = {
            rank: 12,
            _id: userData._id,
            displayName: userData.identityData?.displayName || userData.name || "User",
            profilePicture: userData.identityData?.profilePicture || "",
            fincoins: 1500,
            quizzesCompleted: 3,
            tradesExecuted: 5,
          };
        }
      }
    },
    changeTimeFrame(timeFrame) {
      this.selectedTimeFrame = timeFrame;
      this.fetchLeaderboardData();
    },
  },
  async mounted() {
    // Ensure user data is loaded
    await this.$store.dispatch("users/fetchCurrentUser");
    const userData = this.$store.getters["users/currentUser"];

    console.log("User data from store:", userData);

    if (!userData) {
      toast.error("Failed to load user data", { autoClose: 1000 });
      return;
    }

    // Fetch user's complete data including account balance
    try {
      const userId = userData._id;
      const response = await api.get(`/users/${userId}`);
      const data = response.data;
      console.log("Full user data from API:", data);

      const b = data.bankingAccountData || {};
      this.financialData = [
        {
          label: "Account Value",
          value: `$${Number(b.accountBalance ?? 0).toLocaleString()}`,
        },
        {
          label: "Stock Value",
          value: `$${Number(b.stockValue ?? 0).toLocaleString()}`,
        },
        {
          label: "Cash",
          value: `$${Number(b.cash ?? 0).toLocaleString()}`,
        },
      ];

      // Set profile data from API response (more complete than store)
      this.profile = {
        displayName: data.identityData?.displayName || userData.identityData?.displayName || userData.name || "",
        firstName: data.identityData?.firstName || userData.identityData?.firstName || "",
        lastName: data.identityData?.lastName || userData.identityData?.lastName || "",
        email: data.accountData?.username || userData.accountData?.username || userData.email || "",
        image: data.identityData?.profilePicture || userData.identityData?.profilePicture || "",
      };

      console.log("Profile data set:", this.profile);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data", { autoClose: 1000 });
      
      // Fallback to store data if API call fails
      this.profile = {
        displayName: userData.identityData?.displayName || userData.name || "",
        firstName: userData.identityData?.firstName || "",
        lastName: userData.identityData?.lastName || "",
        email: userData.accountData?.username || userData.email || "",
        image: userData.identityData?.profilePicture || "",
      };
    }

    // Set current user ID for leaderboard comparison
    if (userData) {
      this.currentUserId = userData._id;
    }

    // Fetch leaderboard data
    await this.fetchLeaderboardData();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');

.profile-root {
  min-height: 100vh;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
  box-sizing: border-box;
  background: var(--bg-primary, #F8FAFF);
  font-family: 'Outfit', sans-serif;
}

/* Hero Header */
.profile-hero {
  margin-bottom: 3rem;
  background: #fff;
  padding: 2.5rem;
  border-radius: 32px;
  border: 4px solid #EEF2FF;
  box-shadow: 0 15px 40px rgba(167, 139, 250, 0.1);
  display: flex;
  align-items: center;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.hero-mascot {
  width: 120px;
  height: 120px;
  object-fit: contain;
  filter: drop-shadow(0 8px 15px rgba(167, 139, 250, 0.3));
  animation: float 4s ease-in-out infinite;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1F2937;
  margin: 0 0 0.5rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #6B7280;
  margin: 0;
  max-width: 600px;
}

/* Layout Grid */
.profile-grid {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2.5rem;
  margin-bottom: 3rem;
}

.border {
  background: #fff;
  border: 4px solid #EEF2FF;
  border-radius: 32px;
  box-shadow: 0 10px 30px rgba(167, 139, 250, 0.05);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.border:hover {
  transform: translateY(-8px);
  border-color: var(--agent-button-bg-color, #A78BFA);
  box-shadow: 0 20px 50px rgba(167, 139, 250, 0.15);
}

/* Sidebar Stats */
.balance-card {
  padding: 2.5rem;
  text-align: center;
}

.profile-image-section {
  display: flex;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.profile-image-container {
  position: relative;
  width: 160px;
  height: 160px;
}

.profile-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 8px solid #fff;
  box-shadow: 0 10px 25px rgba(167, 139, 250, 0.2);
}

.image-uploaded {
  border-color: var(--agent-button-bg-color, #A78BFA);
  animation: profilePulse 2s ease-in-out infinite;
}

.custom-file-upload {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 48px;
  height: 48px;
  background: var(--agent-button-bg-color, #A78BFA);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(167, 139, 250, 0.3);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-size: 1.2rem;
  border: 4px solid #fff;
}

.custom-file-upload:hover {
  transform: scale(1.2) rotate(15deg);
  background: #8B5CF6;
}

.balance {
  display: grid;
  gap: 1.25rem;
}

.stat-tile {
  padding: 1.5rem;
  background: #F8FAFF;
  border-radius: 24px;
  border: 2px solid #EEF2FF;
  transition: all 0.3s ease;
}

.stat-tile:hover {
  background: #fff;
  border-color: var(--fin-speak-accent, #4ADE80);
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #6B7280;
  margin: 0 0 0.5rem;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  color: #1F2937;
}

.stat-value--high { color: var(--fin-speak-accent, #4ADE80); }
.stat-value--low { color: var(--error-color, #FF7A7A); }

/* Main Content Info */
.info-card {
  padding: 3rem;
}

.header-section {
  display: inline-block;
  background: var(--agent-button-bg-color, #A78BFA);
  color: #fff;
  padding: 0.75rem 2rem;
  border-radius: 99px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.9rem;
  margin-bottom: 2.5rem;
  box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 0.75rem;
  color: #374151;
  padding-left: 0.5rem;
}

.input-wrapper input,
.input-wrapper textarea {
  width: 100%;
  padding: 1rem 1.5rem;
  background: #F8FAFF;
  border: 3px solid #EEF2FF;
  border-radius: 20px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #1F2937;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-wrapper input:focus,
.input-wrapper textarea:focus {
  outline: none;
  background: #fff;
  border-color: var(--agent-button-bg-color, #A78BFA);
  box-shadow: 0 0 0 6px rgba(167, 139, 250, 0.1);
}

.input-wrapper textarea {
  min-height: 120px;
}

.btn-container {
  display: flex;
  gap: 1.5rem;
  margin-top: 3rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  border-radius: 99px;
  font-weight: 800;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  border: none;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-save {
  background: var(--agent-button-bg-color, #A78BFA);
  color: #fff;
  box-shadow: 0 10px 25px rgba(167, 139, 250, 0.3);
}

.btn-save:hover {
  transform: translateY(-5px) scale(1.05);
  background: #8B5CF6;
  box-shadow: 0 15px 35px rgba(167, 139, 250, 0.4);
}

.btn-cancel {
  background: #fff;
  color: var(--agent-button-bg-color, #A78BFA);
  border: 4px solid #EEF2FF;
}

.btn-cancel:hover {
  background: #F5F3FF;
  border-color: var(--agent-button-bg-color, #A78BFA);
  transform: translateY(-3px);
}

/* Leaderboard Section */
.leaderboard-section {
  padding: 3rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.header-icon {
  font-size: 2rem;
  color: #FBBF24;
  filter: drop-shadow(0 4px 10px rgba(251, 191, 36, 0.4));
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: #1F2937;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-15px) rotate(5deg); }
}

@keyframes profilePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba(167, 139, 250, 0); }
}

.animate-in {
  animation: slideBottom 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideBottom {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 1100px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .form-group.full-width {
    grid-column: span 1;
  }
  .profile-hero {
    padding: 1.5rem;
  }
  .hero-title {
    font-size: 1.8rem;
  }
}

/* Dark Mode Overrides */
:global(.dark-mode) .profile-root {
  background: #0F172A;
}

:global(.dark-mode) .profile-hero,
:global(.dark-mode) .border {
  background: #1E293B;
  border-color: #334155;
}

:global(.dark-mode) .stat-tile,
:global(.dark-mode) .input-wrapper input,
:global(.dark-mode) .input-wrapper textarea {
  background: #0F172A;
  border-color: #334155;
  color: #F8FAFC;
}

:global(.dark-mode) .hero-title,
:global(.dark-mode) .section-header h2 {
  color: #F1F5F9;
}

:global(.dark-mode) .btn-cancel {
  background: #1E293B;
  border-color: #334155;
}
</style>
