<template>
    <div class="notifications-page">
      <Sidebar />
  
      <div class="main-content">
        <h1>Manage Your Price Alerts</h1>
  
<!-- Add Notification Form -->
<div class="notification-form">
  <h3>Add a New Alert</h3>
  <select v-model="selectedNotificationAsset">
    <option value="" disabled>Select Asset</option>
    <option v-for="(data, name) in cryptoData" :key="name" :value="name">
      {{ capitalizeFirstLetter(name) }}
    </option>
    <option v-for="symbol in symbols" :key="symbol" :value="symbol">
      {{ symbol }}
    </option>
  </select>
  <input
    type="number"
    v-model="priceThreshold"
    placeholder="Enter price threshold (USD)"
    min="0"
  />
  <button @click="addNotification">Add Alert</button>
</div>

<!-- Notifications List -->
<div class="notifications-list">
  <h3>Tracked Assets</h3>
  <div v-if="notifications.length > 0">
    <div
      v-for="(notification, index) in notifications"
      :key="index"
      class="notification-item"
    >
      <p>
        <strong>{{ capitalizeFirstLetter(notification.name) }}</strong> -
        Notify when price {{ notification.thresholdType === 'above' ? 'exceeds' : 'drops below' }} 
        <strong>${{ notification.threshold }}</strong>
      </p>
      <button @click="removeNotification(notification.id)">Remove</button>
    </div>

  </div>
  <p v-else>No notifications set. Add some alerts!</p>
</div>

      </div>
    </div>
  </template>
  

  <script>
  import axios from "axios";
  import Sidebar from "@/components/Sidebar.vue";

export default {
  data() {
    return {
      cryptoData: {}, // Data for crypto assets
      symbols: ["AAPL", "GOOGL", "MSFT", "AMZN", "NVDA", "META"], // Stock symbols
      selectedNotificationAsset: "", // Asset selected by user
      priceThreshold: null, // User-defined price threshold
      thresholdType: "above", // Track if threshold is above or below
      notifications: [], // List of all notifications
    };
  },
  components: {
    Sidebar,
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    async fetchCryptoData() {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,dogecoin,polkadot,ripple&vs_currencies=usd"
        );
        this.cryptoData = response.data;
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    },
    async fetchNotifications() {
      try {
        const response = await axios.get("http://localhost:5005/notifications");
        this.notifications = response.data.notifications || [];
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    },
    async addNotification() {
      if (!this.selectedNotificationAsset || !this.priceThreshold) {
        alert("Please select an asset and set a valid price threshold.");
        return;
      }

      const newNotification = {
        name: this.selectedNotificationAsset,
        threshold: parseFloat(this.priceThreshold),
        thresholdType: this.thresholdType, // Include above/below information
      };

      try {
        await axios.post("http://localhost:5005/notifications", newNotification);
        this.fetchNotifications(); // Refresh notifications after adding
        this.selectedNotificationAsset = "";
        this.priceThreshold = null;
        this.thresholdType = "above";
      } catch (error) {
        console.error("Error adding notification:", error);
      }
    },
    async removeNotification(notificationId) {
      try {
        await axios.delete(`http://localhost:5005/notifications/${notificationId}`);
        this.fetchNotifications(); // Refresh notifications after removing
      } catch (error) {
        console.error("Error removing notification:", error);
      }
    },
    async clearAllNotifications() {
      if (confirm("Are you sure you want to clear all notifications?")) {
        try {
          await axios.delete("http://localhost:5005/notifications");
          this.fetchNotifications(); // Refresh notifications after clearing
        } catch (error) {
          console.error("Error clearing notifications:", error);
        }
      }
    },
  },
  mounted() {
    this.fetchCryptoData();
    this.fetchNotifications();
  },
};

</script>


<style>
.notifications-page {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

h1 {
  margin-bottom: 20px;
}

.notification-form {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.notification-form select,
.notification-form input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.notification-form button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notification-form button:hover {
  background-color: #0056b3;
}

.notifications-list {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.notification-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.notification-item p {
  margin: 0;
}

.notification-item button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notification-item button:hover {
  background-color: #a71d2a;
}

.clear-all-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;
  display: block;
  width: 100%;
  text-align: center;
}

.clear-all-btn:hover {
  background-color: #5a6268;
}

.notification-form select,
.notification-form input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.notification-form select {
  margin-bottom: 15px;
}

.notification-form button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.notification-form button:hover {
  background-color: #0056b3;
}


</style>