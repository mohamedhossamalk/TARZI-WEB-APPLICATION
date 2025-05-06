// models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'تارزي'
  },
  logo: {
    type: String,
    default: '/assets/logo.png'
  },
  favicon: {
    type: String,
    default: '/assets/favicon.ico'
  },
  primaryColor: {
    type: String,
    default: '#3498db'
  },
  secondaryColor: {
    type: String,
    default: '#2ecc71'
  },
  contactEmail: {
    type: String,
    default: 'info@tarzi-app.com'
  },
  contactPhone: {
    type: String,
    default: '+201234567890'
  },
  address: {
    type: String,
    default: 'القاهرة، مصر'
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String
  },
  banners: [{
    image: String,
    title: String,
    subtitle: String,
    link: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  featuredCategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  shippingMethods: [{
    name: String,
    cost: Number,
    estimatedDays: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  paymentMethods: [{
    name: String,
    description: String,
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  taxRate: {
    type: Number,
    default: 14 // القيمة المضافة في مصر
  },
  currency: {
    type: String,
    default: 'EGP'
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;