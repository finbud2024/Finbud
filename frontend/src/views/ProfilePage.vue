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
        <img class="profile-image" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="Profile Image">
        <label for="file-upload" class="custom-file-upload">
          <i class="fa fa-camera"></i>
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
            <button class="btn btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        // address: 'Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09',
        // city: 'New York',
        // country: 'United States',
        // postalCode: '',
      },
      sections: [
        {
          title: 'User Information',
          fields: [
            { id: 'username', label: 'Username', type: 'text', model: 'username' },
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
        { label: 'Cash', value: '$3,501.18' }
      ]
    };
  },
  methods: {
    updateProfile() {
      // Logic to update profile
      console.log('Profile updated', this.profile);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap');

.profile-page{
  display: flex;
  justify-content:space-evenly;
  font-family: 'Space Grotesk', sans-serif;
  
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
}

.money h1{
  line-height: 0.5;
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
  border: 5px solid #ddd;
  border-radius: 50%;
  object-fit: cover;
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
  left: 0%;
  transform: translate(10%, -50%);
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
  color: rgb(136, 152, 170);
}
.form-group input::placeholder{
  color: rgb(136, 152, 170);
}
.form-group textarea {
  resize: vertical;
  height: 100px;
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
  background: #33b249;
  transition: 0.3s linear;
}
.btn-cancel:hover {
  background: #ff4d4d;
  transition: 0.5s ease;
}
</style>
