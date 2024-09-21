<template>
    <section class="financial-goals">
        <div class="goal-upper-part">
        <h3 class="goal-section-title">Goals</h3>
        <button class="add-goal-button" @click="showAddGoalModal = true">Add Goal</button>
        </div>

        <div class="search-container">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Search goals..."
            class="search-input"
        />
        </div>


        <div class="goals">
        <div v-for="goal in filteredGoals" :key="goal._id" class="goal" @click="showGoalProgress(goal)">
            <img src="../../assets/financial-goal-mockup.jpg" alt="Goal Image" class="goal-image" />
            <div class="goal-content">
            <div class="goal-icon">
                <i :class="goal.icon"></i>
            </div>
            <div class="goal-info">
                <h3>{{ goal.title }}</h3>
                <p>Category: {{ goal.category }}</p>
                <p>Total: {{ goal.targetAmount }} USD</p>
                <p>Saved: {{ goal.currentAmount }} USD</p>
            </div>
            <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: (goal.currentAmount / goal.targetAmount * 100) + '%' }"></div>
            </div>
            </div>
        </div>
        </div>

        <div v-if="showModal" class="modal" @click="showModal = false">
        <div class="modal-content" @click.stop>
            <div>
                <img src="../../assets/financial-goal-mockup.jpg" alt="">
            </div>
            <div class="modal-text-content">
            <h3>{{ goalTitle }}</h3>
            <p>{{ goalDescription }}</p>
            <p>Total: {{ goalTargetAmount }} USD</p>
            <p>Saved: {{ goalCurrentAmount }} USD</p>
            <p>Completion: {{ goalProgress }}%</p>
            <div class="progress-bar-container">
                <div class="progress-bar" :style="{ width: goalProgress + '%' }"></div>
            </div>

            <button class="add-goal-button" @click="toggleAddMoneyForm">
                {{ showAddMoneyForm ? 'Cancel' : 'Add Money' }}
            </button>

            <div v-if="showAddMoneyForm" class="form-group add-money-form">
                <label for="addAmount">Add Money to Goal</label>
                <input id="addAmount" type="number" v-model="addAmount" placeholder="Enter amount to add">
                <button class="add-goal-button" @click="addMoneyToGoal">Add Money</button>
            </div>
            </div>
        </div>
        </div>

        <div v-if="showAddGoalModal" class="modal" @click="showAddGoalModal = false">
            <div class="modal-content" @click.stop>
                <div class="modal-text-content">
                    <h3>Add New Goal</h3>
                    <div class="form-group">
                        <label for="goalTitle">Goal Title</label>
                        <input id="goalTitle" type="text" placeholder="Enter your goal title" v-model="newGoal.title" required>
                    </div>
                    <div class="form-group">
                        <label for="goalDescription">Description (optional)</label>
                        <textarea id="goalDescription" placeholder="Describe your goal" v-model="newGoal.description"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="targetAmount">Total Money Needed</label>
                        <div class="currency-input">
                            <input id="targetAmount" type="number" placeholder="Total money needed" v-model="newGoal.targetAmount" required>
                            <select>
                                <option value="USD">USD</option>
                                <option value="VND">VND</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="currentAmount">Money Already Have</label>
                        <input id="currentAmount" type="number" placeholder="Money already have" v-model="newGoal.currentAmount">
                    </div>
                    <div class="form-group">
                        <label for="startDate">Start Date</label>
                        <input id="startDate" type="date" v-model="newGoal.startDate" required>
                    </div>
                    <div class="form-group">
                        <label for="endDate">End Date</label>
                        <input id="endDate" type="date" v-model="newGoal.endDate" required>
                    </div>
                    <div class="form-group">
                        <label for="goalCategory">Category</label>
                        <select id="goalCategory" v-model="selectedCategory">
                            <option v-for="category in categories" :key="category" :value="category">
                                {{ category }}
                            </option>
                            <option value="new">Add New Category</option>
                        </select>
                    </div>
                    <div v-if="selectedCategory === 'new'" class="form-group">
                        <label for="newCategory">New Category</label>
                        <input id="newCategory" type="text" placeholder="Enter new category" v-model="newCategory">
                    </div>
                    <button class="add-goal-button" @click="addGoal">Add Goal</button>
                </div>
            </div>
        </div>

    </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Goals',
  data() {
    
    return {
      userId: localStorage.getItem('token'),
      firstName: JSON.parse(localStorage.getItem('user')).identityData.firstName,
      displayName: JSON.parse(localStorage.getItem('user')).identityData.displayName,
      profilePic: JSON.parse(localStorage.getItem('user')).identityData.profilePicture,
      newGoal: {
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: 0,
        startDate: '',
        endDate: '',
        isAchieved: false,
        category: '',
      },
      showModal: false,
      showAddGoalModal: false,
      showAddMoneyForm: false,
      addAmount: 0,
      goalTitle: '',
      goalProgress: 0,
      categories: ['Savings', 'Investment', 'Emergency Fund', 'Vacation'],
      goals: [],
      selectedCategory: '',
      newCategory: '',


      searchQuery: '',  // Add this for search input

    };
  },

  computed: {
    // Computed property to filter the goals based on the search query
    filteredGoals() {
      return this.goals.filter(goal => {
        const searchLower = this.searchQuery.toLowerCase();
        return (
          goal.title.toLowerCase().includes(searchLower) ||
          goal.category.toLowerCase().includes(searchLower)
        );
      });
    },
  },
  methods: {
    retrieveGoals() {
      axios
        .get(`${process.env.VUE_APP_DEPLOY_URL}/goals/u/${this.userId}`)
        .then((response) => {
          this.goals = response.data;
        })
        .catch((error) => {
          console.error('Error fetching goals:', error);
        });
    },

    addGoal() {
      if (
        this.newGoal.title &&
        this.newGoal.targetAmount &&
        this.newGoal.startDate &&
        this.newGoal.endDate &&
        (this.selectedCategory || this.newCategory)
      ) {
        this.newGoal.category =
          this.selectedCategory === 'new' ? this.newCategory : this.selectedCategory;

        axios
          .post(`${process.env.VUE_APP_DEPLOY_URL}/goals`, {
            userId: this.userId,
            ...this.newGoal,
          })
          .then((response) => {
            this.goals.push(response.data);
            this.showAddGoalModal = false;
            this.newGoal = {
              title: '',
              description: '',
              targetAmount: '',
              currentAmount: 0,
              startDate: '',
              endDate: '',
              isAchieved: false,
              category: '',
            };
            this.selectedCategory = '';
            this.newCategory = '';
          })
          .catch((error) => {
            console.error('Error adding goal:', error);
          });
      } else {
        alert('Please fill in all required fields.');
      }
    },

    showGoalProgress(goal) {
    this.goalId = goal._id;
    this.goalTitle = goal.title;
    this.goalDescription = goal.description;
    this.goalTargetAmount = goal.targetAmount;
    this.goalCurrentAmount = goal.currentAmount;
    this.goalStartDate = goal.startDate;
    this.goalEndDate = goal.endDate;
    this.isAchieved = goal.isAchieved;
    this.goalCategory = goal.category;  
    this.goalProgress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2);
    this.showAddMoneyForm = false;
    this.showModal = true;
  },

    toggleAddMoneyForm() {
      this.showAddMoneyForm = !this.showAddMoneyForm;
    },

    async addMoneyToGoal() {
      if (this.addAmount > 0) {
        const updatedAmount = this.goalCurrentAmount + this.addAmount;

        try {
          // Send a PUT request to update the goal's currentAmount
          const response = await axios.put(`${process.env.VUE_APP_DEPLOY_URL}/goals/${this.goalId}`, {
            userId: this.userId, // Include necessary fields
            title: this.goalTitle,
            description: this.goalDescription,
            targetAmount: this.goalTargetAmount,
            currentAmount: updatedAmount,
            startDate: this.goalStartDate,
            endDate: this.goalEndDate,
            category: this.goalCategory,
            isAchieved: updatedAmount >= this.goalTargetAmount ? true : this.isAchieved, // Update isAchieved if the target is reached
          });

          // Update the local state with the new currentAmount and progress
          this.goalCurrentAmount = updatedAmount;
          this.goalProgress = ((updatedAmount / this.goalTargetAmount) * 100).toFixed(2);
          this.addAmount = 0; // Reset the input
          this.showAddMoneyForm = false; // Hide the form after adding money
          alert('Money added successfully!');
          this.retrieveGoals();
        } catch (error) {
          console.error('Error updating goal:', error);
          alert('An error occurred while adding money to the goal.');
        }
      } else {
        alert('Please enter a valid amount.');
      }
    },
  },
  mounted() {
    this.retrieveGoals();
  },
};
</script>


<style scoped>
.financial-goals {
  text-align: center;
  height: 100%;
  width: 100%;
}
.goal-image {
  z-index: 20;
  width: 100%;
  height: auto;
  border-radius: 10px 10px 0 0;
  margin-bottom: -20px; /* Overlap with goal-content */
}

.goal-upper-part {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.goal-section-title {
  margin-bottom: 0px;
  margin-top: 0px;
  font-size: 2em;
  color: #333;
}

.add-goal-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-goal-button:hover {
  background-color: #005bb5;
}

.goals {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.goal {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  margin: 10px;
  flex: 1 1 calc(100% - 20px);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s, box-shadow 0.3s;
}

.goal:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.goal-image {
  width: 100%;
  height: auto;
  border-radius: 10px 10px 0 0;
}

.goal-content {
  background-color: #ffffff;
  border-radius: 10px;
  margin-top: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.goal-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
  color: #007bff;
}

.goal-info h3 {
  margin: 10px 0;
  font-size: 1.5em;
  color: #333;
}

.goal-info p {
  margin: 5px 0;
  font-size: 1em;
  color: #666;
}

.progress-bar-container {
  width: 100%;
  background-color: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
  margin-bottom: 20px;
  height: 20px;
}

.progress-bar {
  height: 100%;
  background-color: #007bff;
  transition: width 0.5s ease-in-out;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
}

.modal-content {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 500px;
  overflow: hidden;
}

.modal-content img {
  width: 100%;
  height: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.modal-text-content {
  padding: 20px;
}

.add-money-form {
  margin-top: 20px;
}

.add-money-form input {
  margin-top: 10px;
}

.search-container {
  margin: 20px 0;
  text-align: center;
}

.search-input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  box-sizing: border-box;
}

/* Add Goal Modal Styles */
.form-group {
  margin-bottom: 15px;
  font-family: 'Space Grotesk', sans-serif;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 16px;
  font-family: 'Space Grotesk', sans-serif;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

.currency-input {
  display: flex;
  align-items: center;
}

.currency-input input {
  margin-right: 10px;
  flex: 1;
}

.currency-input select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  font-family: 'Space Grotesk', sans-serif;
  transition: border-color 0.3s ease;
}

.currency-input select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

#addAmount {
  margin-bottom: 10px;
}
</style>
