<template>
  <div>
    <!-- Overlay for the tutorial effect -->
    <div id="tutorial-overlay" class="tutorial-overlay" v-if="active"></div>

    <!-- Spotlight effect -->
    <div id="tutorial-spotlight" class="tutorial-spotlight" v-if="active"></div>

    <!-- Tooltip for instructions -->
    <div
      id="tutorial-tooltip"
      class="tutorial-tooltip"
      :class="{ 'tutorial-tooltip-hidden': !showTooltip }"
      v-if="active"
    >
      <div class="tutorial-tooltip-arrow"></div>
      <h3>{{ currentStep.title }}</h3>
      <p>{{ currentStep.message }}</p>
    </div>

    <!-- Skip tutorial button -->
    <button
      id="tutorial-skip-button"
      class="tutorial-skip-button"
      v-if="active"
      @click="endTutorial"
    >
      Skip Tutorial
    </button>

    <!-- Progress indicator -->
    <div class="tutorial-progress-bar" v-if="active && steps.length > 1">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="tutorial-progress-dot"
        :class="{ active: currentStepIndex === index }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TutorialOverlay",
  props: {
    steps: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(
          (step) =>
            typeof step.element === "string" &&
            typeof step.message === "string" &&
            typeof step.title === "string"
        );
      },
    },
    storageKey: {
      type: String,
      default: "tutorialShown",
    },
    autoStart: {
      type: Boolean,
      default: true,
    },
    showOnlyOnce: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      active: false,
      currentStepIndex: 0,
      showTooltip: false,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scrollPosition: 0, // Store scroll position
      overlayEventListener: null, // Store event listener reference
    };
  },
  computed: {
    currentStep() {
      return (
        this.steps[this.currentStepIndex] || {
          title: "",
          message: "",
          element: "",
        }
      );
    },
    isMobile() {
      return this.windowWidth < 768;
    }
  },
  mounted() {
    if (this.autoStart) {
      this.startTutorial();
    }

    // Add window resize listener
    window.addEventListener("resize", this.handleResize);
  },
  beforeUnmount() {
    // Clean up event listeners
    window.removeEventListener("resize", this.handleResize);
    this.removeStepEventListeners();
    this.enableScrolling(); // Make sure scrolling is re-enabled
    this.removeOverlayEventListener(); // Remove overlay event listener
    
    // Make sure we clean up any special classes
    const guidanceButton = document.querySelector('#tutorial-guidance-button');
    if (guidanceButton) {
      guidanceButton.classList.remove('tutorial-active');
    }
  },
  methods: {
    // Disable scrolling on the body
    disableScrolling() {
      // Store current scroll position
      this.scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      
      // Add styles to prevent scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this.scrollPosition}px`;
      document.body.style.width = '100%';
    },
    
    // Re-enable scrolling on the body
    enableScrolling() {
      // Remove styles that prevent scrolling
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, this.scrollPosition);
    },
    
    // Add event listener to the overlay to prevent interactions outside spotlight
    addOverlayEventListener() {
      const overlay = document.getElementById('tutorial-overlay');
      if (overlay) {
        this.overlayEventListener = (event) => {
          // Prevent all default actions on the overlay
          event.preventDefault();
          event.stopPropagation();
          return false;
        };
        
        // Add listeners for all common interaction events
        overlay.addEventListener('click', this.overlayEventListener, true);
        overlay.addEventListener('mousedown', this.overlayEventListener, true);
        overlay.addEventListener('mouseup', this.overlayEventListener, true);
        overlay.addEventListener('touchstart', this.overlayEventListener, true);
        overlay.addEventListener('touchend', this.overlayEventListener, true);
        overlay.addEventListener('touchmove', this.overlayEventListener, true);
        overlay.addEventListener('wheel', this.overlayEventListener, { passive: false, capture: true });
      }
    },
    
    // Remove overlay event listener
    removeOverlayEventListener() {
      const overlay = document.getElementById('tutorial-overlay');
      if (overlay && this.overlayEventListener) {
        overlay.removeEventListener('click', this.overlayEventListener, true);
        overlay.removeEventListener('mousedown', this.overlayEventListener, true);
        overlay.removeEventListener('mouseup', this.overlayEventListener, true);
        overlay.removeEventListener('touchstart', this.overlayEventListener, true);
        overlay.removeEventListener('touchend', this.overlayEventListener, true);
        overlay.removeEventListener('touchmove', this.overlayEventListener, true);
        overlay.removeEventListener('wheel', this.overlayEventListener, { passive: false, capture: true });
      }
    },
    
    handleResize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      
      // Update the spotlight and tooltip positions
      if (this.active) {
        this.updateSpotlight();
      }
    },
    startTutorial() {
      console.log("startTutorial called");
      
      // Check if we should show the tutorial based on the query parameter
      if (this.showOnlyOnce) {
        // Check for the showTutorial query parameter
        const showTutorialParam = this.$route.query.showTutorial;
        console.log("showTutorial query param:", showTutorialParam);
        
        // Accept both string 'true' and boolean true values
        const showTutorial = showTutorialParam === 'true' || showTutorialParam === true;
        
        if (!showTutorial) {
          console.log("Tutorial not shown - showTutorial param not present or not true");
          return;
        }
      }

      console.log("Starting tutorial");
      const currentTheme = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('tutorial-previous-theme', currentTheme);

      // Force light mode for tutorial
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');

      this.active = true;
      this.disableScrolling();
      this.addOverlayEventListener();
      
      // Add a small delay before showing the first step
      setTimeout(() => {
        this.showStep(0);
      }, 500);
    },

    updateSpotlight() {
      if (!this.active) return;

      if (!this.currentStep || !this.currentStep.element) {
        console.error("No valid tutorial step found for spotlight");
        return;
      }

      const targetElement = document.querySelector(this.currentStep.element);

      if (!targetElement) {
        console.error("Target element not found:", this.currentStep.element);
        return;
      }

      const spotlight = document.getElementById("tutorial-spotlight");
      const tooltip = document.getElementById("tutorial-tooltip");
      const overlay = document.getElementById("tutorial-overlay");

      if (spotlight && targetElement) {
        const rect = targetElement.getBoundingClientRect();
        
        // Responsive padding based on screen size
        const paddingHorizontal = this.isMobile ? 20 : 40;
        const paddingVertical = this.isMobile ? 5 : 10;

        // Position the spotlight with responsive padding
        spotlight.style.left = (rect.left - paddingHorizontal) + "px";
        spotlight.style.top = (rect.top - paddingVertical) + "px";
        spotlight.style.width = (rect.width + (paddingHorizontal * 2)) + "px";
        spotlight.style.height = (rect.height + (paddingVertical * 2)) + "px";
        
        // Create a hole in the overlay for the spotlight
        // This is done by making the spotlight have pointer-events: auto
        // but making a hole in the overlay using clip-path
        spotlight.style.pointerEvents = "auto";
        
        // Create a clip path for the overlay to create a "hole" for the spotlight
        if (overlay) {
          const spotlightLeft = rect.left - paddingHorizontal;
          const spotlightTop = rect.top - paddingVertical;
          const spotlightRight = rect.right + paddingHorizontal;
          const spotlightBottom = rect.bottom + paddingVertical;
          
          // Create an inset clip-path that creates a hole where the spotlight is
          overlay.style.clipPath = `path('M0,0 L${window.innerWidth},0 L${window.innerWidth},${window.innerHeight} L0,${window.innerHeight} Z M${spotlightLeft},${spotlightTop} L${spotlightRight},${spotlightTop} L${spotlightRight},${spotlightBottom} L${spotlightLeft},${spotlightBottom} Z')`;
        }

        // Position the tooltip responsively
        if (tooltip) {
          // On mobile, place tooltip below element
          // On desktop, place to the right if there's space
          if (this.isMobile || rect.left + rect.width + 320 > this.windowWidth) {
            // Place below with a slight offset
            tooltip.style.left = Math.max(10, Math.min(this.windowWidth - 320, rect.left)) + "px";
            tooltip.style.top = (rect.bottom + 15) + "px";
            
            // Adjust arrow position
            const arrow = tooltip.querySelector('.tutorial-tooltip-arrow');
            if (arrow) {
              arrow.style.left = Math.max(20, Math.min(rect.left + (rect.width / 2) - tooltip.getBoundingClientRect().left, tooltip.offsetWidth - 20)) + "px";
            }
          } else {
            // Place to the right of the element
            tooltip.style.left = (rect.right + 15) + "px";
            tooltip.style.top = rect.top + "px";
            
            // Adjust arrow for left side positioning
            const arrow = tooltip.querySelector('.tutorial-tooltip-arrow');
            if (arrow) {
              arrow.style.left = "-10px";
              arrow.style.top = "20px";
              arrow.style.borderWidth = "10px 10px 10px 0";
              arrow.style.borderColor = "transparent white transparent transparent";
            }
          }
          
          // Check if tooltip goes off screen bottom and adjust
          const tooltipRect = tooltip.getBoundingClientRect();
          if (tooltipRect.bottom > this.windowHeight - 20) {
            tooltip.style.top = (this.windowHeight - tooltipRect.height - 20) + "px";
          }
        }
      }
    },

    addStepEventListeners() {
      if (!this.currentStep || !this.currentStep.element) {
        return; // Exit early if no valid selector
      }
      
      const targetElement = document.querySelector(this.currentStep.element);
      if (targetElement) {
        // For special handling of the guidance button
        if (this.currentStep.element === '#tutorial-guidance-button') {
          // Add a class to make it always visible during tutorial
          targetElement.classList.add('tutorial-active');
          
          // For the guidance button, we don't want to block its normal click behavior
          // So we use a different approach to add the event listener
          targetElement.addEventListener("click", this.handleStepClick);
        } else {
          // For other elements, use capture phase to ensure our handler runs first
          targetElement.addEventListener("click", this.handleStepClick, true);
          
          // For mobile, add touch events
          targetElement.addEventListener("touchend", this.handleStepClick, true);
        }
      }
    },

    removeStepEventListeners() {
      if (!this.currentStep || !this.currentStep.element) {
        return; // Exit early if no valid selector
      }
      
      const targetElement = document.querySelector(this.currentStep.element);
      if (targetElement) {
        if (this.currentStep.element === '#tutorial-guidance-button') {
          // Remove the regular event listener for guidance button
          targetElement.removeEventListener("click", this.handleStepClick);
        } else {
          // Remove both click and touch listeners
          targetElement.removeEventListener("click", this.handleStepClick, true);
          targetElement.removeEventListener("touchend", this.handleStepClick, true);
        }
      }
    },

    handleStepClick(event) {
      // First check if this is the guidance button
      if (this.currentStep && this.currentStep.element === '#tutorial-guidance-button') {
        // For guidance button, we want to end the tutorial completely
        // but still allow the original click event to proceed
        
        // Don't prevent default or stop propagation
        // This will allow the guidance modal to open
        
        // Get a reference to the button for later cleanup
        const guidanceButton = document.querySelector('#tutorial-guidance-button');
        
        // End the tutorial after a brief delay
        setTimeout(() => {
          this.endTutorial();
          
          // Additional cleanup directly in this handler
          if (guidanceButton) {
            // Reset all potentially problematic styles
            guidanceButton.style.zIndex = '';
            guidanceButton.style.transform = '';
            guidanceButton.style.right = '';
            guidanceButton.classList.remove('tutorial-active');
            
            // Apply correct styles based on current state
            if (this.$parent && typeof this.$parent.showGuidance === 'boolean') {
              if (this.$parent.showGuidance) {
                guidanceButton.classList.add('is-guidance-visible');
              } else {
                guidanceButton.classList.remove('is-guidance-visible');
              }
            }
          }
        }, 50);
        
        return; // Exit early
      }
      
      // For other elements, keep the default behavior
      // Prevent the default action if this is a link or button
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      
      // Stop event propagation to prevent unexpected behavior
      if (event && event.stopPropagation) {
        event.stopPropagation();
      }
      
      // Add a small delay to allow the original click action to complete
      // This helps with custom components or buttons that might do their own navigation
      setTimeout(() => {
        this.nextStep();
      }, 100);
    },

    nextStep() {
      this.removeStepEventListeners();
      this.removeOverlayEventListener(); // Remove overlay event listener
      this.showTooltip = false;

      setTimeout(() => {
        this.currentStepIndex++;

        if (this.currentStepIndex < this.steps.length) {
          this.$nextTick(() => {
            if (!this.currentStep || !this.currentStep.element) {
              console.error("No valid tutorial step found for next step");
              this.endTutorial();
              return;
            }
            
            const targetElement = document.querySelector(this.currentStep.element);
            if (targetElement) {
              // Scroll to make sure element is visible for next step
              targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Wait a bit longer on mobile devices
              setTimeout(() => {
                this.updateSpotlight();
                this.showTooltip = true;
                this.addStepEventListeners();
                this.addOverlayEventListener(); // Add overlay event listener for new step
              }, this.isMobile ? 500 : 300);
            } else {
              console.error("Target element not found for next step:", this.currentStep.element);
              this.endTutorial();
              return;
            }
          });
        } else {
          this.endTutorial();
        }
      }, 300);
    },

    endTutorial() {
      console.log("Ending tutorial");
      this.removeStepEventListeners();
      this.removeOverlayEventListener(); // Remove overlay event listener
      this.enableScrolling(); // Re-enable scrolling

      // Restore previous theme
      const previousTheme = localStorage.getItem('tutorial-previous-theme');
      if (previousTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
      }
      localStorage.removeItem('tutorial-previous-theme');

      // Remove special classes and reset styles for guidance button
      const guidanceButton = document.querySelector('#tutorial-guidance-button');
      if (guidanceButton) {
        guidanceButton.classList.remove('tutorial-active');
        
        // Explicitly reset z-index to its original value
        guidanceButton.style.zIndex = ''; // This removes any inline style
        
        // Also reset any transform or right properties that might be stuck
        guidanceButton.style.transform = '';
        guidanceButton.style.right = '';
      }

      this.active = false;

      // Remove the showTutorial query parameter from the URL
      if (this.$route.query.showTutorial) {
        const query = { ...this.$route.query };
        delete query.showTutorial;
        
        // Use router to update URL without the showTutorial parameter
        this.$router.replace({ query });
        console.log("Removed showTutorial from URL");
      }

      this.$emit("tutorial-completed");
    },

    resetTutorial() {
      console.log("Resetting tutorial");
      this.currentStepIndex = 0;
      
      // Add the showTutorial query parameter to the URL
      const query = { ...this.$route.query, showTutorial: 'true' };
      this.$router.replace({ query });
      
      this.startTutorial();
    },

    showStep(stepIndex) {
      console.log(`Showing tutorial step ${stepIndex}`);
      this.currentStepIndex = stepIndex;
      this.showTooltip = false;

      this.$nextTick(() => {
        if (!this.currentStep || !this.currentStep.element) {
          console.error("No valid tutorial step found");
          this.endTutorial();
          return;
        }
        
        const targetElement = document.querySelector(this.currentStep.element);
        if (targetElement) {
          // Scroll to make sure element is visible
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // For mobile devices, ensure we wait for scrolling to complete
          setTimeout(() => {
            this.updateSpotlight();
            this.showTooltip = true;
            this.addStepEventListeners();
          }, this.isMobile ? 500 : 300);
        } else {
          console.error("Target element not found:", this.currentStep.element);
          this.endTutorial();
          return;
        }
      });
    },
  },
};
</script>

<style scoped>
/* Tutorial overlay */
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(25, 41, 65, 0.75);
  z-index: 9999;
  transition: all 0.5s ease;
  pointer-events: auto; /* Allow clicks on the overlay to be captured */
  touch-action: none; /* Prevent scrolling on mobile while tutorial is active */
}

/* Spotlight effect */
.tutorial-spotlight {
  position: fixed; /* Changed from absolute to fixed for better mobile support */
  background: transparent;
  box-shadow: 0 0 0 2000px rgba(25, 41, 65, 0.85);
  border-radius: 10px;
  transition: all 0.5s ease;
  pointer-events: auto; /* Changed to auto to allow interaction with the spotlight area */
  z-index: 10000;
  cursor: pointer; /* Show pointer cursor to indicate clickable area */
}

/* Tooltip for instructions */
.tutorial-tooltip {
  position: fixed; /* Changed from absolute to fixed for better mobile support */
  background: white;
  border-radius: 6px;
  padding: 12px 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: calc(100% - 40px); /* Responsive width for mobile */
  z-index: 10002;
  opacity: 1;
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: translateY(0);
  color: #333;
}

.tutorial-tooltip.tutorial-tooltip-hidden {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}

.tutorial-tooltip h3 {
  margin-top: 0;
  color: #007bff; /* Match your FinBud brand color */
  font-size: 1.2rem;
}

.tutorial-tooltip p {
  margin-bottom: 10px;
  color: #333;
  font-size: 1rem;
}

.tutorial-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent white transparent;
  top: -10px;
  left: 20px;
}

/* Skip tutorial button */
.tutorial-skip-button {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 4px;
  cursor: pointer;
  z-index: 10002;
  transition: all 0.3s ease;
  font-size: 14px;
}

.tutorial-skip-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Progress indicator */
.tutorial-progress-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10002;
}

.tutorial-progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.tutorial-progress-dot.active {
  background: white;
  transform: scale(1.2);
}

/* Dark mode support */
:root.dark-mode .tutorial-tooltip,
body.dark-mode .tutorial-tooltip {
  background: #2d2d2d;
  color: #ffffff;
}

:root.dark-mode .tutorial-tooltip h3,
body.dark-mode .tutorial-tooltip h3 {
  color: #4da3ff;
}

:root.dark-mode .tutorial-tooltip p,
body.dark-mode .tutorial-tooltip p {
  color: #ffffff;
}

:root.dark-mode .tutorial-tooltip-arrow,
body.dark-mode .tutorial-tooltip-arrow {
  border-color: transparent transparent #2d2d2d transparent;
}

/* Responsive styles for mobile */
@media (max-width: 768px) {
  .tutorial-tooltip {
    max-width: calc(100vw - 40px);
    width: calc(100vw - 40px);
    left: 20px !important; /* Override any dynamic positioning */
    right: 20px;
  }
  
  .tutorial-tooltip-arrow {
    left: 50% !important;
    margin-left: -10px;
  }
  
  .tutorial-skip-button {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .tutorial-progress-bar {
    bottom: 10px;
  }
  
  .tutorial-progress-dot {
    width: 8px;
    height: 8px;
  }
}
</style>