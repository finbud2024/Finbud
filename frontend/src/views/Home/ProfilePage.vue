<template>
  <div class="profile-root">
    <div class="profile-page">
      <div class="balance-card border">
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
        <div class="profile-image-container">
          <img
            class="profile-image"
            :class="{ 'image-uploaded': imageUploaded }"
            :src="profileImage"
            alt="Profile Image"
          />
          <label for="file-upload" class="custom-file-upload">
            <font-awesome-icon icon="fa-solid fa-camera" />
          </label>
          <input id="file-upload" type="file" @change="uploadImage" />
        </div>
      </div>
      <div class="info-card border">
        <div class="info-body">
        <form @submit.prevent="updateProfile">
          <div
            class="section"
            v-for="(section, sectionIndex) in sections"
            :key="sectionIndex"
          >
            <div class="header-section">{{ section.title }}</div>
            <div
              class="form-group"
              v-for="(field, fieldIndex) in section.fields"
              :key="fieldIndex"
            >
              <label :for="field.id">{{ field.label }}</label>
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
              ></textarea>
            </div>
          </div>
          <div class="btn-container">
            <button type="submit" class="btn btn-save">Save</button>
            <button type="button" @click="cancelChange" class="btn btn-cancel">
              Cancel
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>

    <FinCoinLeaderboard
      class="profile-leaderboard"
      :leaderboard-data="leaderboardData"
      :current-user-rank="currentUserRank"
      :selected-time-frame="selectedTimeFrame"
      :time-frames="timeFrames"
      :current-user-id="currentUserId"
      :default-image="defaultImage"
      @time-frame-change="changeTimeFrame"
    />
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
.profile-root {
  min-height: 100vh;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 2.5rem;
  box-sizing: border-box;
  background: linear-gradient(160deg, var(--bg-secondary, #f1f5f9) 0%, var(--bg-primary, #fff) 45%);
  animation: profileFade 0.45s ease;
}

.profile-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
  gap: 1.5rem;
  align-items: start;
}

.border {
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
  border-radius: 16px;
  background: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #e2e8f0);
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

@media (hover: hover) {
  .border:hover {
    box-shadow: 0 12px 36px rgba(15, 23, 42, 0.1);
  }
}

.balance-card {
  position: relative;
  padding: 5.5rem 1.25rem 1.5rem;
  min-width: 0;
}

.balance {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  text-align: center;
}

.stat-tile {
  padding: 0.85rem 0.5rem;
  border-radius: 12px;
  background: var(--bg-secondary, #f8fafc);
  border: 1px solid var(--border-color, #e2e8f0);
}

.stat-label {
  margin: 0 0 0.35rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-secondary, #64748b);
}

.stat-value {
  margin: 0;
  font-size: clamp(1.1rem, 2.5vw, 1.65rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary, #0f172a);
  word-break: break-word;
}

.stat-value--high {
  color: #059669;
}

.stat-value--low {
  color: #dc2626;
}

.profile-image-container {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -42%);
  z-index: 2;
}

.profile-image {
  width: 112px;
  height: 112px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--card-bg, #fff);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  display: block;
}

.image-uploaded {
  border-color: var(--primary-color, #000);
  animation: profilePulse 2s ease-in-out infinite;
}

#file-upload {
  display: none;
}

.custom-file-upload {
  position: absolute;
  bottom: 4px;
  right: -2px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-color, #000);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

@media (hover: hover) {
  .custom-file-upload:hover {
    transform: scale(1.06);
  }
}

.info-card {
  position: relative;
  padding: 3.25rem 1.25rem 1.25rem;
  min-width: 0;
}

.info-body {
  padding: 0;
}

.section {
  position: relative;
}

.header-section {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0.65rem 1.25rem;
  background: var(--primary-color, #000);
  color: var(--secondary-color, #fff);
  border-radius: 999px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
  max-width: calc(100% - 2rem);
  overflow: hidden;
  text-overflow: ellipsis;
}

.form-group {
  margin-bottom: 1.1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary, #475569);
}

.form-group input,
.form-group textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border-color, #e2e8f0);
  border-radius: 10px;
  font-size: 1rem;
  background: var(--bg-primary, #fff);
  color: var(--text-primary, #0f172a);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group textarea {
  min-height: 96px;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary-color, #000);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.06);
}

.form-group input[readonly] {
  background: var(--bg-secondary, #f1f5f9);
  color: var(--text-secondary, #64748b);
}

.btn-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.65rem 1.35rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  min-height: 44px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-save {
  background: var(--primary-color, #000);
  color: var(--secondary-color, #fff);
}

.btn-cancel {
  background: transparent;
  color: var(--primary-color, #000);
  border: 2px solid var(--primary-color, #000);
}

@media (hover: hover) {
  .btn-save:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
  .btn-cancel:hover {
    background: var(--bg-secondary, #f8fafc);
  }
}

.profile-leaderboard {
  margin-top: 2rem;
}

@keyframes profileFade {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes profilePulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }
}

@media (max-width: 960px) {
  .profile-page {
    grid-template-columns: 1fr;
  }

  .balance {
    grid-template-columns: 1fr;
    max-width: 320px;
    margin: 0 auto;
  }

  .balance-card {
    padding-top: 5rem;
  }
}

@media (max-width: 640px) {
  .profile-root {
    padding: 1rem 0.75rem 2rem;
  }

  .balance-card,
  .info-card {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .btn-container {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .header-section {
    font-size: 0.72rem;
    padding: 0.55rem 1rem;
  }
}

@media (max-width: 640px) and (hover: hover) {
  .border:hover {
    box-shadow: 0 8px 28px rgba(15, 23, 42, 0.08);
  }
}

.dark-mode .profile-root {
  background: linear-gradient(160deg, #1e293b 0%, #0f172a 50%);
}

.dark-mode .stat-tile {
  background: #334155;
  border-color: #475569;
}

.dark-mode .stat-value {
  color: #f1f5f9;
}

.dark-mode .stat-value--high {
  color: #34d399;
}

.dark-mode .stat-value--low {
  color: #f87171;
}
</style>
