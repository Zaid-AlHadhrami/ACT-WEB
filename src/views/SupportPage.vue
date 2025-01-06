<template>
  <div class="Support">
    <Sidebar />
    <div class="main-content">
      <!-- Original Support Form -->
      <div class="Help-Form">
    <div v-if="submitted">
      <!-- Thank You Message -->
      <h2>Thank you for submitting your request!</h2>
      <p>We have received your message and will get back to you shortly.</p>
    </div>
    <div v-else>
      <!-- Original Support Form -->
      <h2>Get in touch</h2>
      <input class="name-in" type="text" placeholder="First Name" v-model="firstName" />
      <input class="name-in" type="text" placeholder="Last Name" v-model="lastName" />
      <br />
      <input type="email" placeholder="Your Email" v-model="email">
      <br />
      <textarea type="text" placeholder="Your message..." id="message" v-model="message"></textarea>
      <br />
      <button @click="submitRequest">Send your request</button>
    </div>
  </div>

      <div class="Reviews-Section">
  <h2>Submit or Update Your Review</h2>

  <!-- Show review form only if no review exists or the user decides to update -->
  <div v-if="!existingReview || isEditing">
    <div class="rating">
      <span
        v-for="star in 5"
        :key="star"
        class="star"
        :class="{ filled: star <= rating }"
        @click="setRating(star)"
      >
        ★
      </span>
    </div>
    <textarea
      v-model="reviewText"
      placeholder="Write your review here..."
    ></textarea>
    <br />
    <button @click="submitOrUpdateReview">
      {{ existingReview ? "Update Review" : "Submit Review" }}
    </button>
  </div>

  <!-- Show existing review if it exists and not in editing mode -->
  <div v-else>
    <p><strong>Your Review:</strong></p>
    <p><strong>Rating:</strong> {{ existingReview.rating }} ★</p>
    <p>{{ existingReview.text }}</p>
    <button @click="isEditing = true">Edit Review</button>
  </div>

  <h2>All Reviews</h2>
  <div v-if="reviews.length > 0" class="review-list">
    <div v-for="(review, index) in reviews" :key="index" class="review">
      <p>
        <strong>{{ review.userId === userId ? "(You): " + review.username : review.username }}:</strong>
        {{ review.text }}
      </p>
      <p><strong>Rating:</strong> {{ review.rating }} ★</p>
    </div>
  </div>
  <p v-else>No reviews yet. Be the first to leave a review!</p>
</div>

    </div>
  </div>
</template>


<script>
import Sidebar from "@/components/Sidebar.vue";
import axios from "axios";

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../FirebaseConfig";

export default {
  name: "SupportPage",
  data() {
    return {
      userId: localStorage.getItem("userId"), // Get user ID
      username: localStorage.getItem("username") || "Anonymous", // Get username or default
      reviewText: "", // Current review text
      rating: 0, // Current rating
      reviews: [], // All reviews
      existingReview: null, // User's existing review
      isEditing: false, // Controls whether the review form is visible for editing
            submitted: false, // Tracks whether the form is submitted
    };
  },
  components: {
    Sidebar,
  },
  methods: {
    async submitRequest() {
      // Gather form data
      const firstName = document.querySelector('input[placeholder="First Name"]').value;
      const lastName = document.querySelector('input[placeholder="Last Name"]').value;
      const email = document.querySelector('input[placeholder="Your Email"]').value;
      const message = document.querySelector("#message").value;

      // Validate form data
      if (!firstName || !lastName || !email || !message) {
        alert("Please fill in all fields.");
        return;
      }

      try {
        // Send form data to the backend
        const response = await axios.post("http://localhost:5005/support", {
          firstName,
          lastName,
          email,
          message,
        });

        // If successful, update the submitted state
        if (response.status === 200) {
          this.submitted = true; // Show thank-you message
        }
      } catch (error) {
        console.error("Error:", error);
        alert("There was an issue submitting your request. Please try again.");
      }
    },
    setRating(star) {
      this.rating = star; // Set the rating dynamically
    },

    async fetchReviews() {
      try {
        const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        this.reviews = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Check if the user has an existing review
        const userReview = this.reviews.find((review) => review.userId === this.userId);
        if (userReview) {
          this.existingReview = userReview;
          this.reviewText = userReview.text;
          this.rating = userReview.rating;
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    },

    async submitOrUpdateReview() {
      if (!this.reviewText.trim()) {
        alert("Please write a review before submitting.");
        return;
      }
      if (!this.rating) {
        alert("Please select a rating.");
        return;
      }

      const reviewData = {
        text: this.reviewText.trim(),
        rating: this.rating,
        userId: this.userId,
        username: this.username, // Add the username here
        createdAt: this.existingReview ? this.existingReview.createdAt : new Date(),
        updatedAt: new Date(),
      };

      try {
        // Use the userId as the document ID
        const reviewRef = doc(db, "reviews", this.userId);
        await setDoc(reviewRef, reviewData);

        alert(this.existingReview ? "Review updated successfully!" : "Review submitted successfully!");

        // Refresh reviews and exit editing mode
        this.fetchReviews();
        this.isEditing = false;
      } catch (error) {
        console.error("Error submitting or updating review:", error);
        alert("Error submitting review. Please try again.");
      }
    },
  },
  mounted() {
    // Fetch reviews when the component is mounted
    this.fetchReviews();
  },
};
</script>



<style>

body {
    margin: 0; /* Remove default margin */
  }
  
  .Support {
    display: flex;
    margin: 0;

  }

  .sidebar {
  background-color: #202123; 
  overflow-y: auto; /* Scroll if content overflows */
}

.main-content {
    flex-grow: 1;
  padding: 20px; 
  align-items: center;
}


.Help-Form {
  margin: 20px 0;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ccc;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}

.Help-Form h2 {
  margin-bottom: 15px;
  color: #333;
  text-align: center;
}

.Help-Form input,
.Help-Form textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.Help-Form textarea {
  resize: none;
  height: 100px;
}

.Help-Form .name-in {
  width: calc(50% - 10px); /* Two inputs side by side with a gap */
  display: inline-block;
  margin-right: 10px;
  box-sizing: border-box;
}

.Help-Form .name-in:last-child {
  margin-right: 0; /* Remove margin for the last input */
}

.Help-Form button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
}

.Help-Form button:hover {
  background-color: #e0e0e0;
}


  .Reviews-Section {
  margin: 0 auto;
  margin-top: 1%;
  width: 50%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.Reviews-Section h2 {
  margin-bottom: 15px;
}

.rating label {
  font-size: 24px;
  color: #ff9800;
  cursor: pointer;
}

.rating input {
  display: none; /* Hide radio buttons */
}

textarea {
  width: 90%;
  height: 100px;
  resize: none;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #e0e0e0;
}

.review-list {
  margin-top: 20px;
}

.review {
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
}

.rating {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.star {
  font-size: 24px;
  color: #ccc; /* Default color for unselected stars */
  cursor: pointer;
  transition: color 0.3s ease;
}

.star.filled {
  color: #ff9800; /* Highlighted star color for selected rating */
}


</style>