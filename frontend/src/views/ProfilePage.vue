<template>
  <div class="profile-page">
    <div class="balance-card border">
      <div class="balance">
        <div class="stock-simulator-container" v-for="item in financialData" :key="item.label">
          <h3>{{ item.label }}</h3>
          <h1>{{ item.value }}</h1>
        </div>
      </div>
      <div class="profile-image-container">
        <img class="profile-image" :class="{ 'image-uploaded': imageUploaded }" :src="profileImage" alt="Profile Image">
        <label for="file-upload" class="custom-file-upload">
          <font-awesome-icon icon="fa-solid fa-camera" />
        </label>
        <input id="file-upload" type="file" @change="uploadImage"/>
      </div>
    </div>
    <div class="info-card border">
      <div class="info-body">
        <form @submit.prevent="updateProfile">
          <div class="section" v-for="(section, sectionIndex) in sections" :key="sectionIndex">
            <div class="header-section border">User information</div>
            <!-- <h3>{{ section.title }}</h3> -->
              <div class="form-group" v-for="(field, fieldIndex) in section.fields" :key="fieldIndex">
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
            <button type="button" @click="cancelChange" class="btn btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import defaultImage from '@/assets/anonymous.png';

export default {
  data() {
    return {
      imageUploaded: false,
      profile: {
        displayName: '',
        firstName: '',
        lastName: '',
        email: '',
        image: '',
      },
      sections: [
        {
          title: 'User Information',
          fields: [
            { id: 'displayName', label: 'Display name', type: 'text', model: 'displayName' },
            { id: 'email', label: 'Email address', type: 'email', model: 'email' },
            { id: 'firstName', label: 'First name', type: 'text', model: 'firstName' },
            { id: 'lastName', label: 'Last name', type: 'text', model: 'lastName' }
          ]
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
        { label: 'Account Value', value: '$23,196.00' },
        { label: 'Buying Power', value: '$1,320.23' },
        { label: 'Cash', value: '$-3,501.18' }
      ]
    };
  },
  computed: {
    profileImage(){
      return this.profile.image || defaultImage;
    },
    isAuthenticated(){
      return this.$store.getters['users/isAuthenticated'];
    }
  },
  methods: {
    uploadImage(e){
      const file = e.target.files[0];
      //check file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if(!validImageTypes.includes(file.type)){
        toast.error("Invalid file type", {
          autoClose: 1000,
          collapsed: false,
        })
        return;
      }
      //check file size
      const maxSize = 1024 * 1024 * 5; //5MB
      if(file.size > maxSize){
        toast.error("File size exceed 5mb", {
          autoClose: 1000,
          collapsed: false,
        })
        return;
      }
      const reader = new FileReader();

      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;

        image.onload = () => {
          // Create a canvas and get its context
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Define new width and height
          const newWidth = 5000; // Adjust as needed
          const newHeight = (image.height / image.width) * newWidth;

          // Set canvas dimensions
          canvas.width = newWidth;
          canvas.height = newHeight;

          // Draw the image on the canvas with the new dimensions
          ctx.drawImage(image, 0, 0, newWidth, newHeight);

          // Convert canvas to data URL and update resizedImage
          this.profile.image = canvas.toDataURL('image/jpeg'); // 'image/jpeg' or 'image/png'
        };
      };
      reader.readAsDataURL(file);
      this.imageUploaded = true;
      toast.info("Click the save button to store the image", {
        autoClose: 1000,
        collapsed: false,
      })
    },
    async updateProfile() {
      try{
        const newIdentityData = {
          displayName: this.profile.displayName,
          firstName: this.profile.firstName,
          lastName: this.profile.lastName,
          profilePicture: this.profile.image
        };
        const profileData = JSON.parse(localStorage.getItem('user'));
        //check if user profile change or not
        if(newIdentityData.displayName === profileData.identityData.displayName &&
          newIdentityData.firstName === profileData.identityData.firstName &&
          newIdentityData.lastName === profileData.identityData.lastName &&
          newIdentityData.profilePicture === profileData.identityData.profilePicture
        ){
          toast.info("No changes detected!", {
            autoClose: 1000,
            collapsed: false,
          })
          return;
        }
        //update in localStorage
        profileData.identityData = newIdentityData;
        localStorage.setItem('user', JSON.stringify(profileData));
        //update in database
        const userId = localStorage.getItem('token');
        const api = `${process.env.VUE_APP_DEPLOY_URL}/users/${userId}`;
        const response = await axios.put(api, {
          identityData: newIdentityData
        });
        //if image was updated, update to false
        if(this.imageUploaded){
          this.imageUploaded = false;
        }
        toast.success("Updated successfully!", {
          autoClose: 1000,
          collapsed: false,
        })
        console.log('Profile updated', response.data);
      }catch(err){
        toast.error("Something wrong when updating", {
          autoClose: 1000,
          collapsed: false,
        })
        console.log(err);
      }
    },
    cancelChange(){
      //reset profile data
      const profileData = JSON.parse(localStorage.getItem('user'));
      this.profile = {
        displayName: profileData.identityData.displayName,
        firstName: profileData.identityData.firstName,
        lastName: profileData.identityData.lastName,
        email: profileData.accountData.username,
        image: profileData.identityData.profilePicture
      };
      //reset imageUploaded
      this.imageUploaded = false;
      toast.success("Changes canceled!", {
        autoClose: 1000,
        collapsed: false,
      });
    }
  },
  async mounted(){
    //Change color of balance based on value
    const accountValue = document.querySelectorAll('.stock-simulator-container h1');
    accountValue.forEach((value) => {
      const v = parseFloat(value.textContent.replace('$', '').replace(',', ''));
      if(v < 5000){
        value.style.color = 'red';
      } else {
        value.style.color = 'green';
      }
    });

    //fetch user profile
    try{
      const profileData = JSON.parse(localStorage.getItem('user'));
      this.profile = {
        displayName: profileData.identityData.displayName,
        firstName: profileData.identityData.firstName,
        lastName: profileData.identityData.lastName,
        email: profileData.accountData.username,
        image: profileData.identityData.profilePicture
      };

    }catch(err){
      console.log(err);
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.profile-page{
  display: flex;
  justify-content:space-evenly;
}

.border{
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

.balance{
  padding-top: 70px;
  text-align: center;
}

.stock-simulator-container {
  border-bottom: 1px solid #7e7a7a;
  padding: 10px;
}

.stock-simulator-container h1{
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
  background-color:  rgb(248, 249, 254);
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
  color:white;
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
.form-group input::placeholder{
  color: rgb(136, 152, 170);
}
.form-group textarea {
  resize: vertical;
  height: 100px;
}

.form-group input:focus{
  outline: 2px solid #007bff;
}

.form-group input:read-only:focus {
  outline: none;
}

.btn-container{
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
</style>
