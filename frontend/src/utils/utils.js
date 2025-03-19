/**
 * Shows a reward animation popup
 *
 * @param {Object} component - The Vue component instance
 * @param {Number} amount - The amount of FinCoins to display
 * @param {String} type - The type of reward ('trade' or 'milestone')
 */
export function showReward(component, amount, type = "trade") {
  // Set reward amount
  component.rewardAmount = amount;

  // Show reward animation
  component.showingReward = true;

  // Hide reward animation after specified time
  // Milestones get slightly longer display time
  const duration = 1500;

  setTimeout(() => {
    component.showingReward = false;
  }, duration);
}
