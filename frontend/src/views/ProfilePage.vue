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
import FinCoinLeaderboard from "../components/FinCoinLeaderboard.vue";

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
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap");

.profile-page {
  display: flex;
  justify-content: space-evenly;
}

.border {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  background: rgb(248, 249, 254);
}

.info-card {
  margin: 100px 100px 100px 50px;
  position: relative;
  flex: 2;
  padding: 30px;
}

.balance-card {
  margin: 100px 50px 100px 100px;
  position: relative;
  flex: 1;
  padding: 30px;
}

.balance {
  padding-top: 70px;
  text-align: center;
}

.stock-simulator-container {
  border-bottom: 1px solid #7e7a7a;
  padding: 10px;
}

.stock-simulator-container h1 {
  line-height: 0.5;
}

.stock-simulator-container:last-child {
  border-bottom: none;
}

.profile-image-container {
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.profile-image {
  width: 150px;
  height: 150px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.7);
  border: 3px solid #ddd;
  border-radius: 50%;
  object-fit: cover;
}

.image-uploaded {
  border: 3px solid #007bff;
}

.custom-file-upload {
  position: absolute;
  cursor: pointer;
  color: black;
  font-size: 25px;
  bottom: 10%;
  left: 75%;
  border: 1px solid black;
  border-radius: 50%;
  background-color: white;
  height: 35px;
  aspect-ratio: 1/1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#file-upload {
  display: none;
}

.info-body {
  padding: 0px 15px 15px;
  background-color: rgb(248, 249, 254);
}

.header-section {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: bold;
  position: absolute;
  padding: 20px;
  top: 0%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #007bff;
  color: white;
}

.form-group {
  flex: 1;
  margin-right: 10px;
  margin-bottom: 10px;
}
.form-group:nth-child(2) {
  margin-top: 20px;
}
.form-group:last-child {
  margin-bottom: 30px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-sizing: border-box;
  color: black;
}
.form-group input::placeholder {
  color: rgb(136, 152, 170);
}
.form-group textarea {
  resize: vertical;
  height: 100px;
}

.form-group input:focus {
  outline: 2px solid #007bff;
}

.form-group input:read-only:focus {
  outline: none;
}

.btn-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  width: 100%;
}
.btn {
  display: inline-block;
  padding: 10px 15px;
  background: black;
  margin: 0 10px 0px 10px;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  width: 70px;
}

.btn-save:hover {
  background: green;
  transition: 0.3s linear;
}
.btn-cancel:hover {
  background: red;
  transition: 0.5s ease;
}

/* Leaderboard Styles */
.leaderboard-card {
  margin: 20px auto 50px;
  position: relative;
  width: 90%;
  max-width: 1200px;
  padding: 30px;
}

.leaderboard-body {
  padding: 70px 15px 15px;
  background-color: rgb(248, 249, 254);
}

.leaderboard-filters {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.filter-btn {
  padding: 8px 16px;
  margin: 0 10px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.leaderboard-table {
  width: 100%;
}

.leaderboard-header {
  display: flex;
  padding: 10px 0;
  font-weight: bold;
  border-bottom: 2px solid #ddd;
}

.leaderboard-row {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  align-items: center;
}

.current-user {
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 8px;
}

.current-user-position {
  display: flex;
  padding: 15px 0;
  margin-top: 20px;
  border-top: 2px dashed #007bff;
  border-bottom: 2px dashed #007bff;
  background-color: rgba(0, 123, 255, 0.1);
  border-radius: 8px;
  align-items: center;
}

.rank {
  width: 10%;
  text-align: center;
  font-weight: bold;
}

.user {
  width: 40%;
  display: flex;
  align-items: center;
}

.quizzes,
.trades {
  width: 15%;
  text-align: center;
}

.fincoins {
  width: 20%;
  text-align: center;
  font-weight: bold;
  color: #007bff;
}

.leaderboard-user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  border: 1px solid #ddd;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
