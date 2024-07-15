<template>
  <div class="profile-page">
    <div class="balance-card">
      <div class="balance">
        <h3>Account Value</h3>
        <h1>$ 2,562.00</h1>
        <h3>Buying Power</h3>
        <h1>$ 99,770.35</h1>
        <h3>Cash</h3>
        <h1>$ 99,680.4</h1>
      </div>
      <div class="profile-image-container">
        <img class="profile-image" src="http://bootdey.com/img/Content/avatar/avatar1.png" alt="Profile Image">
      </div>
    </div>
    <div class="info-card">
      <div class="info-body">
        <form @submit.prevent="updateProfile">
          <div class="section" v-for="(section, sectionIndex) in sections" :key="sectionIndex">
            <h3>{{ section.title }}</h3>
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
          <button type="submit" class="btn-save">Save</button>
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
        username: 'lucky.jesse',
        firstName: 'Lucky',
        lastName: 'Jesse',
        email: 'jesse@example.com',
        address: 'Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09',
        city: 'New York',
        country: 'United States',
        postalCode: '',
        aboutMe: 'A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.'
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
        // {
        //   title: 'About Me',
        //   fields: [
        //     { id: 'aboutMe', label: 'About Me', type: 'textarea', model: 'aboutMe' }
        //   ]
        // }
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
  background: #f8f9fe;
}
.info-card {
  width: 600px;
  padding: 30px;
  margin: 100px 100px 100px 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  background: rgb(248, 249, 254);
  font-family: 'Space Grotesk', sans-serif;
  position: relative;
}

.balance-card {
  width: 300px;
  padding: 30px;
  margin: 100px -10px 100px 100px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  background: rgb(248, 249, 254);
  font-family: 'Space Grotesk', sans-serif;
  position: relative;
}

.balance{
  padding-top: 70px;
  text-align: center;
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

.section h3 {
  font-size: 20px;
  margin-top: 0;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group:last-child {
  margin-bottom: 30px;
}
.form-group {
  flex: 1;
  margin-right: 10px;
  margin-bottom: 10px;
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
.btn-save {
  display: inline-block;
  padding: 10px 15px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-save:hover {
  background: #0056b3;
}
</style>
