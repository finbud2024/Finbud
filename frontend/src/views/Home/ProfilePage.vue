<template>
  <div class="profile-page">
    <div class="balance-card border">
      <div class="balance">
        <div
          class="stock-simulator-container"
          v-for="item in financialData"
          :key="item.label"
        >
          <h3>{{ item.label }}</h3>
          <h1>{{ item.value }}</h1>
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
            <div class="header-section border">User information</div>
            <!-- <h3>{{ section.title }}</h3> -->
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
  <!-- FinCoin Leaderboard Section -->
  <FinCoinLeaderboard
    :leaderboard-data="leaderboardData"
    :current-user-rank="currentUserRank"
    :selected-time-frame="selectedTimeFrame"
    :time-frames="timeFrames"
    :current-user-id="currentUserId"
    :default-image="defaultImage"
    @time-frame-change="changeTimeFrame"
  />
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
        { label: "Account Value", value: "$" },
        { label: "Buying Power", value: "$" },
        { label: "Cash", value: "$" },
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
          newIdentityData.displayName === userData.identityData.displayName &&
          newIdentityData.firstName === userData.identityData.firstName &&
          newIdentityData.lastName === userData.identityData.lastName &&
          newIdentityData.profilePicture ===
            userData.identityData.profilePicture
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
    cancelChange() {
      // Get user data from store
      const userData = this.$store.getters["users/currentUser"];
      if (!userData) {
        toast.error("User data not available", {
          autoClose: 1000,
          collapsed: false,
        });
        return;
      }

      // Reset profile data from store
      this.profile = {
        displayName: userData.identityData.displayName,
        firstName: userData.identityData.firstName,
        lastName: userData.identityData.lastName,
        email: userData.accountData.username,
        image: userData.identityData.profilePicture,
      };

      // Reset imageUploaded
      this.imageUploaded = false;
      toast.success("Changes canceled!", {
        autoClose: 1000,
        collapsed: false,
      });
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
            displayName: userData.identityData.displayName,
            profilePicture: userData.identityData.profilePicture,
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

    if (!userData) {
      toast.error("Failed to load user data", { autoClose: 1000 });
      return;
    }

    // Fetch user's account balance
    try {
      const userId = userData._id;
      const response = await api.get(`/users/${userId}`);
      const data = response.data;

      this.financialData = [
        {
          label: "Account Value",
          value: `$${data.bankingAccountData.accountBalance.toLocaleString()}`,
        },
        {
          label: "Stock Value",
          value: `$${data.bankingAccountData.stockValue.toLocaleString()}`,
        },
        {
          label: "Cash",
          value: `$${data.bankingAccountData.cash.toLocaleString()}`,
        },
      ];

      // Change color of balance based on value
      this.$nextTick(() => {
        const accountValue = document.querySelectorAll(
          ".stock-simulator-container h1"
        );
        accountValue.forEach((value) => {
          const v = parseFloat(
            value.textContent.replace("$", "").replace(",", "")
          );
          if (v < 5000) {
            value.style.color = "red";
          } else {
            value.style.color = "green";
          }
        });
      });
    } catch (error) {
      console.error("Error fetching financial data:", error);
      toast.error("Failed to load financial data", { autoClose: 1000 });
    }

    // Set profile data from store
    this.profile = {
      displayName: userData.identityData.displayName,
      firstName: userData.identityData.firstName,
      lastName: userData.identityData.lastName,
      email: userData.accountData.username,
      image: userData.identityData.profilePicture,
    };

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
.profile-page {
  display: flex;
  justify-content: space-evenly;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9ff 0%, #f1f4ff 100%);
  animation: fadeIn 0.5s ease;
}

.border {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.border:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
}

.info-card {
  margin: 100px 100px 100px 50px;
  position: relative;
  flex: 2;
  padding: 2rem;
  animation: slideInRight 0.5s ease;
}

.balance-card {
  margin: 100px 50px 100px 100px;
  position: relative;
  flex: 1;
  padding: 2rem;
  animation: slideInLeft 0.5s ease;
}

.balance {
  padding-top: 70px;
  text-align: center;
}

.stock-simulator-container {
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 12px;
  background: linear-gradient(45deg, #f8f9ff, #ffffff);
  transition: all 0.3s ease;
}

.stock-simulator-container:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.stock-simulator-container h3 {
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.stock-simulator-container h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #2d3748, #4a5568);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

.profile-image-container {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
}

.profile-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid white;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.image-uploaded {
  border: 4px solid #000000;
  animation: pulse 2s infinite;
}

.custom-file-upload {
  position: absolute;
  bottom: 10%;
  left: 75%;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.custom-file-upload:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.info-body {
  padding: 2rem;
  background: white;
}

.header-section {
  font-size: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 1rem 2rem;
  background: #000;
  color: white;
  border-radius: 12px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4a5568;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.form-group input:focus {
  outline: none;
  border-color: #000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.form-group input:hover {
  border-color: #cbd5e0;
}

.btn-container {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-save {
  background: #000;
  color: white;
  border: none;
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-cancel {
  background: white;
  color: #000;
  border: 2px solid #000;
}

.btn-cancel:hover {
  background: #f8fafc;
  transform: translateY(-2px);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}

@media (max-width: 1024px) {
  .profile-page {
    flex-direction: column;
    padding: 1rem;
  }

  .balance-card,
  .info-card {
    margin: 2rem 1rem;
    width: auto;
  }

  .balance-card {
    margin-top: 100px;
  }
}

@media (max-width: 640px) {
  .btn-container {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .profile-image {
    width: 120px;
    height: 120px;
  }

  .custom-file-upload {
    width: 35px;
    height: 35px;
  }

  .stock-simulator-container h1 {
    font-size: 1.5rem;
  }
}
</style>
